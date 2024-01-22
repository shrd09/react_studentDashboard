import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/enrollments');
        setEnrollments(response.data);
      } catch (error) {
        setError('Failed to fetch enrollments');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  return (
    <div>
      <h2>All Enrollments</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {enrollments.length > 0 && (
        <ul>
          {enrollments.map((enrollment) => (
            <li key={enrollment.ID}>
              UserID: {enrollment.UserID}, CourseID: {enrollment.CourseID}, Marks: {enrollment.Marks}
            </li>
          ))}
        </ul>
      )}
      {enrollments.length === 0 && !loading && <p>No enrollments available.</p>}
    </div>
  );
};

export default AllEnrollments;
