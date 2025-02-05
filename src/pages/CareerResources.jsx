import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  AcademicCapIcon, 
  DocumentTextIcon, 
  PresentationChartLineIcon,
  UserGroupIcon,
  LightBulbIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

export default function CareerResources() {
  const resources = [
    {
      title: "Resume Writing Tips",
      icon: DocumentTextIcon,
      items: [
        "Use action verbs to describe achievements",
        "Quantify results when possible",
        "Tailor your resume for each job application",
        "Keep formatting consistent and clean",
        "Include relevant keywords from the job description"
      ]
    },
    {
      title: "Interview Preparation",
      icon: UserGroupIcon,
      items: [
        "Research the company thoroughly",
        "Practice common interview questions",
        "Prepare relevant examples of your work",
        "Follow the STAR method for behavioral questions",
        "Have questions ready for the interviewer"
      ]
    },
    {
      title: "Professional Development",
      icon: AcademicCapIcon,
      items: [
        "Stay updated with industry trends",
        "Take online courses in your field",
        "Attend industry conferences and webinars",
        "Build a professional network",
        "Get relevant certifications"
      ]
    },
    {
      title: "Job Search Strategies",
      icon: BriefcaseIcon,
      items: [
        "Optimize your LinkedIn profile",
        "Set up job alerts on major platforms",
        "Network with industry professionals",
        "Follow companies you're interested in",
        "Track your applications systematically"
      ]
    },
    {
      title: "Personal Branding",
      icon: LightBulbIcon,
      items: [
        "Develop a consistent online presence",
        "Create a professional portfolio",
        "Share industry insights on social media",
        "Write blog posts about your expertise",
        "Engage with professional communities"
      ]
    },
    {
      title: "Career Growth",
      icon: PresentationChartLineIcon,
      items: [
        "Set clear career goals",
        "Find a mentor in your field",
        "Take on challenging projects",
        "Document your achievements",
        "Regular skill assessment and improvement"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Helmet>
          <title>Career Resources | AI Resume Pro</title>
          <meta name="description" content="Access valuable career resources and tips to advance your professional journey." />
        </Helmet>

        <div className="py-4 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl mb-12"> {/* Increased margin-bottom */}
            <h1 className="text-3xl font-bold mb-4">Career Resources</h1>
            <p className="text-xl text-blue-100">
              Comprehensive guides and tips to help you advance your career
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource) => (
              <div 
                key={resource.title}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 group"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
                      <resource.icon className="h-6 w-6 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                    </div>
                    <h2 className="ml-3 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {resource.title}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {resource.items.map((item, index) => (
                      <li key={index} className="flex items-start group-hover:translate-x-1 transition-transform duration-300">
                        <svg 
                          className="h-5 w-5 text-blue-500 mt-0.5 mr-2 group-hover:text-blue-600 transition-colors duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                          />
                        </svg>
                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Resources Section */}
          <div className="mt-12 bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="hover:bg-blue-50 p-6 rounded-xl transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Reading</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="hover:text-blue-600 transition-colors duration-300">• "What Color Is Your Parachute?" by Richard N. Bolles</li>
                  <li className="hover:text-blue-600 transition-colors duration-300">• "Atomic Habits" by James Clear</li>
                  <li className="hover:text-blue-600 transition-colors duration-300">• "Deep Work" by Cal Newport</li>
                  <li className="hover:text-blue-600 transition-colors duration-300">• "The 7 Habits of Highly Effective People" by Stephen Covey</li>
                </ul>
              </div>
              <div className="hover:bg-blue-50 p-6 rounded-xl transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Online Learning Platforms</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="hover:text-blue-600 transition-colors duration-300">• Coursera - Professional certificates and courses</li>
                  <li className="hover:text-blue-600 transition-colors duration-300">• LinkedIn Learning - Business and technical skills</li>
                  <li className="hover:text-blue-600 transition-colors duration-300">• Udemy - Practical skill development</li>
                  <li className="hover:text-blue-600 transition-colors duration-300">• edX - University-level courses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}