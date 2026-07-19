import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Styles (CSS Code) ---
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
    wordBreak: 'break-word',
};
const inputStyles = {
    width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ccc',
    borderRadius: '5px', fontSize: '16px', boxSizing: 'border-box', // textAlign removed to align text left
};
const buttonStyles = {
    width: '100%', padding: '12px', backgroundColor: '#67664cff', color: '#ffffff',
    border: 'none', borderRadius: '5px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
    marginTop: '10px',
};
// Div containing the input and the button
const inputWrapperStyles = {
    position: 'relative',
    width: '100%',
    marginBottom: '15px',
};
// Style for the eye icon button
const eyeButtonStyles = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    fontSize: '18px',
};

// --- Component Code ---
function ResetPassOtp() {
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // <-- 1. नया State जोड़ा गया
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const email = location.state?.email;

    if (!email) {
        React.useEffect(() => navigate('/forgot-password'), [navigate]);
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
           const response = await axios.post(
    'https://eventmate-production-b589.up.railway.app/api/auth/reset-password',
    {
        email,
        otp,
        newPassword
    }
);
            alert(response.data);
            navigate('/login');
        } catch (error) {
            alert(error.response?.data || "An error occurred while resetting the password.");
        }
    };

    return (
        <div style={containerStyles}>
            <div style={formWrapperStyles}>
                <h1 style={headingStyles}>Reset Your Password</h1>
                <p style={subtextStyles}>An OTP has been sent to *{email}*. Please enter it below along with your new password.</p>
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength="6"
                        required
                        style={{...inputStyles, textAlign: 'center'}} // Center align only OTP
                    />
                    
                    {/* --- 2. पासवर्ड इनपुट के लिए नया स्ट्रक्चर --- */}
                    <div style={inputWrapperStyles}>
                        <input
                            type={showPassword ? 'text' : 'password'} // <-- type को state से कंट्रोल किया
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={inputStyles}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} // <-- state को बदलने वाला फंक्शन
                            style={eyeButtonStyles}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>

                    <div style={inputWrapperStyles}>
                        <input
                            type={showPassword ? 'text' : 'password'} // <-- type को state से कंट्रोल किया
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={inputStyles}
                        />
                         <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} // <-- state को बदलने वाला फंक्शन
                            style={eyeButtonStyles}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>

                    <button type="submit" style={buttonStyles}>
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassOtp;