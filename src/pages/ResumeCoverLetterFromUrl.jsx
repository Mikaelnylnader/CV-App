import React, { useState } from 'react';
import { CloudArrowUpIcon, LinkIcon } from '@heroicons/react/24/outline';
import Sidebar from '../components/dashboard/Sidebar';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ResumeList from '../components/dashboard/ResumeList';
import CoverLetterList from '../components/dashboard/CoverLetterList';

export default function ResumeCoverLetterFromUrl() {
  const [file, setFile] = useState(null);
  const [jobUrl, setJobUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (event) => {
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
      
      setFile(uploadedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!file || !jobUrl) {
      setError('Please provide both a resume file and job URL');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      // Validate URL
      try {
        new URL(jobUrl);
      } catch {
        throw new Error('Please enter a valid URL');
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database records for both resume and cover letter
      const { error: resumeDbError } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          original_file_path: filePath,
          job_url: jobUrl,
          status: 'pending',
          original_filename: file.name
        });

      if (resumeDbError) throw resumeDbError;

      const { error: coverLetterDbError } = await supabase
        .from('cover_letters')
        .insert({
          user_id: user.id,
          resume_file_path: filePath,
          job_url: jobUrl,
          status: 'pending',
          original_filename: file.name.replace(/\.(pdf|doc|docx)$/i, '_cover_letter.$1')
        });

      if (coverLetterDbError) throw coverLetterDbError;
      
      setSuccess('Your resume and cover letter are being generated. You will be notified when they are ready.');
      setFile(null);
      setJobUrl('');
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to process your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage="Resume + Cover Letter from URL" />
      <main className="flex-1 overflow-y-auto md:ml-16 relative">
        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <h1 className="text-6xl font-bold text-pink-600 text-center">
            Coming Soon
          </h1>
        </div>

        <div className="py-16 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-8 rounded-xl mb-8">
            <h1 className="text-3xl font-bold mb-4">Resume + Cover Letter from URL</h1>
            <p className="text-xl text-pink-100">
              Generate a tailored resume and cover letter from a job posting URL
            </p>
          </div>

          {/* Process Steps */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-pink-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-pink-50 hover:to-white group">
              <div className="text-pink-600 font-semibold mb-2 group-hover:text-pink-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-pink-100 rounded-full text-center leading-8 mr-2 group-hover:bg-pink-200 transition-colors">1</span>
                Upload Resume
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Start by uploading your existing resume</p>
            </div>
            
            <div className="bg-pink-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-pink-50 hover:to-white group">
              <div className="text-pink-600 font-semibold mb-2 group-hover:text-pink-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-pink-100 rounded-full text-center leading-8 mr-2 group-hover:bg-pink-200 transition-colors">2</span>
                Enter Job URL
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Provide the job posting URL</p>
            </div>
            
            <div className="bg-pink-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-pink-50 hover:to-white group">
              <div className="text-pink-600 font-semibold mb-2 group-hover:text-pink-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-pink-100 rounded-full text-center leading-8 mr-2 group-hover:bg-pink-200 transition-colors">3</span>
                Get Documents
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Get your optimized resume and cover letter</p>
            </div>
          </div>

          {/* Upload Form */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {error && (
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Resume Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-500 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer"
                    >
                      <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        {file ? file.name : 'Click to upload or drag and drop'}
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        PDF, DOC, DOCX up to 10MB
                      </span>
                    </label>
                  </div>
                </div>

                {/* URL Input Section */}
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
                      disabled={loading}
                      className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Paste the job posting URL here"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !jobUrl || !file}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
                    (loading || !jobUrl || !file) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    'Generate Documents'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Recent Documents Section */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Resumes</h2>
              <ResumeList />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Cover Letters</h2>
              <CoverLetterList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 