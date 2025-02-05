import React, { useState } from 'react';
import { CloudArrowUpIcon, LinkIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ResumeList from '../components/dashboard/ResumeList';

export default function ResumeFromUrl() {
  const [file, setFile] = useState(null);
  const [jobUrl, setJobUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (uploadedFile.size > maxSize) {
        setError('File size must be less than 10MB');
        return;
      }
      
      const fileExt = uploadedFile.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      
      if (!allowedExtensions.includes(fileExt)) {
        setError('Please upload a PDF, DOC, or DOCX file');
        return;
      }

      // Create new blob with correct MIME type
      const mimeTypes = {
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      };

      const fileBlob = new Blob([uploadedFile], { type: mimeTypes[fileExt] });
      const correctedFile = new File([fileBlob], uploadedFile.name, { type: mimeTypes[fileExt] });
      
      setFile(correctedFile);
      setError('');
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please upload a resume file');
      return;
    }

    if (!jobUrl) {
      setError('Please enter a job posting URL');
      return;
    }

    if (!validateUrl(jobUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload file logic here
      setSuccess('Resume uploaded successfully!');
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to upload resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl mb-8">
            <h1 className="text-3xl font-bold mb-4">Resume from URL</h1>
            <p className="text-xl text-blue-100">
              Generate a tailored resume from a job posting URL
            </p>
          </div>

          {/* Process Steps */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-blue-50 hover:to-white group">
              <div className="text-blue-600 font-semibold mb-2 group-hover:text-blue-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-blue-100 rounded-full text-center leading-8 mr-2 group-hover:bg-blue-200 transition-colors">1</span>
                Upload Resume
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Start by uploading your existing resume</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-blue-50 hover:to-white group">
              <div className="text-blue-600 font-semibold mb-2 group-hover:text-blue-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-blue-100 rounded-full text-center leading-8 mr-2 group-hover:bg-blue-200 transition-colors">2</span>
                Enter Job URL
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Provide the job posting URL</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-blue-50 hover:to-white group">
              <div className="text-blue-600 font-semibold mb-2 group-hover:text-blue-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-blue-100 rounded-full text-center leading-8 mr-2 group-hover:bg-blue-200 transition-colors">3</span>
                Get Resume
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Receive your tailored resume</p>
            </div>
          </div>

          {/* Upload Form */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {error && (
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors">
                    <div className="space-y-1 text-center">
                      <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="resume-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input
                            id="resume-upload"
                            name="resume-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx"
                            disabled={loading}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
                      {file && (
                        <p className="text-sm text-blue-600 mt-2">
                          Selected file: {file.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="job-url" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Posting URL
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      id="job-url"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="https://example.com/job-posting"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading || !file || !jobUrl.trim()}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      loading || !file || !jobUrl.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      'Generate Resume'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Recent Resumes */}
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Resumes</h2>
              <ResumeList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 