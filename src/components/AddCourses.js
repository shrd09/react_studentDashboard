import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Select, MenuItem } from '@mui/material';
import Input from './input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCourses = () => {
  const [courseName, setCourseName] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [teachers, setTeachers] = useState([]);

  const getToken = () => {
    return localStorage.getItem('jwtToken');
  };

  const fetchTeachersData = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:3000/teachers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const teachersData = await response.json();
        setTeachers(teachersData);
      } else {
        toast.error('Failed to fetch teachers');
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Error fetching teachers');
    }
  };

  useEffect(() => {
    fetchTeachersData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();
      const response = await fetch('http://localhost:3000/courses-add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_name: courseName,
          user_id: selectedTeacherId,
        }),
      });

      if (response.ok) {
        toast.success(`Course ${courseName} added successfully`);
      } else {
        toast.error('Failed to add course');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Error adding course');
    }
    setCourseName('');
    setSelectedTeacherId('');
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto', marginTop: '20px' }}>
      <Typography variant="h5" align="center" gutterBottom>
        Add Course
      </Typography>
      <form onSubmit={handleSubmit}>
        <Input label="Course Name" type="text" value={courseName} onChange={setCourseName} />
        <br />
        <Typography variant="body1" style={{ marginTop: '10px' }}>Select Teacher:</Typography>
        <Select
          value={selectedTeacherId}
          onChange={(e) => setSelectedTeacherId(e.target.value)}
          fullWidth
          variant="outlined"
          displayEmpty
        >
          <MenuItem value="" disabled>Select Teacher</MenuItem>
          {teachers.map((teacher) => (
            <MenuItem key={teacher.user_id} value={teacher.user_id}>
              {teacher.user_id}
            </MenuItem>
          ))}
        </Select>
        <br />
        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
          Add Course
        </Button>
      </form>
      <ToastContainer autoClose={4000} />
    </Paper>
  );
};

export default AddCourses;
