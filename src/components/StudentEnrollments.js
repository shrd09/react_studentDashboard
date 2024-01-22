import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const StudentEnrollments = ({ studentID }) => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/enrollments/${studentID}`);
        setEnrollments(response.data);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      }
    };

    fetchEnrollments();
  }, [studentID]);

  return (
    <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
      <Typography variant="h5" gutterBottom>
        Your Enrollments
      </Typography>
      <List>
        {enrollments.map((enrollment) => (
          <ListItem key={enrollment.id}>
            <ListItemText
              primary={`Course ID: ${enrollment.CourseID}`}
              secondary={`Marks: ${enrollment.Marks}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default StudentEnrollments;
