import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CloudArrowUpIcon, LinkIcon } from '@heroicons/react/24/outline';
import { resumeService } from '../../services/resumeService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useSubscription } from '../../contexts/SubscriptionContext';
import UpgradeModal from '../UpgradeModal';

export default function UploadSection() {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [jobUrl, setJobUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadDisabled, setUploadDisabled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getRemainingCustomizations } = useSubscription();
  const [remainingCustomizations, setRemainingCustomizations] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    let timer;
    if (success && uploadDisabled) {
      timer = setTimeout(() => {
        setUploadDisabled(false);
        setSuccess('');
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [success, uploadDisabled]);

  useEffect(() => {
    const checkCustomizations = async () => {
      const remaining = await getRemainingCustomizations();
      setRemainingCustomizations(remaining);
    };
    checkCustomizations();
  }, []);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      console.log('File selected:', uploadedFile.name, uploadedFile.type, uploadedFile.size);
      
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

  const validateJobUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (remainingCustomizations === 0) {
      setShowUpgradeModal(true);
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    if (!file || !jobUrl) {
      setError('Please provide both a resume file and job URL');
      return;
    }

    if (!validateJobUrl(jobUrl)) {
      setError('Please enter a valid job URL');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      console.log('Starting resume upload...');
      
      // Test Supabase connection
      const { data: bucketTest, error: bucketError } = await supabase
        .storage
        .getBucket('resumes');
      
      if (bucketError) {
        console.error('Bucket test error:', bucketError);
        throw new Error('Unable to access storage. Please try again later.');
      }
      
      console.log('Storage bucket accessible:', bucketTest);

      const { resume } = await resumeService.uploadResume(file, jobUrl);
      
      setSuccess('Resume uploaded successfully! Processing will begin shortly.');
      setFile(null);
      setJobUrl('');
      setUploadDisabled(true);
      
      console.log('Resume uploaded with ID:', resume.id);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload resume. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the border color class based on file state
  const getBorderColorClass = () => {
    if (uploadDisabled) return 'border-gray-200 bg-gray-50';
    if (file) return 'border-green-500 bg-green-50';
    return 'border-gray-300 hover:border-blue-500';
  };

  // Get the icon color class based on file state
  const getIconColorClass = () => {
    if (uploadDisabled) return 'text-gray-300';
    if (file) return 'text-green-500';
    return 'text-gray-400';
  };

  return (
    <div>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl mb-8">
        <h1 className="text-3xl font-bold mb-4">Resume from URL</h1>
        <p className="text-xl text-blue-100">
          Transform your resume instantly with AI that tailors your experience to match any job description
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
            Add Job URL
          </div>
          <p className="text-sm text-gray-600 group-hover:text-gray-700">Provide the job posting URL</p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-br hover:from-blue-50 hover:to-white group">
          <div className="text-blue-600 font-semibold mb-2 group-hover:text-blue-700 transition-colors">
            <span className="inline-block w-8 h-8 bg-blue-100 rounded-full text-center leading-8 mr-2 group-hover:bg-blue-200 transition-colors">3</span>
            Get Optimized Resume
          </div>
          <p className="text-sm text-gray-600 group-hover:text-gray-700">Receive your tailored resume</p>
        </div>
      </div>

      {/* Upload Form */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {remainingCustomizations !== null && remainingCustomizations < 3 && (
            <div className="mb-4 p-4 bg-yellow-50 text-yellow-800 rounded-md">
              <p>You have {remainingCustomizations} resume customizations remaining on your free plan.</p>
            </div>
          )}

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
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                  disabled={uploadDisabled}
                />
                <label
                  htmlFor="resume-upload"
                  className={`cursor-pointer ${uploadDisabled ? 'cursor-not-allowed' : ''}`}
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://example.com/job-posting"
                  disabled={uploadDisabled}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || uploadDisabled}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting || uploadDisabled
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Generate Resume'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="Unlimited Resume Customizations"
      />
    </div>
  );
}