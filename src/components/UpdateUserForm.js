// UpdateUserForm.js
import React, { useState } from 'react';
import { TextField } from '@mui/material';

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
    <div>
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
      <button onClick={handleSubmit}>Update User</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default UpdateUserForm;
