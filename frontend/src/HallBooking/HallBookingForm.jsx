import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom"; // useLocation ko import karein

const HallBookingForm = () => {
    // --- State Initialization ---
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // location state se data lene ke liye

    // --- ---
    // --- IMPORTANT: Get Hall ID and Booking Time ---
    //
    // Data ko 'location.state' se prapt karein.
    // Jab aap pichhle page se navigate karein, toh aise karein:
    // navigate("/hallbookingform", { state: { hallId: 123, bookingTime: "2025-10-21T10:00:00.000Z" } });
    //
    const hallId = location.state?.hallId;
    const bookingTime = location.state?.bookingTime;
    // --- ---

    // --- Handle Input Changes ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // --- Handle Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // --- <<< Yahaan naya console.log >>> ---
        console.log("HALL BOOKING FORM SUBMIT - LATEST VERSION RUNNING!");
        // --- <<< ---

        // --- Data Validation ---
        if (!hallId || !bookingTime) {
            alert("Error: Hall ID ya Booking Time nahi mila. Please pichhle page par wapas jaakar phir se try karein.");
            return; // Form submit na karein
        }
        // --- ---
    
        setIsSubmitting(true);

        const bookingData = {
            hallId: hallId, // Ab yeh dynamic hai
            bookingTime: bookingTime, // Ab yeh dynamic hai
            userName: formData.fullName,
            userPhone: formData.phone,
        };

        try {
            // Send booking request to backend
            const token = localStorage.getItem('token');
            const headers = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
            const response = await axios.post('https://eventmate-production-b589.up.railway.app/api/bookings', bookingData, { headers });
            // On success, navigate to the success page
            navigate("/SuccessMsg", { state: { bookingDetails: response.data } });

        } catch (error) {
            console.error("Booking failed:", error); // Log error for debugging

            // --- <<< Deeper Debugging Logs >>> ---
            console.log("INSIDE CATCH BLOCK");
            if (error.response) {
                console.log("error.response exists:", error.response);
                console.log("error.response.status:", error.response.status);
                console.log("Type of error.response.status:", typeof error.response.status);
            } else {
                console.log("error.response DOES NOT exist");
            }
            // --- <<< ---

            // Check if it's a conflict (hall already booked)
            if (error.response && error.response.status === 409) {
                console.log("INSIDE 409 BLOCK - Attempting navigation now!");
                navigate("/booking-suggestions", { // Ensure path matches App.jsx
                    state: {
                        suggestions: error.response.data.suggestions || [],
                        bookingDate: bookingTime, // Pass the original time
                        userInfo: formData // Pass the user info
                    }
                });
                // NO ALERT HERE FOR 409
            } else {
                // Handle other errors
                const genericError = error.response?.data?.message || error.message || "Booking failed due to an unexpected error.";
                alert(genericError); // Show only the error message string
            }
        } finally {
             setIsSubmitting(false); // Re-enable button
        }
    };

    // Yadi hallId ya bookingTime na mile, toh user ko error dikhayein
    if (!hallId || !bookingTime) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Booking Error</h2>
                    <p className="mb-6">Booking details nahi milin. Lgata hai aap seedhe is page par aa gaye hain.</p>
                    <Link to="/findhall" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
                        Find Halls Par Wapas Jayein
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* <<< TEST HEADING - Remove after fixing >>> */}
            <h1 style={{ color: 'red', textAlign: 'center', fontSize: '2em', marginTop: '20px', backgroundColor: 'yellow' }}>
                HALL BOOKING FORM - TEST VERSION {Math.random()}
            </h1>
            {/* <<< --- >>> */}

            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
                >
                    <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
                        Hall Booking - User Info
                    </h2>

                    {/* --- Form Input Fields --- */}
                    <input
                        type="text"
                        name="fullName" // 'name' attribute matches state key
                        value={formData.fullName} // Controlled input
                        onChange={handleChange} // Update state on change
                        placeholder="Enter your full name"
                        className="w-full border rounded-lg px-4 py-2 mb-4"
                        required
                    />

                    <input
                        type="tel"
                        name="phone" // 'name' attribute matches state key
                        value={formData.phone} // Controlled input
                        onChange={handleChange} // Update state on change
                        placeholder="Enter your phone number"
                        className="w-full border rounded-lg px-4 py-2 mb-4"
                        required
                    />
                    {/* --- --- */}

                    <button
                        type="submit" // Ensures form submission triggers handleSubmit
                        disabled={isSubmitting} // Disable button during API call
                        className={`w-full font-semibold py-2 px-4 rounded-lg ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-green-700 text-white'}`}
                    >
                        {isSubmitting ? 'Booking...' : 'Book Now ➝'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default HallBookingForm;