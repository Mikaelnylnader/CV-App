import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

export default function HelpCenter() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const sections = [
    {
      title: 'Getting Started',
      content: [
        {
          title: 'How to create your first resume',
          description: 'Learn how to create your first professional resume with AI Resume Pro.',
          details: [
            {
              subtitle: 'Step 1: Sign Up and Log In',
              text: 'Create an account or log in to AI Resume Pro. You can sign up using your email or continue with Google.'
            },
            {
              subtitle: 'Step 2: Access the Dashboard',
              text: 'Once logged in, you will be taken to your dashboard. Click on the "Create New Resume" button in the top right corner.'
            },
            {
              subtitle: 'Step 3: Choose a Template',
              text: 'Browse our collection of professional templates. Select one that best matches your industry and experience level.'
            },
            {
              subtitle: 'Step 4: Enter Your Information',
              text: 'Fill in your personal details, work experience, education, and skills. Our AI will guide you with real-time suggestions.'
            },
            {
              subtitle: 'Step 5: AI Optimization',
              text: 'Let our AI analyze your content and provide recommendations for improvements. Accept or modify the suggestions as needed.'
            },
            {
              subtitle: 'Step 6: Preview and Download',
              text: 'Review your resume in real-time, make any final adjustments, and download it in your preferred format (PDF, Word, etc.).'
            }
          ]
        },
        {
          title: 'Understanding AI optimization',
          description: 'Discover how our AI helps create the perfect resume.',
          details: [
            {
              subtitle: 'Content Analysis',
              text: 'Our AI analyzes your input to identify key achievements, skills, and experiences that are most relevant to your target role.'
            },
            {
              subtitle: 'Language Enhancement',
              text: 'The AI suggests powerful action verbs and industry-specific terminology to make your resume stand out.'
            },
            {
              subtitle: 'ATS Optimization',
              text: 'We ensure your resume is optimized for Applicant Tracking Systems (ATS) by including relevant keywords and proper formatting.'
            },
            {
              subtitle: 'Industry-Specific Recommendations',
              text: 'Get tailored suggestions based on your industry, experience level, and target position.'
            }
          ]
        },
        {
          title: 'Managing your account settings',
          description: 'Learn how to customize your account and manage your preferences.',
          details: [
            {
              subtitle: 'Profile Settings',
              text: 'Update your personal information, profile picture, and contact details in the Settings menu.'
            },
            {
              subtitle: 'Security Settings',
              text: 'Manage your password, enable two-factor authentication, and review login history.'
            },
            {
              subtitle: 'Notification Preferences',
              text: 'Choose which notifications you want to receive about updates, tips, and account activity.'
            },
            {
              subtitle: 'Data Management',
              text: 'Control how your data is stored, shared, and used within our platform.'
            }
          ]
        },
        {
          title: 'Subscription plans and features',
          description: 'Compare our subscription plans and choose the right one for you.',
          details: [
            {
              subtitle: 'Free Plan',
              text: 'Create one basic resume, access standard templates, and use basic AI suggestions.'
            },
            {
              subtitle: 'Pro Plan ($9.99/month)',
              text: 'Unlimited resumes, advanced AI optimization, premium templates, and cover letter creation.'
            },
            {
              subtitle: 'Premium Plan ($19.99/month)',
              text: 'Everything in Pro, plus priority support, LinkedIn optimization, and job application tracking.'
            },
            {
              subtitle: 'Enterprise Plan',
              text: 'Custom solutions for teams and organizations with dedicated support and advanced features.'
            }
          ]
        }
      ]
    },
    {
      title: 'Resume Building',
      content: [
        {
          title: 'Best practices for resume creation',
          description: 'Learn the best practices for creating an effective resume.',
          details: [
            {
              subtitle: 'Resume Structure',
              text: 'Learn how to structure your resume sections effectively.'
            },
            {
              subtitle: 'Content Guidelines',
              text: 'Understand what content to include and what to leave out.'
            }
          ]
        },
        {
          title: 'How to use AI suggestions effectively',
          description: 'Make the most of our AI-powered suggestions.',
          details: [
            {
              subtitle: 'Understanding Suggestions',
              text: 'Learn how to interpret and apply AI suggestions effectively.'
            },
            {
              subtitle: 'Customizing AI Output',
              text: 'Tailor AI suggestions to match your personal style.'
            }
          ]
        },
        {
          title: 'Customizing resume templates',
          description: 'Personalize your resume template.',
          details: [
            {
              subtitle: 'Template Customization',
              text: 'Learn how to modify templates to match your preferences.'
            },
            {
              subtitle: 'Design Tips',
              text: 'Best practices for resume design and formatting.'
            }
          ]
        },
        {
          title: 'Exporting and sharing your resume',
          description: 'Learn about different export options.',
          details: [
            {
              subtitle: 'Export Formats',
              text: 'Understanding different file formats and when to use them.'
            },
            {
              subtitle: 'Sharing Options',
              text: 'How to share your resume securely with employers.'
            }
          ]
        }
      ]
    },
    {
      title: 'Cover Letters',
      content: [
        {
          title: 'Creating compelling cover letters',
          description: 'Learn how to write effective cover letters that get noticed.',
          details: [
            {
              subtitle: 'Cover Letter Structure',
              text: 'Learn the proper format: introduction, body paragraphs, and closing. Each section should be concise and impactful.'
            },
            {
              subtitle: 'Opening Paragraph',
              text: 'Start strong with a compelling introduction that grabs attention and states your purpose.'
            },
            {
              subtitle: 'Body Content',
              text: 'Highlight relevant experiences and skills that match the job requirements. Use specific examples to demonstrate your value.'
            },
            {
              subtitle: 'Closing Strong',
              text: 'End with a clear call to action and professional closing that encourages the next step in the hiring process.'
            }
          ]
        },
        {
          title: 'Using AI to tailor your cover letter',
          description: 'Maximize the impact of your cover letter with AI assistance.',
          details: [
            {
              subtitle: 'AI Analysis',
              text: 'Our AI analyzes the job description to identify key requirements and matches them with your experience.'
            },
            {
              subtitle: 'Personalization',
              text: 'Get suggestions for personalizing your letter to each company and role you apply to.'
            },
            {
              subtitle: 'Language Optimization',
              text: 'Enhance your writing with industry-specific language and powerful phrases that resonate with hiring managers.'
            },
            {
              subtitle: 'Tone Adjustment',
              text: 'Adjust the tone of your letter to match the company culture and industry standards.'
            }
          ]
        },
        {
          title: 'Cover letter templates and formats',
          description: 'Choose from our collection of professional cover letter templates.',
          details: [
            {
              subtitle: 'Template Selection',
              text: 'Browse through various templates designed for different industries and career levels.'
            },
            {
              subtitle: 'Format Customization',
              text: 'Modify templates to match your personal style while maintaining professional standards.'
            },
            {
              subtitle: 'ATS Compatibility',
              text: 'All templates are optimized for Applicant Tracking Systems to ensure your letter gets through.'
            },
            {
              subtitle: 'Visual Consistency',
              text: 'Match your cover letter design with your resume for a cohesive application package.'
            }
          ]
        },
        {
          title: 'Tips for different industries',
          description: 'Industry-specific guidance for your cover letters.',
          details: [
            {
              subtitle: 'Tech Industry',
              text: 'Focus on technical skills, projects, and innovative problem-solving abilities.'
            },
            {
              subtitle: 'Creative Fields',
              text: 'Showcase your portfolio and creative process while maintaining professionalism.'
            },
            {
              subtitle: 'Business/Corporate',
              text: 'Emphasize leadership, results, and quantifiable achievements in your previous roles.'
            },
            {
              subtitle: 'Healthcare/Medical',
              text: 'Highlight certifications, patient care experience, and commitment to healthcare excellence.'
            }
          ]
        }
      ]
    },
    {
      title: 'Account Management',
      content: [
        {
          title: 'Updating your profile information',
          description: 'Keep your account information current and accurate.',
          details: [
            {
              subtitle: 'Personal Information',
              text: 'Update your name, contact details, and professional information in your profile settings.'
            },
            {
              subtitle: 'Profile Picture',
              text: 'Add or update your profile picture to personalize your account.'
            },
            {
              subtitle: 'Email Preferences',
              text: 'Manage your email settings and communication preferences.'
            },
            {
              subtitle: 'Account Recovery',
              text: 'Set up recovery options to ensure secure access to your account.'
            }
          ]
        },
        {
          title: 'Managing your subscription',
          description: 'Control your subscription settings and billing preferences.',
          details: [
            {
              subtitle: 'Subscription Status',
              text: 'View your current plan, billing cycle, and subscription features.'
            },
            {
              subtitle: 'Plan Changes',
              text: 'Upgrade, downgrade, or modify your subscription plan as needed.'
            },
            {
              subtitle: 'Payment Methods',
              text: 'Add, remove, or update your payment methods securely.'
            },
            {
              subtitle: 'Billing History',
              text: 'Access your past invoices and payment history.'
            }
          ]
        },
        {
          title: 'Security settings and privacy',
          description: 'Protect your account and manage your privacy settings.',
          details: [
            {
              subtitle: 'Password Management',
              text: 'Change your password and set up two-factor authentication for enhanced security.'
            },
            {
              subtitle: 'Login History',
              text: 'Monitor recent account activity and active sessions.'
            },
            {
              subtitle: 'Privacy Controls',
              text: 'Manage who can see your information and how it is used.'
            },
            {
              subtitle: 'Data Protection',
              text: 'Understand how we protect your personal and professional information.'
            }
          ]
        },
        {
          title: 'Connecting job platforms',
          description: 'Link your account with various job search platforms.',
          details: [
            {
              subtitle: 'Platform Integration',
              text: 'Connect with LinkedIn, Indeed, and other major job platforms.'
            },
            {
              subtitle: 'Sync Settings',
              text: 'Control how your information syncs between platforms.'
            },
            {
              subtitle: 'Application Tracking',
              text: 'Monitor your job applications across different platforms.'
            },
            {
              subtitle: 'Privacy Settings',
              text: 'Manage your visibility and sharing preferences across platforms.'
            }
          ]
        }
      ]
    },
    {
      title: 'Technical Support',
      content: [
        {
          title: 'Troubleshooting common issues',
          description: 'Solutions for frequently encountered technical problems.',
          details: [
            {
              subtitle: 'Login Issues',
              text: 'Steps to resolve common login and access problems.'
            },
            {
              subtitle: 'Document Upload',
              text: 'Troubleshoot problems with uploading resumes and cover letters.'
            },
            {
              subtitle: 'Format Conversion',
              text: 'Fix issues with document conversion and formatting.'
            },
            {
              subtitle: 'Performance',
              text: 'Optimize your experience if the platform is running slowly.'
            }
          ]
        },
        {
          title: 'Browser compatibility',
          description: 'Ensure the best experience with your browser.',
          details: [
            {
              subtitle: 'Supported Browsers',
              text: 'List of recommended browsers and versions for optimal performance.'
            },
            {
              subtitle: 'Browser Settings',
              text: 'Recommended browser settings for the best experience.'
            },
            {
              subtitle: 'Cache Management',
              text: 'How to clear cache and cookies if you encounter issues.'
            },
            {
              subtitle: 'Mobile Support',
              text: 'Information about mobile browser compatibility and features.'
            }
          ]
        },
        {
          title: 'File upload guidelines',
          description: 'Learn about supported file types and upload limits.',
          details: [
            {
              subtitle: 'Supported Formats',
              text: 'List of accepted file formats for resumes and cover letters.'
            },
            {
              subtitle: 'Size Limits',
              text: 'Maximum file sizes and how to reduce file size if needed.'
            },
            {
              subtitle: 'Image Guidelines',
              text: 'Requirements for uploading profile pictures and other images.'
            },
            {
              subtitle: 'Upload Tips',
              text: 'Best practices for successful file uploads.'
            }
          ]
        },
        {
          title: 'Contact technical support',
          description: 'Get help from our technical support team.',
          details: [
            {
              subtitle: 'Support Channels',
              text: 'Different ways to reach our technical support team.'
            },
            {
              subtitle: 'Response Times',
              text: 'Expected response times for different types of issues.'
            },
            {
              subtitle: 'Information Needed',
              text: 'What to include when reporting technical issues.'
            },
            {
              subtitle: 'Emergency Support',
              text: 'How to get urgent help for critical issues.'
            }
          ]
        }
      ]
    },
    {
      title: 'Billing & Subscriptions',
      content: [
        {
          title: 'Understanding billing cycles',
          description: 'Learn about our billing process and payment schedules.',
          details: [
            {
              subtitle: 'Billing Periods',
              text: 'How billing cycles work and when payments are processed.'
            },
            {
              subtitle: 'Pro-rated Charges',
              text: 'Understanding pro-rated fees when changing plans.'
            },
            {
              subtitle: 'Renewal Process',
              text: 'How automatic renewals work and when they occur.'
            },
            {
              subtitle: 'Payment Notifications',
              text: 'When and how you will be notified about upcoming charges.'
            }
          ]
        },
        {
          title: 'Payment methods accepted',
          description: 'View available payment options and manage your payment methods.',
          details: [
            {
              subtitle: 'Credit Cards',
              text: 'Accepted credit card types and processing information.'
            },
            {
              subtitle: 'Digital Payments',
              text: 'PayPal and other digital payment options available.'
            },
            {
              subtitle: 'International Payments',
              text: 'Payment options for international users and currency conversion.'
            },
            {
              subtitle: 'Security Measures',
              text: 'How we protect your payment information.'
            }
          ]
        },
        {
          title: 'Cancellation and refunds',
          description: 'Understand our cancellation policy and refund process.',
          details: [
            {
              subtitle: 'Cancellation Process',
              text: 'How to cancel your subscription and what happens after.'
            },
            {
              subtitle: 'Refund Policy',
              text: 'Our refund policy and when refunds are applicable.'
            },
            {
              subtitle: 'Account Access',
              text: 'What happens to your data and access after cancellation.'
            },
            {
              subtitle: 'Reactivation',
              text: 'How to reactivate your account after cancellation.'
            }
          ]
        },
        {
          title: 'Upgrading or downgrading plans',
          description: 'Learn how to change your subscription plan.',
          details: [
            {
              subtitle: 'Upgrade Process',
              text: 'Steps to upgrade your plan and immediate benefits.'
            },
            {
              subtitle: 'Downgrade Process',
              text: 'How to downgrade and what features you will retain.'
            },
            {
              subtitle: 'Plan Comparison',
              text: 'Compare different plans to choose the right one.'
            },
            {
              subtitle: 'Feature Changes',
              text: 'Understanding feature availability when changing plans.'
            }
          ]
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Help Center | AI Resume Pro</title>
        <meta name="description" content="Get help and support for using AI Resume Pro's features and services." />
      </Helmet>

      <div className="min-h-screen">
        <div className="flex-grow">
          <div className="pt-24 pb-16">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Center</h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100">
                  Find answers, get support, and learn how to make the most of AI Resume Pro.
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search for help articles..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Help Sections */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
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
                      <div className="space-y-6">
                        {section.content.map((item, i) => (
                          <div key={i} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                            <button
                              onClick={() => setSelectedTopic(selectedTopic === `${index}-${i}` ? null : `${index}-${i}`)}
                              className="w-full text-left flex items-start cursor-pointer group"
                            >
                              <svg 
                                className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5 transform transition-transform group-hover:translate-x-1" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                              </svg>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                                  {item.title}
                                </h3>
                                <p className="text-gray-600 mt-1">{item.description}</p>
                              </div>
                            </button>
                            
                            {selectedTopic === `${index}-${i}` && item.details && (
                              <div className="mt-4 ml-9 pl-3 border-l-2 border-blue-200">
                                {item.details.map((detail, j) => (
                                  <div key={j} className="mb-4 last:mb-0">
                                    <h4 className="text-md font-semibold text-gray-800 mb-2">
                                      {detail.subtitle}
                                    </h4>
                                    <p className="text-gray-600">
                                      {detail.text}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Support Section */}
              <div className="mt-12 bg-gray-50 rounded-xl p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
                <p className="text-gray-600 mb-6">
                  Cannot find what you are looking for? Our support team is here to help.
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
      </div>
    </>
  );
} 