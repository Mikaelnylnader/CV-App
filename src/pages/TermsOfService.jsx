import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function TermsOfService() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: [
        'By accessing or using AI Resume Pro, you agree to these terms',
        'We reserve the right to modify these terms at any time',
        'Continued use after changes constitutes acceptance',
        'Users must be at least 18 years old to use our services'
      ]
    },
    {
      title: 'User Accounts',
      content: [
        'You are responsible for maintaining account security',
        'Accurate and up-to-date information is required',
        'One person per account policy',
        'Account sharing is strictly prohibited'
      ]
    },
    {
      title: 'Service Usage',
      content: [
        'Services must be used for lawful purposes only',
        'Prohibited activities and content restrictions',
        'Fair usage policies and limitations',
        'Data storage and retention policies'
      ]
    },
    {
      title: 'Subscription and Payments',
      content: [
        'Subscription terms and billing cycles',
        'Payment processing and accepted methods',
        'Cancellation and refund policies',
        'Price changes and notifications'
      ]
    },
    {
      title: 'Intellectual Property',
      content: [
        'Ownership of platform content and features',
        'User-generated content rights',
        'License to use our services',
        'Trademark and copyright protection'
      ]
    },
    {
      title: 'Limitation of Liability',
      content: [
        'Service provided "as is" without warranties',
        'Limitation of damages and liability',
        'Indemnification obligations',
        'Force majeure conditions'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Terms of Service | AI Resume Pro</title>
        <meta name="description" content="Read our Terms of Service to understand your rights and responsibilities when using AI Resume Pro." />
      </Helmet>

      <div className="min-h-screen">
        <div className="pt-24 pb-16">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100">
                Please read these terms carefully before using our services.
              </p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-gray-600 text-center">
              Last Updated: January 28, 2024
            </p>
          </div>

          {/* Introduction */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="bg-white rounded-xl shadow-md p-8">
              <p className="text-gray-600 leading-relaxed">
                Welcome to AI Resume Pro. These Terms of Service ("Terms") govern your access to and use of 
                our website, services, and applications. By using our services, you agree to be bound by these 
                Terms. If you disagree with any part of these terms, you may not access our services.
              </p>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div 
                  key={section.title}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-blue-600 font-bold">{index + 1}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                    </div>
                    <ul className="space-y-4">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <svg 
                            className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" 
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
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-12 bg-gray-50 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Our Terms?</h2>
              <p className="text-gray-600 mb-6">
                If you have any questions about our Terms of Service, please contact our support team.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 