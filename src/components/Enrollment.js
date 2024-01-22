// import React, { useState } from 'react';
// import axios from 'axios';

// const Enrollment = () => {
//   const [userID, setUserID] = useState('');
//   const [courseID, setCourseID] = useState('');
//   const [marks, setMarks] = useState('');
//   const [message, setMessage] = useState('');

//   const handleEnrollment = async () => {
//     try {
//         // const marksValue = marks === '' ? 0 : parseInt(marks, 10);
//       // Make a POST request to enroll the user in the course
//       const response = await axios.post('http://localhost:8080/enrollments', {
//         user_id: userID,
//         course_id: courseID,
//         // marks: marksValue,
//       });

//       if (response.status === 201) {
//         // Enrollment successful
//         setMessage('Enrollment successful');
//         // Clear the input fields
//         setUserID('');
//         setCourseID('');
//         setMarks('');
//       } else {
//         setMessage('Failed to enroll in the course');
//       }
//     } catch (error) {
//       setMessage('Error enrolling in the course');
//     }
//   };

//   return (
//     <div>
//       <h2>Enrollment</h2>
//       <div>
//         <label>User ID:</label>
//         <input
//           type="text"
//           value={userID}
//           onChange={(e) => setUserID(e.target.value)}
//         />
//       </div>
//       <div>
//         <label>Course ID:</label>
//         <input
//           type="text"
//           value={courseID}
//           onChange={(e) => setCourseID(e.target.value)}
//         />
//       </div>
//       {/* <div>
//         <label>Marks:</label>
//         <input
//           type="text"
//           value={marks}
//           onChange={(e) => setMarks(e.target.value)}
//         />
//       </div> */}
//       <button onClick={handleEnrollment}>Enroll</button>
//       <p>{message}</p>
//     </div>
//   );
// };

// export default Enrollment;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Enrollment = ({ userID, courseID }) => {
  const [marks, setMarks] = useState('');
  const [message, setMessage] = useState('');

  const handleEnrollment = async () => {
    try {
      const response = await axios.post('http://localhost:8080/enrollments', {
        user_id: userID.toString(),
        course_id: courseID.toString(),
      });

      if (response.status === 201) {
        setMessage('Enrollment successful');
        setMarks(''); // Clear the input fields if using marks
      } else {
        setMessage('Failed to enroll in the course');
      }
    } catch (error) {
        console.error('Error enrolling in the course:', error);
      setMessage('Error enrolling in the course');
    }
  };

  return (
    <div>
      <h2>Enrollment</h2>
      <div>
        <p>User ID: {userID}</p>
        <p>Course ID: {courseID}</p>
        <button onClick={handleEnrollment}>Enroll</button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Enrollment;
