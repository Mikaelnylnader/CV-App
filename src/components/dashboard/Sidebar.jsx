import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  DocumentDuplicateIcon,
  PencilSquareIcon,
  ChartBarIcon,
  BookOpenIcon,
  UserIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { name: 'My Resumes', icon: DocumentDuplicateIcon, path: '/cvs' },
  { name: 'My Cover Letters', icon: DocumentTextIcon, path: '/cover-letters' },
  { name: 'My Jobs', icon: BriefcaseIcon, path: '/jobs' },
  { name: 'Resume from URL', icon: DocumentDuplicateIcon, path: '/dashboard/resume-from-url' },
  { name: 'Resume + Cover Letter from URL', icon: DocumentDuplicateIcon, path: '/dashboard/resume-cover-letter-from-url' },
  { name: 'Cover Letter from Resume', icon: PencilSquareIcon, path: '/dashboard/cover-letter' },
  { name: 'Cover Letter from URL', icon: ChartBarIcon, path: '/dashboard/cover-letter-from-cover-letter' },
  { name: 'Career Resources', icon: BookOpenIcon, path: '/resources' },
  { name: 'Account Settings', icon: Cog6ToothIcon, path: '/settings' }
];

export default function Sidebar({ currentPage = 'Dashboard' }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isHovered ? 'w-64' : 'w-16'
      } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-50`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        <div className={`flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 ${
          isHovered ? 'justify-start' : 'justify-center'
        }`}>
          {isHovered ? (
            <h1 className="text-xl font-bold text-blue-600">AI Resume Pro</h1>
          ) : (
            <h1 className="text-xl font-bold text-blue-600">AI</h1>
          )}
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                currentPage === item.name
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`h-6 w-6 ${
                  currentPage === item.name ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {isHovered && (
                <span className="ml-3 transition-opacity duration-200">{item.name}</span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}