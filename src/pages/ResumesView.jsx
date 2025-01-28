import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import ResumeList from '../components/dashboard/ResumeList';
import CreateResumeButton from '../components/dashboard/CreateResumeButton';

export default function ResumesView() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage="My Resumes" />
      <main className="flex-1 overflow-y-auto md:ml-16">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
            <CreateResumeButton />
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">All Optimized Resumes</h2>
            <p className="mt-2 text-sm text-gray-600">
              View and manage all your optimized resumes
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <ResumeList />
          </div>
        </div>
      </main>
    </div>
  );
}