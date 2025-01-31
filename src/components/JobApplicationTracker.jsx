import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Button } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { InterviewPrepModal } from './InterviewPrepModal';

const JobApplicationCard = ({ application, onEdit, onDelete, onPrepInterview }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
              {application.jobTitle || 'Job Title'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {application.company || 'Company Name'}
            </Typography>
          </Box>
          <Chip
            label={application.status || 'Applied'}
            size="small"
            sx={{
              backgroundColor: 
                application.status === 'Applied' ? 'primary.main' :
                application.status === 'Interview' ? 'success.main' :
                application.status === 'Rejected' ? 'error.main' :
                'warning.main',
              color: 'white',
              fontWeight: 500
            }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Applied: {application.dateApplied ? new Date(application.dateApplied).toLocaleDateString() : 'Not specified'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(application);
            }}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(application.id);
            }}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'error.main' }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onPrepInterview(application.id);
            }}
            sx={{
              ml: 'auto',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            Prep Interview
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const JobApplicationTracker = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      jobTitle: "Software Engineer",
      company: "Tech Corp",
      status: "Applied",
      dateApplied: "2024-03-20"
    },
    {
      id: 2,
      jobTitle: "Frontend Developer",
      company: "Web Solutions",
      status: "Interview",
      dateApplied: "2024-03-19"
    },
    {
      id: 3,
      jobTitle: "Full Stack Developer",
      company: "Digital Innovations",
      status: "Applied",
      dateApplied: "2024-03-18"
    }
  ]);
  const [interviewPrepModalOpen, setInterviewPrepModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const handleEdit = (application) => {
    console.log('Edit application:', application);
    // Add edit functionality
  };

  const handleDelete = (applicationId) => {
    setApplications(prevApplications => 
      prevApplications.filter(app => app.id !== applicationId)
    );
  };

  const handlePrepInterview = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setInterviewPrepModalOpen(true);
  };

  return (
    <div>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
        {applications.map((application) => (
          <JobApplicationCard
            key={application.id}
            application={application}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPrepInterview={handlePrepInterview}
          />
        ))}
      </Box>

      <InterviewPrepModal
        isOpen={interviewPrepModalOpen}
        onClose={() => setInterviewPrepModalOpen(false)}
        applicationId={selectedApplicationId}
      />
    </div>
  );
};

export default JobApplicationTracker; 