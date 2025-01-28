import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { DocumentTextIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Sidebar from '../components/dashboard/Sidebar';

export default function CVDashboard() {
  const { user } = useAuth();
  const [cvs, setCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  const fetchCVs = async () => {
    try {
      setRefreshing(true);
      setError(null);

      // Add retry delay if retrying
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryCount - 1)));
      }

      const { data, error: fetchError } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Clean up file paths
      const cleanedData = (data || []).map(cv => ({
        ...cv,
        optimized_file_path: cv.optimized_file_path?.replace(/\.pdf\.pdf$/, '.pdf'),
        original_file_path: cv.original_file_path?.replace(/\.pdf\.pdf$/, '.pdf')
      }));

      setCVs(cleanedData);
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching CVs:', err);
      setError(err.message || 'Failed to load CVs');
      
      // Retry if not exceeded max attempts
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        fetchCVs();
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePreview = (cv) => {
    if (!cv.optimized_file_path && !cv.original_file_path) {
      setError('No file available for preview');
      return;
    }

    const filePath = cv.optimized_file_path || cv.original_file_path;
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    // Add timestamp to prevent caching
    const url = new URL(publicUrl);
    url.searchParams.set('t', Date.now().toString());
    
    return url.toString();
  };

  useEffect(() => {
    if (user) {
      fetchCVs();

      // Set up real-time subscription
      const channel = supabase
        .channel('cv-updates')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'resumes',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            // Handle different change types
            switch (payload.eventType) {
              case 'INSERT':
                setCVs(prev => [payload.new, ...prev]);
                break;
              case 'UPDATE':
                setCVs(prev => prev.map(cv => 
                  cv.id === payload.new.id ? payload.new : cv
                ));
                break;
              case 'DELETE':
                setCVs(prev => prev.filter(cv => cv.id !== payload.old.id));
                break;
              default:
                break;
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar currentPage="CVs" />
        <main className="flex-1 overflow-y-auto md:ml-16">
          <div className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage="CVs" />
      <main className="flex-1 overflow-y-auto md:ml-16">
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My CVs</h1>
            <button
              onClick={fetchCVs}
              disabled={refreshing}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowPathIcon className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    onClick={fetchCVs}
                    className="mt-2 text-sm text-red-700 underline hover:text-red-800"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CV List */}
          {cvs.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No CVs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by uploading your first CV
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {cvs.map((cv) => (
                <div
                  key={cv.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {cv.original_filename || 'Untitled CV'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Last updated: {new Date(cv.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cv.status === 'completed' ? 'bg-green-100 text-green-800' :
                      cv.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cv.status}
                    </span>
                  </div>

                  {/* Job URL */}
                  {cv.job_url && (
                    <div className="mt-2">
                      <a
                        href={cv.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Job Posting
                      </a>
                    </div>
                  )}

                  {/* PDF Preview */}
                  {cv.status === 'completed' && (
                    <div className="mt-4">
                      <iframe
                        src={`${handlePreview(cv)}#toolbar=0`}
                        className="w-full h-96 rounded border border-gray-200"
                        title={`Preview of ${cv.original_filename || 'CV'}`}
                        onError={() => setError('Failed to load PDF preview')}
                      />
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {error && (
                    <div className="mt-2 text-sm text-red-600">
                      {error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}