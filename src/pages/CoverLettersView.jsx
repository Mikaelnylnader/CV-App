import React from 'react';
import CoverLetterList from '../components/dashboard/CoverLetterList';
import { useNavigate } from 'react-router-dom';

export default function CoverLettersView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Cover Letters</h1>
            <button
              onClick={() => navigate('/dashboard/cover-letter')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Create New Cover Letter
            </button>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">All Cover Letters</h2>
            <p className="mt-2 text-sm text-gray-600">
              View and manage all your cover letters
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <CoverLetterList />
          </div>
        </div>
      </main>
    </div>
  );
} 