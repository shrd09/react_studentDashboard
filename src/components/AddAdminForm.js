import React, { useState } from 'react';
import { TextField, Button, Typography, Paper } from '@mui/material';
import Input from './input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddAdminForm = ({onClose}) => {
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
                
                body: JSON.stringify({email:email,password:password, role:'admin'}),
                
            });

            if (response.ok){
                toast.success('Admin created sucessfully!');
                const data = await response.json();

            // Check if the response contains the userId property
            if (data.id !== undefined) {
                const userId = data.id;
                console.log('User ID:', userId);
                setEmail("");
                setPassword("");
            } else {
              toast.success('User ID not found in the response:', data);
                console.error('User ID not found in the response:', data);
            }
            }
            else{
              toast.success("Failed to create admin");
                console.error("Failed to create admin");
            }
        }
        catch(error){
            console.error("Error:",error);
        }
    };


    return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto', marginTop: '20px' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Create Admin
          </Typography>
          <form onSubmit={handleSubmit}>
        <Input label="Email" type="email" value={email} onChange={setEmail} />
        <Input label="Password" type="password" value={password} onChange={setPassword} />
        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
          Create Admin
        </Button>
      </form>
          <ToastContainer autoClose={4000} />
        </Paper>
      );
    };

    export default AddAdminForm;

