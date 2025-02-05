import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentArrowUpIcon, ArrowRightIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function ResumeToJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadDisabled, setUploadDisabled] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !location.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Upload resume to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      // Send request to Make.com webhook
      const response = await fetch('https://hook.eu2.make.com/ro3p49q2th4ft183d4hhd24o8uym1gh4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          resumeUrl: publicUrl,
          fileName: file.name,
          location: location,
          type: 'job_matching'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process resume for job matching');
      }

      // Navigate to job suggestions page
      navigate('/dashboard/job-suggestions');
    } catch (error) {
      console.error('Error processing resume:', error);
      setError('Failed to process your resume. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-xl mb-8">
            <h1 className="text-3xl font-bold mb-4">Resume to Jobs</h1>
            <p className="text-xl text-indigo-100">
              Upload your resume to get matched with relevant job opportunities
            </p>
          </div>

          {/* Process Steps */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-indigo-50 hover:to-white group">
              <div className="text-indigo-600 font-semibold mb-2 group-hover:text-indigo-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-indigo-100 rounded-full text-center leading-8 mr-2 group-hover:bg-indigo-200 transition-colors">1</span>
                Upload Resume
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Upload your resume in PDF, DOC, or DOCX format</p>
            </div>
            
            <div className="bg-indigo-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-indigo-50 hover:to-white group">
              <div className="text-indigo-600 font-semibold mb-2 group-hover:text-indigo-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-indigo-100 rounded-full text-center leading-8 mr-2 group-hover:bg-indigo-200 transition-colors">2</span>
                Choose Location
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">Select your preferred job location</p>
            </div>

            <div className="bg-indigo-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-indigo-50 hover:to-white group">
              <div className="text-indigo-600 font-semibold mb-2 group-hover:text-indigo-700 transition-colors">
                <span className="inline-block w-8 h-8 bg-indigo-100 rounded-full text-center leading-8 mr-2 group-hover:bg-indigo-200 transition-colors">3</span>
                Get Matches
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">View personalized job matches</p>
            </div>
          </div>

          {/* Upload Form */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {error && (
                <div className="mb-6 p-4 text-red-700 bg-red-100 rounded-md">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Resume Upload */}
                <div>
                  <label
                    htmlFor="resume-upload"
                    className={`relative block w-full rounded-lg border-2 border-dashed p-12 text-center hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer ${
                      file ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                    }`}
                  >
                    <DocumentArrowUpIcon className={`mx-auto h-12 w-12 ${file ? 'text-indigo-500' : 'text-gray-400'}`} />
                    <span className="mt-2 block text-sm font-semibold text-gray-900">
                      {file ? file.name : 'Upload your resume'}
                    </span>
                    <span className="mt-2 block text-sm text-gray-500">
                      PDF, DOC, or DOCX up to 10MB
                    </span>
                    <input
                      id="resume-upload"
                      name="resume"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      disabled={uploadDisabled}
                      required
                    />
                  </label>
                </div>

                {/* Location Input */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Location
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter city, state, or country"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!file || !location.trim() || isSubmitting || uploadDisabled}
                  className={`w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    !file || !location.trim() || isSubmitting || uploadDisabled
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {isSubmitting ? 'Processing...' : 'Find Matching Jobs'}
                </button>
              </form>
            </div>
          </div>

          {/* View All Jobs Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/dashboard/job-suggestions')}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
            >
              View all job suggestions
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 
