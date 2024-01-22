// src/components/StudentDashboard.js
import React, { useState, useEffect } from 'react';

import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControl,
  FormLabel,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import StudentEnrollments from './StudentEnrollments';
import CourseList from './CourseList';


const StudentDashboard = ({ user ,handleLogout}) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [marks, setMarks] = useState([]);

  const [overallCGPA, setOverallCGPA] = useState(null);

  const [formData, setFormData] = useState({
    user_id: user.id,
    student_name: '',
    address: '',
    age: '',
  });

  const getToken = () => {
    return localStorage.getItem('jwtToken');
  };

  const token = getToken();
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/students/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const details = await response.json();
          setStudentDetails(details);
        } else {
          console.error('Failed to fetch student details');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchMarks = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${user.id}/enrollments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const marksData = await response.json();
          const marksArray = Array.isArray(marksData) ? marksData : [];
          setMarks(marksArray);
          // setMarks(marksData);
        } else {
          console.error('Failed to fetch marks');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchStudentDetails();
    fetchMarks();
  }, [user.id]);


  const calculateOverallCGPA = () => {
    const totalMarks = marks.reduce((acc, enrollment) => acc + (enrollment.marks || 0), 0);
    const totalSubjects = marks.length;

    const cgpa = totalMarks / totalSubjects;

    setOverallCGPA(cgpa);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/student-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Students details submitted successfully');
        console.log('Students details submitted successfully');
        setShowStudentDetails(true);
        // Fetch updated student details
        const studentResponse = await fetch(`http://localhost:3000/students/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (studentResponse.ok) {
          const details = await studentResponse.json();
          setStudentDetails(details);
        } else {
          console.error('Failed to fetch updated student details');
        }
      } else {
        console.error('Failed to submit student details');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const renderContent = () => {
    if (studentDetails) {
      return (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Your Details:</Typography>
            <List>
              <ListItem>
                <ListItemText primary={`Student Name: ${studentDetails.student_name}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Address: ${studentDetails.address}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Age: ${studentDetails.age}`} />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <Card>
          <CardContent>
            {/* Form for student details */}
            <form onSubmit={handleFormSubmit}>
              <FormControl>
                <FormLabel>Student Name:</FormLabel>
                <TextField
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </FormControl>
              <FormControl>
                <FormLabel>Address:</FormLabel>
                <TextField
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </FormControl>
              <FormControl>
                <FormLabel>Age:</FormLabel>
                <TextField
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </FormControl>
              <Grid item xs={1}>
              <Button type="submit" variant="contained" color='secondary' fullWidth>
                Submit Details
              </Button>
              </Grid>
            </form>
          </CardContent>
        </Card>
      );
    }
  };

  const renderAppBar = () => (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Student Dashboard</Typography>
        <div style={{ marginLeft: 'auto' }}>
          <Button color="inherit" onClick={handleLogout}>
            <ExitToAppIcon style={{ marginRight: '4px' }} />
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );

  return (
    <div>
      {renderAppBar()}
    <Grid container spacing={2}  style={{ marginTop: '16px' }}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom align="center">
          <b>Welcome, {user.email} (Student)!</b>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        {renderContent()}
      </Grid>
    <StudentEnrollments studentID={user.id}/>
    <CourseList userID={user.id}/>
   
    </Grid>
    </div>
  );
};

export default StudentDashboard;

