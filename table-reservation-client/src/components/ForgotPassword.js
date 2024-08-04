import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword(props) {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      props.showAlert('Please enter your email', 'error');
      return;
    }

    // Show loading alert
    props.showAlert('Sending OTP...', 'info');

    try {
      const response = await axios.post('http://localhost:5000/api/users/forgot-password', { email });

      if (response.data.message === 'OTP sent successfully') {
        // Clear the loading alert
        props.showAlert(null, null); // Clear any existing alert

        // Show success alert
        props.showAlert('OTP sent successfully', 'success');

        // Delay navigation to ensure the success alert is visible
        setTimeout(() => {
          navigate('/reset-password');
        }, 1500); // Adjust delay as needed
      } else {
        // Clear the loading alert
        props.showAlert(null, null); // Clear any existing alert

        // Show error message
        props.showAlert(response.data.message, 'error');
      }
    } catch (error) {
      console.error(error);
      // Clear the loading alert
      props.showAlert(null, null); // Clear any existing alert

      // Show server error message
      props.showAlert('Server error', 'error');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#cdcfd1" }}>
      <div className="bg-white p-3 rounded w-25">
        <h4>Forgot Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
