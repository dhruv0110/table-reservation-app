import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from "../../assets/logo.svg"

const Navbar = (props) => {
  let location = useLocation();
  let navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ name: "", email: "", id: "", role: "" });

  const logOut = () => {
    localStorage.removeItem('token');
    props.showAlert("Logout Successfully", "success");
    navigate("/login");
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return null;
      }
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

  const handleAdminClick = () => {
    props.showAlert("Come to admin panel", "success");
  };

  useEffect(() => {
    const getUserDetails = async () => {
      const userData = await fetchUserDetails();
      if (localStorage.getItem("token")) {
        setUserDetails(userData);
      } else {
        navigate("/login");
      }
      if (userData) {
        setUserDetails(userData);
      } else {
        setUserDetails({ name: "", email: "", id: "", role: "" });
      }
    };

    getUserDetails();
  }, [localStorage.getItem("token")]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container navbar-container">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="Logo" className="navbar-logo" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link">Menu</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link">Recipe</Link>
              </li>
            </ul>
            {localStorage.getItem("token") ? (
              <div className="right-box d-flex align-items-center mt-2">
                {userDetails.role === 'admin' && 
                <>
                  <Link 
                    className="btn admin-btn" 
                    role="button" 
                    to="/admin" 
                    onClick={handleAdminClick} // Add onClick handler for the admin button
                  >
                    Admin
                  </Link>
                </>
                }
                <Link to="/table-reserve">
                    <button className="btn order-btn" type="button">Reserve now</button>
                  </Link>
                <button className="btn logout-btn" onClick={logOut}>
                  Logout
                </button>
                {localStorage.getItem('token') && 
                  <Link className="nav-link mx-2 user-icon" to="/info">
                    <i className="fa-solid fa-user"></i>
                  </Link>
                }
              </div>
            ) : (
              <form className="d-flex" role="search">
                <Link className="btn auth-btn" to="/login" role="button">
                  Login
                </Link>
                <Link className="btn auth-btn mx-2" to="/signup" role="button">
                  Signup
                </Link>
              </form>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
