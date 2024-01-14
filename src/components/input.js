// Input.js
import React from 'react';
import { TextField } from '@mui/material';

const Input = ({ label, type, value, onChange }) => (
  <TextField
    label={label}
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
    margin="normal"
  />
);

export default Input;
