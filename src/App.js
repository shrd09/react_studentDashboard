import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; 
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';


const App = () => {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');

  const handleLogin = (user,token) => {
    setUser(user);
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('user', JSON.stringify(user));// Store user data
    toast.success('Login successful!');
    console.log('Token stored: ', token);
    
  };

    
  const checkTokenExpiration = () => {
    const token = getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Token has expired
          setUser(null);
          toast.info('Your session has expired. Please log in again.');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  };

  useEffect(() => {
    // Check token expiration when the component mounts
    checkTokenExpiration();

    // Set up a timer to periodically check token expiration
    const tokenCheckInterval = setInterval(checkTokenExpiration, 60000); // Check every minute

    // Clean up the interval when the component unmounts
    return () => clearInterval(tokenCheckInterval);
  }, []);



  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
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
      credentials: 'include', 
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
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


  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          {user.role === 'admin' && <AdminDashboard user={user} handleLogout={handleLogout} />}

          { user.role === 'student' && (
            <StudentDashboard user={user} handleLogout={handleLogout} />
          )} 
          {user.role === 'teacher' && (
            <TeacherDashboard user={user} handleLogout={handleLogout} />
          )} 

            {/* Logout Confirmation Dialog */}
            {showLogoutConfirmation && (
              <Paper elevation={10} sx={{ marginTop: 4, padding: 2 }}>
                <Typography variant="h6">Are you sure you want to logout?</Typography>
                <Button variant="contained" color="inherit" onClick={confirmLogout}>
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
