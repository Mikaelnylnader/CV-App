import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

export default function FAQ() {
  const [openSection, setOpenSection] = useState(null);

  const sections = [
    {
      title: 'Getting Started',
      questions: [
        {
          q: 'How do I create my first resume?',
          a: 'To create your first resume, sign up for an account and click on "Create New Resume" from your dashboard. Follow our step-by-step guide to input your information, and our AI will help optimize your content.'
        },
        {
          q: 'Is AI Resume Pro free to use?',
          a: 'We offer both free and premium plans. The free plan includes basic resume creation, while premium plans unlock advanced AI features, unlimited resumes, and cover letter generation.'
        },
        {
          q: 'How long does it take to create a resume?',
          a: 'With our AI-powered platform, you can create a professional resume in as little as 15 minutes. The exact time depends on how much content you need to input and customize.'
        }
      ]
    },
    {
      title: 'Account & Billing',
      questions: [
        {
          q: 'How do I upgrade my subscription?',
          a: 'Go to Settings > Subscription in your dashboard and click "Upgrade Plan". You can choose from our various premium plans and complete the payment process securely.'
        },
        {
          q: 'Can I cancel my subscription anytime?',
          a: 'Yes, you can cancel your subscription at any time from your account settings. Your premium features will remain active until the end of your current billing period.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and other popular payment methods depending on your region.'
        }
      ]
    },
    {
      title: 'Resume Features',
      questions: [
        {
          q: 'How does the AI optimization work?',
          a: 'Our AI analyzes your resume content and provides suggestions to improve your wording, highlight key achievements, and match industry standards. It learns from millions of successful resumes to provide tailored recommendations.'
        },
        {
          q: 'Can I export my resume to different formats?',
          a: 'Yes, you can export your resume to PDF, Word, and plain text formats. Premium users also get access to additional export options and custom formatting.'
        },
        {
          q: 'How many resume templates are available?',
          a: 'We offer over 30 professional templates in our free plan and 100+ premium templates for subscribers, all optimized for ATS systems and modern hiring practices.'
        }
      ]
    },
    {
      title: 'Cover Letters',
      questions: [
        {
          q: 'Does AI Resume Pro help with cover letters?',
          a: 'Yes, our platform includes AI-powered cover letter generation and customization tools. Premium users can create unlimited cover letters tailored to specific job applications.'
        },
        {
          q: 'How do I customize my cover letter?',
          a: 'You can customize your cover letter by editing the AI-generated content, choosing different templates, and adjusting the tone and style to match your preferences.'
        },
        {
          q: 'Can I use the same cover letter for different jobs?',
          a: 'While you can use the same base cover letter, we recommend customizing it for each application. Our AI helps you quickly adapt your cover letter to different job requirements.'
        }
      ]
    },
    {
      title: 'Technical Support',
      questions: [
        {
          q: 'What browsers are supported?',
          a: 'AI Resume Pro works best on modern browsers like Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.'
        },
        {
          q: 'How do I report a technical issue?',
          a: 'You can report technical issues through our Help Center or by contacting support@airesumepro.com. Please include details about the problem and any error messages you encounter.'
        },
        {
          q: 'Is my data secure?',
          a: 'Yes, we use industry-standard encryption and security measures to protect your data. Your information is stored securely and never shared without your permission.'
        }
      ]
    }
  ];

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>FAQ | AI Resume Pro</title>
        <meta name="description" content="Find answers to frequently asked questions about AI Resume Pro's features, pricing, and services." />
      </Helmet>

      <div className="min-h-screen">
        <div className="pt-24 pb-16">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100">
                Find quick answers to common questions about AI Resume Pro.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Sections */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <div className="space-y-8">
              {sections.map((section, sectionIndex) => (
                <div 
                  key={section.title}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <button
                    className="w-full p-8 text-left focus:outline-none"
                    onClick={() => toggleSection(sectionIndex)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                          <span className="text-blue-600 font-bold">{sectionIndex + 1}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                      </div>
                      <svg
                        className={`w-6 h-6 text-blue-600 transform transition-transform ${
                          openSection === sectionIndex ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                  
                  <div className={`px-8 pb-8 ${openSection === sectionIndex ? 'block' : 'hidden'}`}>
                    <div className="space-y-6">
                      {section.questions.map((item, i) => (
                        <div key={i} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.q}</h3>
                          <p className="text-gray-600">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Support Section */}
            <div className="mt-12 bg-gray-50 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 