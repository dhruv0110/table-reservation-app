import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Info = () => {
  const [userDetails, setUserDetails] = useState({ name: "", email: "", id: "" }); // State to hold the user's details
  let navigate = useNavigate();
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
      <h1>Personal Information</h1>
      {userDetails.name ? (
        <div className='my-4'>
          <p>User Name: {userDetails.name}</p>
          <p>User Email: {userDetails.email}</p>
          <p>User ID: {userDetails._id}</p>
          <p>User ID: {userDetails.role}</p>
        </div>
      ) : (
        <p>No user details available.</p>
      )}
    </div>
  );
};

export default Info;
