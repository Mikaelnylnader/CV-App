import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabaseClient';
import { pdfService } from '../../services/pdfService';

export default function EditCoverLetterModal({ coverLetter, isOpen, onClose, onSave }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && coverLetter) {
      fetchCoverLetterContent();
    }
  }, [isOpen, coverLetter]);

  const fetchCoverLetterContent = async () => {
    try {
      setLoading(true);
      setError('');

      const filePath = coverLetter.generated_file_path || coverLetter.resume_file_path;
      if (!filePath) {
        throw new Error('No file available');
      }

      // Get the file URL
      const { data: { publicUrl } } = supabase.storage
        .from('cover-letters')
        .getPublicUrl(filePath);

      // Fetch the PDF file
      const response = await fetch(publicUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch PDF file');
      }

      const blob = await response.blob();
      const file = new File([blob], 'cover-letter.pdf', { type: 'application/pdf' });
      
      // Extract text from PDF
      const text = await pdfService.extractText(file);
      if (!text) {
        throw new Error('No text content found in PDF');
      }

      setContent(text);
    } catch (err) {
      console.error('Error fetching cover letter:', err);
      setError(err.message || 'Failed to load cover letter content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      if (!content.trim()) {
        throw new Error('Content cannot be empty');
      }

      // Call the onSave callback with the edited content
      await onSave(content);
      onClose();
    } catch (err) {
      console.error('Error saving changes:', err);
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    try {
      const filename = coverLetter.original_filename?.replace(/\.pdf$/, '') || 'cover-letter';
      const element = document.createElement('a');
      const file = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${filename}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(element.href); // Clean up
    } catch (err) {
      console.error('Error downloading file:', err);
      setError('Failed to download file');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
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
                Edit Cover Letter
              </h3>

              {error && (
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-[500px] p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono resize-none"
                  placeholder="Cover letter content..."
                />
              )}
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse space-x-3 space-x-reverse">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading || !content.trim()}
              className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={loading || !content.trim()}
              className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-blue-600 bg-white border border-blue-600 rounded-md shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download as Text
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}