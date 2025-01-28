import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { DocumentTextIcon, TrashIcon, ArrowDownTrayIcon, PencilSquareIcon, EyeIcon } from '@heroicons/react/24/outline'; 
import { downloadService } from '../../services/downloadService';
import DownloadProgress from '../DownloadProgress';
import EditCoverLetterModal from './EditCoverLetterModal';
import PreviewCoverLetterModal from './PreviewCoverLetterModal';

export default function CoverLetterList() {
  const [coverLetters, setCoverLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const { user } = useAuth();
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    fetchCoverLetters();
  }, [user]);

  const fetchCoverLetters = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Clean up file paths to ensure they're correct
      const cleanedData = data?.map(letter => ({
        ...letter,
        generated_file_path: letter.generated_file_path?.replace(/\.pdf\.pdf$/, '.pdf'),
        resume_file_path: letter.resume_file_path?.replace(/\.pdf\.pdf$/, '.pdf')
      })) || [];

      setCoverLetters(cleanedData);
    } catch (err) {
      console.error('Error fetching cover letters:', err);
      setError('Failed to load cover letters');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (filename) => {
    if (!filename) return 'Cover Letter';
    return filename.replace(/\.pdf\.pdf$/, '.pdf')
                  .replace(/\.pdf$/, '')
                  .replace(/\([0-9]+\)$/, '')
                  .trim() + ' Cover Letter';
  };

  const getJobUrl = (url) => {
    if (!url) return 'No job URL';
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname
        .replace('www.', '')
        .split('.')[0]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } catch {
      return url;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cover letter?')) return;

    try {
      const coverLetter = coverLetters.find(cl => cl.id === id);
      if (!coverLetter) return;

      if (coverLetter.resume_file_path) {
        const { error: storageError } = await supabase.storage
          .from('cover-letters')
          .remove([coverLetter.resume_file_path]);

        if (storageError && !storageError.message.includes('Object not found')) {
          throw storageError;
        }
      }

      if (coverLetter.generated_file_path) {
        const { error: genStorageError } = await supabase.storage
          .from('cover-letters')
          .remove([coverLetter.generated_file_path]);

        if (genStorageError && !genStorageError.message.includes('Object not found')) {
          throw genStorageError;
        }
      }

      const { error: dbError } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      setCoverLetters(prev => prev.filter(cl => cl.id !== id));
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      alert('Failed to delete cover letter');
    }
  };

  const handlePreview = (coverLetter) => {
    // Ensure file exists before opening preview
    const url = getDownloadUrl(coverLetter);
    if (!url) {
      alert('Cover letter file not available');
      return;
    }
    setSelectedCoverLetter(coverLetter);
    setIsPreviewModalOpen(true);
  };

  const handleEdit = (coverLetter) => {
    setSelectedCoverLetter(coverLetter);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (content) => {
    // Implementation will be added later
    console.log('Saving edited content:', content);
  };

  const getDownloadUrl = (coverLetter) => {
    if (!coverLetter) return null;
    
    const filePath = coverLetter.generated_file_path || coverLetter.resume_file_path;
    if (!filePath) return null;

    // Get the file URL without download flag for preview
    const { data: { publicUrl }, error } = supabase.storage
      .from('cover-letters')
      .getPublicUrl(filePath);

    if (error) {
      console.error('Error getting download URL:', error);
      return null;
    }
    return publicUrl;
  };

  const handleDownload = async (coverLetter) => {
    try {
      setError('');
      setIsDownloading(true);
      setSelectedCoverLetter(coverLetter);

      console.log('Starting download for cover letter:', {
        id: coverLetter.id,
        generated_file_path: coverLetter.generated_file_path,
        resume_file_path: coverLetter.resume_file_path,
        original_filename: coverLetter.original_filename,
        status: coverLetter.status
      });

      // Try to get the generated file first
      let filePath = coverLetter.generated_file_path;
      
      // If no generated file path, try the resume file path
      if (!filePath) {
        filePath = coverLetter.resume_file_path;
      }

      if (!filePath) {
        throw new Error('No file available for download');
      }

      // Clean up file path and handle rewritten files
      const basePath = filePath.split('/')[0]; // Get user ID part
      const fileName = filePath.split('/')[1]; // Get file name part
      
      // Add .pdf.pdf if it doesn't have it
      const fileNameWithExt = fileName.endsWith('.pdf.pdf') ? fileName : fileName.replace(/\.pdf$/, '.pdf.pdf');
      const rewrittenPath = `${basePath}/rewritten_${fileNameWithExt}`;
      
      console.log('Trying paths:', {
        original: filePath,
        rewritten: rewrittenPath,
        fileNameWithExt
      });

      // Try rewritten path first, then original path
      let exists = await downloadService.verifyFileExists('cover-letters', rewrittenPath);
      let finalPath = rewrittenPath;

      if (!exists) {
        // Try with .pdf.pdf extension
        const originalWithExt = `${basePath}/${fileNameWithExt}`;
        exists = await downloadService.verifyFileExists('cover-letters', originalWithExt);
        finalPath = originalWithExt;
      }

      if (!exists) {
        // Try original path as fallback
        exists = await downloadService.verifyFileExists('cover-letters', filePath);
        finalPath = filePath;
      }

      console.log('File exists check:', { exists, finalPath });

      if (!exists) {
        throw new Error('File not found. Please try again later.');
      }

      // Clean up filename for download
      const filename = (coverLetter.original_filename || 'cover-letter')
        .replace(/\.pdf(\.pdf)*$/, '')
        .replace(/[^a-zA-Z0-9-_ ]/g, '')
        .trim() + '.pdf';

      console.log('Using filename:', filename);

      await downloadService.downloadFile(
        'cover-letters',
        finalPath,
        filename,
        {
          onProgress: (progress) => {
            console.log('Download progress:', progress);
            setDownloadProgress(progress);
          },
          onError: (error) => {
            console.error('Download error:', error);
            setError(error.message || 'Unable to download file. Please try again later.');
            setDownloadProgress(0);
          }
        }
      );
    } catch (error) {
      console.error('Download error:', error);
      setError(error.message || 'Unable to download file. Please try again later.');
      setDownloadProgress(0);
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse bg-gray-200 h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchCoverLetters}
              className="mt-2 text-sm text-red-700 underline hover:text-red-800"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (coverLetters.length === 0) {
    return (
      <div className="text-center py-8">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No cover letters</h3>
        <p className="mt-1 text-sm text-gray-500">
          Upload a resume and provide a job URL to generate your first cover letter
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coverLetters.map((coverLetter) => (
          <div
            key={coverLetter.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => handlePreview(coverLetter)}
              >
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
                    {getDisplayName(coverLetter.original_filename)}
                  </h3>
                  {coverLetter.job_url ? (
                    <a
                      href={coverLetter.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {getJobUrl(coverLetter.job_url)}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">No job URL</p>
                  )}
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(coverLetter.status)}`}>
                {coverLetter.status.charAt(0).toUpperCase() + coverLetter.status.slice(1)}
              </span>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Created: {new Date(coverLetter.created_at).toLocaleDateString()}
            </p>

            <div className="mt-4 flex space-x-3">
              {coverLetter.status === 'completed' && (
                <>
                  <button
                    onClick={() => handlePreview(coverLetter)}
                    className="text-sm text-gray-600 hover:text-blue-600 flex items-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Preview
                  </button>
                  <button
                    disabled={isDownloading}
                    onClick={() => handleDownload(coverLetter)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center disabled:opacity-50"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    {isDownloading ? `Downloading (${downloadProgress}%)` : 'Download'}
                  </button>
                  <button
                    onClick={() => handleEdit(coverLetter)}
                    className="text-sm text-gray-600 hover:text-blue-600 flex items-center"
                  >
                    <PencilSquareIcon className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(coverLetter.id)}
                className="text-sm text-gray-600 hover:text-red-600 flex items-center"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <PreviewCoverLetterModal
        coverLetter={selectedCoverLetter}
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setSelectedCoverLetter(null);
        }}
      />

      <EditCoverLetterModal
        coverLetter={selectedCoverLetter}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCoverLetter(null);
        }}
        onSave={handleSaveEdit}
      />
      {isDownloading && (
        <DownloadProgress 
          progress={downloadProgress}
          filename={selectedCoverLetter?.original_filename?.replace(/\.pdf\.pdf$/, '.pdf') || 'cover-letter.pdf'}
        />
      )}
    </>
  );
}