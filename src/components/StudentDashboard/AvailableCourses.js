// src/components/AvailableCourses.js
import React from 'react';
import { Button, List, ListItem, ListItemText, Typography } from '@mui/material';

const AvailableCourses = ({ courses, handleEnroll }) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom>Available Courses:</Typography>
      <List>
        {courses.map((course) => (
          <ListItem key={course.id}>
            <ListItemText primary={course.course_name} secondary={`Teacher: ${course.teacher.teacher_name}`} />
            <Button
              variant="contained"
              onClick={() => handleEnroll(course.id)}
            >
              Enroll
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default AvailableCourses;
