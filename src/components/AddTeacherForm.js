// src/components/NewTeacherForm.js
import React, { useState } from 'react';
import { Button, Typography, Paper } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Input from './input';

const NewTeacherForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const getToken = () => {
    return localStorage.getItem('jwtToken');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({email:email,password:password,role:'teacher'}),
      });

      if (response.ok) {
        toast.success('Teacher created successfully');
        console.log('Teacher created successfully');
        const data = await response.json();

      // Check if the response contains the userId property
      if (data.id !== undefined) {
        const userId = data.id;
        console.log('User ID:', userId);
        setEmail("");
        setPassword("");
      } else {
        toast.error('User ID not found in the response:', data);
        console.error('User ID not found in the response:', data);
      }
      } else {
        console.error('Failed to create teacher');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto', marginTop: '20px' }}>
      <Typography variant="h5" align="center" gutterBottom>
        Create Teacher
      </Typography>
      <form onSubmit={handleSubmit}>
        <Input label="Email" type="email" value={email} onChange={setEmail} />
        <Input label="Password" type="password" value={password} onChange={setPassword} />
        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
          Create Teacher
        </Button>
      </form>
      <ToastContainer autoClose={4000} />
    </Paper>
  );
};

export default NewTeacherForm;
