// TeacherCourses.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import EnrolledStudents from './EnrolledStudents';

const TeacherCourses = ({ teacherID }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/teacher/courses/${teacherID}`);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [teacherID]);

  const handleCourseClick = (courseId) => {
    setSelectedCourse((prevCourse) => (prevCourse === courseId ? null : courseId));
  };

  return (
    <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
      <Typography variant="h5" component="div" gutterBottom>
        Courses Taught by You
      </Typography>
      <List>
        {courses.map((course) => (
          <ListItem key={course.id} style={{ border: '1px solid #ccc', marginBottom: '10px', borderRadius: '5px' }}>
            <ListItemText
              primary={<Typography variant="h6">Course ID: {course.course_id}</Typography>}
              secondary={`Year: ${course.Year}`}
            />
            <Button
              variant="outlined"
              onClick={() => handleCourseClick(course.course_id)}
              style={{ marginLeft: '10px', color: selectedCourse === course.course_id ? '#fff' : '#000', backgroundColor: selectedCourse === course.course_id ? '#4caf50' : '#fff' }}
            >
              {selectedCourse === course.course_id ? 'Hide Students' : 'View Students'}
            </Button>
          </ListItem>
        ))}
      </List>
      {selectedCourse && <EnrolledStudents teacherID={teacherID} courseID={selectedCourse} />}
    </Paper>
  );
};

export default TeacherCourses;
