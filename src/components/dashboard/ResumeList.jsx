import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import ResumeCard from './ResumeCard';
import { useAuth } from '../../contexts/AuthContext';

export default function ResumeList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  const fetchResumes = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);

      // Add retry logic with timeout
      const fetchWithTimeout = async (attempt) => {
        const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        );

        const fetch = supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

        try {
          const result = await Promise.race([fetch, timeout]);
          return result;
        } catch (error) {
          if (attempt < MAX_RETRIES) {
            await new Promise(resolve => 
              setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt))
            );
            return fetchWithTimeout(attempt + 1);
          }
          throw error;
        }
      };

      const { data, error: fetchError } = await fetchWithTimeout(0);
      if (fetchError) throw fetchError;

      // Clean up file paths to ensure they're correct
      const cleanedData = data?.map(resume => ({
        ...resume,
        optimized_file_path: resume.optimized_file_path?.replace(/\.pdf\.pdf$/, '.pdf')
      })) || [];

      setResumes(cleanedData);
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setError('Failed to load resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deletedId) => {
    setResumes(prevResumes => prevResumes.filter(resume => resume.id !== deletedId));
  };

  useEffect(() => {
    let mounted = true;
    let channel;
    let retryTimeout;

    const setupSubscription = async () => {
      if (!user) return;

      try {
        if (mounted) {
          // Clear any existing retry timeout
          if (retryTimeout) {
            clearTimeout(retryTimeout);
          }

          await fetchResumes();
        }

        channel = supabase
          .channel('resume_changes')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'resumes',
              filter: `user_id=eq.${user.id}`
            }, 
            () => {
              if (mounted) {
                fetchResumes();
              }
            }
          )
          .subscribe();

      } catch (error) {
        console.error('Subscription setup error:', error);
        if (mounted) {
          setError('Failed to setup real-time updates');
          // Retry subscription setup after delay
          retryTimeout = setTimeout(() => {
            if (mounted) {
              setupSubscription();
            }
          }, RETRY_DELAY);
        }
      }
    };

    setupSubscription();

    return () => {
      mounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please sign in to view your resumes</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse bg-gray-200 h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => {
                setRetryCount(0);
                fetchResumes();
              }}
              className="mt-2 text-sm text-red-700 underline hover:text-red-800"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes</h3>
        <p className="mt-1 text-sm text-gray-500">{t('dashboard.noResumes')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resumes.map((resume) => (
        <ResumeCard 
          key={resume.id} 
          resume={resume} 
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}