import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import {
  ArrowUpTrayIcon,
  LinkIcon,
  DocumentTextIcon,
  AcademicCapIcon
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

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          },
        });

      if (uploadError) throw uploadError;

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Interview Preparation</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Upload Resume Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <ArrowUpTrayIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Upload Resume</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Upload your resume to generate targeted interview questions and practice scenarios.
            </p>
            <div className="relative">
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
                className="block w-full py-2 px-4 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                    <span>Uploading... {Math.round(uploadProgress)}%</span>
                  </div>
                ) : (
                  <span className="text-gray-600">
                    {selectedFile ? selectedFile.name : 'Choose a file or drag and drop'}
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* Job URL Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <LinkIcon className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Job URL</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Enter a job posting URL to generate customized interview questions based on the role.
            </p>
            <form onSubmit={handleUrlSubmit}>
              <div className="flex items-center">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste job URL here"
                  className="flex-1 rounded-l-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Generate'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Features Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-2" />
              <div>
                <h4 className="font-medium text-gray-900">Resume Analysis</h4>
                <p className="text-sm text-gray-600">Get personalized questions based on your experience</p>
              </div>
            </div>
            <div className="flex items-start">
              <AcademicCapIcon className="h-6 w-6 text-green-600 mr-2" />
              <div>
                <h4 className="font-medium text-gray-900">AI-Powered Practice</h4>
                <p className="text-sm text-gray-600">Practice with our AI interviewer and get feedback</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 