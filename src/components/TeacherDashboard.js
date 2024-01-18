// src/components/TeacherDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  FormControl,
  FormLabel,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeacherDashboard = ({ user ,handleLogout}) => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [showTeacherDetails, setShowTeacherDetails] = useState(false);
  const [inputMarks, setInputMarks] = useState('');
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [formData, setFormData] = useState({
    user_id: user.id,
    teacher_name: '',
    phone_no: '',
  });

  const [selectedCourseRegisteredStudents, setSelectedCourseRegisteredStudents] = useState([]);

  const handleOpenDialog = (enrollmentId) => {
    setSelectedEnrollmentId(enrollmentId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedEnrollmentId(null);
    setInputMarks('');
    setIsDialogOpen(false);
  };


  const handleCourseClick = async (courseId) => {
    console.log('Course clicked:', courseId);
    setSelectedCourseId(courseId);

    try {
      const response = await fetch(`http://localhost:3000/courses/${courseId}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registered students:', data);
        setRegisteredStudents(data);
        setSelectedCourseRegisteredStudents(data);
      } else {
        console.error('Failed to fetch registered students for the course');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getToken = () => {
    return localStorage.getItem('jwtToken');
  };

  const token = getToken();

  useEffect(() => {
    // Fetch the list of courses
    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://localhost:3000/teachers/${user.id}/courses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          //if the received data is an array
          const coursesArray = Array.isArray(data) ? data : [data];
          setCourses(coursesArray);
        } else {
          toast.success('Failed to fetch courses')
          console.error('Failed to fetch courses');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchTeacherDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/teachers/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const details = await response.json();
          setTeacherDetails(details);
        } else {
          console.error('Failed to fetch teacher details');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCourses();
    fetchTeacherDetails();
  }, [user.id]);


  const handleUpdateMarks = async (enrollmentId) => {
    // Open the dialog
    handleOpenDialog(enrollmentId);
  };

  const handleDialogSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/enrollments/${selectedEnrollmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ marks: inputMarks }),
      });
  
      if (response.ok) {
        toast.success('Marks updated successfully!!')
        console.log('Marks updated successfully!!');
        // Update local state to reflect the updated marks
        setEnrollments((prevEnrollments) =>
          prevEnrollments.map((enrollment) =>
            enrollment.id === selectedEnrollmentId ? { ...enrollment, marks: inputMarks } : enrollment
          )
        );
      } else {
        console.error('Failed to update marks');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  
    // Close the dialog
    handleCloseDialog();
  };


  
  useEffect(() => {
    if (courses.length > 0) {
      const courseIds = courses.map((course) => course.id).join(',');

      const fetchEnrollments = async () => {
        try {
          const response = await fetch(`http://localhost:3000/courses/${courseIds}/enrollments`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setEnrollments(data);
          } else {
            console.error('Failed to fetch enrollments');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchEnrollments();
    }
  }, [courses]);


  const logoutHandle = () => {
    handleLogout();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/teacher-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Marks updated successfully!!')
        console.log('Teachers details submitted successfully');
        // Update state to show teacher details
        setShowTeacherDetails(true);
        // Fetch updated teacher details
        const teacherResponse = await fetch(`http://localhost:3000/teachers/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (teacherResponse.ok) {
          const details = await teacherResponse.json();
          setTeacherDetails(details);
        } else {
          console.error('Failed to fetch updated teacher details');
        }
      } else {
        console.error('Failed to submit teacher details');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const renderContent = () => {
    if (teacherDetails) {
      return (
        <Grid container spacing={2}>
          {/* Display teacher details here */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Your Details:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={`Teacher Name: ${teacherDetails.teacher_name}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Phone_no: ${teacherDetails.phone_no}`} />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      );
    }
    else {
      return (
        <Card>
          <CardContent>
            {/* Form for teacher details */}
            <form onSubmit={handleFormSubmit}>
              <FormControl>
                <FormLabel>Teacher Name:</FormLabel>
                <TextField
                  type="text"
                  name="teacher_name"
                  value={formData.teacher_name}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </FormControl>
              <FormControl>
                <FormLabel>Phone_no:</FormLabel>
                <TextField
                  type="tel"
                  name="phone_no"
                  value={formData.phone_no}
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


  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom align="center">
          <b>Welcome, {user.email} (Teacher)!</b>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        {renderContent()}
      </Grid>

      <Grid item xs={6}>
        <Typography variant="h6" gutterBottom>
          <b>Your Courses:</b>
        </Typography>
        <List>
          {courses.map((course) => (
            <div key={course.user_id}>
              <Button
                variant="outlined"
                onClick={() => handleCourseClick(course.id)}
                fullWidth
              >
                {course.course_name}
              </Button>
              {selectedCourseId === course.id && (
                <List>
                  {selectedCourseRegisteredStudents.map((student) => (
                    <ListItem key={student.id}>
                      <ListItemText primary={`Student: ${student.student_name}`} />
                      {/* Add Update Marks button for each student */}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateMarks(student.enrollment_id)} 
                      >
                        Update Marks
                      </Button>
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
          ))}
        </List>
      </Grid>
      <Grid item xs={6}>
        {/* Dialog for updating marks */}
        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Update Marks</DialogTitle>
          <DialogContent>
            <TextField
              label="Marks (out of 100)"
              value={inputMarks}
              onChange={(e) => {
                setInputMarks(e.target.value);
                // handleUpdateMarks(selectedEnrollmentId); // Remove this line
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDialogSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>

      <Grid item xs={1}>
        <Button variant="contained" onClick={logoutHandle} fullWidth>
          Logout
        </Button>
      </Grid>
    </Grid>
  );
};
export default TeacherDashboard;


