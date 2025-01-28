import React, { useState } from 'react';
import { CloudArrowUpIcon, LinkIcon } from '@heroicons/react/24/outline';
import Sidebar from '../components/dashboard/Sidebar';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ResumeList from '../components/dashboard/ResumeList';

export default function ResumeFromUrl() {
  const [jobUrl, setJobUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
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

      // TODO: Implement resume generation from URL
      // This is a placeholder for the actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Resume generation started. You will be notified when it is ready.');
      setJobUrl('');
    } catch (err) {
      console.error('Error generating resume:', err);
      setError(err.message || 'Failed to generate resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage="Resume from URL" />
      <main className="flex-1 overflow-y-auto md:ml-16">
        <div className="py-16 px-4 sm:px-6 lg:px-8">
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
                Enter Job URL
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Provide the job posting URL</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-blue-50 hover:to-white group">
              <div className="text-blue-600 font-semibold mb-2 group-hover:text-blue-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-blue-100 rounded-full text-center leading-8 mr-2 group-hover:bg-blue-200 transition-colors">2</span>
                Generate Resume
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Our AI tailors your resume to the job</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-blue-50 hover:to-white group">
              <div className="text-blue-600 font-semibold mb-2 group-hover:text-blue-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-blue-100 rounded-full text-center leading-8 mr-2 group-hover:bg-blue-200 transition-colors">3</span>
                Download Resume
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Get your optimized resume</p>
            </div>
          </div>

          {/* URL Input Form */}
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
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Paste the job posting URL here"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !jobUrl}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    (loading || !jobUrl) ? 'opacity-50 cursor-not-allowed' : ''
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
                    'Generate Resume'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Recent Resumes Section */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Resumes</h2>
            <ResumeList />
          </div>
        </div>
      </main>
    </div>
  );
} 