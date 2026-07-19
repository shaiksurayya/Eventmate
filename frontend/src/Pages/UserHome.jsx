import React, { useEffect, useState } from "react";
import "./Home.css";
const Home = ({ userId }) => {
  const [bookingCount, setBookingCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const base = "https://eventmate-production-b589.up.railway.app/api/bookings";
      const detailsUrl = `${base}/user/${userId}/details`;
      const countUrl = `${base}/user/${userId}/count`;

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) headers["Authorization"] = `Bearer ${token}`;

      // Fetch details
      const detailsRes = await fetch(
        detailsUrl,
        token ? { headers } : { credentials: "include" }
      );
      const detailsData = await detailsRes.json();

      // Fetch count
      const countRes = await fetch(
        countUrl,
        token ? { headers } : { credentials: "include" }
      );
      const countData = await countRes.json();

      setBookingCount(Number(countData));
      setRecentBookings(detailsData.slice(0, 3)); // show only 3 recent

    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookingCount(0);
      setRecentBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchBookings();
  }, [userId]);
return (
  <div className="home-container">
    <h2 className="home-title">Dashboard Home</h2>

    <div className="summary-card">
      <h3>Total Bookings</h3>
      <div className="booking-count">
        {loading ? "..." : bookingCount}
      </div>
    </div>

    <h3 className="section-title">Recent Bookings</h3>

    {loading ? (
      <p className="loading">Loading...</p>
    ) : recentBookings.length > 0 ? (
      <div className="bookings-list">
        {recentBookings.map((b, index) => (
          <div className="booking-card" key={index}>
            <h4>{b.hallName}</h4>
            <p>{b.bookingDateTime}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="no-bookings">No bookings found.</p>
    )}
  </div>
);
};

export default Home;