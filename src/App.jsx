import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import AdminBlog from './pages/AdminBlog';
import UploadSection from './components/dashboard/UploadSection';
import ResumeList from './components/dashboard/ResumeList';
import EditResume from './pages/EditResume';
import Sidebar from './components/dashboard/Sidebar';
import CoverLetterPage from './pages/CoverLetterPage';
import CoverLetterFromCoverLetter from './pages/CoverLetterFromCoverLetter';
import Settings from './pages/Settings';
import CareerResources from './pages/CareerResources';
import ChatBot from './components/ChatBot';
import { testConnection } from './lib/supabaseClient';
import ResumeFromUrl from './pages/ResumeFromUrl';
import ResumeCoverLetterFromUrl from './pages/ResumeCoverLetterFromUrl';
import ResumeToJobs from './pages/ResumeToJobs';

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
      <Footer />
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Router>
      <HelmetProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <Header />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cvs" element={
                <PrivateRoute>
                  <CVDashboard />
                </PrivateRoute>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/dashboard/upload" element={
                <PrivateRoute>
                  <div className="flex h-screen bg-gray-50">
                    <Sidebar currentPage="Upload Resume" />
                    <main className="flex-1 overflow-y-auto md:ml-16">
                      <div className="py-8 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-8">New Resume from URL</h1>
                        <UploadSection />
                        
                        <div className="mt-12">
                          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                          <div className="bg-white rounded-lg shadow-sm p-6">
                            <ResumeList />
                          </div>
                        </div>
                      </div>
                    </main>
                  </div>
                </PrivateRoute>
              } />
              <Route path="/dashboard/cover-letter" element={
                <PrivateRoute>
                  <CoverLetterPage />
                </PrivateRoute>
              } />
              <Route path="/dashboard/resume-from-url" element={
                <PrivateRoute>
                  <ResumeCoverLetterFromUrl />
                </PrivateRoute>
              } />
              <Route path="/dashboard/cover-letter-from-cover-letter" element={
                <PrivateRoute>
                  <CoverLetterFromCoverLetter />
                </PrivateRoute>
              } />
              <Route path="/dashboard/cover-letter-from-url" element={
                <PrivateRoute>
                  <ResumeToJobs />
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
              <Route path="/resumes/edit/:id" element={
                <PrivateRoute>
                  <EditResume />
                </PrivateRoute>
              } />
              <Route path="/resources" element={
                <PrivateRoute>
                  <CareerResources />
                </PrivateRoute>
              } />
              <Route path="/admin/blog" element={
                <PrivateRoute>
                  <AdminBlog />
                </PrivateRoute>
              } />
            </Routes>
            {user && <ChatBot />}
          </SubscriptionProvider>
        </AuthProvider>
      </HelmetProvider>
    </Router>
  );
}