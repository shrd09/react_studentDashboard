import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Popover,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AddStudentForm from './components/AddStudentForm';
import AddTeacherForm from './components/AddTeacherForm';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';


const App = () => {
  const [user, setUser] = useState(null);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogin = (user,token) => {
    setUser(user);
    localStorage.setItem('jwtToken', token);
    toast.success('Login successful!');
    console.log('Token stored: ', token);
    
  };

      

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };


  const getToken = () => {
    return localStorage.getItem('jwtToken');
  };

  const token = getToken();

  const confirmLogout = () => {
    // Send a DELETE request to the logout endpoint
    fetch('http://localhost:3000/sessions', {
      method: 'DELETE',
      credentials: 'include', // Include credentials for the session to be sent
      headers: {
        // 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },  
    })
      .then(response => {
        if (response.ok) {
          return response.json(); // Parse the JSON response for successful requests
        }  else {
          throw new Error('Logout failed');
        }
      })
      .then(data => {
        setUser(null);
        setShowLogoutConfirmation(false);
        setLogoutMessage(data.message);
        toast.success('Logout successful!');
      })
      .catch(error => {
        console.error('Error during logout:', error.message);
        setLogoutMessage('Logout failed');
        toast.error('Logout failed. Please try again.');
      });
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleAddStudent = (data) => {
    // Perform to add student using data
    console.log('Adding student:', data);
    setRegistrationSuccess(true);
    setShowAddStudentForm(false);
    setAnchorEl(null);
  };

  const handleAddTeacher = (data) => {
    // Perform to add teacher using data
    console.log('Adding teacher:', data);
    setShowAddTeacherForm(false);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'add-menu-popover' : undefined;

  const handleCancel = () => {
    setShowAddStudentForm(false);
    setShowAddTeacherForm(false);
  };


  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          {user.role === 'admin' && (
            <>
            <Grid item xs={12}>
                <Typography variant="h4" gutterBottom align="center">
                  Welcome, Admin!
                </Typography>
            </Grid>
            <br/>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Button
                aria-describedby={id}
                variant="contained"
                color="primary"
                onClick={handleClick}
              >
                Add
              </Button>
              </Grid>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Paper>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setShowAddStudentForm(true);
                      handleClose();
                    }}
                  >
                    Add Student
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setShowAddTeacherForm(true);
                      handleClose();
                    }}
                  >
                    Add Teacher
                  </Button>
                </Paper>
              </Popover>
              <br/>
              <br/>
              {user.role === 'admin' && (
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={1}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Grid>
            </Grid>
          )}
            </>
          )}

          { user.role === 'student' && (
            // If the user is a student, show the student dashboard
            <StudentDashboard user={user} handleLogout={handleLogout} />
          )} 
          {user.role === 'teacher' && (
            // If the user is a teacher, show the teacher dashboard
            <TeacherDashboard user={user} handleLogout={handleLogout} />
          )} 

          {(showAddStudentForm || showAddTeacherForm) && (
            <Dialog open={showAddStudentForm || showAddTeacherForm} onClose={() => handleCancel()}>
              <DialogTitle>Add {showAddStudentForm ? 'Student' : 'Teacher'}</DialogTitle>
              <DialogContent>
                {showAddStudentForm && <AddStudentForm onSubmit={handleAddStudent} />}
                {showAddTeacherForm && <AddTeacherForm onSubmit={handleAddTeacher} />}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleCancel()} color="secondary">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          )}


          {registrationSuccess && (
              <Box mt={2}>
                <Typography variant="h6" color="success">
                  Student successfully registered!
                </Typography>
              </Box>
            )}

            {user.role !== 'admin' && user.role !== 'student' && user.role !== 'teacher' && (
              // Handle other roles
              <div>
                <h2>Welcome, {user.role}!</h2>
                {/* Other components for non-admin, non-student, non-teacher roles */}
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}

            {/* Logout Confirmation Dialog */}
            {showLogoutConfirmation && (
              <Paper elevation={10} sx={{ marginTop: 4, padding: 2 }}>
                <Typography variant="h6">Are you sure you want to logout?</Typography>
                <Button variant="contained" color="primary" onClick={confirmLogout}>
                  Yes
                </Button>
                <Button variant="outlined" color="secondary" onClick={cancelLogout}>
                  No
                </Button>
              </Paper>
            )}

          </>
          )}
          <ToastContainer autoClose={4000} />
    </Container>
    
  );
};
  export default App;
