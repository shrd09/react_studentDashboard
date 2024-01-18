// src/components/MarksList.js
import React from 'react';
import { Button, List, ListItem, ListItemText } from '@mui/material';

const MarksList = ({ marks, handleSeeMarks, selectedSubjectId }) => {
    console.log("marks",marks);
    console.log("selectedSubjectId", selectedSubjectId);

  return (
    <List>
      {marks.map((enrollment) => (
        <ListItem key={enrollment.id}>
          <ListItemText primary={`Course: ${enrollment.course.course_name}`} />
          {selectedSubjectId === enrollment.course.id ? (
            // If selectedSubjectId matches the course id, show the "Hide Marks" button
            <>
              <Button variant="contained" onClick={() => handleSeeMarks(null)}>
                Hide Marks
              </Button>
              <ListItemText secondary={`Marks: ${enrollment.marks || 'Not assigned'}`} />
            </>
          ) : (
            // If not, show the "Show Marks" button
            <Button
              variant="outlined"  // Use "outlined" variant for outlined button
              onClick={() => handleSeeMarks(enrollment.course.id)}
            >
              Show Marks
            </Button>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default MarksList;
