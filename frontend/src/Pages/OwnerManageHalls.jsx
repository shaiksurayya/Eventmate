import React, { useState } from "react";
import './OMH.css';

const OwnerManageHalls = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    phoneNumber: "",
    hallName: "",
    hallAddress: "",
    hallDescription: "",
    capacity: "",
    budget: "",
    imageUrl1: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://eventmate-production-b589.up.railway.app/api/managehalls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Hall details submitted successfully!");
        setFormData({
          ownerName: "",
          phoneNumber: "",
          hallName: "",
          hallAddress: "",
          hallDescription: "",
          capacity: "",
          budget: "",
          imageUrl1: "",
        });
      } else {
        alert("Failed to submit hall. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting hall:", error);
      alert("Error submitting hall. Check console.");
    }
  };

  return (
    <div className="manage-halls-container">
      <h2 className="page-title">Manage Halls</h2>
      <p className="page-subtitle">
        Add your hall details below. Image URL is mandatory.
      </p>

      <form className="hall-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Owner Name</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            placeholder="Enter owner name"
            required
          />
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter phone number"
            pattern="[0-9]{10}"
            required
          />
        </div>

        <div className="form-group">
          <label>Hall Name</label>
          <input
            type="text"
            name="hallName"
            value={formData.hallName}
            onChange={handleChange}
            placeholder="Enter hall name"
            required
          />
        </div>

        <div className="form-group">
          <label>Hall Address</label>
          <textarea
            name="hallAddress"
            value={formData.hallAddress}
            onChange={handleChange}
            placeholder="Enter full address"
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label>Hall Description</label>
          <textarea
            name="hallDescription"
            value={formData.hallDescription}
            onChange={handleChange}
            placeholder="Write a short description of the hall"
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label>Capacity</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Enter hall capacity"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Budget (₹)</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Enter approximate budget"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL (Mandatory)</label>
          <input
            type="url"
            name="imageUrl1"
            value={formData.imageUrl1}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit Hall Details
        </button>
      </form>
    </div>
  );
};

export default OwnerManageHalls;
