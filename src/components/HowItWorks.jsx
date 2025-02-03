import React from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentArrowUpIcon, 
  LinkIcon, 
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  DocumentCheckIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import Testimonials from './Testimonials';

export default function HowItWorks() {
  const steps = [
    {
      icon: DocumentArrowUpIcon,
      title: "Upload Your Resume",
      description: "Start by uploading your existing resume in any common format."
    },
    {
      icon: LinkIcon,
      title: "Add Job URL",
      description: "Paste the link to your target job posting - we'll analyze the requirements automatically."
    },
    {
      icon: DocumentTextIcon,
      title: "Get Tailored Resume",
      description: "Our AI instantly optimizes your resume to match the job requirements while maintaining your authentic experience."
    },
    {
      icon: ChatBubbleBottomCenterTextIcon,
      title: "Interview Preparation",
      description: "Access AI-powered interview prep with custom questions based on the job and your experience."
    },
    {
      icon: DocumentCheckIcon,
      title: "Cover Letter Generation",
      description: "Generate compelling cover letters that complement your tailored resume."
    },
    {
      icon: ChartBarIcon,
      title: "Track Applications",
      description: "Monitor your application status and get insights to improve your success rate."
    }
  ];

  return (
    <>
      <div id="how-it-works" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">How It Works</h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Your Career Journey Made Simple</h3>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these steps to transform your career - from resume creation to landing your dream job
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-start p-6 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50 cursor-pointer border border-gray-100"
              >
                <div className="bg-blue-100 rounded-2xl p-3 mb-4 transition-colors duration-300 group-hover:bg-blue-200">
                  <step.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-blue-600">
                  <span className="text-blue-600">{index + 1}. </span>
                  {step.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Testimonials />
    </>
  );
}