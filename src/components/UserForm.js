// src/components/UserForm.js

import React, { useState } from 'react';
import axios from 'axios';

const UserForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');


const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/v1/users', {
        user: { email, password, role },
      });

      console.log('User created successfully:', response.data)
      setEmail("");
      setPassword("");
      setRole("");
      
    } catch (error) {
      console.error('Error creating user:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <label>
        Role:
        <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default UserForm;

// src/components/UserForm.js

// import React, { useState } from 'react';
// import axios from 'axios';

// const UserForm = ({ onSubmit }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('student');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Perform login and get user details
//       const response = await axios.post('http://localhost:3000/api/v1/login', {
//         // user: { email: 'admin@email.com', password: '123456' },
//         user: { email, password, role },
//       });

//       // Assuming the login response includes user details
//       const user = response.data;

//       // Pass the user details to the parent component
//       onSubmit(user);
//     } catch (error) {
//       console.error('Error logging in:', error.response ? error.response.data : error.message);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <label>
//         Email:
//         <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
//       </label>
//       <br />
//       <label>
//         Password:
//         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//       </label>
//       <br />
//       <label>
//         Role:
//         <select value={role} onChange={(e) => setRole(e.target.value)}>
//           <option value="student">Student</option>
//           <option value="teacher">Teacher</option>
//           <option value="admin">Admin</option>
//         </select>
//       </label>
//       <br />
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default UserForm;
