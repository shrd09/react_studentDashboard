// src/components/MarksList.js
import React from 'react';
import { Button, List, ListItem, ListItemText } from '@mui/material';

const MarksList = ({ marks, handleSeeMarks, selectedSubjectId }) => {
    console.log("marks",marks);
  return (
    <List>
      {marks.map((enrollment) => (
        <ListItem key={enrollment.id}>
          <ListItemText primary={`Course: ${enrollment.course.course_name}`} />
          {selectedSubjectId === enrollment.course.id ? (
            <Button variant="contained" onClick={() => handleSeeMarks(null)}>
              Hide Marks
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => handleSeeMarks(enrollment.course.id)}
            >
              Show Marks
            </Button>
          )}
          {selectedSubjectId === enrollment.course.id && (
            <ListItemText secondary={`Marks: ${enrollment.marks || 'Not assigned'}`} />
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default MarksList;
