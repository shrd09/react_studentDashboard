import React from 'react';
import { useState } from 'react';
import {
    Typography,
    Button,
    Grid,
    Popover,
    Paper,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import AddStudentForm from './AddStudentForm';
import AddTeacherForm from './AddTeacherForm';
import AddAdminForm from './AddAdminForm';
import AddCourses from './AddCourses';
import UpdateUserForm from './UpdateUserForm';
import { toast } from 'react-toastify';

const AdminDashboard = ({ user, handleLogout }) =>{
    const [anchorEl, setAnchorEl] = useState(null);
    const [showAddStudentForm, setShowAddStudentForm] = useState(false);
    const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
    const [showAddAdminForm, setShowAddAdminForm] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteUserEmail, setDeleteUserEmail] = useState('');
    const [users,setUsers] = useState([]);
    const [updatedUser, setUpdateUser] = useState(null);
    const [showUpdateUserForm, setShowUpdateUserForm] = useState(false);

    const open = Boolean(anchorEl);
    const id = open ? 'add-menu-popover' : undefined;

    const handleAddStudent = (data) => {
        console.log('Adding student:', data);
        setShowAddStudentForm(true);
        setAnchorEl(null);
      };
    
      const handleAddTeacher = (data) => {
        // Perform to add teacher using data
        console.log('Adding teacher:', data);
        setShowAddTeacherForm(true);
        setAnchorEl(null);
      };
    
      const handleAddAdmin = (data) => {
        // Perform to add admin using data
        console.log('Adding Admin:', data);
        setShowAddAdminForm(true);
        setAnchorEl(null);
      };

      const handleUpdateUserClick = (user) => {
        setUpdateUser(user);
        setShowUpdateUserForm(true);
      };

      const handleUpdateUser = async (user) => {
        try {
          // Construct the update payload based on your server's expectations
          const updatePayload = {
            email: user.email,
            password: user.password,
            role: user.role,
          };
      
          const response = await fetch(`http://localhost:3000/users/${user.email}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${getToken()}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatePayload),
          });
      
          if (response.ok) {
            console.log(`User with email ${user.email} updated successfully`);
            toast.success(`User with email ${user.email} updated successfully`);
            fetchUsers();
          } else {
            console.error(`Failed to update user with email ${user.email}`);
            toast.error(`Failed to update user with email ${user.email}`);
          }
        } catch (error) {
          console.error('Error updating user:', error);
        } finally {
          setUpdateUser(null);
          setShowUpdateUserForm(false);
        }
      };

      
      const handleClose = () => {
        setAnchorEl(null);
      };
    
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };

      const handleCancel = () => {
        setShowAddStudentForm(false);
        setShowAddTeacherForm(false);
        setShowAddAdminForm(false);
      };

      const getToken = () => {
        return localStorage.getItem('jwtToken');
      };

      const handleShowAllUsers = () => {
        fetchUsers();
      };

      const handleDeleteUser = () => {
        setShowDeleteDialog(true);
      };
    
      const handleConfirmDelete = (email) => {
        deleteUser(email);
        setDeleteUserEmail('')
        setShowDeleteDialog(false);
      };
    
      const handleCancelDelete = () => {
        setShowDeleteDialog(false);
      };
    

      const fetchUsers = async () => {
        try{
            const response = await fetch('http://localhost:3000/users/all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok){
                const users = await response.json();
                setUsers(users);
                console.log('Users:', users);
            }
            else{
                console.error('Failed to fetch users');
            }
        }
        catch(error){
            console.error('Error fetching users:',error);
        }
      };


      const deleteUser = async (email) => {
        try{
            console.log("Email of the user 1",email);
            const response = await fetch(`http://localhost:3000/users/${email}`,{
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok){
                console.log("email of user", deleteUserEmail);
                console.log(`User with email ${email} deleted successfully`);
                toast.success(`User with email ${email} deleted successfully`)
                fetchUsers();
            }
            else{
                console.error('Failed to delete user with email ${email}');
                toast.error(`Failed to delete user with email ${email}`)
            }
        }
        catch(error){
            console.error('Error deleting users:',error);
        }
      };


    return (
        <div>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom align="center">
          Welcome, Admin!
        </Typography>
      </Grid>
      <br />
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Button
          aria-describedby={id}
          variant="contained"
          color="inherit"
          onClick={handleClick}
        >
          Add
        </Button>
      </Grid>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Paper>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={handleAddStudent}
          >
            Add Student
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={handleAddTeacher}
          >
            Add Teacher
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={handleAddAdmin}
          >
            Add Admin
          </Button>
        </Paper>
        <AddCourses fetchTeachers={fetchUsers} />
      </Popover>
      <br />
      <br />
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        
      </Grid>

      {(showAddStudentForm || showAddTeacherForm || showAddAdminForm) && (
            <Dialog open={showAddStudentForm || showAddTeacherForm || showAddAdminForm} onClose={() => handleCancel()}>
              <DialogTitle>Add {showAddStudentForm ? 'Student' : showAddTeacherForm ? 'Teacher' : 'Admin' }</DialogTitle>
              <DialogContent>
                {showAddStudentForm && <AddStudentForm onSubmit={handleAddStudent} />}
                {showAddTeacherForm && <AddTeacherForm onSubmit={handleAddTeacher} />}
                {showAddAdminForm && <AddAdminForm onSubmit={handleAddAdmin} />}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleCancel()} color="secondary">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          )}

          <Button
        variant="outlined"
        color="inherit"
        onClick={handleShowAllUsers}
      >
        Show All Users
      </Button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <b>Email:</b> <i>{user.email}</i> - <b>Role:</b> <i>{user.role}</i>{' '}
          </li>
        ))}
      </ul>
      <Button
        variant="outlined"
        color="inherit"
        onClick={() => handleUpdateUserClick(user)}
      >
        Update
      </Button>
      <br/>
      <br/>
      {showUpdateUserForm && updatedUser && (
        <UpdateUserForm
          user={updatedUser}
          onUpdate={(updatedUser) => handleUpdateUser(updatedUser)}
          onCancel={() => setShowUpdateUserForm(false)}
        />
      )}

<Button variant="outlined" color="inherit" onClick={handleDeleteUser}>
        Delete Users
      </Button>
    <Dialog open={showDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>Enter the email of the user you want to delete:</Typography>
          <input
            type="email"
            value={deleteUserEmail}
            onChange={(e) => setDeleteUserEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="secondary">
            Cancel
          </Button>
          <Button onClick={()=>handleConfirmDelete(deleteUserEmail)} color="primary">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Grid item xs={1}>
      <br/>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Grid>
    </div>
    );
};

export default AdminDashboard;