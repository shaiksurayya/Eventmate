
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useOwnerAuth } from '../Context/OwnerAuthContext';

const OwnerEmailOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginOwner } = useOwnerAuth();
  const email = location.state?.email;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(
  'https://eventmate-production-b589.up.railway.app/api/auth/verify-otp-owner',
  {
    email,
    password: otp // backend expects OTP in password
  }
);

      alert(response.data);
      loginOwner('dummy-owner-token'); // Ideally replace with backend JWT token
      setLoading(false);
      navigate('/owner/manage-halls'); // redirect to owner dashboard
    } catch (err) {
      setError(err.response?.data || 'OTP verification failed');
      setLoading(false);
    }
  };

  // --- Inline Styling ---
  const containerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    backgroundColor: '#f7f7f7',
    padding: '20px',
  };
  const formWrapperStyles = {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center',
  };
  const headingStyles = { marginBottom: '15px', fontSize: '28px', color: '#333' };
  const subtextStyles = { marginBottom: '30px', fontSize: '16px', color: '#666', wordBreak: 'break-word' };
  const inputStyles = {
    width: '100%',
    padding: '12px',
    marginBottom: '25px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '20px',
    textAlign: 'center',
    letterSpacing: '5px',
    boxSizing: 'border-box',
  };
  const buttonStyles = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#5f593cff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };
  const disabledButtonStyles = { ...buttonStyles, backgroundColor: '#cccccc', cursor: 'not-allowed' };
  const errorTextStyles = { color: '#d9534f', marginBottom: '15px', marginTop: '-10px' };

  return (
    <div style={containerStyles}>
      <form style={formWrapperStyles} onSubmit={handleVerifyOtp}>
        <h2 style={headingStyles}>Verify OTP</h2>
        <p style={subtextStyles}>OTP sent to <strong>{email}</strong></p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          style={inputStyles}
          required
        />
        {error && <div style={errorTextStyles}>{error}</div>}

        <button type="submit" style={loading ? disabledButtonStyles : buttonStyles} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
};

export default OwnerEmailOtp;
























// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useOwnerAuth } from '../Context/OwnerAuthContext';
// import './AuthForm.css';

// const OwnerEmailOtp = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { loginOwner } = useOwnerAuth();
//   const email = location.state?.email;

//   const [otp, setOtp] = useState('');

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:8080/api/auth/verify-otp-owner', {
//         email,
//         password: otp // backend expects OTP in password
//       });

//       alert(response.data);
//       loginOwner('dummy-owner-token'); // Ideally replace with backend JWT token
//       navigate('/owner-dashboard'); // redirect to owner dashboard
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data || 'OTP verification failed');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={handleVerifyOtp}>
//         <h2>Verify OTP</h2>
//         <p>OTP sent to <strong>{email}</strong></p>
//         <input
//           type="text"
//           placeholder="Enter OTP"
//           value={otp}
//           onChange={e => setOtp(e.target.value)}
//           required
//         />
//         <button type="submit" className="auth-button">Verify OTP</button>
//       </form>
//     </div>
//   );
// };

// export default OwnerEmailOtp;
