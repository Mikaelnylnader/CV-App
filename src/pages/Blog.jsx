import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import BlogPost from '../components/blog/BlogPost';

const blogPosts = [
  {
    id: 1,
    title: "How to Write an Effective Resume in 2024",
    date: "March 15, 2024",
    author: "Career Expert",
    summary: "Learn the latest trends and best practices for creating a resume that stands out in today's competitive job market.",
    content: `In today's rapidly evolving job market, having a well-crafted resume is more important than ever. 
    This comprehensive guide covers everything from choosing the right format to highlighting your achievements effectively. 
    We'll explore how to use action verbs, quantify your accomplishments, and tailor your resume for ATS systems.`,
    imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "The Art of Cover Letter Writing",
    date: "March 12, 2024",
    author: "Professional Writer",
    summary: "Master the techniques of writing compelling cover letters that grab employers' attention.",
    content: `A well-written cover letter can be your ticket to landing your dream job. 
    This post discusses how to structure your cover letter, what to include, and common mistakes to avoid. 
    Learn how to make a strong first impression and effectively communicate your value proposition to potential employers.`,
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Networking Tips for Job Seekers",
    date: "March 8, 2024",
    author: "Career Coach",
    summary: "Discover effective networking strategies to expand your professional opportunities.",
    content: `Networking remains one of the most powerful tools in your job search arsenal. 
    This article explores both traditional and digital networking strategies, including LinkedIn optimization, 
    informational interviews, and how to maintain professional relationships over time.`,
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Mastering ATS-Friendly Resume Formats",
    date: "March 18, 2024",
    author: "Tech Recruiter",
    summary: "Learn how to optimize your resume to pass through Applicant Tracking Systems successfully.",
    content: `With over 75% of companies using ATS software to screen resumes, it's crucial to understand how these systems work. 
    This guide covers the essential formatting rules, keyword optimization strategies, and common pitfalls to avoid. 
    Learn which file formats work best and how to maintain readability while ensuring ATS compatibility.`,
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Top Skills to Include in Your 2024 CV",
    date: "March 16, 2024",
    author: "Industry Analyst",
    summary: "Stay ahead of the curve by highlighting the most in-demand skills employers are looking for in 2024.",
    content: `The job market is constantly evolving, and so are the skills employers value most. 
    This comprehensive guide examines both hard and soft skills that are crucial in today's workplace. 
    From artificial intelligence and data analytics to emotional intelligence and adaptability, 
    learn which skills can make your CV stand out and how to effectively showcase them.`,
    imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Remote Job Applications: A Complete Guide",
    date: "March 14, 2024",
    author: "Remote Work Specialist",
    summary: "Everything you need to know about tailoring your CV and application for remote positions.",
    content: `The rise of remote work has changed how we approach job applications. 
    This guide covers everything from highlighting remote work skills in your CV to preparing for virtual interviews. 
    Learn about digital collaboration tools, time management strategies, and how to demonstrate your ability to work independently.`,
    imageUrl: "https://images.unsplash.com/photo-1521898284481-a5ec348cb555?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "Career Change CV Writing Guide",
    date: "March 10, 2024",
    author: "Career Transition Coach",
    summary: "How to craft a compelling CV when switching careers or industries.",
    content: `Changing careers can be challenging, but a well-crafted CV can help bridge the gap. 
    Learn how to identify and highlight transferable skills, explain your career transition story, 
    and structure your CV to emphasize relevant experience. This guide includes real examples and 
    templates specifically designed for career changers.`,
    imageUrl: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 8,
    title: "Leveraging AI Tools in Your Job Search",
    date: "March 6, 2024",
    author: "Tech Career Advisor",
    summary: "How to use AI-powered tools to optimize your CV and improve your job search success.",
    content: `Artificial Intelligence is revolutionizing the job search process. 
    This article explores how to use AI tools for CV optimization, job matching, and interview preparation. 
    Learn about the latest AI-powered platforms, how to use them effectively, and maintain authenticity 
    while leveraging these powerful tools in your job search journey.`,
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop"
  }
];

const Blog = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center" 
        sx={{ mb: 6, fontWeight: 'bold' }}>
        Career Insights Blog
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom align="center" 
        sx={{ mb: 8, color: 'text.secondary' }}>
        Expert advice and tips for your professional journey
      </Typography>
      
      <Grid container spacing={4}>
        {blogPosts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <BlogPost post={post} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Blog;