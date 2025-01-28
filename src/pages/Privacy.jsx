import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Privacy() {
  const sections = [
    {
      title: 'Information We Collect',
      content: [
        'Personal information (name, email address, phone number)',
        'Resume content and job application data',
        'Usage data and analytics',
        'Device and browser information'
      ]
    },
    {
      title: 'How We Use Your Information',
      content: [
        'To provide and improve our AI resume optimization services',
        'To communicate with you about our services',
        'To analyze and enhance our platform performance',
        'To comply with legal obligations'
      ]
    },
    {
      title: 'Data Storage and Security',
      content: [
        'We use industry-standard security measures to protect your data',
        'Your data is stored securely on our servers',
        'We regularly backup and encrypt sensitive information',
        'We maintain strict access controls to protect your privacy'
      ]
    },
    {
      title: 'Your Rights',
      content: [
        'Access your personal data',
        'Request corrections to your information',
        'Delete your account and associated data',
        'Opt-out of marketing communications'
      ]
    },
    {
      title: 'Third-Party Services',
      content: [
        'We may use third-party services for analytics',
        'Payment processing is handled by secure providers',
        'We do not sell your data to third parties',
        'Integration with job posting platforms'
      ]
    },
    {
      title: 'Cookie Policy',
      content: [
        'We use essential cookies for site functionality',
        'Analytics cookies help us improve our services',
        'You can control cookie preferences in your browser',
        'Third-party cookies may be used for enhanced features'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy | AI Resume Pro</title>
        <meta name="description" content="Learn about how AI Resume Pro protects your privacy and handles your personal information." />
      </Helmet>

      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100">
              We take your privacy seriously. Learn about how we protect and handle your personal information.
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-600 text-center">
            Last Updated: January 11, 2024
          </p>
        </div>

        {/* Introduction */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-8">
            <p className="text-gray-600 leading-relaxed">
              At AI Resume Pro, we are committed to protecting your privacy and ensuring 
              the security of your personal information. This Privacy Policy explains how 
              we collect, use, and safeguard your data when you use our services. By 
              using AI Resume Pro, you agree to the practices described in this policy.
            </p>
          </div>
        </div>

        {/* Policy Sections */}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Our Privacy Policy?</h2>
            <p className="text-gray-600 mb-6">
              If you have any questions or concerns about our privacy practices, please don't hesitate to contact us.
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
    </>
  );
}