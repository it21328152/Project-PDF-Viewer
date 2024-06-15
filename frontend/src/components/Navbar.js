import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

//test 1

const Navbar = ({ isAuthenticated, username, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <b>PDF Viewer</b>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Typography variant="body1" sx={{ marginRight: 2 }}>
                <b>User: {username}</b>
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Sign In
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
