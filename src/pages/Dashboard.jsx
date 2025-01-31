import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  DocumentDuplicateIcon,
  PencilSquareIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  UserIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import Sidebar from '../components/dashboard/Sidebar';
import ResumeList from '../components/dashboard/ResumeList';
import CoverLetterList from '../components/dashboard/CoverLetterList';
import { emailService } from '../services/emailService';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'resumes', 'coverLetters'

  console.log('Auth state:', { user, loading }); // Debug log

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show not authenticated state
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Not Authenticated</h2>
          <p className="text-gray-600 mb-4">Please log in to access the dashboard.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const actionCards = [
    {
      title: 'Resume from URL',
      description: 'Generate a tailored resume from a job posting URL',
      icon: DocumentDuplicateIcon,
      action: () => navigate('/dashboard/upload'),
      color: 'blue'
    },
    {
      title: 'Cover Letter From CV',
      description: 'Generate a tailored cover letter for your job application',
      icon: PencilSquareIcon,
      action: () => navigate('/dashboard/cover-letter'),
      color: 'green'
    },
    {
      title: 'Cover Letter from URL',
      description: 'Generate a tailored cover letter from a job posting URL',
      icon: ChartBarIcon,
      action: () => navigate('/dashboard/cover-letter-from-cover-letter'),
      color: 'purple'
    },
    {
      title: 'Career Resources',
      description: 'Access guides and tips for job searching',
      icon: BookOpenIcon,
      action: () => navigate('/resources'),
      color: 'yellow'
    },
    {
      title: 'Resume + Cover Letter from URL',
      description: 'Generate a tailored resume and cover letter from a job posting URL',
      icon: DocumentDuplicateIcon,
      action: () => navigate('/dashboard/resume-from-url'),
      color: 'pink'
    },
    {
      title: 'Resume to Jobs',
      description: 'Generate a tailored cover letter from a job posting URL',
      icon: PencilSquareIcon,
      action: () => navigate('/dashboard/cover-letter-from-url'),
      color: 'indigo'
    },
    {
      title: 'Interview Preparation',
      description: 'Practice for interviews with AI-powered mock interviews',
      icon: AcademicCapIcon,
      action: () => navigate('/dashboard/interview-prep'),
      color: 'teal'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      green: 'bg-green-50 text-green-600 hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
      yellow: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
      pink: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
      indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
      teal: 'bg-teal-50 text-teal-600 hover:bg-teal-100'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage="Dashboard" />
      <main className="flex-1 overflow-y-auto md:ml-16">
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#000033] to-[#000066] text-white p-8 rounded-xl mb-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p className="text-xl text-blue-100">
              Welcome back! What would you like to do today?
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Resume from URL */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer transform" onClick={() => navigate('/dashboard/upload')}>
              <div className="flex items-start">
                <DocumentDuplicateIcon className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="ml-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors duration-200">Resume from URL</h2>
                  <p className="text-gray-600 mb-4">Generate a tailored resume from a job posting URL</p>
                  <span className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center group">
                    Get Started 
                    <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Cover Letter From CV */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer transform" onClick={() => navigate('/dashboard/cover-letter')}>
              <div className="flex items-start">
                <PencilSquareIcon className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="ml-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 hover:text-green-600 transition-colors duration-200">Cover Letter From CV</h2>
                  <p className="text-gray-600 mb-4">Generate a tailored cover letter for your job application</p>
                  <span className="text-green-600 hover:text-green-700 font-medium inline-flex items-center group">
                    Create Now 
                    <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Cover Letter from URL */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer transform" onClick={() => navigate('/dashboard/cover-letter-from-cover-letter')}>
              <div className="flex items-start">
                <ChartBarIcon className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="ml-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 hover:text-purple-600 transition-colors duration-200">Cover Letter from URL</h2>
                  <p className="text-gray-600 mb-4">Generate a tailored cover letter from a job posting URL</p>
                  <span className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center group">
                    Generate 
                    <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Career Resources */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer transform" onClick={() => navigate('/resources')}>
              <div className="flex items-start">
                <BookOpenIcon className="h-8 w-8 text-yellow-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="ml-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 hover:text-yellow-600 transition-colors duration-200">Career Resources</h2>
                  <p className="text-gray-600 mb-4">Access guides and tips for job searching</p>
                  <span className="text-yellow-600 hover:text-yellow-700 font-medium inline-flex items-center group">
                    Explore 
                    <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Resume + Cover Letter from URL */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer transform" onClick={() => navigate('/dashboard/resume-from-url')}>
              <div className="flex items-start">
                <DocumentDuplicateIcon className="h-8 w-8 text-pink-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="ml-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 hover:text-pink-600 transition-colors duration-200">Resume + Cover Letter from URL</h2>
                  <p className="text-gray-600 mb-4">Generate a tailored resume and cover letter from a job posting URL</p>
                  <span className="text-pink-600 hover:text-pink-700 font-medium inline-flex items-center group">
                    Generate Both 
                    <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Resume to Jobs */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer transform" onClick={() => navigate('/dashboard/cover-letter-from-url')}>
              <div className="flex items-start">
                <PencilSquareIcon className="h-8 w-8 text-indigo-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="ml-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 hover:text-indigo-600 transition-colors duration-200">Resume to Jobs</h2>
                  <p className="text-gray-600 mb-4">Generate a tailored cover letter from a job posting URL</p>
                  <span className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center group">
                    Match Jobs 
                    <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Interview Preparation */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer transform" onClick={async () => {
              try {
                // Create a new interview prep session and navigate to it
                const { data, error } = await supabase
                  .from('interview_prep')
                  .insert([
                    {
                      user_id: user.id,
                      title: 'New Interview Preparation',
                      status: 'in_progress',
                      company: '',
                      position: '',
                      date: new Date().toISOString(),
                      questions: [],
                      answers: [],
                      feedback: []
                    }
                  ])
                  .select()
                  .single();

                if (error) throw error;
                navigate(`/dashboard/interview-prep/${data.id}`);
              } catch (err) {
                console.error('Error creating interview prep:', err);
                // If there's an error, just navigate to the main interview prep page
                navigate('/dashboard/interview-prep');
              }
            }}>
              <div className="flex items-start">
                <AcademicCapIcon className="h-8 w-8 text-teal-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="ml-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 hover:text-teal-600 transition-colors duration-200">Interview Preparation</h2>
                  <p className="text-gray-600 mb-4">Practice for interviews with AI-powered mock interviews</p>
                  <span className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center group">
                    Start Practicing 
                    <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`${
                    activeTab === 'all'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('resumes')}
                  className={`${
                    activeTab === 'resumes'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Resumes
                </button>
                <button
                  onClick={() => setActiveTab('coverLetters')}
                  className={`${
                    activeTab === 'coverLetters'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Cover Letters
                </button>
              </nav>
            </div>

            {/* Content based on active tab */}
            <div>
              {activeTab === 'all' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Resumes</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <ResumeList />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Cover Letters</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <CoverLetterList />
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'resumes' && <ResumeList />}
              {activeTab === 'coverLetters' && <CoverLetterList />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}