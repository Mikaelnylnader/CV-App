import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowUpTrayIcon, 
  DocumentTextIcon, 
  SparklesIcon,
  DocumentDuplicateIcon,
  ChatBubbleBottomCenterTextIcon,
  AcademicCapIcon,
  XMarkIcon,
  BriefcaseIcon,
  ChartBarIcon,
  UserGroupIcon,
  LightBulbIcon,
  ClipboardDocumentCheckIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import Testimonials from './Testimonials';

export default function HowItWorks() {
  const { t } = useTranslation();
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      number: '1',
      title: 'Smart Resume Builder',
      description: 'AI-powered resume creation and optimization with ATS-friendly templates and real-time suggestions.',
      icon: ArrowUpTrayIcon,
      detailedSteps: [
        {
          title: 'Choose Your Template',
          description: 'Select from our collection of ATS-optimized, professionally designed templates tailored to your industry.'
        },
        {
          title: 'AI Content Optimization',
          description: 'Our AI analyzes your experience and suggests powerful action verbs, metrics, and achievements to highlight.'
        },
        {
          title: 'ATS Compatibility Check',
          description: 'Real-time scanning ensures your resume passes Applicant Tracking Systems with optimal keyword matching.'
        },
        {
          title: 'Format Perfection',
          description: 'Automatic formatting ensures consistent spacing, fonts, and layout that look great both digitally and in print.'
        }
      ]
    },
    {
      number: '2',
      title: 'Personalized Cover Letters',
      description: 'Generate tailored cover letters that match job requirements and showcase your unique value proposition.',
      icon: DocumentTextIcon,
      detailedSteps: [
        {
          title: 'Job Description Analysis',
          description: 'AI analyzes the job posting to identify key requirements, skills, and company culture elements.'
        },
        {
          title: 'Personalized Content',
          description: 'Generate a unique cover letter that aligns your experience with job requirements and company values.'
        },
        {
          title: 'Tone and Style Matching',
          description: 'Adjust the writing style to match company culture - formal, casual, or creative as needed.'
        },
        {
          title: 'Custom Templates',
          description: 'Choose from various formats and layouts that complement your resume and the company\'s brand.'
        }
      ]
    },
    {
      number: '3',
      title: 'LinkedIn Optimization',
      description: 'Transform your LinkedIn profile into a powerful networking and job-hunting tool with AI-driven optimization.',
      icon: SparklesIcon,
      detailedSteps: [
        {
          title: 'Profile Enhancement',
          description: 'Optimize every section of your profile with keywords and compelling content that attracts recruiters.'
        },
        {
          title: 'Network Growth Strategy',
          description: 'Get personalized strategies for connecting with industry professionals and companies.'
        },
        {
          title: 'Content Strategy',
          description: 'Receive suggestions for posts and articles that establish your professional brand.'
        },
        {
          title: 'SEO Optimization',
          description: 'Enhance your profile\'s visibility in LinkedIn and Google searches with strategic keyword placement.'
        }
      ]
    },
    {
      number: '4',
      title: 'Job Application Tracker',
      description: 'Stay organized with our comprehensive job application management system.',
      icon: ClipboardDocumentCheckIcon,
      detailedSteps: [
        {
          title: 'Application Dashboard',
          description: 'Track all your job applications, deadlines, and follow-ups in one organized dashboard.'
        },
        {
          title: 'Status Updates',
          description: 'Monitor application status, interview schedules, and follow-up tasks with automated reminders.'
        },
        {
          title: 'Document Management',
          description: 'Store and manage different versions of resumes and cover letters for each application.'
        },
        {
          title: 'Progress Analytics',
          description: 'View insights about your job search progress and application success rates.'
        }
      ]
    },
    {
      number: '5',
      title: 'Interview Preparation',
      description: 'Comprehensive interview preparation with AI-powered mock interviews and real-time feedback.',
      icon: ChatBubbleBottomCenterTextIcon,
      detailedSteps: [
        {
          title: 'AI Mock Interviews',
          description: 'Practice with our AI interviewer that adapts questions based on the job and your responses.'
        },
        {
          title: 'Answer Analysis',
          description: 'Get instant feedback on your answers, body language, and speaking pace through video analysis.'
        },
        {
          title: 'Company Research',
          description: 'Access comprehensive company insights and custom interview questions based on company culture.'
        },
        {
          title: 'Behavioral Question Prep',
          description: 'Master the STAR method with guided practice for common behavioral questions.'
        }
      ]
    },
    {
      number: '6',
      title: 'Salary Negotiation',
      description: 'Get data-driven insights and strategies for negotiating your compensation package.',
      icon: ChartBarIcon,
      detailedSteps: [
        {
          title: 'Market Research',
          description: 'Access up-to-date salary data for your role, experience level, and location.'
        },
        {
          title: 'Negotiation Scripts',
          description: 'Get customized negotiation scripts and responses for different scenarios.'
        },
        {
          title: 'Benefits Analysis',
          description: 'Evaluate full compensation packages including benefits, equity, and perks.'
        },
        {
          title: 'Counter Offer Strategy',
          description: 'Receive guidance on handling counter offers and multiple job offers.'
        }
      ]
    },
    {
      number: '7',
      title: 'Career Planning',
      description: 'Map out your career path with personalized guidance and skill development plans.',
      icon: RocketLaunchIcon,
      detailedSteps: [
        {
          title: 'Career Assessment',
          description: 'Discover your strengths, interests, and ideal career paths through comprehensive assessments.'
        },
        {
          title: 'Skill Gap Analysis',
          description: 'Identify key skills needed for your target role and get personalized learning recommendations.'
        },
        {
          title: 'Goal Setting',
          description: 'Create actionable short-term and long-term career goals with milestone tracking.'
        },
        {
          title: 'Industry Insights',
          description: 'Stay updated with industry trends and emerging opportunities in your field.'
        }
      ]
    },
    {
      number: '8',
      title: 'Networking Assistant',
      description: 'Build and maintain professional relationships with our smart networking tools.',
      icon: UserGroupIcon,
      detailedSteps: [
        {
          title: 'Connection Management',
          description: 'Organize and track your professional network with smart categorization and follow-up reminders.'
        },
        {
          title: 'Outreach Templates',
          description: 'Access customizable templates for cold outreach, follow-ups, and thank you messages.'
        },
        {
          title: 'Event Networking',
          description: 'Find and track relevant industry events, conferences, and networking opportunities.'
        },
        {
          title: 'Relationship Building',
          description: 'Get prompts for maintaining relationships and expanding your network strategically.'
        }
      ]
    },
    {
      number: '9',
      title: 'Personal Branding',
      description: 'Develop a strong professional brand across all platforms and channels.',
      icon: LightBulbIcon,
      detailedSteps: [
        {
          title: 'Brand Strategy',
          description: 'Create a consistent professional brand that highlights your unique value proposition.'
        },
        {
          title: 'Content Calendar',
          description: 'Plan and manage your professional content across LinkedIn, portfolio, and other platforms.'
        },
        {
          title: 'Portfolio Builder',
          description: 'Create a stunning digital portfolio showcasing your work and achievements.'
        },
        {
          title: 'Social Media Optimization',
          description: 'Optimize your professional social media presence for maximum impact.'
        }
      ]
    }
  ];

  return (
    <div id="how-it-works" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">How It Works</h2>
          <h3 className="text-4xl font-bold text-gray-900">Your Career Journey Made Simple</h3>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Follow these steps to transform your career - from resume creation to landing your dream job
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.number} 
              className="flex flex-col items-start p-6 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50 cursor-pointer border border-gray-100"
              onClick={() => setSelectedFeature(feature)}
            >
              <div className="bg-blue-100 rounded-2xl p-3 mb-4 transition-colors duration-300 group-hover:bg-blue-200">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-blue-600">
                <span className="text-blue-600">{feature.number}. </span>
                {feature.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedFeature && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedFeature(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 relative">
              <button 
                onClick={() => setSelectedFeature(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 rounded-2xl p-3 mr-4">
                  <selectedFeature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedFeature.title}
                </h3>
              </div>

              <div className="space-y-6">
                {selectedFeature.detailedSteps.map((step, index) => (
                  <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold">{index + 1}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                    </div>
                    <p className="text-gray-600 ml-11">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Testimonials />
    </div>
  );
}