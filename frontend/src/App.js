import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import PDFViewer from './components/PDFViewer';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import axios from 'axios';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch username if authenticated
      const fetchUsername = async () => {
        const token = localStorage.getItem('token');
        try {
          const res = await axios.get('http://localhost:5000/api/auth/user', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUsername(res.data.username);
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      };
      fetchUsername();
    }
  }, [isAuthenticated]);

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} username={username} onLogout={handleLogout} />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/pdf/:id" element={<PDFViewer />} />
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
