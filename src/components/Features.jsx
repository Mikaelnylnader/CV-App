import React from 'react';
import { useTranslation } from 'react-i18next';
import { BoltIcon, ClockIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Features() {
  const { t } = useTranslation();

  const features = [
    {
      title: t('features.instantCustomization.title'),
      description: t('features.instantCustomization.description'),
      icon: BoltIcon,
    },
    {
      title: t('features.timeSaving.title'),
      description: t('features.timeSaving.description'),
      icon: ClockIcon,
    },
    {
      title: t('features.atsOptimization.title'),
      description: t('features.atsOptimization.description'),
      icon: DocumentTextIcon,
    },
    {
      title: t('features.smartHighlights.title'),
      description: t('features.smartHighlights.description'),
      icon: SparklesIcon,
    }
  ];

  return (
    <div id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">{t('features.title')}</h2>
          <h3 className="text-4xl font-bold text-gray-900 mb-4">{t('features.subtitle')}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="flex flex-col items-start p-6 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50"
            >
              <div className="bg-blue-100 rounded-2xl p-3 mb-4 transition-colors duration-300 group-hover:bg-blue-200">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-blue-600">{feature.title}</h4>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}