import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Styles (Optional, you can use your own CSS) ---
const containerStyles = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh',
    backgroundColor: '#f7f7f7', padding: '20px',
};
const formWrapperStyles = {
    backgroundColor: '#ffffff', padding: '40px', borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', width: '100%',
    maxWidth: '450px', textAlign: 'center',
};
const headingStyles = {
    marginBottom: '15px', fontSize: '28px', color: '#333',
};
const subtextStyles = {
    marginBottom: '30px', fontSize: '16px', color: '#666',
};
const inputStyles = {
    width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ccc',
    borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box',
};
const buttonStyles = {
    width: '100%', padding: '12px', backgroundColor: '#44402bff', color: '#ffffff',
    border: 'none', borderRadius: '5px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
};

// --- Component Code ---
function ForgotPass() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           
            const response = await axios.post('http://localhost:8080/api/auth/forgot-password', {
                email: email 
            });

          
            alert(response.data);

           
            navigate('/ResetPassOtp', { state: { email: email } });

        } catch (error) {
            alert(error.response?.data || "An error occurred. Please check the email address.");
        }
    };

    return (
        <div style={containerStyles}>
            <div style={formWrapperStyles}>
                <h1 style={headingStyles}>Forgot Your Password?</h1>
                <p style={subtextStyles}>
                    No worries! Just enter your email address below and we'll send you an OTP to reset it.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                        style={inputStyles}
                    />
                    <button type="submit" style={buttonStyles}>
                        Send OTP
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPass;