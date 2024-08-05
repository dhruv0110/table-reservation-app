import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserPanel from './components/UserPanel/UserPanel';
// import AdminPanel from './components/TableShow';
import Login from './components/LoginSignup/Login';
import Alert from './components/Alert/Alert';
import Navbar from './components/Navbar/Navbar';
import Info from './components/Info/Info';
import Signup from './components/LoginSignup/signup';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Admin from './components/Sidebar/Admin';
import TableShow from './components/TableShow/TableShow';
// import List from './components/List';
import Add from './components/Add/Add';
import List from './components/List/List';


function App() {
  const [alert, setAlert] = useState(null);
  const [userDetails, setUserDetails] = useState(null); // Store user details here
  const [loading, setLoading] = useState(true); // Add loading state

  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null; // Return null if token is not available

      const response = await fetch("http://localhost:5000/api/users/getuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (response.ok) {
        return await response.json(); // Return the fetched user's details
      } else {
        return null; // Return null if fetch fails
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      return null; // Return null if an error occurs
    }
  };

  useEffect(() => {
    const getUserDetails = async () => {
      const userData = await fetchUserDetails();
      setUserDetails(userData);
      setLoading(false); // Set loading to false after fetching data
      if (!userData && localStorage.getItem("token")) {
        localStorage.removeItem("token");
      }
    };

    getUserDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while fetching data
  }

  return (
    <Router>
      <Navbar showAlert={showAlert}/>
      <Alert alert={alert} />
      <Routes>
        <Route path="/login" element={<Login showAlert={showAlert} />} />
        <Route path="/signup" element={<Signup showAlert={showAlert} />} />
        <Route path="/" element={<UserPanel showAlert={showAlert}/>} />
        <Route path="/info" element={<Info showAlert={showAlert} />} />
        <Route path="/forgot-password" element={<ForgotPassword showAlert={showAlert} />}></Route>
        <Route path="/reset-password" element={<ResetPassword showAlert={showAlert} />} />
        {userDetails?.role === 'admin' && (
          <>          
        <Route path="/admin" element={<Admin showAlert={showAlert} />} />
        <Route path="/admin/table" element={<TableShow showAlert={showAlert} />} />
        <Route path="/list" element={<List showAlert={showAlert} />} />
        <Route path="/admin/add" element={<Add showAlert={showAlert} />} />
        </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
          
      </Routes>
    </Router>
  );
}

export default App;
