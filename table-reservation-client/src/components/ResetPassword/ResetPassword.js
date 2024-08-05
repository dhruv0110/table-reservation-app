import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword(props) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [timer, setTimer] = useState(120); // Timer set to 120 seconds (2 minutes)
  const [isTimerActive, setIsTimerActive] = useState(true); // To handle timer activation
  const [alertShown, setAlertShown] = useState(false); // Flag to ensure alert is shown only once
  const navigate = useNavigate();

  useEffect(() => {
    if (isTimerActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);

      return () => clearInterval(interval); // Clear interval on component unmount or timer stop
    } else if (timer === 0 && !alertShown) {
      setIsTimerActive(false); // Stop the timer when it reaches 0
      props.showAlert('OTP expired. Please request a new one.', 'danger');
      setAlertShown(true); // Set the flag to true after showing the alert
    }
  }, [isTimerActive, timer, alertShown, props]);

  const handleResetPassword = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/users/reset-password', { email, otp, newPassword })
      .then(res => {
        if (res.data.message === 'Password reset successfully') {
          props.showAlert('Password changed successfully', 'success');
          navigate('/login');
        } else {
          props.showAlert(res.data.message, 'danger');
        }
      })
      .catch(err => {
        console.error(err);
        props.showAlert('Error resetting password', 'danger');
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{backgroundColor:"#cdcfd1"}}>
      <div className="bg-white p-3 rounded w-25">
        <h4>Reset Password</h4>
        <form onSubmit={handleResetPassword}>
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
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
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
              value={newPassword}
            />
          </div>
          <div className="mb-3">
            <p>Time Remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</p>
          </div>
          <button type="submit" className="btn btn-primary w-100 rounded-0" disabled={!isTimerActive}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
