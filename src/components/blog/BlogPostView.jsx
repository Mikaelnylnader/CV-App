import React from 'react';
import { Container, Typography, Box, Chip, Avatar, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import CategoryChip from '../CategoryChip.jsx';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const BlogPostView = ({ posts }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Blog post not found</Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowLeftIcon className="w-5 h-5" />}
          onClick={() => navigate('/blog')}
          sx={{ mt: 2 }}
        >
          Back to Blog
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Box
        sx={{
          background: `linear-gradient(rgba(10, 15, 30, 0.9), rgba(26, 31, 46, 0.9)), url('https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: { xs: 8, md: 12 },
          mb: 6,
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Button
              startIcon={<ArrowLeftIcon className="w-5 h-5" />}
              sx={{ 
                color: 'white',
                mb: 4,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
              onClick={() => navigate('/blog')}
            >
              Back to Blog
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
              <CategoryChip label={post.tags[0]} />
              <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.7)">
                {post.date}
              </Typography>
              <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.7)" sx={{ ml: 'auto' }}>
                {post.readTime}
              </Typography>
            </Box>

            <Typography
              variant="h1"
              component="h1"
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3.5rem' },
                mb: 4,
                lineHeight: 1.2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {post.title}
            </Typography>

            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                p: 2,
                borderRadius: 1,
                backdropFilter: 'blur(8px)'
              }}
            >
              <Avatar src={post.authorAvatar} alt={post.author}>
                {post.author.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" color="white">
                  {post.author}
                </Typography>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  {post.role}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <Box sx={{ mb: 4 }}>
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                sx={{ 
                  mr: 1,
                  mb: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.12)' }
                }}
              />
            ))}
          </Box>
          
          <Box sx={{ 
            '& img': { 
              width: '100%',
              height: 'auto',
              borderRadius: 2,
              mb: 4 
            },
            '& h2': {
              fontSize: '2rem',
              fontWeight: 700,
              mb: 3,
              mt: 6
            },
            '& h3': {
              fontSize: '1.5rem',
              fontWeight: 600,
              mb: 2,
              mt: 4
            },
            '& p': {
              fontSize: '1.1rem',
              lineHeight: 1.7,
              mb: 3
            },
            '& ul, & ol': {
              mb: 3,
              pl: 3
            },
            '& li': {
              fontSize: '1.1rem',
              lineHeight: 1.7,
              mb: 1
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: 3,
              py: 1,
              my: 4,
              '& p': {
                fontStyle: 'italic'
              }
            },
            '& code': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              padding: '2px 6px',
              borderRadius: 1,
              fontFamily: 'monospace'
            }
          }}>
            <div className="markdown-content">
              <ReactMarkdown>
                {post.content}
              </ReactMarkdown>
            </div>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default BlogPostView; 