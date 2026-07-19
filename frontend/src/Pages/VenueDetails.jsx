// src/Pages/VenueDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './VenueDetails.css'; // Your custom CSS file
import { FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import { FaBuilding } from 'react-icons/fa';


const VenueDetails = () => {
    const { venueId } = useParams();
    const navigate = useNavigate();
    const [venue, setVenue] = useState(null);
    const [step, setStep] = useState(1);
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [confirmedBooking, setConfirmedBooking] = useState(null);
    const [bookedDates, setBookedDates] = useState([]); // Iski ab zaroorat nahi hai, lekin rakhte hain
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        const fetchVenueDetails = async () => {
            try {
                const response = await fetch(`https://eventmate-production-b589.up.railway.app/api/halls/${venueId}`);
                if (response.ok) setVenue(await response.json());
            } catch (error) {
                console.error("Error fetching venue details:", error);
            }
        };

        // Booked dates fetch karna ab optional hai, 
        // lekin agar aap calendar par booked dates ko highlight karna chahte hain (disable nahi),
        // toh isse rakhein. Abhi ke liye yeh kuch nahi kar raha hai.
        const fetchBookedDates = async () => {
            try {
                const response = await fetch(`https://eventmate-production-b589.up.railway.app/api/bookings/hall/${venueId}/booked-dates`);
                if (response.ok) {
                    const dates = await response.json();
                    setBookedDates(dates.map(dateStr => new Date(dateStr)));
                }
            } catch (error) {
                console.error("Error fetching booked dates:", error);
            }
        };

        fetchVenueDetails();
        fetchBookedDates(); // Ise call karte rehte hain, future mein kaam aa sakta hai
    }, [venueId]);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setFormError(null); 

        const token = localStorage.getItem('token');
        if (!token) {
            // alert("You must be logged in to make a booking.");
            setFormError("You must be logged in to make a booking."); // Alert hataya
            setIsSubmitting(false);
            // navigate('/login'); // Redirect na karein, bas error dikhayein
            return;
        }
        
        // Date ko local ISO string mein convert karein
        const date = selectedDateTime;
        const localIsoString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

        const bookingData = {
            hallId: venue.hallId,
            userName: userName,
            userPhone: userPhone,
            bookingTime: localIsoString
        };

        try {
            const response = await fetch("https://eventmate-production-b589.up.railway.app/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(bookingData),
            });

            if (response.status === 201) { // 201 Created (Success)
                const savedBooking = await response.json();
                setConfirmedBooking(savedBooking);
                setStep(3); // Success page par jaayein

            } else if (response.status === 409) { // 409 Conflict (Already Booked)
                // YEH AAPKA IMPORTANT FLOW HAI
                const errorData = await response.json();
                // User ko suggestions page par bhej dein
                navigate("/booking-suggestions", { 
                    state: { 
                        suggestions: errorData.suggestions || [], // Backend se suggestions lein
                        bookingDate: localIsoString, // Yahi date aage pass karein
                        userInfo: { fullName: userName, phone: userPhone } // Jo user info form mein bhari thi
                    } 
                });

            } else { // Baaki sabhi errors (Jaise 400, 500, etc.)
                let errorMessage = "Booking failed due to an unknown error.";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || JSON.stringify(errorData);
                } catch (jsonError) {
                    errorMessage = await response.text(); 
                }
                setFormError(errorMessage); // Error ko state mein set karein
            }

        } catch (error) {
            console.error("Error during booking (Network/Server Down):", error);
            setFormError("An error occurred. Please check your network and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!venue) return <div>Loading venue details...</div>;

    return (
        <div className="venue-details-container">
            <div className="venue-info-card">
                <img src={venue.imageLink} alt={venue.hallName} className="venue-image" />
               <h2 className="venue-title">
  <FaBuilding className="venue-title-icon" /> {venue.hallName}
</h2>

                <p>This is a premium hall with world-class facilities. Perfect for weddings, corporate events, and parties.</p>
                  <p className="venue-detail">
    <FaMapMarkerAlt className="venue-icon" /> <strong>Location:</strong> {venue.location}
  </p>
  <p className="venue-detail">
    <FaUsers className="venue-icon" /> <strong>Capacity:</strong> {venue.capacity} guests
  </p>
            </div>
            <div className="booking-flow-card">
                {step === 1 && (
                    <>
                        <h3>Select Date and Time</h3>
                        <div className="calendar-container">
                            <DatePicker
                                selected={selectedDateTime}
                                onChange={(date) => setSelectedDateTime(date)}
                                showTimeSelect
                                inline
                                dateFormat="MMMM d, yyyy h:mm aa"
                                minDate={new Date()}
                                // --- YAHAN SE 'excludeDates' HATA DIYA GAYA HAI ---
                                // excludeDates={bookedDates} 
                                // --- ---
                            />
                        </div>
                        <button className="flow-btn" onClick={() => setStep(2)}>Next</button>
                    </>
                )}
                
                {step === 2 && (
                    <>
                        <h3>Hall Booking - User Info</h3>
                        <form onSubmit={handleBookingSubmit}>
                            <div className="form-group">
                                <label>Enter your name</label>
                                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Enter your phone number</label>
                                <input type="tel" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} required />
                            </div>

                            {/* Error message dikhane ke liye */}
                            {formError && (
                                <div style={{ 
                                    color: 'red', 
                                    backgroundColor: '#ffebee', 
                                    border: '1px solid #e57373', 
                                    padding: '10px', 
                                    borderRadius: '5px', 
                                    marginBottom: '15px', 
                                    textAlign: 'center' 
                                }}>
                                    {formError}
                                </div>
                            )}

                            <div className="button-group">
                                <button type="button" className="flow-btn back" onClick={() => setStep(1)} disabled={isSubmitting}>Back</button>
                                <button type="submit" className="flow-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Booking...' : 'Book'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
                {step === 3 && confirmedBooking && (
                    <div className="success-message">
                        <h3>Booking Successful!</h3>
                        <p>Your booking for <strong>{venue.hallName}</strong> has been confirmed.</p>
                        <p>Contact Name: {confirmedBooking.userName}</p>
                        <p>Date: {new Date(confirmedBooking.bookingTime).toLocaleString()}</p>
                        <p>Booking ID: {confirmedBooking.bookingId}</p>
                        <p>We will contact you shortly.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VenueDetails;


















