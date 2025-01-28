import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gray-900">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 mix-blend-multiply" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">
            <span className="block">{t('hero.title')}</span>
            <span className="block text-blue-400">{t('hero.subtitle')}</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl md:text-2xl text-blue-100 leading-relaxed">
            {t('hero.description')}
          </p>
          <div className="mt-12 flex justify-center space-x-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-primary group"
            >
              {t('hero.cta')}
              <ArrowRightIcon className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 transform">
        <div className="w-64 h-64 bg-gradient-to-br from-blue-500/30 to-transparent rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 transform">
        <div className="w-64 h-64 bg-gradient-to-tr from-indigo-500/30 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
}