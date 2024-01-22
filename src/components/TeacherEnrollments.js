import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { useHistory } from 'react-router-dom';

const TeacherEnrollments = ({ courseID }) => {
  const [enrollments, setEnrollments] = useState([]);
//   const history = useHistory();

  useEffect(() => {
    // Fetch enrollments for the course when the component mounts
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/enrollments/course/${courseID}`);
        setEnrollments(response.data);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      }
    };

    fetchEnrollments();
  }, [courseID]);

  // Example: Dynamically change the route based on the fetched data
  const handleRedirect = () => {
    // Assuming you have a student ID in the first enrollment item
    const studentID = enrollments.length > 0 ? enrollments[0].user_id : '';
    // history.push(`/students/${studentID}`);
  };

  return (
    <div>
      <h2>Enrollments for Your Course</h2>
      <ul>
        {enrollments.map((enrollment) => (
          <li key={enrollment.id}>
            Student ID: {enrollment.user_id}, Marks: {enrollment.marks}
          </li>
        ))}
      </ul>
      <button onClick={handleRedirect}>Redirect to First Student</button>
    </div>
  );
};

export default TeacherEnrollments;
