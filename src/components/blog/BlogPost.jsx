import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BlogPost = ({ post }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log('Navigating to blog post:', post.slug);
    navigate(`/blog/${post.slug}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
          transition: 'all 0.3s ease-in-out'
        }
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="240"
        image={post.imageUrl}
        alt={post.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={post.tags[0]} 
            size="small" 
            sx={{ 
              backgroundColor: 'primary.main',
              color: 'white',
              fontWeight: 500,
              mb: 2
            }} 
          />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {post.date} · {post.readTime}
          </Typography>
        </Box>
        
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            fontSize: '1.5rem',
            lineHeight: 1.3,
            mb: 2
          }}
        >
          {post.title}
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          paragraph 
          sx={{ mb: 'auto' }}
        >
          {post.summary}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {post.author}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.role}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlogPost; 