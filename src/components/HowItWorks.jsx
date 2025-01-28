import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpTrayIcon, MagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Testimonials from './Testimonials';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      number: '1',
      title: t('howItWorks.steps.upload.title'),
      description: t('howItWorks.steps.upload.description'),
      icon: ArrowUpTrayIcon,
    },
    {
      number: '2',
      title: t('howItWorks.steps.jobLink.title'),
      description: t('howItWorks.steps.jobLink.description'),
      icon: MagnifyingGlassIcon,
    },
    {
      number: '3',
      title: t('howItWorks.steps.getResume.title'),
      description: t('howItWorks.steps.getResume.description'),
      icon: DocumentTextIcon,
    },
  ];

  return (
    <div id="how-it-works" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">{t('howItWorks.title')}</h2>
          <h3 className="text-4xl font-bold text-gray-900">{t('howItWorks.subtitle')}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className="flex flex-col items-start p-6 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50"
            >
              <div className="bg-blue-100 rounded-2xl p-3 mb-4 transition-colors duration-300 group-hover:bg-blue-200">
                <step.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-blue-600">
                <span className="text-blue-600">{step.number}. </span>
                {step.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Testimonials />
    </div>
  );
}