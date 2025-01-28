import { supabase } from '../lib/supabaseClient';

interface DownloadOptions {
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
  retryAttempts?: number;
  retryDelay?: number;
}

class DownloadService {
  private async downloadWithProgress(url: string, filename: string, onProgress?: (progress: number) => void): Promise<void> {
    try {
      // Validate input
      if (!url) {
        throw new Error('Download URL is required');
      }
      if (!filename) {
        throw new Error('Filename is required');
      }
      
      // Clean up URL and add cache busting
      const downloadUrl = new URL(url);
      downloadUrl.searchParams.delete('t'); // Remove any existing timestamp
      downloadUrl.searchParams.set('t', Date.now().toString());
      downloadUrl.searchParams.set('download', 'true');

      // Fetch with retry logic
      let response;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          response = await fetch(downloadUrl.toString(), {
            method: 'GET',
            cache: 'no-store',
            mode: 'cors',
            credentials: 'omit',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });

          if (response.ok) break;

          attempts++;
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            continue;
          }

          throw new Error(`Failed to download file (HTTP ${response.status})`);
        } catch (error) {
          if (attempts === maxAttempts) throw error;
        }
      }

      if (!response) {
        throw new Error('Failed to download file after multiple attempts');
      }

      // Get file content with progress tracking
      const contentLength = Number(response.headers.get('content-length'));
      const reader = response.body?.getReader();
      
      if (!reader) {
        throw new Error('Unable to read file content');
      }

      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        if (contentLength && onProgress) {
          const progress = (receivedLength / contentLength) * 100;
          onProgress(Math.round(progress));
        }
      }

      // Create blob from chunks
      const blob = new Blob(chunks, { type: 'application/pdf' });
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      // Create and trigger download
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      
      if (onProgress) {
        onProgress(100);
      }
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  async verifyFileExists(bucket: string, path: string): Promise<boolean> {
    try {
      if (!path) {
        console.log('No path provided');
        return false;
      }

      // Remove .pdf extension and clean path
      const cleanPath = path.replace(/\.pdf$/, '').split('?')[0];
      console.log('Checking file existence:', { bucket, cleanPath });

      // List all files in the bucket first
      const pathParts = cleanPath.split('/');
      const userId = pathParts[0];
      const targetFileName = pathParts[1];
      console.log('Looking for:', {
        userId,
        targetFileName,
        cleanPath
      });

      const { data: files, error: listError } = await supabase.storage
        .from(bucket)
        .list(userId, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (listError) {
        console.error('Error listing files:', listError);
        return false;
      }

      console.log('Files found in bucket:', files?.map(f => f.name));

      // Normalize target filename for comparison (without extension)
      const normalizedTarget = targetFileName.replace(/\.pdf$/, '').toLowerCase();

      // Try to find the file with various possible names
      const fileExists = files?.some(file => {
        const normalizedName = file.name.replace(/\.pdf$/, '').toLowerCase();
        const matches = normalizedName === normalizedTarget;
        console.log('Comparing names:', {
          normalizedName,
          normalizedTarget,
          originalName: file.name,
          matches
        });
        return matches;
      });

      if (!fileExists) {
        console.log('File not found in directory listing');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error verifying file:', error);
      return false;
    }
  }

  async downloadFile(bucket: string, path: string, filename: string, options: DownloadOptions = {}): Promise<void> {
    const {
      onProgress,
      onError,
      retryAttempts = 3,
      retryDelay = 1000
    } = options;

    try {
      // Clean up path and remove .pdf extension for storage lookup
      const cleanPath = path.replace(/\.pdf$/, '').split('?')[0].trim();
      if (!cleanPath || !filename) {
        throw new Error('Invalid file path or filename');
      }

      // First verify if file exists
      const fileExists = await this.verifyFileExists(bucket, cleanPath);
      if (!fileExists) {
        console.error('File not found in storage:', { bucket, cleanPath });
        throw new Error(`File not found in storage: ${cleanPath}`);
      }

      console.log('Attempting to download:', { bucket, cleanPath, filename });

      // Try to download with retries
      let lastError: Error | null = null;
      for (let attempt = 1; attempt <= retryAttempts; attempt++) {
        try {
          // Add .pdf extension back for download
          const downloadPath = `${cleanPath}.pdf`;
          const { data, error } = await supabase.storage
            .from(bucket)
            .download(downloadPath);

          if (error) {
            console.error(`Download attempt ${attempt} failed:`, error);
            lastError = error;
            if (attempt < retryAttempts) {
              await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
              continue;
            }
            throw error;
          }

          if (!data) {
            throw new Error('No data received from download');
          }

          // Ensure filename has .pdf extension for download
          const downloadFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

          // Create blob URL and trigger download
          const blobUrl = URL.createObjectURL(data);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = downloadFilename;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
          
          if (onProgress) {
            onProgress(100);
          }

          return;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error occurred');
          if (attempt === retryAttempts) {
            throw lastError;
          }
        }
      }

      throw lastError || new Error('Failed to download file after all attempts');
    } catch (error) {
      console.error('Download error:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error('Failed to download file'));
      }
      throw error;
    }
  }
}

export const downloadService = new DownloadService();