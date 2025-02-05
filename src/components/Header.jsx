import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { 
  HomeIcon, 
  DocumentDuplicateIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

export default function Header() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = (location.pathname.startsWith('/dashboard') || 
                     location.pathname.startsWith('/resumes') ||
                     (location.pathname.startsWith('/blog') && user) ||
                     (location.pathname.startsWith('/resources') && user) ||
                     (location.pathname.startsWith('/jobs') && user) ||
                     (location.pathname.startsWith('/cover-letters') && user));

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const scrollToSection = (sectionId) => (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const section = document.querySelector(`#${sectionId}`);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-md z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" onClick={handleLogoClick} className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI Resume Pro
          </span>
        </a>

        <div className="hidden lg:flex items-center space-x-6">
          {isDashboard ? (
            <>
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <HomeIcon className="h-5 w-5 mr-1" />
                {t('common.dashboard')}
              </Link>

              {/* My Documents */}
              <Link to="/resumes" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <DocumentDuplicateIcon className="h-5 w-5 mr-1" />
                My Resumes
              </Link>
              <Link to="/cover-letters" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <DocumentTextIcon className="h-5 w-5 mr-1" />
                My Cover Letters
              </Link>
              <Link to="/jobs" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <BriefcaseIcon className="h-5 w-5 mr-1" />
                My Jobs
              </Link>

              {/* Resources and Settings */}
              <Link to="/resources" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <BookOpenIcon className="h-5 w-5 mr-1" />
                Resources
              </Link>
              <Link to="/blog" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <BookOpenIcon className="h-5 w-5 mr-1" />
                Blog
              </Link>
              <Link to="/settings" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <Cog6ToothIcon className="h-5 w-5" />
              </Link>
            </>
          ) : (
            <>
              <a href="#features" onClick={scrollToSection('features')} className="text-gray-600 hover:text-blue-600 transition-colors">
                {t('common.features')}
              </a>
              <a href="#how-it-works" onClick={scrollToSection('how-it-works')} className="text-gray-600 hover:text-blue-600 transition-colors">
                {t('common.howItWorks')}
              </a>
              <a href="#pricing" onClick={scrollToSection('pricing')} className="text-gray-600 hover:text-blue-600 transition-colors">
                {t('common.pricing')}
              </a>
              <Link to="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">
                Blog
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {user ? (
            <button
              onClick={handleSignOut}
              className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              {t('common.signOut')}
            </button>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap text-sm sm:text-base">
                {t('common.signIn')}
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap text-sm sm:text-base"
              >
                {t('common.signUp')}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}