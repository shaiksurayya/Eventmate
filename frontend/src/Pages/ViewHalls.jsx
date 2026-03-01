
import React, { useEffect, useState } from "react";
import "./ViewHalls.css";
import { useNavigate } from "react-router-dom";

const ViewHalls = () => {
  const [halls, setHalls] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const [bookingData, setBookingData] = useState({ name: "", phone: "", date: "" });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/managehalls");
        if (!response.ok) throw new Error("Failed to fetch halls");
        const data = await response.json();
        setHalls(data);
      } catch (error) {
        console.error("Error fetching halls:", error);
      }
    };
    fetchHalls();
  }, []);

  const toggleReadMore = (id) => setExpanded(expanded === id ? null : id);

  const openBookingModal = (hall) => {
    setSelectedHall(hall);
    setBookingData({ name: "", phone: "", date: "" });
    setShowBookingModal(true);
  };

  const handleInputChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/managehallbookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hallId: selectedHall.id,
          hallName: selectedHall.hallName,
          ownerName: selectedHall.ownerName,
          ownerPhone: selectedHall.phoneNumber,
          customerName: bookingData.name,
          customerPhone: bookingData.phone,
          bookingDate: bookingData.date,
          status: "Booked",
        }),
      });

      if (response.status === 409) {
        alert("❌ This date is already booked for this hall.");
        return;
      }
      if (!response.ok) throw new Error("Failed to book hall");

      setBookingConfirmed(true);

// Small delay so user sees confirmation
setTimeout(() => {
  closeModal();
  navigate("/bookings"); // go to bookings page
}, 1500);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Error booking hall! Try again.");
    }
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setBookingConfirmed(false);
    setSelectedHall(null);
  };

  return (
    <div className="unique-view-halls-wrapper">
      <h2 className="unique-view-halls-title">Available Event Halls</h2>

      {halls.length === 0 ? (
        <p className="unique-no-halls-message">No halls available right now.</p>
      ) : (
        <div className="unique-halls-container">
          {halls.map((hall) => (
            <div className="unique-hall-card" key={hall.id}>
              <img src={hall.imageUrl1} alt={hall.hallName} className="unique-hall-image" />
              <div className="unique-hall-info">
                <h3>{hall.hallName}</h3>
                <p> {hall.hallAddress}</p>
                <p><b>Capacity:</b> {hall.capacity} People</p>
                <p><b>Budget:</b> ₹{hall.budget}</p>
                <p><b>Owner:</b> {hall.ownerName}</p>
                <p><b>Contact:</b> {hall.phoneNumber}</p>

                <p>
                  <b>Description:</b>{" "}
                  {expanded === hall.id ? hall.hallDescription : hall.hallDescription.slice(0, 100) + "..."}
                  {hall.hallDescription.length > 100 && (
                    <span className="unique-read-more" onClick={() => toggleReadMore(hall.id)}>
                      {expanded === hall.id ? " Show Less" : " Read More"}
                    </span>
                  )}
                </p>
                <button className="unique-book-btn" onClick={() => openBookingModal(hall)}>📅 Book Now</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showBookingModal && selectedHall && (
        <div className="unique-popup-overlay">
          <div className="unique-popup-box">
            {!bookingConfirmed ? (
              <>
                <h3>Book {selectedHall.hallName}</h3>
                <form onSubmit={handleBookingSubmit}>
                  <input name="name" placeholder="Your Name" value={bookingData.name} onChange={handleInputChange} required />
                  <input name="phone" placeholder="Your Phone" value={bookingData.phone} onChange={handleInputChange} required />
                  <input type="date" name="date" value={bookingData.date} onChange={handleInputChange} required />
                  <button type="submit" className="unique-submit-booking-btn">Confirm</button>
                  <button type="button" className="unique-cancel-booking-btn" onClick={closeModal}>Cancel</button>
                </form>
              </>
            ) : (
              <>
                <h3>✅ Booking Confirmed!</h3>
                <p>Hall: <b>{selectedHall.hallName}</b></p>
                <p>Date: <b>{bookingData.date}</b></p>
                <button className="unique-close-popup-btn" onClick={closeModal}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewHalls;



















