import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Blog() {
  const navigate = useNavigate();
  
  const blogPosts = [
    {
      id: 1,
      title: "How AI is Revolutionizing Resume Writing",
      excerpt: "Discover how artificial intelligence is changing the way we create and optimize resumes for job applications.",
      date: "2024-01-08",
      author: "Sarah Johnson",
      imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Top 10 Resume Mistakes to Avoid in 2024",
      excerpt: "Learn about the most common resume mistakes that could be holding you back from landing your dream job.",
      date: "2024-01-07",
      author: "Michael Chen",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "The Future of Job Applications",
      excerpt: "Explore how technology is shaping the future of job applications and what it means for job seekers.",
      date: "2024-01-06",
      author: "Emily Rodriguez",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Mastering ATS-Friendly Resumes",
      excerpt: "A comprehensive guide to creating resumes that successfully pass Applicant Tracking Systems.",
      date: "2024-01-05",
      author: "David Wilson",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "The Power of Keywords in Your Resume",
      excerpt: "Understanding how to effectively use keywords to make your resume stand out to employers and AI systems.",
      date: "2024-01-04",
      author: "Lisa Thompson",
      imageUrl: "https://images.unsplash.com/photo-1518976024611-28bf4b48222e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "Remote Work Resume Tips",
      excerpt: "Essential tips for tailoring your resume for remote positions in the post-pandemic job market.",
      date: "2024-01-03",
      author: "James Martinez",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest Blog Posts</h1>
          <p className="text-lg text-gray-600">Stay updated with the latest trends in resume optimization and job hunting</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article 
              key={post.id}
              onClick={() => navigate(`/blog/${post.id}`)}
              className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 cursor-pointer"
            >
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2 group-hover:text-blue-600 transition-colors">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} · {post.author}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">
                  {post.excerpt}
                </p>
                <div className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-all group-hover:translate-x-2">
                  Read more 
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}