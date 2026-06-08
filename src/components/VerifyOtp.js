import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyOTP = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (!storedEmail) {
      setError('Email not found. Please register again.');
    } else {
      setEmail(storedEmail);
    }
  }, []);

  const handleChange = (e) => {
    setOtp(e.target.value);
    setError('');
    setSuccessMessage('');
  };

  const validateOtp = () => {
    if (!otp) return 'OTP is required';
    if (!/^\d{6}$/.test(otp)) return 'OTP must be 6 digits';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateOtp();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsVerifying(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/verify-otp`,
        { otp, email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setSuccessMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError('Email is missing. Cannot resend OTP.');
      return;
    }

    setIsResending(true);
    setError('');
    setSuccessMessage('');

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/resend-otp`,
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setSuccessMessage('OTP has been resent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center text-primary mb-2">Enter OTP</h3>
        <p className="text-center text-muted mb-3">
          {email ? `We’ve sent a 6-digit OTP to ${email}` : 'Loading email...'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter OTP"
              maxLength="6"
            />
          </div>

          {error && <div className="alert alert-danger text-center py-1">{error}</div>}
          {successMessage && <div className="alert alert-success text-center py-1">{successMessage}</div>}

          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            onClick={handleResendOtp}
            className="btn btn-link p-0"
            disabled={isResending}
          >
            {isResending ? 'Resending OTP...' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
