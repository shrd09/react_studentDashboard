// src/components/StudentDetails.js
import React from 'react';
import { Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';

const StudentDetails = ({ studentDetails }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Your Details:</Typography>
        <List>
          <ListItem>
            <ListItemText primary={`Student Name: ${studentDetails.student_name}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary={`Address: ${studentDetails.address}`} />
          </ListItem>
          <ListItem>
            <ListItemText primary={`Age: ${studentDetails.age}`} />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default StudentDetails;
