// src/components/StudentList.js
import React, { useState, useEffect } from 'react';

const StudentList = () => {
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

  return (
    <div>
      <h2>Student List</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.name} - User ID: {student.user_id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
