import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function About() {
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-founder',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      bio: 'Former tech recruiter with 10+ years of experience in talent acquisition.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-founder',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      bio: 'AI researcher and engineer with expertise in natural language processing.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      bio: 'Product leader focused on creating intuitive user experiences.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us | AI Resume Pro</title>
        <meta name="description" content="Learn about the team behind AI Resume Pro and our mission to revolutionize the job application process." />
      </Helmet>

      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100">
              We're revolutionizing the job application process by combining AI technology 
              with human expertise to help job seekers land their dream roles.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Founded in 2024, AI Resume Pro emerged from a simple observation: 
              the job application process was broken. Job seekers were spending 
              countless hours tailoring resumes, often without success. We knew 
              there had to be a better way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Problem We're Solving</h3>
              <p className="text-gray-600 mb-6">
                In today's competitive job market, standing out is harder than ever. 
                Applicant Tracking Systems (ATS) reject up to 75% of resumes before 
                they reach human eyes, while recruiters spend an average of just 7.4 
                seconds reviewing each resume.
              </p>
              <p className="text-gray-600">
                We're changing that by using AI to optimize resumes for both ATS 
                systems and human readers, helping qualified candidates get the 
                attention they deserve.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform skew-y-6 rounded-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
                alt="Team collaboration"
                className="relative rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-600">
                We're a diverse team of recruiters, engineers, and product designers 
                passionate about helping people succeed in their careers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member) => (
                <div 
                  key={member.name}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-8">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-blue-100"
                    />
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 text-center mb-4">{member.role}</p>
                    <p className="text-gray-600 text-center">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">
                We're constantly pushing the boundaries of what's possible with AI 
                to create better solutions for job seekers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Empowerment</h3>
              <p className="text-gray-600">
                We believe everyone deserves a fair chance to showcase their 
                skills and experience to potential employers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trust</h3>
              <p className="text-gray-600">
                We maintain the highest standards of privacy and security while 
                delivering honest, reliable results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}