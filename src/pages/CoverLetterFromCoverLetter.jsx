import React, { useState } from 'react';
import { CloudArrowUpIcon, LinkIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import CoverLetterList from '../components/dashboard/CoverLetterList';

export default function CoverLetterFromCoverLetter() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobUrl, setJobUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  const handleResumeUpload = (event) => {
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
      
      setResumeFile(correctedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resumeFile || !jobUrl) {
      setError('Please provide both a resume file and job URL');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Upload resume file to Supabase Storage
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, resumeFile);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase
        .from('cover_letters')
        .insert({
          user_id: user.id,
          resume_file_path: filePath,
          job_url: jobUrl,
          status: 'pending',
          original_filename: resumeFile.name
        });

      if (dbError) throw dbError;
      
      setSuccess('Your cover letter is being generated. We will notify you when it is ready.');
      setResumeFile(null);
      setJobUrl('');
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to generate cover letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get the border color class based on file state
  const getBorderColorClass = () => {
    if (loading) return 'border-gray-200 bg-gray-50';
    if (resumeFile) return 'border-purple-500 bg-purple-50';
    return 'border-gray-300 hover:border-purple-500';
  };

  // Get the icon color class based on file state
  const getIconColorClass = () => {
    if (loading) return 'text-gray-300';
    if (resumeFile) return 'text-purple-500';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-xl mb-8">
            <h1 className="text-3xl font-bold mb-4">Cover Letter From URL</h1>
            <p className="text-xl text-purple-100">
              Generate a tailored cover letter from your resume and a job posting URL
            </p>
          </div>

          {/* Process Steps */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-purple-50 hover:to-white group">
              <div className="text-purple-600 font-semibold mb-2 group-hover:text-purple-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-purple-100 rounded-full text-center leading-8 mr-2 group-hover:bg-purple-200 transition-colors">1</span>
                Upload Resume
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Start by uploading your resume</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-purple-50 hover:to-white group">
              <div className="text-purple-600 font-semibold mb-2 group-hover:text-purple-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-purple-100 rounded-full text-center leading-8 mr-2 group-hover:bg-purple-200 transition-colors">2</span>
                Enter Job URL
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Provide the job posting URL</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-purple-50 hover:to-white group">
              <div className="text-purple-600 font-semibold mb-2 group-hover:text-purple-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-purple-100 rounded-full text-center leading-8 mr-2 group-hover:bg-purple-200 transition-colors">3</span>
                Get Cover Letter
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Receive your tailored cover letter</p>
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
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${getBorderColorClass()}`}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      id="resume-upload"
                      disabled={loading}
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer"
                    >
                      <CloudArrowUpIcon className={`mx-auto h-12 w-12 ${getIconColorClass()}`} />
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        PDF, DOC, DOCX up to 10MB
                      </span>
                    </label>
                  </div>
                </div>

                {/* Job URL Section */}
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
                      className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Paste the job posting URL here"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !jobUrl || !resumeFile}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                    (loading || !jobUrl || !resumeFile) ? 'opacity-50 cursor-not-allowed' : ''
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
                    'Generate Cover Letter'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Recent Cover Letters Section */}
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Cover Letters</h2>
              <div className="grid grid-cols-1 gap-6">
                <CoverLetterList />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}