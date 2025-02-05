import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { HelmetProvider } from 'react-helmet-async';
import CVDashboard from './pages/CVDashboard';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import ResumesView from './pages/ResumesView';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPostPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import AdminBlog from './pages/AdminBlog';
import UploadSection from './components/dashboard/UploadSection';
import ResumeList from './components/dashboard/ResumeList';
import EditResume from './pages/EditResume';
import CoverLetterPage from './pages/CoverLetterPage';
import CoverLetterFromCoverLetter from './pages/CoverLetterFromCoverLetter';
import Settings from './pages/Settings';
import CareerResources from './pages/CareerResources';
import ChatBot from './components/ChatBot';
import { initializeSupabase } from './lib/supabaseClient';
import ResumeFromUrl from './pages/ResumeFromUrl';
import ResumeCoverLetterFromUrl from './pages/ResumeCoverLetterFromUrl';
import ResumeToJobs from './pages/ResumeToJobs';
import HelpCenter from './pages/HelpCenter';
import TermsOfService from './pages/TermsOfService';
import FAQ from './pages/FAQ';
import InterviewPrep from './pages/InterviewPrep';
import InterviewPrepDetail from './pages/InterviewPrepDetail';
import JobSuggestions from './pages/JobSuggestions';
import CoverLettersView from './pages/CoverLettersView';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  useEffect(() => {
    initializeSupabase();
  }, []);

  return (
    <Router>
      <HelmetProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="pt-16 flex-grow"> {/* Add flex-grow to push footer to bottom */}
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* Public routes with layout */}
                  <Route element={<PublicLayout />}>
                    <Route path="/blog/*" element={<Blog />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/help" element={<HelpCenter />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/faq" element={<FAQ />} />
                  </Route>

                  {/* Private routes */}
                  <Route path="/dashboard" element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/dashboard/interview-prep" element={
                    <PrivateRoute>
                      <InterviewPrep />
                    </PrivateRoute>
                  } />
                  <Route path="/dashboard/interview-prep/:id" element={
                    <PrivateRoute>
                      <InterviewPrepDetail />
                    </PrivateRoute>
                  } />
                  <Route path="/dashboard/resume-from-url" element={
                    <PrivateRoute>
                      <ResumeFromUrl />
                    </PrivateRoute>
                  } />
                  <Route path="/dashboard/job-suggestions" element={
                    <PrivateRoute>
                      <JobSuggestions />
                    </PrivateRoute>
                  } />
                  <Route path="/dashboard/cover-letter" element={
                    <PrivateRoute>
                      <CoverLetterPage />
                    </PrivateRoute>
                  } />
                  <Route path="/dashboard/cover-letter-from-cover-letter" element={
                    <PrivateRoute>
                      <CoverLetterFromCoverLetter />
                    </PrivateRoute>
                  } />
                  <Route path="/dashboard/resume-cover-letter-from-url" element={
                    <PrivateRoute>
                      <ResumeCoverLetterFromUrl />
                    </PrivateRoute>
                  } />
                  <Route path="/dashboard/resume-to-jobs" element={
                    <PrivateRoute>
                      <ResumeToJobs />
                    </PrivateRoute>
                  } />
                  <Route path="/dashboard/cover-letter-from-url" element={
                    <PrivateRoute>
                      <CoverLetterFromCoverLetter />
                    </PrivateRoute>
                  } />
                  <Route path="/dashboard/upload" element={
                    <PrivateRoute>
                      <UploadSection />
                    </PrivateRoute>
                  } />
                  <Route path="/cvs" element={
                    <PrivateRoute>
                      <CVDashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/settings" element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  } />
                  <Route path="/resumes" element={
                    <PrivateRoute>
                      <ResumesView />
                    </PrivateRoute>
                  } />
                  <Route path="/cover-letters" element={
                    <PrivateRoute>
                      <CoverLettersView />
                    </PrivateRoute>
                  } />
                  <Route path="/resources" element={
                    <PrivateRoute>
                      <CareerResources />
                    </PrivateRoute>
                  } />
                </Routes>
              </div>
              {user && <ChatBot />}
              {!user && <Footer />}
            </div>
          </SubscriptionProvider>
        </AuthProvider>
      </HelmetProvider>
    </Router>
  );
}