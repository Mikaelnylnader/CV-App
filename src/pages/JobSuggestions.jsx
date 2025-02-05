import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { 
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  BookmarkIcon,
  BookmarkSlashIcon
} from '@heroicons/react/24/outline';

export default function JobSuggestions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('suggested');

  useEffect(() => {
    fetchJobs();
  }, [user, activeTab]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('job_suggestions')
        .select('*')
        .eq('user_id', user.id);

      // Filter based on active tab
      if (activeTab === 'applied') {
        query = query.eq('applied', true);
      } else if (activeTab === 'saved') {
        query = query.eq('saved', true);
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load job suggestions');
    } finally {
      setLoading(false);
    }
  };

  const toggleApplied = async (jobId, currentStatus) => {
    try {
      const { error: updateError } = await supabase
        .from('job_suggestions')
        .update({ applied: !currentStatus })
        .eq('id', jobId);

      if (updateError) throw updateError;
      
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, applied: !job.applied } : job
      ));
    } catch (err) {
      console.error('Error updating job status:', err);
      setError('Failed to update application status');
    }
  };

  const toggleSaved = async (jobId, currentStatus) => {
    try {
      const { error: updateError } = await supabase
        .from('job_suggestions')
        .update({ saved: !currentStatus })
        .eq('id', jobId);

      if (updateError) throw updateError;
      
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, saved: !job.saved } : job
      ));
    } catch (err) {
      console.error('Error updating saved status:', err);
      setError('Failed to update saved status');
    }
  };

  const tabs = [
    { id: 'suggested', name: 'Suggested Jobs' },
    { id: 'saved', name: 'Saved Jobs' },
    { id: 'applied', name: 'Applied Jobs' }
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <main className="flex-1 overflow-y-auto md:ml-16">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading job suggestions...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-8 rounded-xl mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-4">Job Suggestions</h1>
                <p className="text-xl text-pink-100">
                  Your personalized job matches based on your resume
                </p>
              </div>
              <button
                onClick={() => navigate('/dashboard/resume-to-jobs')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-pink-600 bg-white hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Upload
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === tab.id
                        ? 'border-pink-500 text-pink-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          {jobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'suggested' && 'No Job Suggestions Yet'}
                {activeTab === 'saved' && 'No Saved Jobs'}
                {activeTab === 'applied' && 'No Applied Jobs'}
              </h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'suggested' && 'Upload your resume and select your preferred location to get personalized job matches.'}
                {activeTab === 'saved' && "Save jobs you're interested in to keep track of them here."}
                {activeTab === 'applied' && "Jobs you've marked as applied will appear here."}
              </p>
              {activeTab === 'suggested' && (
                <button
                  onClick={() => navigate('/dashboard/resume-to-jobs')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Upload Resume
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h2>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-5 w-5 mr-1" />
                          {job.company}
                        </div>
                        <div className="flex items-center">
                          <MapPinIcon className="h-5 w-5 mr-1" />
                          {job.location}
                        </div>
                        {job.salary && (
                          <div className="flex items-center">
                            <CurrencyDollarIcon className="h-5 w-5 mr-1" />
                            {job.salary}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{job.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills?.map((skill, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 rounded-full text-sm bg-pink-50 text-pink-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleSaved(job.id, job.saved)}
                        className={`p-2 rounded-full ${
                          job.saved 
                            ? 'bg-yellow-100 text-yellow-600' 
                            : 'bg-gray-100 text-gray-400 hover:bg-yellow-50 hover:text-yellow-600'
                        }`}
                        title={job.saved ? 'Remove from Saved' : 'Save Job'}
                      >
                        {job.saved ? (
                          <BookmarkIcon className="h-6 w-6" />
                        ) : (
                          <BookmarkSlashIcon className="h-6 w-6" />
                        )}
                      </button>
                      <button
                        onClick={() => toggleApplied(job.id, job.applied)}
                        className={`p-2 rounded-full ${
                          job.applied 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400 hover:bg-pink-50 hover:text-pink-600'
                        }`}
                        title={job.applied ? 'Mark as Not Applied' : 'Mark as Applied'}
                      >
                        {job.applied ? (
                          <CheckCircleIcon className="h-6 w-6" />
                        ) : (
                          <ClockIcon className="h-6 w-6" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center border-t pt-4">
                    <div className="text-sm text-gray-500">
                      Match Score: <span className="font-semibold text-pink-600">{job.match_score}%</span>
                    </div>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 font-medium text-sm"
                    >
                      View Job →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 