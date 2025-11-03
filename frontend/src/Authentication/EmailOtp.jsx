import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext'; // Make sure this path is correct

// --- Styles ---
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
const headingStyles = {
    marginBottom: '15px',
    fontSize: '28px',
    color: '#333',
};
const subtextStyles = {
    marginBottom: '30px',
    fontSize: '16px',
    color: '#666',
    wordBreak: 'break-word',
};
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
const disabledButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
};
const errorTextStyles = {
    color: '#d9534f',
    marginBottom: '15px',
    marginTop: '-10px',
};

// --- Component Code ---
function EmailOtp() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Use optional chaining to safely access email
    const email = location.state?.email;

    // CRITICAL FIX: The condition is now placed INSIDE the useEffect hook.
    useEffect(() => {
        if (!email) {
            // If no email is passed in the state, redirect to the login page.
            navigate('/login');
        }
    }, [email, navigate]);

    const handleVerifySubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(''); // Clear previous errors on a new submission

        try {
            const response = await axios.post('http://localhost:8080/api/auth/verify-otp', { email, otp });
            const apiToken = response.data.token;

            if (apiToken) {
                login(apiToken); // Save token to context and localStorage
                alert("Account verified successfully!"); // This can be replaced with a more modern notification
                navigate('/FindHall'); // Redirect to the next page
            } else {
                setError("Verification failed: Token not received from server.");
            }
        } catch (err) {
            console.error('Verification failed:', err);
            // Get the most specific error message from the server response
            const errorMessage = err.response?.data?.message || err.response?.data || 'Invalid OTP or a server error occurred.';
            setError(errorMessage);
        } finally {
            // This block runs whether the try succeeds or fails
            setLoading(false);
        }
    };

    // If there's no email, render nothing while useEffect redirects
    if (!email) {
        return null;
    }

    return (
        <div style={containerStyles}>
            <div style={formWrapperStyles}>
                <h1 style={headingStyles}>Verify Your Account</h1>
                <p style={subtextStyles}>
                    An OTP has been sent to <strong>{email}</strong>. Please enter it below.
                </p>
                <form onSubmit={handleVerifySubmit}>
                    <input
                        style={inputStyles}
                        type="text"
                        placeholder="_ _ _ _ _ _"
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />

                    {/*  IMPROVEMENT: Display error message directly in the UI */}
                    {error && <p style={errorTextStyles}>{error}</p>}

                    <button
                        type="submit"
                        style={loading ? disabledButtonStyles : buttonStyles}
                        disabled={loading}
                    >
                        {/*  IMPROVEMENT: Show a loading state to the user */}
                        {loading ? 'Verifying...' : 'Verify Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EmailOtp;