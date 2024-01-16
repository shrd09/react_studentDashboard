import React, { useState ,useEffect} from 'react';
import { TextField, Button, Typography, Paper } from '@mui/material';
import Input from './input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCourses = () => {
    const [courseName, setCourseName] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
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
        // Call fetchTeachersData when the component mounts
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
        setSelectedTeacherId(null);
    };
        


    return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto', marginTop: '20px' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Add Course
          </Typography>
          <form onSubmit={handleSubmit}>
            <Input label="Course Name" type="text" value={courseName} onChange={setCourseName} />
            <br />
            <label>Select Teacher:</label>
            <select
              value={selectedTeacherId || ''}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
            >
              <option value="" disabled>Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.user_id} value={teacher.user_id}>
                  {teacher.user_id}
                </option>
              ))}
            </select>
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