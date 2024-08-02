import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [otp, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/reset-password', { otp, newPassword });
      if (response.data.message === 'Password updated successfully') {
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h4>Reset Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="otp">
              <strong>OTP</strong>
            </label>
            <input
              type="text"
              placeholder="Enter OTP"
              autoComplete="off"
              name="otp"
              className="form-control rounded-0"
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="newPassword">
              <strong>New Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter New Password"
              autoComplete="off"
              name="newPassword"
              className="form-control rounded-0"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
