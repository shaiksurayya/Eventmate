// DateTimeRangePicker.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import HallBookingForm from "./HallBookingForm";

export default function DateTimeRangePicker() {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [error, setError] = useState("");
  const [duration, setDuration] = useState("");
  const [availability, setAvailability] = useState(""); 
  const [isAvailable, setIsAvailable] = useState(false); // ✅ toggle for Book Now

  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date("2030-12-31T23:59:59");

  // 🔹 Calculate duration whenever start or end changes
  useEffect(() => {
    if (start && end && end > start) {
      const diffMs = end - start;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      setDuration(`${diffDays} days ${diffHours} hours`);
    } else {
      setDuration("");
    }
    setAvailability("");
    setIsAvailable(false); // reset when changing dates
  }, [start, end]);

  const handleCheck = () => {
    if (!start || !end) {
      setError("Please select both start and end.");
      setAvailability("");
      setIsAvailable(false);
      return;
    }
    if (start < today) {
      setError("Start date cannot be in the past.");
      setAvailability("");
      setIsAvailable(false);
      return;
    }
    if (end <= start) {
      setError("End must be after Start.");
      setAvailability("");
      setIsAvailable(false);
      return;
    }
    if (end > maxDate) {
      setError("End date cannot be later than 31 Dec 2030.");
      setAvailability("");
      setIsAvailable(false);
      return;
    }

    setError("");
    setAvailability("✅ Available for booking");
    setIsAvailable(true);
  };

  const handleBookNow = () => {
    // Navigate to booking page
    navigate("/HallBookingForm");
  };

  return (
    <div className="mt-2 mb-4  max-w-lg mx-auto">
      {/* From Date */}
      <div className="mb-1">
        <label className="block mb-0 font-medium">From</label>
        <DatePicker
          selected={start}
          onChange={(date) => {
            setStart(date);
            if (end && date && end <= date) {
              setEnd(null);
            }
          }}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMM d, yyyy h:mm aa"
          placeholderText="Select start date & time"
          selectsStart
          startDate={start}
          endDate={end}
          minDate={today}
          maxDate={maxDate}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* To Date */}
      <div className="mb-2">
        <label className="block mb-0 font-medium">To</label>
        <DatePicker
          selected={end}
          onChange={(date) => setEnd(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMM d, yyyy h:mm aa"
          placeholderText="Select end date & time"
          selectsEnd
          startDate={start}
          endDate={end}
          minDate={start || today}
          maxDate={maxDate}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Duration Preview */}
      {duration && (
        <p className="text-green-700 font-semibold mb-1">
          Duration: {duration}
        </p>
      )}

      {/* Availability Message */}
      {availability && (
        <p
          className={`${
            availability.includes("✅") ? "text-green-600" : "text-red-600"
          } font-semibold`}
        >
          {availability}
        </p>
      )}

      {/* ✅ Conditional Button */}
      {isAvailable ? (
        <button
          type="button"
          onClick={handleBookNow}
          className="bg-green-600 text-white px-4 py-2 rounded mt-3"
        >
          Book Now
        </button>
      ) : (
        <button
          type="button"
          onClick={handleCheck}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
        >
          Check  
        </button>
      )}
    </div>
  );
}
