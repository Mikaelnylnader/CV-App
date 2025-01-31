import React from 'react';
import { Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  fontWeight: 600,
  fontSize: '0.85rem',
  height: '28px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const CategoryChip = ({ label }) => {
  return <StyledChip label={label} />;
};

export default CategoryChip; 