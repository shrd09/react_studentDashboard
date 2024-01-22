import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container } from '@mui/material';

const AddCourse = () => {
  const [courseName, setCourseName] = useState('');

  const handleAddCourse = async () => {
    try {
      // Make a POST request to your GoLang backend to add a new course
      const response = await axios.post('http://localhost:8080/courses', {
        course_name: courseName,
      });

      if (response.status === 201) {
        // Course added successfully
        console.log('Course added successfully');
        // Clear the input field
        setCourseName('');
      } else {
        console.error('Failed to add course');
      }
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h2">Add Course</Typography>
      <div>
        <TextField
          label="Course Name"
          variant="outlined"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddCourse}
        style={{ marginTop: '20px' }}
      >
        Add Course
      </Button>
    </Container>
  );
};

export default AddCourse;
