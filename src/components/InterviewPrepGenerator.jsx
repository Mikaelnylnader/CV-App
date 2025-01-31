import React, { useState, useRef } from 'react';
import { interviewPrepService } from '../services/interviewPrepService';
import { useAuth } from '../hooks/useAuth';
import { DocumentTextIcon, LinkIcon, UserIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export const InterviewPrepGenerator = ({ applicationId }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [prepDocument, setPrepDocument] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    jobUrl: '',
    linkedinUrl: '',
    cvFile: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        cvFile: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Read CV file content
      const cvContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(formData.cvFile);
      });

      // Generate prep document
      const result = await interviewPrepService.generateInterviewPrep(
        user.id,
        applicationId,
        formData.jobUrl,
        formData.linkedinUrl,
        cvContent
      );

      setPrepDocument(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Form Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Generate Interview Preparation
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Posting URL
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  name="jobUrl"
                  required
                  value={formData.jobUrl}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://company.com/job-posting"
                />
              </div>
            </div>

            {/* LinkedIn URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interviewer's LinkedIn URL (Optional)
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://linkedin.com/in/interviewer"
                />
              </div>
            </div>

            {/* CV Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Your CV
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        required
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX or TXT up to 10MB
                  </p>
                </div>
              </div>
              {formData.cvFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {formData.cvFile.name}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Generating...
                  </>
                ) : (
                  'Generate Prep Document'
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4 mt-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error generating document
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Preview Section */}
        {prepDocument && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Interview Preparation Document
            </h3>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: prepDocument.html }}
            />
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 