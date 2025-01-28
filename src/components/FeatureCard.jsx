import React from 'react';

export default function FeatureCard({ icon: Icon, title, description, delay }) {
  return (
    <div
      className="group relative bg-white p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <div className="bg-blue-100 rounded-2xl p-3 w-fit mb-6 group-hover:bg-blue-200 transition-colors duration-300">
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}