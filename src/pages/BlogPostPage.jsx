import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Avatar, Chip, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';

const HeroImage = styled('div')({
  width: '100%',
  height: '500px',
  position: 'relative',
  marginBottom: '2rem',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
  }
});

const StyledImg = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const CategoryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  fontWeight: 600,
  fontSize: '0.85rem',
  height: '28px',
}));

const TagChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  fontWeight: 500,
  fontSize: '0.85rem',
  height: '28px',
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

const MarkdownContent = styled('div')(({ theme }) => ({
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '12px',
    marginTop: '2rem',
    marginBottom: '2rem',
  },
  '& h2': {
    fontSize: '2rem',
    fontWeight: 700,
    marginTop: '2.5rem',
    marginBottom: '1.5rem',
    color: theme.palette.text.primary,
  },
  '& h3': {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginTop: '2rem',
    marginBottom: '1rem',
    color: theme.palette.text.primary,
  },
  '& p': {
    fontSize: '1.1rem',
    lineHeight: 1.8,
    marginBottom: '1.5rem',
    color: theme.palette.text.secondary,
  },
  '& ul, & ol': {
    marginBottom: '1.5rem',
    paddingLeft: '1.5rem',
  },
  '& li': {
    fontSize: '1.1rem',
    lineHeight: 1.8,
    marginBottom: '0.5rem',
    color: theme.palette.text.secondary,
  },
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  '& blockquote': {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    paddingLeft: '1rem',
    marginLeft: 0,
    marginRight: 0,
    fontStyle: 'italic',
  },
  '& code': {
    backgroundColor: theme.palette.grey[100],
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    fontSize: '0.9em',
  },
}));

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // This would typically come from an API or context
  const blogPosts = [
    {
      id: 1,
      title: "How to Write an Effective Resume in 2025",
      date: "March 15, 2025",
      author: "Sarah Anderson",
      role: "Senior Career Expert & Former Google Recruiter",
      summary: "Master the latest resume writing strategies for 2025, including AI optimization, skills-based formatting, and automated tracking system (ATS) compatibility. Learn how to make your resume stand out in today's competitive job market.",
      content: `In today's AI-driven job market...`, // Full content from Blog.jsx
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop",
      slug: "how-to-write-effective-resume-2025",
      readTime: "8 min read",
      tags: ["Resume Writing", "Career Advice", "Job Search", "ATS Optimization", "Professional Development"]
    },
  ];

  const post = blogPosts.find(post => post.slug === slug);

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center">Blog post not found</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="contained" onClick={() => navigate('/blog')}>
            Back to Blog
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <div>
      <HeroImage>
        <StyledImg src={post.imageUrl} alt={post.title} />
      </HeroImage>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
            <CategoryChip label="Career Tips" />
            <Typography variant="subtitle1" color="text.secondary">
              {post.date}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 'auto' }}>
              {post.readTime}
            </Typography>
          </Box>

          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 4,
              lineHeight: 1.2
            }}
          >
            {post.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 6, gap: 2 }}>
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48,
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {post.author[0]}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {post.author}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.role}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 600, mb: 3 }}>
              {post.summary}
            </Typography>
          </Box>

          <MarkdownContent>
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </MarkdownContent>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 6, mb: 4 }}>
            {post.tags.map((tag) => (
              <TagChip key={tag} label={tag} />
            ))}
          </Box>

          <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid #e2e8f0' }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/blog')}
              sx={{ px: 4 }}
            >
              Back to Blog
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default BlogPostPage; 