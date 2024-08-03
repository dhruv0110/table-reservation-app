import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast from react-toastify

const Navbar = (props) => {
  let location = useLocation();
  let navigate = useNavigate();

  const [adminpanel, setAdminpanel] = useState("admin");
  const [userDetails, setUserDetails] = useState({ name: "", email: "", id: "" });

  const logOut = () => {
    localStorage.removeItem('token');
    setAdminpanel("");
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
        setUserDetails({ name: "", email: "", id: "" });
      }
    };

    getUserDetails();
  }, []);

  const handleAdminClick = () => {
    props.showAlert("Come to admin panel","success");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Navbar
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
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
            </ul>
            {localStorage.getItem("token") ? (
              <div className="d-flex align-items-center" style={{display:'flex'}}>
                {userDetails.role === 'admin' && 
                  <Link 
                    className="btn" 
                    role="button" 
                    to="/admin" 
                    style={{marginRight: "10px", color:"white", backgroundColor:"#373838", border:"1px solid #c4c2c2"}}
                    onClick={handleAdminClick} // Add onClick handler for the admin button
                  >
                    {adminpanel}
                  </Link>
                }
                <button className="btn btn-primary" onClick={logOut}>
                  Logout
                </button>
                {(localStorage.getItem('token')) ? 
                  <Link className="nav-link mx-4" style={{color:'white',fontSize:'20px'}} to="/info">
                    <i className="fa-solid fa-user"></i>
                  </Link> 
                  : ""}
              </div>
            ) : (
              <form className="d-flex" role="search">
                <Link className="btn btn-primary" to="/login" role="button">
                  Login
                </Link>
                <Link
                  className="btn btn-primary mx-2"
                  to="/signup"
                  role="button"
                >   
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
