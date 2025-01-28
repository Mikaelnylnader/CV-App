import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabaseClient';
import { downloadService } from '../../services/downloadService';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js only when needed
const initializePdfLib = () => {
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
};

export default function PreviewResumeModal({ resume, isOpen, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const canvasRef = useRef(null);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  useEffect(() => {
    let timeoutId;
    
    if (isOpen && resume) {
      loadPDF();
    } else {
      // Reset state when modal closes
      setPdfUrl('');
      setError('');
      setRetryCount(0);
      setDownloadProgress(0);
      setIsDownloading(false);
      setPdfDoc(null);
      setCurrentPage(1);
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
  }, [isOpen, resume]);

  useEffect(() => {
    if (pdfDoc && currentPage) {
      renderPage();
    }
  }, [pdfDoc, currentPage]);

  const loadPDF = async () => {
    try {
      setError(null);
      setLoading(true);

      // Initialize PDF.js when loading a PDF
      initializePdfLib();

      // Always use original_file_path as it's the most recently uploaded file
      const filePath = resume.original_file_path;
      if (!filePath) {
        throw new Error('No file available for preview');
      }

      console.log('Loading PDF with path:', filePath);

      // Verify file exists first
      const exists = await downloadService.verifyFileExists('resumes', filePath);
      if (!exists) {
        throw new Error('File not found. Please try again later.');
      }

      // Get file URL
      const { data } = await supabase.storage
        .from('resumes')
        .download(filePath);

      if (!data) {
        throw new Error('Failed to load PDF file');
      }

      // Convert blob to URL
      const url = URL.createObjectURL(data);
      
      // Load the PDF
      const pdf = await pdfjsLib.getDocument({
        url,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/standard_fonts/',
      }).promise;
      
      setPdfDoc(pdf);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError(err.message);
      
      // Retry loading if we haven't exceeded max retries
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying PDF load (${retryCount + 1}/${MAX_RETRIES})...`);
        setRetryCount(prev => prev + 1);
        setTimeout(loadPDF, RETRY_DELAY);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!resume) return;
    
    const filePath = resume.original_file_path;
    if (!filePath) return;

    try {
      setIsDownloading(true);
      setError('');

      await downloadService.downloadFile(
        'resumes',
        filePath,
        resume.original_filename?.replace(/\.pdf\.pdf$/, '.pdf') || 'resume.pdf',
        {
          onProgress: setDownloadProgress,
          onError: (error) => setError(error.message),
          retryAttempts: 3,
          retryDelay: 1000
        }
      );
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download file. Please try again.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const renderPage = async () => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(currentPage);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Get viewport at scale 1
      const viewport = page.getViewport({ scale: 1.0 });

      // Calculate scale to fit width while maintaining aspect ratio
      const containerWidth = canvas.parentElement.clientWidth;
      const containerHeight = canvas.parentElement.clientHeight;
      const widthScale = containerWidth / viewport.width;
      const heightScale = containerHeight / viewport.height;
      const scale = Math.min(widthScale, heightScale);

      // Set canvas size to match the scaled viewport
      const scaledViewport = page.getViewport({ scale });
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      // Render PDF page
      await page.render({
        canvasContext: context,
        viewport: scaledViewport
      }).promise;
    } catch (err) {
      console.error('Error rendering PDF page:', err);
      setError('Failed to render PDF page');
    }
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
                Preview Resume
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
                <div className="h-[800px] w-full bg-gray-50 rounded-lg flex items-center justify-center">
                  {pdfDoc && (
                    <canvas 
                      ref={canvasRef}
                      className="max-w-full max-h-full"
                      style={{ display: 'block' }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}