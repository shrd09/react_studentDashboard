// src/components/StudentForm.js
import React from 'react';
import { Button, FormControl, FormLabel, TextField, Grid,Card, CardContent } from '@mui/material';

const StudentForm = ({ formData, handleInputChange, handleFormSubmit }) => {
  return (
    <Card>
      <CardContent>
        <form onSubmit={handleFormSubmit}>
          <FormControl>
            <FormLabel>Student Name:</FormLabel>
            <TextField
              type="text"
              name="student_name"
              value={formData.student_name}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <FormControl>
                 <FormLabel>Address:</FormLabel>
                 <TextField
                   type="text"
                   name="address"
                   value={formData.address}
                   onChange={handleInputChange}
                   required
                   fullWidth
                 />
               </FormControl>
               <FormControl>
                 <FormLabel>Age:</FormLabel>
                 <TextField
                   type="number"
                   name="age"
                   value={formData.age}
                   onChange={handleInputChange}
                   required
                   fullWidth
                 />
               </FormControl>
          </FormControl>
          {/* Add other form fields */}
          <Grid item xs={1}>
            <Button type="submit" variant="contained" color="secondary" fullWidth>
              Submit Details
            </Button>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;
