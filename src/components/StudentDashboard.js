// src/components/StudentDashboard.js
import React, { useState, useEffect } from 'react';

import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControl,
  FormLabel,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentDashboard = ({ user ,handleLogout}) => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [marks, setMarks] = useState([]);

  const [overallCGPA, setOverallCGPA] = useState(null);

  const [formData, setFormData] = useState({
    user_id: user.id,
    student_name: '',
    address: '',
    age: '',
  });

  const getToken = () => {
    return localStorage.getItem('jwtToken');
  };

  const token = getToken();
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/students/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const details = await response.json();
          setStudentDetails(details);
        } else {
          console.error('Failed to fetch student details');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchMarks = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${user.id}/enrollments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const marksData = await response.json();
          const marksArray = Array.isArray(marksData) ? marksData : [];
          setMarks(marksArray);
          // setMarks(marksData);
        } else {
          console.error('Failed to fetch marks');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchStudentDetails();
    fetchMarks();
  }, [user.id]);


  const calculateOverallCGPA = () => {
    const totalMarks = marks.reduce((acc, enrollment) => acc + (enrollment.marks || 0), 0);
    const totalSubjects = marks.length;

    const cgpa = totalMarks / totalSubjects;

    setOverallCGPA(cgpa);
  };


  useEffect(() => {
    // Fetch the list of courses
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3000/courses', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        } else {
          console.error('Failed to fetch courses');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
  
      console.log('Enrollment Payload:', JSON.stringify({ enrollment: { user_id: user.id, course_id: courseId ,marks:null} }));

      const response = await fetch('http://localhost:3000/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ enrollment: { user_id: user.id,course_id: courseId ,marks:null}, }),
      });

      if (response.ok) {
        toast.success('Enrollment successful');
        console.log('Enrollment successful');
        // Fetch updated list of enrolled courses
        const enrolledResponse = await fetch(`http://localhost:3000/users/${user.id}/enrolled_courses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (enrolledResponse.ok) {
          const enrolledData = await enrolledResponse.json();
          //if the received data is an array
          const enrolledArray = Array.isArray(enrolledData) ? enrolledData : [enrolledData];
          setEnrolledCourses(enrolledArray);
        } 
        else {
          toast.success("Failed to fetch enrolled courses");
          console.error('Failed to fetch enrolled courses');
        }
      }
      else if (response.status === 422){
        const errorData = await response.json();
        console.error('Enrollment failed: ',errorData.error);
        alert(errorData.error);
      }  else {
        console.error('Failed to enroll in the course');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/student-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Students details submitted successfully');
        console.log('Students details submitted successfully');
        setShowStudentDetails(true);
        // Fetch updated student details
        const studentResponse = await fetch(`http://localhost:3000/students/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (studentResponse.ok) {
          const details = await studentResponse.json();
          setStudentDetails(details);
        } else {
          console.error('Failed to fetch updated student details');
        }
      } else {
        console.error('Failed to submit student details');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  // const handleSeeDetails = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/students/${user.id}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       },
  //     });

  //     if (response.ok) {
  //       const studentDetails = await response.json();
  //       console.log('Student Details:', studentDetails);
  //     } else {
  //       console.error('Failed to fetch student details');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  const handleSeeMarks = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}/enrollments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const marksData = await response.json();
        console.log('Marks Data:', marksData);
        const marksArray = Array.isArray(marksData) ? marksData : [marksData];
        setMarks(marksArray);
      } else {
        console.error('Failed to fetch marks');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const [selectedSubjectId, setSelectedSubjectId] = useState(null);


  const logoutHandle = () => {
    handleLogout();
  };


  const renderContent = () => {
    if (studentDetails) {
      return (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Your Details:</Typography>
            <List>
              <ListItem>
                <ListItemText primary={`Student Name: ${studentDetails.student_name}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Address: ${studentDetails.address}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Age: ${studentDetails.age}`} />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <Card>
          <CardContent>
            {/* Form for student details */}
            <form onSubmit={handleFormSubmit}>
              <FormControl>
                <FormLabel>Student Name:</FormLabel>
                <TextField
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </FormControl>
              <FormControl>
                <FormLabel>Address:</FormLabel>
                <TextField
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </FormControl>
              <FormControl>
                <FormLabel>Age:</FormLabel>
                <TextField
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </FormControl>
              <Grid item xs={1}>
              <Button type="submit" variant="contained" color='secondary' fullWidth>
                Submit Details
              </Button>
              </Grid>
            </form>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom align="center">
          <b>Welcome, {user.email} (Student)!</b>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        {renderContent()}
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained" onClick={handleSeeMarks} fullWidth>
          Your Subjects
        </Button>
      </Grid>

      <Grid item xs={12}>
        <List>
          {marks.map((enrollment) => (
            <ListItem key={enrollment.id}>
              <ListItemText primary={`Course: ${enrollment.course.course_name}`} />
              {selectedSubjectId === enrollment.course.id ? (
                <Button
                  variant="outlined"
                  onClick={() => setSelectedSubjectId(null)}
                >
                  Hide Marks
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => setSelectedSubjectId(enrollment.course.id)}
                >
                  Show Marks
                </Button>
              )}
              {selectedSubjectId === enrollment.course.id && (
                <ListItemText secondary={`Marks: ${enrollment.marks || 'Not assigned'}`} />
              )}
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained" onClick={calculateOverallCGPA} fullWidth>
          Overall percentage
        </Button>
      </Grid>
      {overallCGPA !== null && (
        <Grid item xs={12}>
          <Typography variant="inherit" gutterBottom>Your Overall %:</Typography>
          <Typography>{overallCGPA.toFixed(2)}</Typography>
        </Grid>
      )}


      {/* Available courses list */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Available Courses:</Typography>
        <List>
          {courses.map((course) => (
            <ListItem key={course.id}>
              <ListItemText primary={course.course_name} secondary={`Teacher: ${course.teacher.teacher_name}`} />
              <Button
                variant="contained"
                onClick={() => handleEnroll(course.id)}>
                Enroll
              </Button>
            </ListItem>
          ))}
        </List>
      </Grid>

      <Grid item xs={1}>
        <Button variant="outlined"
            color="inherit" onClick={logoutHandle} >
          Logout
        </Button>
      </Grid>
    </Grid>
  );
};

export default StudentDashboard;

// // src/components/StudentDashboard.js
// import React, { useState, useEffect } from 'react';
// import {
//   Grid,
//   Typography,
//   Button,
// } from '@mui/material';

// import StudentDetails from './StudentDashboard/StudentDetails';
// import StudentForm from './StudentDashboard/StudentForm';
// import MarksList from './StudentDashboard/MarksList';
// import AvailableCourses from './StudentDashboard/AvailableCourses';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const StudentDashboard = ({ user, handleLogout }) => {
//   // ... (existing state variables and functions)

//   const [courses, setCourses] = useState([]);
//     const [enrolledCourses, setEnrolledCourses] = useState([]);
//     const [studentDetails, setStudentDetails] = useState(null);
//     const [showStudentDetails, setShowStudentDetails] = useState(false);
//     const [marks, setMarks] = useState([]);
  
//     const [overallCGPA, setOverallCGPA] = useState(null);
  
//     const [formData, setFormData] = useState({
//       user_id: user.id,
//       student_name: '',
//       address: '',
//       age: '',
//     });

//       const getToken = () => {
//     return localStorage.getItem('jwtToken');
//   };

//   const token = getToken();
//   useEffect(() => {
//     const fetchStudentDetails = async () => {
//       try {
//         // const token = getToken();
//         const response = await fetch(`http://localhost:3000/students/${user.id}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const details = await response.json();
//           setStudentDetails(details);
//         } else {
//           toast.error('Failed to fetch student details');
//           console.error('Failed to fetch student details');
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };

//     const fetchMarks = async () => {
//       try {
//         const response = await fetch(`http://localhost:3000/users/${user.id}/enrollments`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });
  
//         if (response.ok) {
//           const marksData = await response.json();
//           const marksArray = Array.isArray(marksData) ? marksData : [];
//           setMarks(marksArray);
//         } else {
//           console.error('Failed to fetch marks');
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };

//     fetchStudentDetails();
//     fetchMarks();
//   }, [user.id]);


//   const calculateOverallCGPA = () => {
//     const totalMarks = marks.reduce((acc, enrollment) => acc + (enrollment.marks || 0), 0);
//     const totalSubjects = marks.length;

//     const cgpa = totalMarks / totalSubjects;

//     setOverallCGPA(cgpa);
//   };


//   useEffect(() => {
//     // Fetch the list of courses
//     const fetchCourses = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/courses', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             // Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setCourses(data);
//         } else {
//           console.error('Failed to fetch courses');
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };

//     fetchCourses();
//   }, []);

//   const handleEnroll = async (courseId) => {
//     try {
  
//       console.log('Enrollment Payload:', JSON.stringify({ enrollment: { user_id: user.id, course_id: courseId ,marks:null} }));

//       const response = await fetch('http://localhost:3000/enrollments', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ enrollment: { user_id: user.id,course_id: courseId ,marks:null}, }),
//       });

//       if (response.ok) {
//         toast.success('Enrollment successful');
//         console.log('Enrollment successful');
//         const enrolledResponse = await fetch(`http://localhost:3000/users/${user.id}/enrolled_courses`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (enrolledResponse.ok) {
//           const enrolledData = await enrolledResponse.json();
//           //if the received data is an array
//           const enrolledArray = Array.isArray(enrolledData) ? enrolledData : [enrolledData];
//           setEnrolledCourses(enrolledArray);
//         } 
//         else {
//           toast.error("Failed to fetch enrolled courses");
//           console.error('Failed to fetch enrolled courses');
//         }
//       }
//       else if (response.status === 422){
//         const errorData = await response.json();
//         toast.error('Enrollment failed: ',errorData.error);
//         // console.error('Enrollment failed: ',errorData.error);
//         alert(errorData.error);
//       }  else {
//         console.error('Failed to enroll in the course');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('http://localhost:3000/student-details', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         toast.success('Students details submitted successfully');
//         // console.log('Students details submitted successfully');
//         // Update state to show student details
//         setShowStudentDetails(true);
//         // Fetch updated student details
//         const studentResponse = await fetch(`http://localhost:3000/students/${user.id}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });

//         if (studentResponse.ok) {
//           const details = await studentResponse.json();
//           setStudentDetails(details);
//         } else {
//           console.error('Failed to fetch updated student details');
//         }
//       } else {
//         console.error('Failed to submit student details');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };


//   const handleSeeDetails = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/students/${user.id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       if (response.ok) {
//         const studentDetails = await response.json();
//         console.log('Student Details:', studentDetails);
//       } else {
//         console.error('Failed to fetch student details');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const handleSeeMarks = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/users/${user.id}/enrollments`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
  
//       if (response.ok) {
//         const marksData = await response.json();
//         console.log('Marks Data:', marksData);
//         const marksArray = Array.isArray(marksData) ? marksData : [marksData];
//         setMarks(marksArray);
//       } else {
//         console.error('Failed to fetch marks');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const [selectedSubjectId, setSelectedSubjectId] = useState(null);

//   const logoutHandle = () => {
//     handleLogout();
//   };

//   const renderContent = () => {
//     if (studentDetails) {
//       return <StudentDetails studentDetails={studentDetails} />;
//     } else {
//       return <StudentForm formData={formData} handleInputChange={handleInputChange} handleFormSubmit={handleFormSubmit} />;
//     }
//   };

//   return (
//     <Grid container spacing={2}>
//       <Grid item xs={12}>
//         <Typography variant="h5" gutterBottom align="center">
//           <b>Welcome, {user.email} (Student)!</b>
//         </Typography>
//       </Grid>

//       <Grid item xs={12}>
//         {renderContent()}
//       </Grid>

//       <Grid item xs={1}>
//         <Button variant="contained" onClick={handleSeeMarks} fullWidth>
//           Your Subjects
//         </Button>
//       </Grid>

//       <Grid item xs={12}>
//         <MarksList marks={marks} handleSeeMarks={handleSeeMarks} selectedSubjectId={selectedSubjectId} />
//       </Grid>

//       <Grid item xs={1}>
//         <Button variant="contained" onClick={calculateOverallCGPA} fullWidth>
//           Overall percentage
//         </Button>
//       </Grid>

//       {overallCGPA !== null && (
//         <Grid item xs={12}>
//           <Typography variant="h6" gutterBottom>Your Overall %:</Typography>
//           <Typography>{overallCGPA.toFixed(2)}</Typography>
//         </Grid>
//       )}

//       <Grid item xs={12}>
//         <AvailableCourses courses={courses} handleEnroll={handleEnroll} />
//       </Grid>

//       <Grid item xs={1}>
//         <Button variant="contained" onClick={logoutHandle} fullWidth>
//           Logout
//         </Button>
//       </Grid>
//       <ToastContainer autoClose={4000} />
//     </Grid>
//   );
// };

// export default StudentDashboard;
