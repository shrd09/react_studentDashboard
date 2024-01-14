// src/components/TeacherList.js
import React, { useState, useEffect } from 'react';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    // Fetch and set the list of students from the backend
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:3000/teachers');
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div>
      <h2>Teacher List</h2>
      <ul>
        {teachers.map((teacher) => (
          <li key={teacher.id}>
            {teacher.name} - User ID: {teacher.user_id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherList;
