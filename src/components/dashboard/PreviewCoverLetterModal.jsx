import React, { useState, useEffect } from 'react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabaseClient';

export default function PreviewCoverLetterModal({ coverLetter, isOpen, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  useEffect(() => {
    let timeoutId;
    
    if (isOpen && coverLetter) {
      loadPdfUrl();
    } else {
      // Reset state when modal closes
      setPdfUrl('');
      setError('');
      setRetryCount(0);
      // Clear any pending timeouts
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOpen, coverLetter]);

  const loadPdfUrl = async () => {
    try {
      setLoading(true);
      setError('');

      if (!coverLetter) {
        throw new Error('No cover letter data available');
      }

      const filePath = coverLetter.generated_file_path || coverLetter.resume_file_path;
      if (!filePath) {
        throw new Error('No file available');
      }

      // Clean up file path
      const cleanPath = filePath.replace(/\.pdf\.pdf$/, '.pdf');

      // Get the file URL with timestamp to prevent caching
      const timestamp = new Date().getTime();
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('cover-letters')
        .getPublicUrl(cleanPath);

      if (urlError) throw urlError;

      const urlWithTimestamp = `${publicUrl}?t=${timestamp}`;

      // Verify file exists
      const response = await fetch(urlWithTimestamp, { 
        method: 'HEAD',
        cache: 'no-cache'
      });

      if (!response.ok) {
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying PDF load (${retryCount + 1}/${MAX_RETRIES})...`);
          setRetryCount(prev => prev + 1);
          setTimeout(loadPdfUrl, RETRY_DELAY);
          return;
        }
        throw new Error('File not found or inaccessible');
      }

      setPdfUrl(urlWithTimestamp);
      setRetryCount(0);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Unable to load the cover letter. Please try downloading it instead.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!coverLetter) return;
    
    const filePath = coverLetter.generated_file_path || coverLetter.resume_file_path;
    if (!filePath) return;

    // Clean up file path
    const cleanPath = filePath.replace(/\.pdf\.pdf$/, '.pdf');

    // Get the file URL
    const { data: { publicUrl } } = supabase.storage
      .from('cover-letters')
      .getPublicUrl(cleanPath);

    // Create download link
    const link = document.createElement('a');
    link.href = publicUrl;
    link.target = '_blank';
    link.download = coverLetter.original_filename?.replace(/\.pdf\.pdf$/, '.pdf') || 'cover-letter.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-5xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Preview Cover Letter
              </h3>

              {error && (
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                  <button
                    onClick={handleDownload}
                    className="mt-2 text-sm text-red-700 hover:text-red-800 underline flex items-center"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    Download file instead
                  </button>
                </div>
              )}

              {loading ? (
                <div className="animate-pulse">
                  <div className="h-[800px] bg-gray-200 rounded"></div>
                </div>
              ) : (
                <div className="h-[800px] w-full bg-gray-50 rounded-lg">
                  {pdfUrl && (
                    <iframe
                      src={`${pdfUrl}#toolbar=0`}
                      className="w-full h-full rounded-lg border border-gray-200"
                      title="Cover Letter Preview"
                      onError={() => {
                        setError('Failed to load PDF preview. Please try downloading the file instead.');
                        setPdfUrl('');
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse space-x-3 space-x-reverse">
            <button
              onClick={handleDownload}
              className="inline-flex justify-center px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Download
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}