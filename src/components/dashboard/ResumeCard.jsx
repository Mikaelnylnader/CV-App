import React, { useState } from 'react';
import { DocumentTextIcon, TrashIcon, PencilSquareIcon, EyeIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabaseClient';
import { downloadService } from '../../services/downloadService';
import EditResumeModal from './EditResumeModal';
import PreviewResumeModal from './PreviewResumeModal';
import DownloadProgress from '../DownloadProgress';
import Toast from '../Toast';

export default function ResumeCard({ resume, onDelete }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const showComingSoonToast = (feature) => {
    setToastMessage(`${feature} feature coming soon!`);
    setShowToast(true);
  };

  const handleDownload = async () => {
    try {
      setError('');
      setDownloadProgress(0);
      setIsDownloading(true);

      console.log('Resume data:', {
        id: resume.id,
        original_file_path: resume.original_file_path,
        optimized_file_path: resume.optimized_file_path,
        original_filename: resume.original_filename,
        status: resume.status
      });

      // Use original_file_path as it's the most recently uploaded file
      const filePath = resume.original_file_path;
      if (!filePath) {
        throw new Error('No file available for download');
      }

      console.log('Using file path:', filePath);

      // Verify file exists first
      const exists = await downloadService.verifyFileExists('resumes', filePath);
      console.log('File exists check:', exists);

      if (!exists) {
        throw new Error('File not found. Please try again later.');
      }

      const filename = resume.original_filename?.replace(/\.pdf(\.pdf)*$/, '.pdf') || 'resume.pdf';

      await downloadService.downloadFile('resumes', filePath, filename, {
        onProgress: setDownloadProgress,
        onError: (error) => {
          console.error('Download error:', error);
          setError('Failed to download file. Please try again later.');
        }
      });
    } catch (err) {
      console.error('Error downloading resume:', err);
      setError('Unable to download file. Please try again later.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      setError('');

      // Delete the file from storage
      if (resume.original_file_path) {
        const { error: storageError } = await supabase.storage
          .from('resumes')
          .remove([resume.original_file_path]);

        if (storageError && !storageError.message.includes('Object not found')) {
          throw storageError;
        }
      }

      // Delete optimized file if it exists
      if (resume.optimized_file_path) {
        const { error: optimizedStorageError } = await supabase.storage
          .from('resumes')
          .remove([resume.optimized_file_path]);

        if (optimizedStorageError && !optimizedStorageError.message.includes('Object not found')) {
          throw optimizedStorageError;
        }
      }

      // Delete the database record
      const { error: dbError } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resume.id);

      if (dbError) throw dbError;

      // Call the onDelete callback to update the UI
      if (onDelete) {
        onDelete(resume.id);
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      setError('Failed to delete resume. Please try again.');
    }
  };

  const handleSaveEdit = async (content) => {
    try {
      // TODO: Implement save functionality
      console.log('Saving edited content:', content);
    } catch (error) {
      console.error('Error saving resume:', error);
      setError('Failed to save changes. Please try again.');
    }
  };

  const handlePreview = () => {
    showComingSoonToast('Preview');
  };

  const handleEdit = () => {
    showComingSoonToast('Edit');
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200">
        <div className="flex items-start justify-between">
          <div 
            className="flex items-start cursor-pointer"
            onClick={handlePreview}
          >
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
                {resume.original_filename?.replace(/\.pdf\.pdf$/, '.pdf') || 'Resume'}
              </h3>
              {resume.job_url ? (
                <a
                  href={resume.job_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {new URL(resume.job_url).hostname}
                </a>
              ) : (
                <p className="text-sm text-gray-500">No job URL</p>
              )}
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            resume.status === 'completed' ? 'bg-green-100 text-green-800' :
            resume.status === 'failed' ? 'bg-red-100 text-red-800' :
            resume.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {resume.status === 'completed' ? 'Completed' :
             resume.status === 'failed' ? 'Failed' :
             resume.status === 'processing' ? 'Processing' :
             'Uploaded'}
          </span>
        </div>

        {error && (
          <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <p className="mt-4 text-sm text-gray-500">
          Created: {formatDate(resume.created_at)}
        </p>
        <div className="mt-4 flex space-x-3">
          {resume.status === 'completed' && (
            <>
              <button
                onClick={handlePreview}
                className="text-sm text-gray-600 hover:text-blue-600 flex items-center"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                Preview
              </button>
              <button
                onClick={handleDownload}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <DocumentTextIcon className="h-4 w-4 mr-1" />
                Download
              </button>
              <button 
                onClick={handleEdit}
                className="text-sm text-gray-600 hover:text-blue-600 flex items-center"
              >
                <PencilSquareIcon className="h-4 w-4 mr-1" />
                Edit
              </button>
            </>
          )}
          <button 
            onClick={handleDelete}
            className="text-sm text-gray-600 hover:text-red-600 flex items-center"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>

      {isDownloading && (
        <DownloadProgress 
          progress={downloadProgress}
          filename={resume.original_filename?.replace(/\.pdf\.pdf$/, '.pdf') || 'resume.pdf'}
        />
      )}

      <EditResumeModal
        resume={resume}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />

      <PreviewResumeModal
        resume={resume}
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
      />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}