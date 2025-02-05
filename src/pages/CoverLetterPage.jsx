import React, { useState, useEffect } from 'react';
import { CloudArrowUpIcon, LinkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CoverLetterList from '../components/dashboard/CoverLetterList';

export default function CoverLetterPage() {
  const [file, setFile] = useState(null);
  const [jobUrl, setJobUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Verify storage bucket exists on component mount
  useEffect(() => {
    const verifyStorage = async () => {
      try {
        const { data: bucket, error } = await supabase
          .storage
          .getBucket('cover-letters');

        if (error) {
          console.error('Storage configuration error:', error);
          setError('Storage system is temporarily unavailable. Please try again later.');
        }
      } catch (err) {
        console.error('Failed to verify storage:', err);
      }
    };

    verifyStorage();
  }, []);

  // Redirect to login if no user
  if (!user) {
    navigate('/login');
    return null;
  }

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

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

    if (!validateUrl(jobUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Verify bucket exists and is accessible
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .getBucket('cover-letters');

      if (bucketError) {
        console.error('Storage configuration error:', bucketError);
        throw new Error('Storage system is temporarily unavailable. Please try again later.');
      }

      // Create a unique filename
      const fileExt = file.name.split('.').pop().toLowerCase();
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(7);
      const fileName = `${timestamp}-${randomString}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('cover-letters')
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        if (uploadError.message.includes('duplicate')) {
          throw new Error('A file with this name already exists. Please try again with a different file.');
        }
        throw new Error('Failed to upload file. Please try again.');
      }

      // Get the file URL
      const { data: { publicUrl } } = supabase.storage
        .from('cover-letters')
        .getPublicUrl(filePath);

      // Create database record
      const { data: coverLetter, error: dbError } = await supabase
        .from('cover_letters')
        .insert({
          user_id: user.id,
          resume_file_path: filePath,
          job_url: jobUrl,
          status: 'pending',
          original_filename: file.name
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save cover letter information. Please try again.');
      }

      // Get webhook URL from environment variables
      const webhookUrl = import.meta.env.VITE_MAKE_COVER_LETTER_WEBHOOK;
      if (!webhookUrl) {
        throw new Error('Cover letter generation is temporarily unavailable. Please try again later.');
      }

      // Send webhook request
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: coverLetter.id,
          user_id: user.id,
          job_url: jobUrl,
          resume_file_path: filePath,
          file_url: publicUrl,
          original_filename: file.name,
          supabase: {
            url: import.meta.env.VITE_SUPABASE_URL,
            key: import.meta.env.VITE_SUPABASE_ANON_KEY
          }
        })
      });

      if (!webhookResponse.ok) {
        const errorData = await webhookResponse.text();
        console.error('Webhook error:', errorData);
        
        // Update status to failed
        await supabase
          .from('cover_letters')
          .update({ 
            status: 'failed',
            webhook_response: { error: errorData },
            webhook_last_attempt_at: new Date().toISOString(),
            webhook_attempts: 1
          })
          .eq('id', coverLetter.id);

        throw new Error('Cover letter generation service is currently unavailable. Our team has been notified and we\'re working to fix this. Please try again later.');
      }

      // Update status to processing
      await supabase
        .from('cover_letters')
        .update({ 
          status: 'processing',
          webhook_last_attempt_at: new Date().toISOString(),
          webhook_attempts: 1
        })
        .eq('id', coverLetter.id);

      setSuccess('Your cover letter is being generated. We will notify you when it is ready.');
      setFile(null);
      setJobUrl('');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to generate cover letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get the border color class based on file state
  const getBorderColorClass = () => {
    if (loading) return 'border-gray-200 bg-gray-50';
    if (file) return 'border-green-500 bg-green-50';
    return 'border-gray-300 hover:border-green-500';
  };

  // Get the icon color class based on file state
  const getIconColorClass = () => {
    if (loading) return 'text-gray-300';
    if (file) return 'text-green-500';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 rounded-xl mb-8">
            <h1 className="text-3xl font-bold mb-4">Cover Letter from Resume</h1>
            <p className="text-xl text-green-100">
              Generate a tailored cover letter for your job application
            </p>
          </div>

          {/* Process Steps */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-green-50 hover:to-white group">
              <div className="text-green-600 font-semibold mb-2 group-hover:text-green-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-green-100 rounded-full text-center leading-8 mr-2 group-hover:bg-green-200 transition-colors">1</span>
                Upload Resume
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Start by uploading your existing resume</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-green-50 hover:to-white group">
              <div className="text-green-600 font-semibold mb-2 group-hover:text-green-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-green-100 rounded-full text-center leading-8 mr-2 group-hover:bg-green-200 transition-colors">2</span>
                Add Job URL
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Provide the job posting URL</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-green-50 hover:to-white group">
              <div className="text-green-600 font-semibold mb-2 group-hover:text-green-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-green-100 rounded-full text-center leading-8 mr-2 group-hover:bg-green-200 transition-colors">3</span>
                Get Cover Letter
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Receive your tailored cover letter</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${getBorderColorClass()}`}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                      disabled={loading}
                    />
                    <label
                      htmlFor="resume-upload"
                      className={`cursor-pointer ${loading ? 'cursor-not-allowed' : ''}`}
                    >
                      <CloudArrowUpIcon className={`mx-auto h-12 w-12 ${getIconColorClass()}`} />
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        {file ? file.name : 'Click to upload or drag and drop'}
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        PDF, DOC, DOCX up to 10MB
                      </span>
                    </label>
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
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="https://example.com/job-posting"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    }`}
                  >
                    {loading ? 'Processing...' : 'Generate Cover Letter'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Recent Cover Letters */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Cover Letters</h2>
            <CoverLetterList />
          </div>
        </div>
      </main>
    </div>
  );
}