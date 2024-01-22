import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const UpdateUserForm = ({ onUpdate, onCancel, user }) => {
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user.role);

  const handleSubmit = () => {
    // Validate and submit the updated user details
    const updatedUser = {
      email,
      password: password || undefined, // Only include if a new password is provided
      role,
    };
    onUpdate(updatedUser);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300 }}>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <Button variant="contained" onClick={handleSubmit} color="primary">
        Update User
      </Button>
    </Box>
  );
};

export default UpdateUserForm;
