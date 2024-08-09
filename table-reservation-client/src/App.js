import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserPanel from './components/UserPanel/UserPanel';
import Login from './components/LoginSignup/Login';
import Alert from './components/Alert/Alert';
import Navbar from './components/Navbar/Navbar';
import Info from './components/Info/Info';
import Signup from './components/LoginSignup/signup';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Admin from './components/Sidebar/Admin';
import TableShow from './components/TableShow/TableShow';
import Add from './components/Add/Add';
import List from './components/List/List';
import TableComponent from './components/TableComponent/TableComponent';

function PrivateRoute({ element, ...rest }) {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
}

function AdminRoute({ element, ...rest }) {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  return userDetails?.role === 'admin' ? element : <Navigate to="/" />;
}

function App() {
  const [alert, setAlert] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 1500);
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const response = await fetch("http://localhost:5000/api/users/getuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message);
      return null;
    }
  };

  useEffect(() => {
    const getUserDetails = async () => {
      const userData = await fetchUserDetails();
      setUserDetails(userData);
      localStorage.setItem("userDetails", JSON.stringify(userData));
      setLoading(false);

      if (!userData && localStorage.getItem("token")) {
        localStorage.removeItem("token");
      }
    };

    getUserDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar showAlert={showAlert} userDetails={userDetails} />
      <Alert alert={alert} />
      <Routes>
        <Route path="/" element={<UserPanel showAlert={showAlert} />} />
        <Route path="/login" element={<Login showAlert={showAlert} />} />
        <Route path="/signup" element={<Signup showAlert={showAlert} />} />
        <Route path="/info" element={<PrivateRoute element={<Info showAlert={showAlert} />} />} />
        <Route path="/forgot-password" element={<ForgotPassword showAlert={showAlert} />} />
        <Route path="/reset-password" element={<ResetPassword showAlert={showAlert} />} />
        <Route path="/table-reserve" element={localStorage.getItem("token") ? <TableComponent showAlert={showAlert} /> : <Navigate to="/login" />} />
        <Route path="/admin" element={<AdminRoute element={<Admin showAlert={showAlert} />} />} />
        <Route path="/admin/table" element={<AdminRoute element={<TableShow showAlert={showAlert} />} />} />
        <Route path="/list" element={<AdminRoute element={<List showAlert={showAlert} />} />} />
        <Route path="/admin/add" element={<AdminRoute element={<Add showAlert={showAlert} />} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
