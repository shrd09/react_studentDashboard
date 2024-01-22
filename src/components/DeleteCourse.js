import React, { useState } from 'react';

const DeleteCourse = () => {
  const [courseId, setCourseId] = useState('');
  const [message, setMessage] = useState('');

  const getToken = () => {
    return localStorage.getItem('jwtToken');
  };

  const handleDeleteCourse = async () => {
    try {
      // Set up headers
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');

      // Make a DELETE request using fetch
      const token = getToken();
      const response = await fetch(`http://localhost:8080/courses/${courseId}`, {
        method: 'DELETE',
        mode: 'no-cors', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*',
        },
        credentials: 'include', // Include credentials (cookies) for cross-origin requests
      });

      if (response.ok) {
        // Course deleted successfully
        setMessage('Course deleted successfully');
        // Clear the input field
        setCourseId('');
      } else {
        setMessage('Failed to delete course');
      }
    } catch (error) {
      setMessage('Error deleting course');
    }
  };

  return (
    <div>
      <h2>Delete Course</h2>
      <div>
        <label>Course ID:</label>
        <input
          type="text"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        />
      </div>
      <button onClick={handleDeleteCourse}>Delete Course</button>
      <p>{message}</p>
    </div>
  );
};

export default DeleteCourse;
