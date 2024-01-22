import React from 'react';
import { useState } from 'react';
import {
    Typography,
    Button,
    Grid,
    Popover,
    Paper,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import { toast } from 'react-toastify';

const UserList = ({ users, onUpdateUserClick, onDeleteUserClick }) => {

const [users,setUsers] = useState([]);


const fetchUsers = async () => {
    try{
        const response = await fetch('http://localhost:3000/users/all', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok){
            const users = await response.json();
            setUsers(users);
            console.log('Users:', users);
        }
        else{
            console.error('Failed to fetch users');
        }
    }
    catch(error){
        console.error('Error fetching users:',error);
    }
  };
  return (

  );
};

export default UserList;