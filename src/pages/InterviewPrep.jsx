import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import {
  ArrowUpTrayIcon,
  LinkIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function InterviewPrep() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Send request to Make.com webhook
      const response = await fetch('https://hook.eu2.make.com/wy0s2v6iuiwfwpgpioq1tjel85blhd4e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'url',
          userId: user.id,
          jobUrl: url,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process job URL');
      }

      // Create new interview prep session with URL
      const { data, error: insertError } = await supabase
        .from('interview_prep')
        .insert([
          {
            user_id: user.id,
            title: 'Interview Prep from Job URL',
            status: 'in_progress',
            company: '',
            position: '',
            date: new Date().toISOString(),
            questions: [],
            answers: [],
            feedback: [],
            job_url: url
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      navigate(`/dashboard/interview-prep/${data.id}`);
    } catch (err) {
      console.error('Error creating interview prep from URL:', err);
      setError('Failed to create interview preparation from URL');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setSelectedFile(file);

      // Upload resume to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          },
        });

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      // Send request to Make.com webhook
      const response = await fetch('https://hook.eu2.make.com/wy0s2v6iuiwfwpgpioq1tjel85blhd4e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'resume',
          userId: user.id,
          resumeUrl: publicUrl,
          fileName: file.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process resume');
      }

      // Create interview prep session with resume
      const { data: prepData, error: insertError } = await supabase
        .from('interview_prep')
        .insert([
          {
            user_id: user.id,
            title: 'Interview Prep from Resume',
            status: 'in_progress',
            company: '',
            position: '',
            date: new Date().toISOString(),
            questions: [],
            answers: [],
            feedback: [],
            resume_path: filePath
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      navigate(`/dashboard/interview-prep/${prepData.id}`);
    } catch (err) {
      console.error('Error uploading resume:', err);
      setError('Failed to upload resume');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-8 rounded-xl mb-8">
            <h1 className="text-3xl font-bold mb-4">Interview Preparation</h1>
            <p className="text-xl text-teal-100">
              Practice and prepare for your interviews with AI-powered assistance
            </p>
          </div>

          {/* Process Steps */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-teal-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-teal-50 hover:to-white group">
              <div className="text-teal-600 font-semibold mb-2 group-hover:text-teal-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-teal-100 rounded-full text-center leading-8 mr-2 group-hover:bg-teal-200 transition-colors">1</span>
                Upload Resume or Enter Job URL
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Start by providing your resume or job posting URL</p>
            </div>
            
            <div className="bg-teal-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-teal-50 hover:to-white group">
              <div className="text-teal-600 font-semibold mb-2 group-hover:text-teal-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-teal-100 rounded-full text-center leading-8 mr-2 group-hover:bg-teal-200 transition-colors">2</span>
                AI Analysis
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Our AI generates targeted interview questions</p>
            </div>
            
            <div className="bg-teal-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-teal-50 hover:to-white group">
              <div className="text-teal-600 font-semibold mb-2 group-hover:text-teal-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-teal-100 rounded-full text-center leading-8 mr-2 group-hover:bg-teal-200 transition-colors">3</span>
                Practice Interview
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Practice with AI and get instant feedback</p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload Resume Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="resume-upload"
                      disabled={loading}
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer"
                    >
                      <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
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
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      placeholder="https://example.com/job-posting"
                      disabled={loading}
                    />
                  </div>
                  <button
                    onClick={handleUrlSubmit}
                    disabled={loading || !url}
                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Generate Questions'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DocumentTextIcon className="h-8 w-8 text-teal-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Analysis</h3>
              <p className="text-gray-600">Get personalized questions based on your experience and skills</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-teal-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Practice</h3>
              <p className="text-gray-600">Practice with our intelligent AI interviewer in real-time</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <AcademicCapIcon className="h-8 w-8 text-teal-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Feedback</h3>
              <p className="text-gray-600">Receive detailed feedback and improvement suggestions</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 