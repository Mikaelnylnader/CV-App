import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  DocumentDuplicateIcon,
  PencilSquareIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Sidebar from '../components/dashboard/Sidebar';
import ResumeList from '../components/dashboard/ResumeList';
import CoverLetterList from '../components/dashboard/CoverLetterList';

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
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      green: 'bg-green-50 text-green-600 hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
      yellow: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
      pink: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
      indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage="Dashboard" />
      <main className="flex-1 overflow-y-auto md:ml-16">
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl mb-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p className="text-xl text-blue-100">
              Welcome back! What would you like to do today?
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {actionCards.map((card, index) => (
              <button
                key={`${card.title}-${index}`}
                onClick={card.action}
                className={`p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 text-left ${getColorClasses(card.color)}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <card.icon className="h-8 w-8" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold">{card.title}</h3>
                    <p className="mt-1 text-sm opacity-80">{card.description}</p>
                  </div>
                </div>
              </button>
            ))}
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
            {activeTab === 'all' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Resumes</h3>
                  <ResumeList />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Cover Letters</h3>
                  <CoverLetterList />
                </div>
              </div>
            )}
            {activeTab === 'resumes' && <ResumeList />}
            {activeTab === 'coverLetters' && <CoverLetterList />}
          </div>
        </div>
      </main>
    </div>
  );
}