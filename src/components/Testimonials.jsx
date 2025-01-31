import React from 'react';

export default function Testimonials() {
  return (
    <div id="success-stories" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Success Stories</h2>
          <h3 className="text-4xl font-bold text-gray-900">What Our Users Say</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white hover:to-blue-50">
            <div className="flex items-center mb-6">
              <img
                src="https://randomuser.me/api/portraits/women/1.jpg"
                alt="Sarah Johnson"
                className="w-16 h-16 rounded-full mr-4 transition-transform duration-300 hover:scale-110"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Sarah Johnson</h3>
                <p className="text-sm text-gray-600">Software Engineer</p>
              </div>
            </div>
            <div className="relative">
              <p className="text-gray-700 text-lg leading-relaxed">Thanks to AI Resume Pro, I landed my dream job! The AI optimization was spot-on and helped me highlight my most relevant experience.</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white hover:to-blue-50">
            <div className="flex items-center mb-6">
              <img
                src="https://randomuser.me/api/portraits/men/2.jpg"
                alt="Michael Chen"
                className="w-16 h-16 rounded-full mr-4 transition-transform duration-300 hover:scale-110"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Michael Chen</h3>
                <p className="text-sm text-gray-600">Product Manager</p>
              </div>
            </div>
            <div className="relative">
              <p className="text-gray-700 text-lg leading-relaxed">This tool is a game-changer! It helped me customize my resume for each application, and I got callbacks from top tech companies. Worth every penny!</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white hover:to-blue-50">
            <div className="flex items-center mb-6">
              <img
                src="https://randomuser.me/api/portraits/women/3.jpg"
                alt="Emily Rodriguez"
                className="w-16 h-16 rounded-full mr-4 transition-transform duration-300 hover:scale-110"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Emily Rodriguez</h3>
                <p className="text-sm text-gray-600">Marketing Director</p>
              </div>
            </div>
            <div className="relative">
              <p className="text-gray-700 text-lg leading-relaxed">The AI suggestions were incredibly accurate. I went from zero responses to multiple interviews in just two weeks. Now I'm doing what I love!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}