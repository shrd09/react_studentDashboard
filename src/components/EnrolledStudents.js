import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

const EnrolledStudents = ({ teacherID, courseID }) => {
  const [enrolledStudents, setEnrolledStudents] = useState([]);

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        console.log("courseID:  ",courseID);
        const response = await axios.get(`http://localhost:8080/teachers/${teacherID}/courses/${courseID}/enrolled-students`);
        console.log("API Response:", response);
        // const response = await axios.get(`http://localhost:8080/teachers/${teacherID}/enrolled-students`);
        setEnrolledStudents(response.data);
      } catch (error) {
        console.error('Error fetching enrolled students:', error);
      }
    };

    fetchEnrolledStudents();
  }, [teacherID, courseID]);

  useEffect(() => {
    console.log("Updated enrolledStudents:", enrolledStudents);
  }, [enrolledStudents]);

  return (
    <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
      <Typography variant="h5" component="div" gutterBottom>
        Enrolled Students
      </Typography>
      <List>
        {enrolledStudents && enrolledStudents.length ? (
          enrolledStudents.map((student) => (
            <ListItem key={student.id} style={{ border: '1px solid #ccc', marginBottom: '10px', borderRadius: '5px' }}>
              <ListItemText
                primary={
                  <Typography variant="h6">
                    Student ID: {student.ID}
                  </Typography>
                }
                secondary={`User ID: ${student.UserID}, Name: ${student.StudentName}`}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No enrolled students found" />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

export default EnrolledStudents;
