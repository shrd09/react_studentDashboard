// src/components/StudentDelete.js
import React, { useState, useEffect } from 'react';

const StudentDelete = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch and set the list of students from the backend
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3000/students');
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:3000/students/${studentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Student deleted successfully');
        // Update the local state to reflect the deletion
        setStudents(students.filter((student) => student.id !== studentId));
      } else {
        console.error('Failed to delete student');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Student List</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.name} - User ID: {student.user_id}
            <button onClick={() => handleDelete(student.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentDelete;
