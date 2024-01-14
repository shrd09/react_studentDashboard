// src/components/TeacherDelete.js
import React, { useState, useEffect } from 'react';

const TeacherDelete = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    // Fetch and set the list of teachers from the backend
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

  const handleDelete = async (teacherId) => {
    try {
      const response = await fetch(`http://localhost:3000/teachers/${teacherId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Teacher deleted successfully');
        // Update the local state to reflect the deletion
        setTeachers(teachers.filter((teacher) => teacher.id !== teacherId));
      } else {
        console.error('Failed to delete teacher');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Teacher List</h2>
      <ul>
        {teachers.map((teacher) => (
          <li key={teacher.id}>
            {teacher.name} - User ID: {teacher.user_id}
            <button onClick={() => handleDelete(teacher.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherDelete;
