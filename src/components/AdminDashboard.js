import React from 'react';
import { useState, useEffect } from 'react';
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
    AppBar,
    Toolbar,
    Table,
    TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Select,
    MenuItem,

} from '@mui/material';
import AddStudentForm from './AddStudentForm';
import AddTeacherForm from './AddTeacherForm';
import AddAdminForm from './AddAdminForm';
import UpdateUserForm from './UpdateUserForm';
import AddCourse from './AddCourse';
import { toast } from 'react-toastify';
import DeleteCourse from './DeleteCourse';
import AssignCourseToTeacher from './AssignCourseToTeacher';


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
    const [showAllUsers, setShowAllUsers] = useState(false);
    const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedOption, setSelectedOption] = useState('');


  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
  
    // Reset state variables when changing options
    setShowAllUsers(false);
    setUpdateUser(null);
    setShowUpdateUserForm(false);
  
  
    // Set the selected option
    setSelectedOption(selectedValue);
  
    // Additional logic if needed based on the selected option
    switch (selectedValue) {
      case 'showAllUsers':
        setShowAllUsers(true);
        break;
      case 'updateUser':
        handleUpdateUserClick(user);
        break;
      case 'deleteUsers':
        handleDeleteUser();
        break;
      // Add cases for other options if needed
      default:
        break;
    }
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (showAllUsers) {
      fetchUsers();
    }
  }, [showAllUsers]);

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
        console.log("Fetching all users...");
        setShowAllUsers(true);
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
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Admin Dashboard
              </Typography>
              <Select value={selectedOption} onChange={handleOptionChange}>
            <MenuItem value="">Select Option</MenuItem>
            <MenuItem value="showAllUsers">Show All Users</MenuItem>
            <MenuItem value="updateUser">Update User</MenuItem>
            <MenuItem value="deleteUsers">Delete Users</MenuItem>
            <MenuItem value="addCourse">Add Course</MenuItem>
            <MenuItem value="assignCourse">Assign Course to Teacher</MenuItem>
          </Select>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
              <Button
                color="inherit"
                onClick={handleClick}
                aria-describedby={id}
              >
                Add User
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Paper sx={{ padding: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={handleAddStudent}
                    sx={{ marginBottom: 1 }}
                  >
                    Add Student
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={handleAddTeacher}
                    sx={{ marginBottom: 1 }}
                  >
                    Add Teacher
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={handleAddAdmin}
                  >
                    Add Admin
                  </Button>
                </Paper>
              </Popover>
            </Toolbar>
          </AppBar>
    
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
          
          {selectedOption === 'showAllUsers' && showAllUsers && (
      <div>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : users
              ).map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    )}


{selectedOption === 'updateUser' && (
  <div>
    {/* Render Update User information or trigger the update process */}
    {updatedUser && (
      <UpdateUserForm
        user={updatedUser}
        onUpdate={(updatedUser) => handleUpdateUser(updatedUser)}
        onCancel={() => setShowUpdateUserForm(false)}
      />
    )}
  </div>
)}


{selectedOption === 'deleteUsers' && (
  <div>
    {/* Render Delete Users information or trigger the delete process */}
    {showDeleteDialog && (
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
          <Button onClick={() => handleConfirmDelete(deleteUserEmail)} color="primary">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    )}
  </div>
)}

{selectedOption === 'addCourse' && (
  <div>
        <AddCourse />
        </div>
)}


{selectedOption === 'assignCourse' && (
  <div>
    <AssignCourseToTeacher />
    </div>
)}

<Typography variant="h4" gutterBottom>
      <b>Welcome admin!!</b>
    </Typography>
    </div>
    );
};

export default AdminDashboard;