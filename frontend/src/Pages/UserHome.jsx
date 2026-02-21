import React, { useEffect, useState } from "react";

const Home = ({ userId }) => {
  const [bookingCount, setBookingCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const base = "http://localhost:8080/api/bookings";
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
    <div style={{ padding: "20px" }}>
      <h2>Dashboard Home</h2>

      {/* Booking Summary Card */}
      <div
        style={{
          background: "#E6F0FF",
          padding: "20px",
          borderRadius: "10px",
          width: "250px",
          marginBottom: "20px",
        }}
      >
        <h3>Total Bookings</h3>
        <p style={{ fontSize: "28px", fontWeight: "bold" }}>
          {loading ? "..." : bookingCount}
        </p>
      </div>

      {/* Recent Bookings */}
      <h3>Recent Bookings</h3>

      {loading ? (
        <p>Loading...</p>
      ) : recentBookings.length > 0 ? (
        recentBookings.map((b, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <h4>{b.hallName}</h4>
            <p>{b.bookingDateTime}</p>
          </div>
        ))
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default Home;