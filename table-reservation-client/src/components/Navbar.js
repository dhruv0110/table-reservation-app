import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate,useLocation } from 'react-router-dom';

const Navbar = () => {
  let location = useLocation();
  let navigate = useNavigate();

  const[adminpanel,setAdminpanel] = useState("admin");
  const logOut = () => {
    localStorage.removeItem('token');
    setAdminpanel("");
    // setUserName("");
    navigate("/login");
  };
  const [userDetails, setUserDetails] = useState({ name: "", email: "", id: "" }); // State to hold the user's details
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return null; // Return null if token is not available
      }
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
      if(localStorage.getItem("token")){
        setUserDetails(userData);
      }else{
        navigate("/login");
      }
       // eslint-disable-next-line
      if (userData) {
        setUserDetails(userData); // Set userDetails to the fetched user's details
      } else {
        setUserDetails({ name: "", email: "", id: "" }); // Reset userDetails if fetch fails
      }
    };

    getUserDetails();
  }, []);

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
                {userDetails.role === 'admin'? <Link className="btn" role="button" to="/admin" style={{marginRight: "10px",color:"white",backgroundColor:"#373838",border:"1px solid #c4c2c2"}}>{adminpanel}</Link>:""}
                <button className="btn btn-primary" onClick={logOut}>
                  Logout
                </button>
                {(localStorage.getItem('token'))?<Link className="nav-link mx-4" style={{color:'white',fontSize:'20px'}} to="/info"><i className="fa-solid fa-user"></i></Link>:""}
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
