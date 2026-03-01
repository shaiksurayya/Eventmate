

import React, { useEffect, useState } from "react";
import { FaCalendarCheck, FaCheckCircle } from "react-icons/fa";
import "./Bookings.css";



const Bookings = ({ userId }) => {
  const [details, setDetails] = useState([]);
  const [madeCount, setMadeCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const tokenKey = "token";
  const authToken =
    typeof window !== "undefined" ? localStorage.getItem(tokenKey) : null;

  const fetchJsonSafe = async (url, opts = {}) => {
    const res = await fetch(url, opts);
    const text = await res.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch (e) {}
    return { ok: res.ok, status: res.status, json };
  };

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const base = "http://localhost:8080/api/bookings";
      const detailsUrl = userId
        ? `${base}/user/${userId}/details`
        : `${base}/user/details`;

      const headers = { "Content-Type": "application/json" };
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

      const res = await fetchJsonSafe(
        detailsUrl,
        authToken ? { headers } : { credentials: "include" }
      );

      const data = res.json ?? [];
      const bookingsArray = Array.isArray(data) ? data : [];

      setDetails(bookingsArray);
      setMadeCount(bookingsArray.length);

      const now = new Date();
      const completed = bookingsArray.filter(
        (b) => new Date(b.bookingDateTime) < now
      );

      setDoneCount(completed.length);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setDetails([]);
      setMadeCount(0);
      setDoneCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [userId]);

  const percentage =
    madeCount > 0 ? Math.round((doneCount / madeCount) * 100) : 0;

  return (
    <div className="bookings-container">
      <h2 className="bookings-title">My Bookings</h2>

      {/* 🔥 Summary Cards */}
      <div className="bookings-summary-container">
        <div className="bookings-summary made">
          <div className="summary-top">
            <FaCalendarCheck className="summary-icon" />
            <h3>Bookings Made</h3>
          </div>
          <p>{loading ? "..." : madeCount}</p>
        </div>

        <div className="bookings-summary done">
          <div className="summary-top">
            <FaCheckCircle className="summary-icon" />
            <h3>Bookings Done</h3>
          </div>
          <p>{loading ? "..." : doneCount}</p>

          {!loading && madeCount > 0 && (
            <>
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="progress-text">{percentage}% Completed</span>
            </>
          )}
        </div>
      </div>

      {/* 🔥 Booking List */}
      {loading ? (
        <p className="no-bookings">Loading bookings...</p>
      ) : details.length > 0 ? (
        <div className="bookings-list">
          {details.map((d, idx) => {
            const isCompleted =
              new Date(d.bookingDateTime) < new Date();

            return (
              <div
                key={d.hallId ? `${d.hallId}-${idx}` : idx}
                className={`booking-card ${
                  isCompleted ? "completed-card" : ""
                }`}
              >
                <div className="booking-content">
                  <div>
                    <h3 className="booking-event">{d.hallName}</h3>
                    <p className="booking-address">{d.hallAddress}</p>
                    <p className="booking-id">
                      <strong>Hall ID:</strong> {d.hallId}
                    </p>
                  </div>

                  <div className="booking-right">
                    <p className="booking-date">
                      <strong>Date:</strong>
                    </p>
                    <p>{d.bookingDateTime}</p>

                    {isCompleted && (
                      <span className="completed-badge">
                        ✔ Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="no-bookings">You have no bookings yet.</p>
      )}
    </div>
  );
};

export default Bookings;