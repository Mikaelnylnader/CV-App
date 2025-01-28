import React from 'react';
import { Paper, Typography, Box, Avatar, Chip, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const BlogImage = styled('img')({
  width: '100%',
  height: '300px',
  objectFit: 'cover',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const BlogPost = ({ post }) => {
  return (
    <StyledPaper elevation={2}>
      <Box sx={{ position: 'relative' }}>
        <BlogImage
          src={post.imageUrl}
          alt={post.title}
        />
      </Box>
      
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, mr: 1 }}>
            {post.author[0]}
          </Avatar>
          <Typography variant="subtitle2" color="text.secondary">
            {post.author}
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <Typography variant="subtitle2" color="text.secondary">
            {post.date}
          </Typography>
        </Box>

        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          {post.title}
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          {post.summary}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" paragraph>
          {post.content}
        </Typography>
      </Box>
    </StyledPaper>
  );
};

export default BlogPost; 