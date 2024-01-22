import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

const AssignCourseToTeacher = () => {
  const [teacherId, setTeacherId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [years, setYears] = useState([]);

  useEffect(() => {
    // Fetch the list of teachers when the component mounts
    axios.get('http://localhost:8080/teachers')
      .then(response => setTeachers(response.data))
      .catch(error => console.error('Error fetching teachers:', error));

    // Fetch the list of courses when the component mounts
    axios.get('http://localhost:8080/courses')
      .then(response => setCourses(response.data))
      .catch(error => console.error('Error fetching courses:', error));

    // Generate an array of years from the current year onwards
    const currentYear = new Date().getFullYear();
    const yearArray = Array.from({ length: 10 }, (_, index) => currentYear + index);
    setYears(yearArray);
  }, []);

  const handleAssignCourse = async () => {
    try {
      const response = await axios.post('http://localhost:8080/teacher-courses', {
        teacher_id: parseInt(teacherId),
        course_id: parseInt(courseId),
        year: parseInt(selectedYear),
      });

      if (response.status === 201) {
        setMessage('Course assigned successfully');
        // Clear the input fields
        setTeacherId('');
        setCourseId('');
        setSelectedYear('');
      } else {
        setMessage('Failed to assign course');
      }
    } catch (error) {
      setMessage('Error assigning course');
    }
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
        <Typography variant="h4" gutterBottom>
          Assign Course to Teacher
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <TextField
              label="Teacher ID"
              variant="outlined"
              fullWidth
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              label="Course ID"
              variant="outlined"
              fullWidth
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                label="Year"
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleAssignCourse}
              fullWidth
            >
              Assign Course
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography>{message}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AssignCourseToTeacher;
