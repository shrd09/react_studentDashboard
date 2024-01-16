import React, { useState,useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl,InputLabel,Typography,Paper, Grid } from '@mui/material';
import { styled } from '@mui/system';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledPaper = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px',
  maxWidth: '400px',
  margin: 'auto',
});

const StyledForm = styled('form')({
  width: '100%',
  marginTop: '8px',
});

const StyledButton = styled(Button)({
  marginTop: '16px',
});



const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

 
  
  useEffect(() => {
    const csrfMetaTag = document.querySelector('meta[name="csrf-token"]');
    if (csrfMetaTag) {
      setCsrfToken(csrfMetaTag.content);
      console.log('CSRF Token:', csrfMetaTag.content);
    } else {
      console.error('CSRF Token meta tag not found!');
    }
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      console.log('Token retrieved from localStorage:', storedToken);
      // You may want to check if the token is still valid and not expired
      // If it's still valid, you can redirect the user to the appropriate page
    }
  }, []);
  
  const getToken = () => {
    return localStorage.getItem('jwtToken');
  };

  const token = getToken();
  console.log('Token generated:', token);

  const fetchUserRole = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user?email=${email}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRole(data.role);
        return data.role;
      } else {
        console.error('Failed to fetch user role');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user role:', error.message);
      return null;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Sending request with token:', token);
    
    try {
      console.log('Fetching:', 'http://localhost:3000/users/sign_in');
      
      const userRole = await fetchUserRole();
      const response = await fetch('http://localhost:3000/users/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ user: { email, password, role: userRole } }),
      });

      if (response.ok) {
        const {user, token, message } = await response.json();
        console.log('User Object:', user);
        console.log('Token: ',token);
        console.log(message);
        // toast.success(message);
        onLogin(user, token); // Pass the user data to the parent component
        
      } else {
        // alert("Login failed");
        console.error('Login failed');
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred during login. Please try again.');
    }
  };


  return (

    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <StyledPaper elevation={3}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <StyledForm onSubmit={handleSubmit}>
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
       <br />
       <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
       <br />
       {/* <FormControl fullWidth>
         <InputLabel>Role</InputLabel>
         <Select value={role} onChange={(e) => setRole(e.target.value)} fullWidth>
           <MenuItem value="student">Student</MenuItem>
           <MenuItem value="teacher">Teacher</MenuItem>
           <MenuItem value="admin">Admin</MenuItem>
         </Select>
       </FormControl> */}
       <br />
            <StyledButton type="submit" variant="contained" color="primary" fullWidth>
              Login
            </StyledButton>
          </StyledForm>
        </StyledPaper>
      </Grid>
      <ToastContainer autoClose={4000} />
    </Grid>
      );
    };
    
    export default Login;
    
