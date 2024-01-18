// PasswordReset.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/system';

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

const PasswordReset = ({ onPasswordReset }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    onPasswordReset();
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <StyledPaper elevation={3}>
          <Typography variant="h5" gutterBottom>
            Reset Password
          </Typography>
          <StyledForm onSubmit={handleSubmit}>
            <TextField
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <br />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Reset Password
            </Button>
          </StyledForm>
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default PasswordReset;
