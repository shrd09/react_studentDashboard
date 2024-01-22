// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Typography, List, ListItem, ListItemText, Button, Paper } from '@mui/material';
// import Enrollment from './Enrollment';

// function CourseList() {
//     const [courses, setCourses] = useState([]);
//     const [selectedCourse, setSelectedCourse] = useState(null);

//     useEffect(() => {
//         axios.get('http://localhost:8080/courses')
//             .then(response => setCourses(response.data))
//             .catch(error => console.error('Error fetching courses:', error));
//     }, []);

//     const handleEnroll = (courseID) => {
//         setSelectedCourse(courseID);
//         console.log(`Enrolling in course ${courseID}`);
//     };

//     return (
//         <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
//             <Typography variant="h5" gutterBottom>
//                 Course List
//             </Typography>
//             <List>
//                 {courses.map(course => (
//                     <ListItem key={course.ID}>
//                         <ListItemText primary={course.CourseName} />
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={() => handleEnroll(course.ID)}
//                         >
//                             Enroll
//                         </Button>
//                     </ListItem>
//                 ))}
//             </List>
//             {selectedCourse && (
//                 <Enrollment userID={userID} courseID={courseID}/>
//             )}
//         </Paper>
//     );
// }

// export default CourseList;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, Button, Paper } from '@mui/material';
import Enrollment from './Enrollment';

function CourseList({userID}) {
  const [courses, setCourses] = useState([]);
  const [enrollmentInfo, setEnrollmentInfo] = useState({
    userID: null,
    courseID: null,
  });

  useEffect(() => {
    axios.get('http://localhost:8080/courses')
      .then(response => setCourses(response.data))
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  const handleEnroll = (courseID) => {
    console.log('Enrolling in course:', courseID);
    setEnrollmentInfo({
      userID: userID,
      courseID: courseID,
    });
  };

  return (
    <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
      <Typography variant="h5" gutterBottom>
        Course List
      </Typography>
      <List>
        {courses.map(course => (
          <ListItem key={course.ID}>
            <ListItemText primary={course.CourseName} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEnroll(course.ID)}
            >
              Enroll
            </Button>
          </ListItem>
        ))}
      </List>
      {enrollmentInfo.userID && enrollmentInfo.courseID && (
        <Enrollment userID={enrollmentInfo.userID} courseID={enrollmentInfo.courseID} />
      )}
    </Paper>
  );
}

export default CourseList;
