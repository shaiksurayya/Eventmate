import React, { useState, useRef,useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { FaStar, FaPhone, FaCalendar, FaClock, FaCheck, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
// Import axiosConfig for sending JWT token
import apiClient from '../api/axiosConfig'; 

const PhotographerPortfolio = ({ photographer }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Safety Check: Portfolio data na hone par render na karein
  if (!photographer || !photographer.portfolio || photographer.portfolio.length === 0) {
      return null;
  }

  return (
    <section style={{ marginBottom: 40 }}>
      <h2
        style={{
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 24,
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: 8,
          color: "#1f2937",
        }}
      >
        Portfolio
      </h2>

      <div
        style={{
          display: "flex",
          gap: 20,
          overflowX: "auto",
          padding: "16px 4px 24px 4px",
          scrollbarWidth: "thin",
          cursor: "grab",
          position: "relative",
        }}
      >
        {photographer.portfolio.map((img, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              flexShrink: 0,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <img
              src={img}
              alt={`portfolio-${idx}`}
              style={{
                width: 300,
                height: 200,
                objectFit: "cover",
              }}
              onClick={() => setSelectedImage(img)}
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Large view"
            style={{
              maxWidth: "90%",
              maxHeight: "85%",
              borderRadius: 10,
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              objectFit: "contain",
            }}
          />
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 30,
              fontSize: 32,
              color: "white",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
};

const PhotographerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [photographer, setPhotographer] = useState(null); 

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const bookingRef = useRef(null);
  const [eventType, setEventType] = useState("");
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [message, setMessage] = useState(''); // Naya state add kiya

  const [bookingStatus, setBookingStatus] = useState(null);

  // --- NAYA DATA FETCHING LOGIC ---
  useEffect(() => {
    apiClient.get(`/api/photographers/${id}`)
        .then(response => {
            setPhotographer(response.data);
            if (response.data.eventTypes && response.data.eventTypes.length > 0) {
                setEventType(response.data.eventTypes[0]);
            }
        })
        .catch(error => {
            console.error("Error fetching photographer details:", error);
            setPhotographer(null); 
        });
  }, [id]); 

  // --- LOADING CHECK ---
  if (!photographer) {
    // Error free loading message
    return <h2 style={{ textAlign: "center", marginTop: 50 }}>Loading Photographer Details...</h2>;
  }

  // --- NAYA HELPER FUNCTION ---
  // Date object ko "YYYY-MM-DD" string mein format karne ke liye
  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const generateCalendar = (date) => {
    // ... (generateCalendar function waisa hi rahega) ...
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const calendar = [];
    let currentWeek = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      currentWeek.push(currentDate);
      if (currentWeek.length === 7) {
        calendar.push(currentWeek);
        currentWeek = [];
      }
    }
    return calendar;
  };
  
  // --- NAYE HELPER FUNCTIONS YAHAN HONGE ---
  const getTodayMidnight = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };
  const isDateAvailable = (date) => date >= getTodayMidnight();

  const isDateSelected = (date) =>
    selectedDate && date.toDateString() === selectedDate.toDateString();

  const prevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const nextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleDateSelect = (date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedTime("");
    }
  };
  
  // --- NAYA BOOKING SUBMIT LOGIC ---
  const handleBookingSubmit = async () => {
    setBookingStatus(null); // Puraana status clear karein

    // 1. Form validation (check karein ki sab select hua hai)
    if (!selectedDate || !selectedTime || !eventType || !userName || !userPhone) {
        setBookingStatus({ 
            error: "Please select date, time, event type, and fill in your name and phone." 
        });
        setTimeout(() => setBookingStatus(null), 4000); 
        return;
    }
    
    const formattedDate = formatDate(selectedDate);

    // 3. Backend ko bhejne ke liye request object banayein
    const bookingRequest = {
        photographerId: id,
        bookingDate: formattedDate,
        userName: userName,
        userPhone: userPhone,
        eventType: eventType
    };

    try {
        // 4. Backend API ko call karein
        await apiClient.post('/api/photographers/book', bookingRequest); 

        // 5. Booking Safal (Success)
        setBookingStatus({ 
            message: `Booking Confirmed!`,
            date: selectedDate?.toDateString(),
            time: selectedTime,
            type: eventType
        });
            // --- NAYI NAVIGATION LINE YAHAN ADD KAREIN ---
    // User ko Booking History page par bhej dein (recommended)
    // setTimeout(() => {
    //     setBookingStatus(null);
    //     navigate('/bookings'); 
    // }, 1500); // 1.5 second ka delay taaki user 'Booking Confirmed' dekh sake

    } catch (error) {
        // 6. Booking Failed (Conflict yaani pehle se booked)
        if (error.response && error.response.status === 409) {
            setBookingStatus({ 
                error: "This photographer is already booked on " + formattedDate
            });
          

        } else {
            // 7. Koi aur Error
            const errorMsg = error.response?.data?.message || "Booking failed. Please try again.";
            setBookingStatus({ error: errorMsg });
            setTimeout(() => setBookingStatus(null), 4000);
        }
    }
  };


  const handleScrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const calendar = generateCalendar(currentMonth);
  const monthNames = [
    "January","February","March","April","May","June","July","August","September","October","November","December"
  ];
  
  // --- Final Booking Button Style ---
  const bookingBtnStyle = {
    backgroundColor: selectedDate && selectedTime ? "#059669" : "#9ca3af",
    color: "white",
    border: "none",
    padding: "14px 24px",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: selectedDate && selectedTime ? "pointer" : "not-allowed",
    transition: "background-color 0.2s"
  };

  return (
    <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Header Section */}   
  <div
  style={{
    display: "flex",
    gap: 32,
    marginBottom: 50,
    flexWrap: "wrap",
    background: "linear-gradient(to right, #ffffff, #f8fafc)",
    padding: 24,
    borderRadius: 16,
    boxShadow:
      "0 10px 20px -5px rgba(0,0,0,0.05), 0 4px 6px -4px rgba(0,0,0,0.05)",
    alignItems: "center",
    transition: "all 0.3s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-3px)";
    e.currentTarget.style.boxShadow =
      "0 15px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.05)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow =
      "0 10px 20px -5px rgba(0,0,0,0.05), 0 4px 6px -4px rgba(0,0,0,0.05)";
  }}
>
  {/* Photographer Image */}
  <div
    style={{
      position: "relative",
      borderRadius: 16,
      overflow: "hidden",
      width: 320,
      height: 220,
      flexShrink: 0,
      backgroundColor: '#eee' // Placeholder background
    }}
  >
    {photographer && photographer.imageLink ? (
      <img
        src={photographer.imageLink} // Yahaan imageLink use kiya
        alt={photographer.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.4s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
    ) : (
      <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa'}}>No Image</div>
    )}
    {/* Subtle overlay gradient */}
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "50%",
        background:
          "linear-gradient(to top, rgba(0,0,0,0.5), transparent 80%)",
      }}
    />
  </div>

  {/* Photographer Info */}
  <div style={{ flex: 1, minWidth: 300 }}>
    <h1
      style={{
        fontSize: 32,
        fontWeight: 800,
        marginBottom: 12,
        background:
          "linear-gradient(90deg, #16a34a, #065f46)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {photographer.name}
    </h1>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
        color: "#374151",
      }}
    >
      <FaStar color="#fbbf24" size={18} />
      <span style={{ fontWeight: 600, fontSize: 16 }}>
        {photographer.rating} / 5.0
      </span>
      {/* Location field database mein hai */}
      <span style={{ color: "#9ca3af", fontSize: 14 }}>
        • {photographer.location}
      </span>
    </div>

    <p
      style={{
        marginBottom: 6,
        fontSize: 15,
        color: "#374151",
      }}
    >
      <strong style={{ color: "#111827" }}>Starting Price:</strong>{" "}
      <span style={{ color: "#059669", fontWeight: 600 }}>
        {/* {`photographer.startingPrice ? ₹${photographer.startingPrice.toLocaleString()} : 'N/A'`} */}
        <p>Starting Price: {photographer.startingPrice ? `₹${photographer.startingPrice.toLocaleString('en-IN')}` : 'N/A'}</p>
      </span>
    </p>

    <p
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
        color: "#374151",
      }}
    >
      <FaPhone color="#059669" />
      <span
        style={{
          fontWeight: 600,
          letterSpacing: 0.5,
          fontSize: 15,
        }}
              >
                {photographer.phone}
              </span>
            </p>
        
            <p
              style={{
                marginTop: 10,
                fontSize: 15,
                lineHeight: 1.6,
                color: "#4b5563",
                maxWidth: 600,
              }}
            >
              {photographer.specialization} {/* Specialization display kar rahe hain */}
            </p>
        
            {/* Quick Action Buttons */}
            <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={handleScrollToBooking} 
                style={{
                  backgroundColor: "#059669",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#047857")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
              >
                Book Now
              </button>
            </div>
          </div> 
        </div> 
        
        
        {/* Portfolio Section */}
        <PhotographerPortfolio photographer={photographer} />
        
        
        {/* Services Section */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Services & Packages</h2>
          <div style={{ display: "grid", gap: 20 }}>
            
            {/* Service data ab backend se nahi aa raha, isliye isse comment out kiya */}
            {/* {photographer && photographer.services && photographer.services.map((service, index) => (
              <div key={index} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h3>{service.name}</h3>
                  <span style={{ color: "#059669", fontWeight: 700 }}>{service.price}</span>
                </div>
                <p><strong>Duration:</strong> {service.duration}</p>
                
                {service.includes.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FaCheck color="#059669" /> {item}
                  </div>
                ))}
                
              </div>
            ))} */}
            <p>No formal service packages available yet, contact for custom quote.</p>
            
          </div>
        </section>
        
        {/* About */}
        <section style={{ marginBottom: 40 }}ref={bookingRef}>
          {/* Yahaan pehla error tha: photographer.name.split(' ') */}
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>About {photographer.name?.split(" ")[0]}</h2>
          {/* Yahaan doosra error ho sakta tha */}
          <p style={{ backgroundColor: "#f8f9fa", padding: 24, borderRadius: 12 }}>{photographer.about || photographer.specialization}</p>
        </section>
        
        {/* Booking Section */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
            Availability & Booking
          </h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
            {/* Interactive Calendar */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FaCalendar color="#059669" />
                  <span style={{ fontWeight: 600 }}>Select Date & Time</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button 
                    onClick={prevMonth}
                    style={{ 
                      border: "none", 
                      background: "none", 
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f3f4f6"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                  >
                    <FaArrowLeft size={16} color="#374151" />
                  </button>
                  <span style={{ fontWeight: 600, minWidth: 150, textAlign: "center" }}>
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </span>
                  <button 
                    onClick={nextMonth}
                    style={{ 
                      border: "none", 
                      background: "none", 
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f3f4f6"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                  >
                    <FaArrowRight size={16} color="#374151" />
                  </button>
                </div>
              </div>
              
              <div style={{ 
                border: "1px solid #e5e7eb", 
                borderRadius: 12, 
                overflow: "hidden",
                backgroundColor: "white",
                marginBottom: 20
              }}>
                {/* Week days header */}
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(7, 1fr)", 
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #e5e7eb"
                }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <div 
                      key={index}
                      style={{ 
                        padding: "12px 8px", 
                        textAlign: "center", 
                        fontWeight: 600,
                        fontSize: 14,
                        color: "#374151"
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar days */}
                {calendar.map((week, weekIndex) => (
                  <div 
                    key={weekIndex}
                    style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(7, 1fr)",
                      borderBottom: weekIndex < calendar.length - 1 ? "1px solid #e5e7eb" : "none"
                    }}
                  >
                    {week.map((date, dateIndex) => {
                      const available = isDateAvailable(date);
                      const selected = isDateSelected(date);
                      const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                      
                      return (
                        <div 
                          key={dateIndex}
                          onClick={() => handleDateSelect(date)}
                          style={{ 
                            padding: "12px 8px", 
                            textAlign: "center",
                            backgroundColor: selected ? "#059669" : "white",
                            color: selected ? "white" : 
                                  !isCurrentMonth ? "#d1d5db" :
                                  available ? "#374151" : "#d1d5db",
                            fontWeight: selected ? 600 : 400,
        cursor: available ? "pointer" : "not-allowed",
                            borderRight: dateIndex < 6 ? "1px solid #e5e7eb" : "none",
                            transition: "all 0.2s",
                            position: "relative"
                          }}
                          onMouseEnter={(e) => {
                            if (available && !selected) {
                              e.target.style.backgroundColor = "#f0fdf4";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (available && !selected) {
                              e.target.style.backgroundColor = "white";
                            }
                          }}
                        >
                          {date.getDate()}
                          {available && !selected && (
                            <div style={{
                              position: "absolute",
                              bottom: 2,
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: 4,
                              height: 4,
                              backgroundColor: "#059669",
                              borderRadius: "50%"
                            }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
          
              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <FaClock color="#059669" />
                    <span style={{ fontWeight: 600 }}>Available Time Slots for {selectedDate?.toDateString()}</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {/* Safety check: photographer && photographer.workingHours */}
                    {photographer && photographer.workingHours && photographer.workingHours.map((time, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTime(time)}
                        style={{
                          padding: "12px 16px",
                          border: `2px solid ${selectedTime === time ? "#059669" : "#e5e7eb"}`,
                          borderRadius: 8,
                          backgroundColor: selectedTime === time ? "#f0fdf4" : "white",
                          color: selectedTime === time ? "#059669" : "#374151",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          if (selectedTime !== time) {
                            e.target.style.borderColor = "#059669";
                            e.target.style.backgroundColor = "#f0fdf4";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedTime !== time) {
                            e.target.style.borderColor = "#e5e7eb";
                            e.target.style.backgroundColor = "white";
                          }
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
        {/* Booking Summary */}
            <div style={{ 
              border: "1px solid #e5e7eb", 
              borderRadius: 12, 
              padding: 24,
              backgroundColor: "white",
              position: "sticky",
              top: 20
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Booking Summary</h3>
              
              {selectedDate && (
                <div style={{ marginBottom: 20, padding: 16, backgroundColor: "#f0fdf4", borderRadius: 8 }}>
                  <p style={{ margin: "4px 0", fontWeight: 600 }}>Selected Date:</p>
                  <p style={{ margin: "4px 0", color: "#059669" }}>{selectedDate?.toDateString()}</p>
                  {selectedTime && (
                    <>
                      <p style={{ margin: "4px 0", fontWeight: 600, marginTop: 8 }}>Selected Time:</p>
                      <p style={{ margin: "4px 0", color: "#059669" }}>{selectedTime}</p>
                    </>
                  )}
                </div>
              )}
              
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                
                {/* Event Type Dropdown */}
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>Event Type</label>
                  <select 
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    style={{ 
                      width: "100%", 
                      padding: "12px", 
                      border: "1px solid #d1d5db", 
                      borderRadius: 8,
                      fontSize: 16
                    }}
                  >
                    {photographer.eventTypes && photographer.eventTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {/* Your Name Input */}
                <div style={{ marginTop: 12 }}>
                  <label style={{ fontWeight: 600, fontSize: 16, color: "#374151", marginBottom: 8, display: "block" }}>
                    Your Name:
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your full name"
                    style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 16, boxSizing: 'border-box' }}
                  />
                </div>
            
                {/* Your Phone Input */}
                <div style={{ marginTop: 12 }}>
                  <label style={{ fontWeight: 600, fontSize: 16, color: "#374151", marginBottom: 8, display: "block" }}>
                    Your Phone:
                  </label>
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 16, boxSizing: 'border-box' }}
                  />
                </div>
        
                {/* Message Textarea */}
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>Message</label>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)} // Naya onChange event
                    style={{ 
                      width: "100%", 
                      padding: "12px", 
                      border: "1px solid #d1d5db", 
                      borderRadius: 8,
                      fontSize: 16,
                      minHeight: 100,
                      resize: "vertical"
                    }}
                    placeholder="Tell us about your event and any specific requirements..."
                  />
                </div>
                
                {/* Confirm Booking Button */}
                <button 
                  onClick={handleBookingSubmit}
                  style={bookingBtnStyle} // Naya style object use kiya
                  onMouseEnter={(e) => {
                    if (selectedDate && selectedTime) {
                      e.currentTarget.style.backgroundColor = "#047857";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedDate && selectedTime) {
                      e.currentTarget.style.backgroundColor = "#059669";
                    }
                  }}
                >
                  {selectedDate && selectedTime ? "Confirm Booking" : "Select Date & Time"}
                </button>
        
                {/* Booking Status Message */}
                {bookingStatus && (
                  <div style={{
                    marginTop: 16,
                    padding: 12,
                    borderRadius: 8,
                    border: bookingStatus.error ? "1px solid #ef4444" : "1px solid #22c55e",
                    backgroundColor: bookingStatus.error ? "#f8d7da" : "#d4edda",
                    color: bookingStatus.error ? "#721c24" : "#155724",
                    textAlign: 'left',
                    transition: 'all 0.3s ease'
                  }}>
                    {bookingStatus.message && (
                      <>
                        <strong style={{ display: 'block', marginBottom: 8, fontSize: 15 }}>{bookingStatus.message}</strong>
                        <div style={{ fontSize: 14 }}>Date: {bookingStatus.date}</div>
                        <div style={{ fontSize: 14 }}>Time: {bookingStatus.time}</div>
                        <div style={{ fontSize: 14 }}>Event: {bookingStatus.type}</div>
                      </>
                    )}
                    {bookingStatus.error && (
                      <strong style={{ fontSize: 14 }}>{bookingStatus.error}</strong>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
              
            {/* Social Icons */}
            <div style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              padding: "20px 0",
            }}>
              {photographer.social?.facebook && (
                <a
                  href={photographer.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ /*...*/ }}
                  onMouseEnter={(e) => { /*...*/ }}
                  onMouseLeave={(e) => { /*...*/ }}
                >
                  <FaFacebookF size={18} />
                </a>
              )}
        
              {photographer.social?.instagram && (
                <a
                  href={photographer.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ /*...*/ }}
                  onMouseEnter={(e) => { /*...*/ }}
                  onMouseLeave={(e) => { /*...*/ }}
                >
        *   *       <FaInstagram size={18} />
                </a>
              )}
        
              {photographer.social?.twitter && (
                <a
                  href={photographer.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ /*...*/ }}
                  onMouseEnter={(e) => { /*...*/ }}
                  onMouseLeave={(e) => { /*...*/ }}
                >
                  <FaTwitter size={18} />
                </a>
              )}
            </div>
            </div>
          );
        };
        
        export default PhotographerDetails;
        

// import React, { useState, useRef,useEffect } from "react";
// import { useParams,useNavigate } from "react-router-dom";
// import { FaStar, FaPhone, FaCalendar, FaClock, FaCheck, FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
// //import axios from "axios";
// import apiClient from '../api/axiosConfig'; // Agar zaroorat ho toh path adjust karein

// const PhotographerPortfolio = ({ photographer }) => {
//   const [selectedImage, setSelectedImage] = useState(null);

//   return (
//     <section style={{ marginBottom: 40 }}>
//       <h2
//         style={{
//           fontSize: 24,
//           fontWeight: 700,
//           marginBottom: 24,
//           borderBottom: "2px solid #e5e7eb",
//           paddingBottom: 8,
//           color: "#1f2937",
//         }}
//       >
//         Portfolio
//       </h2>

//       <div
//         style={{
//           display: "flex",
//           gap: 20,
//           overflowX: "auto",
//           padding: "16px 4px 24px 4px",
//           scrollbarWidth: "thin",
//           cursor: "grab",
//           position: "relative",
//         }}
//       >
//         {photographer.portfolio.map((img, idx) => (
//           <div
//             key={idx}
//             style={{
//               position: "relative",
//               flexShrink: 0,
//               borderRadius: 12,
//               overflow: "hidden",
//               boxShadow:
//                 "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//               transition: "all 0.3s ease",
//               cursor: "pointer",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = "translateY(0)";
//             }}
//           >
//             <img
//               src={img}
//               alt={`portfolio-${idx}`}
//               style={{
//                 width: 300,
//                 height: 200,
//                 objectFit: "cover",
//               }}
//               onClick={() => setSelectedImage(img)}
//             />
            
//           </div>
//         ))}
//       </div>

//       {selectedImage && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             backgroundColor: "rgba(0,0,0,0.85)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//           onClick={() => setSelectedImage(null)}
//         >
//           <img
//             src={selectedImage}
//             alt="Large view"
//             style={{
//               maxWidth: "90%",
//               maxHeight: "85%",
//               borderRadius: 10,
//               boxShadow: "0 0 20px rgba(0,0,0,0.5)",
//               objectFit: "contain",
//             }}
//           />
//           <button
//             onClick={() => setSelectedImage(null)}
//             style={{
//               position: "absolute",
//               top: 20,
//               right: 30,
//               fontSize: 32,
//               color: "white",
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             ✕
//           </button>
//         </div>
//       )}
//     </section>
//   );
// };

// const PhotographerDetails = () => {
//   const { id } = useParams();
//  // const photographer = photographers.find((p) => p.id === parseInt(id));
//  const navigate = useNavigate(); // <-- Naya add karein
//   const [photographer, setPhotographer] = useState(null); // <-- Naya add karein

//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState("");
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const bookingRef = useRef(null);
//  // const [eventType, setEventType] = useState(photographer ? photographer.eventTypes[0] : "");
//  const [eventType, setEventType] = useState("");
//  const [userName, setUserName] = useState('');
//   const [userPhone, setUserPhone] = useState('');

//   const [bookingStatus, setBookingStatus] = useState(null);
//   // --- NAYA DATA FETCHING LOGIC ---
//   useEffect(() => {
//     // Backend se photographer ki details fetch karein
//    ) // <-- YEH AAPKA ENDPOINT HONA CHAHIYE
//     apiClient.get(`/api/photographers/${id}`)

//         .then(response => {
//             setPhotographer(response.data);
//             // Default event type set karein jab data load ho jaaye
//             if (response.data.eventTypes && response.data.eventTypes.length > 0) {
//                 setEventType(response.data.eventTypes[0]);
//             }
//         })
//         .catch(error => {
//             console.error("Error fetching photographer details:", error);
//             setPhotographer(null); // Error hone par data null set karein
//         });
//   }, [id]); // Yeh tab chalega jab 'id' badlega

//   //if (!photographer)
//     //return <h2 style={{ textAlign: "center", marginTop: 50 }}>Photographer not found</h2>;
//   if (!photographer) {
//     return <h2 style={{ textAlign: "center", marginTop: 50 }}>Loading Photographer Details...</h2>;
//   }

//   // --- NAYA HELPER FUNCTION ---
//   // Date object ko "YYYY-MM-DD" string mein format karne ke liye
//   const formatDate = (date) => {
//     const d = new Date(date);
//     let month = '' + (d.getMonth() + 1);
//     let day = '' + d.getDate();
//     const year = d.getFullYear();

//     if (month.length < 2) month = '0' + month;
//     if (day.length < 2) day = '0' + day;

//     return [year, month, day].join('-');
//   };

//   const generateCalendar = (date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const startDate = new Date(firstDay);
//     startDate.setDate(startDate.getDate() - firstDay.getDay());
//     const calendar = [];
//     let currentWeek = [];
//     for (let i = 0; i < 42; i++) {
//       const currentDate = new Date(startDate);
//       currentDate.setDate(startDate.getDate() + i);
//       currentWeek.push(currentDate);
//       if (currentWeek.length === 7) {
//         calendar.push(currentWeek);
//         currentWeek = [];
//       }
//     }
//     return calendar;
//   };

//   const today = new Date();
//   const isDateAvailable = (date) =>
//     date >= today && date <= new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

//   const isDateSelected = (date) =>
//     selectedDate && date.toDateString() === selectedDate.toDateString();

//   const prevMonth = () =>
//     setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

//   const nextMonth = () =>
//     setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

//   const handleDateSelect = (date) => {
//     if (isDateAvailable(date)) {
//       setSelectedDate(date);
//    setSelectedTime("");
//     }
//   };
//     const handleBookingSubmit = async () => {
//     // Puraana status clear karein
//     setBookingStatus(null);

//     // 1. Form validation (check karein ki sab select hua hai)
//     if (!selectedDate || !selectedTime || !eventType || !userName || !userPhone) {
//         setBookingStatus({ 
//             error: "Please select date, time, event type, and fill in your name and phone." 
//         });
//         setTimeout(() => setBookingStatus(null), 4000); // 4 sec baad error hatayein
//         return;
//     }
    
//     // 2. Date ko backend format (YYYY-MM-DD) mein badlein
//     const formattedDate = formatDate(selectedDate);

//     // 3. Backend ko bhejne ke liye request object banayein
//     const bookingRequest = {
//         photographerId: id,
//         bookingDate: formattedDate,
//         userName: userName,
//         userPhone: userPhone,
//         eventType: eventType
//     };

//     try {
//         // 4. Backend API ko call karein
//      graphers/book', bookingRequest);
//                 const response = await apiClient.post('/api/photographers/book', bookingRequest); 


//         // 5. Booking Safal (Success)
//         setBookingStatus({ 
//             message: `Booking Confirmed!`,
//             date: selectedDate.toDateString(),
//             time: selectedTime
//         });
        
//         // Form fields clear karein
//         // setSelectedDate(null);
//         // setSelectedTime("");
//         // setEventType(photographer.eventTypes[0]);
//         // setUserName("");
//         // setUserPhone("");
        
//         // // 4 second baad success page par bhej dein
//         // setTimeout(() => {
//         //     setBookingStatus(null);
//         //    // navigate("/booking-success"); // Aapka success page
//         // }, 4000);

//     } catch (error) {
//         // 6. Booking Failed (Conflict yaani pehle se booked)
//         if (error.response && error.response.status === 409) {
//             setBookingStatus({ 
//                 error: "This photographer is already booked on " + formattedDate
//             });
            
//             // 4 second baad suggestions page par bhej dein
//             setTimeout(() => {
//                 setBookingStatus(null);
//                 navigate(`/photographer-suggestions?date=${formattedDate}`);
//             }, 4000);

//         } else {
//             // 7. Koi aur Error
//             const errorMsg = error.response?.data?.message || "Booking failed. Please try again.";
//             setBookingStatus({ error: errorMsg });
//             setTimeout(() => setBookingStatus(null), 4000);
//         }
//     }
//   };

//   // const handleBooking = () => {
//   //   if (selectedDate && selectedTime) {
//   //     alert(`Booking confirmed!\nDate: ${selectedDate.toDateString()}\nTime: ${selectedTime}`);
//   //   } else {
//   //     alert("Please select both date and time");
//   //   }
//   // };

//   const handleScrollToBooking = () => {
//     bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }
//   const handleBooking = () => {
//     // Clear any previous status
//     setBookingStatus(null);

//     if (selectedDate && selectedTime && eventType) {
//       // Success
//       setBookingStatus({ 
//         message: `Booking Confirmed!`,
//         date: selectedDate.toDateString(),
//         time: selectedTime,
//         type: eventType
//       });
      
//       // Form ko clear karein
//       setSelectedDate(null);
//       setSelectedTime("");
//       setEventType(photographer.eventTypes[0]); // Dropdown ko default par reset karein
      
//       // 5 second baad message ko gayab kar dein
//       setTimeout(() => {
//         setBookingStatus(null);
//       }, 5000); 

//     } else {
//       // Error
//       setBookingStatus({ 
//         error: "Please select date, time, and event type." 
//       });
       
//       // 3 second baad error ko gayab kar dein
//       setTimeout(() => {
//         setBookingStatus(null);
//       }, 3000);
//     }
//   };
//   const calendar = generateCalendar(currentMonth);
//   const monthNames = [
//     "January","February","March","April","May","June","July","August","September","October","November","December"
//   ];

//   return (
//     <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
//         {/* Header Section */}   
//   <div
//   style={{
//     display: "flex",
//     gap: 32,
//     marginBottom: 50,
//     flexWrap: "wrap",
//     background: "linear-gradient(to right, #ffffff, #f8fafc)",
//     padding: 24,
//     borderRadius: 16,
//     boxShadow:
//       "0 10px 20px -5px rgba(0,0,0,0.05), 0 4px 6px -4px rgba(0,0,0,0.05)",
//     alignItems: "center",
//     transition: "all 0.3s ease",
//   }}
//   onMouseEnter={(e) => {
//     e.currentTarget.style.transform = "translateY(-3px)";
//     e.currentTarget.style.boxShadow =
//       "0 15px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.05)";
//   }}
//   onMouseLeave={(e) => {
//     e.currentTarget.style.transform = "translateY(0)";
//     e.currentTarget.style.boxShadow =
//       "0 10px 20px -5px rgba(0,0,0,0.05), 0 4px 6px -4px rgba(0,0,0,0.05)";
//   }}
// >
//   {/* Photographer Image */}
//   <div
//     style={{
//       position: "relative",
//       borderRadius: 16,
//       overflow: "hidden",
//       width: 320,
//       height: 220,
//       flexShrink: 0,
//     }}
//   >
//     {/* Photographer Image */}
//             <div
//               style={{
//                 position: "relative",
//                 borderRadius: 16,
//                 overflow: "hidden",
//                 width: 320,
//                 height: 220,
//                 flexShrink: 0,
//                 backgroundColor: '#eee' // Placeholder background
//               }}
//             >
//               {/* --- YEH CHECK ADD KIYA GAYA HAI --- */}
//               {photographer && photographer.images && photographer.images.length > 0 ? (
//                 <img
//                   src={photographer.images[0]} // Ab yeh safe hai
//                   alt={photographer.name}
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                     transition: "transform 0.4s ease",
//                   }}
//                   onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//                   onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//                 />
//               ) : (
//                  // Agar image nahi hai toh placeholder dikha sakte hain
//                  <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa'}}>No Image</div>
//               )}
//               {/* Subtle overlay gradient */}
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: 0,
//                   left: 0,
//                   right: 0,
//                   height: "50%",
//                   background:
//                     "linear-gradient(to top, rgba(0,0,0,0.5), transparent 80%)",
//                 }}
//               />
//             </div>

// {/* --- YAHAN TAK REPLACE KAREIN (END) --- */}
//     {/* <img
//       src={photographer.images[0]}
//       alt={photographer.name}
//       style={{
//         width: "100%",
//         height: "100%",
//         objectFit: "cover",
//         transition: "transform 0.4s ease",
//       }}
//       onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//       onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//     /> */}
//     {/* Subtle overlay gradient */}
//     <div
//       style={{
//         position: "absolute",
//         bottom: 0,
//         left: 0,
//         right: 0,
//         height: "50%",
//         background:
//           "linear-gradient(to top, rgba(0,0,0,0.5), transparent 80%)",
//       }}
//     />
//   </div>

//   {/* Photographer Info */}
//   <div style={{ flex: 1, minWidth: 300 }}>
//     <h1
//       style={{
//         fontSize: 32,
//         fontWeight: 800,
//         marginBottom: 12,
//         background:
//           "linear-gradient(90deg, #16a34a, #065f46)",
//         WebkitBackgroundClip: "text",
//         WebkitTextFillColor: "transparent",
//       }}
//     >
//       {photographer.name}
//     </h1>

//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 8,
//         marginBottom: 12,
//         color: "#374151",
//       }}
//     >
//       <FaStar color="#fbbf24" size={18} />
//       <span style={{ fontWeight: 600, fontSize: 16 }}>
//         {photographer.rating} / 5.0
//       </span>
//       <span style={{ color: "#9ca3af", fontSize: 14 }}>
//         • {photographer.location}
//       </span>
//     </div>

//     <p
//       style={{
//         marginBottom: 6,
//         fontSize: 15,
//         color: "#374151",
//       }}
//     >
//       <strong style={{ color: "#111827" }}>Starting Price:</strong>{" "}
//       <span style={{ color: "#059669", fontWeight: 600 }}>
//         {photographer.price}
//       </span>
//     </p>

//     <p
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 8,
//         marginBottom: 12,
//         color: "#374151",
//       }}
//     >
//       <FaPhone color="#059669" />
//       <span
//         style={{
//           fontWeight: 600,
//           letterSpacing: 0.5,
//           fontSize: 15,
//         }}
//       >
//         {photographer.phone}
//       </span>
//     </p>

//     <p
//       style={{
//         marginTop: 10,
//         fontSize: 15,
//         lineHeight: 1.6,
//         color: "#4b5563",
//         maxWidth: 600,
//       }}
//     >
//       {photographer.description}
//     </p>

//     {/* Quick Action Buttons
//     <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
//       <button
//       onClick={handleScrollToBooking}
//         style={{
//           backgroundColor: "#059669",
//           color: "white",
//           padding: "10px 20px",
//           borderRadius: 8,
//           border: "none",
//           cursor: "pointer",
//           fontWeight: 600,
//           transition: "background-color 0.3s ease",
//         }}
//         onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#047857")}
//         onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
//       >
//         Book Now
//       </button> */}
//       {/* Quick Action Buttons */}
//     <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
//       <button
//         onClick={handleScrollToBooking} // Yeh 'onClick' scroll ke liye hai jo humne pehle add kiya tha
//         style={{
//           backgroundColor: "#059669",
//           color: "white",
//           padding: "10px 20px",
//           borderRadius: 8,
//           border: "none",
//           cursor: "pointer",
//           fontWeight: 600,
//           transition: "background-color 0.3s ease",
//         }}
//         onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#047857")}
//         onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
//       >
//         Book Now
//       </button>
      
//       {/* 'View Portfolio' button yahaan se delete kar diya gaya hai */}
    
//     </div> {/* Yeh "Buttons div" ko close kar raha hai */}
//   </div> {/* Yeh "Info div" ko close kar raha hai */}
// </div> {/* Yeh poore "Header Section" ko close kar raha hai */}


// {/* Portfolio Section */}
// <PhotographerPortfolio photographer={photographer} />


// {/* Services Section */}
// <section style={{ marginBottom: 40 }}>
//   <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Services & Packages</h2>
//   <div style={{ display: "grid", gap: 20 }}>
    
//     {photographer && photographer.services && services.map((service, index) => (
//       <div key={index} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 24 }}>
//         <div style={{ display: "flex", justifyContent: "space-between" }}>
//           <h3>{service.name}</h3>
//           <span style={{ color: "#059669", fontWeight: 700 }}>{service.price}</span>
//         </div>
//         <p><strong>Duration:</strong> {service.duration}</p>
        
//         {service.includes.map((item, i) => (
//           <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             <FaCheck color="#059669" /> {item}
//           </div>
//         ))}
        
//       </div>
//     ))}
    
//   </div>
// </section>

// {/* About */}
// <section style={{ marginBottom: 40 }}ref={bookingRef}>
//   <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>About {photographer?.name?.split(" ")[0]}</h2>
//   <p style={{ backgroundColor: "#f8f9fa", padding: 24, borderRadius: 12 }}>{photographer.about}</p>
// </section>
// {/* Line 672 yahaan end hoti hai */}
//       {/* Booking Section */}
//       {/* (Keep your calendar & time selection code as is) */}
//           {/* Availability & Booking Section */}
//             <section style={{ marginBottom: 40 }}>
//               <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, borderBottom: "2px solid #e5e7eb", paddingBottom: 8 }}>
//                 Availability & Booking
//               </h2>
              
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
//                 {/* Interactive Calendar */}
//                 <div>
//                   <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                       <FaCalendar color="#059669" />
//                       <span style={{ fontWeight: 600 }}>Select Date & Time</span>
//                     </div>
//                     <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                       <button 
//                         onClick={prevMonth}
//                         style={{ 
//                           border: "none", 
//                           background: "none", 
//                           cursor: "pointer",
//                           padding: "8px",
//                           borderRadius: "50%",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center"
//                         }}
//                         onMouseEnter={(e) => e.target.style.backgroundColor = "#f3f4f6"}
//                         onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
//                       >
//                         <FaArrowLeft size={16} color="#374151" />
//                       </button>
//                       <span style={{ fontWeight: 600, minWidth: 150, textAlign: "center" }}>
//                         {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
//                       </span>
//                       <button 
//                         onClick={nextMonth}
//                         style={{ 
//                           border: "none", 
//                           background: "none", 
//                           cursor: "pointer",
//                           padding: "8px",
//                           borderRadius: "50%",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center"
//                         }}
//                         onMouseEnter={(e) => e.target.style.backgroundColor = "#f3f4f6"}
//                         onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
//                       >
//                         <FaArrowRight size={16} color="#374151" />
//                       </button>
//                     </div>
//                   </div>
                  
//                   <div style={{ 
//                     border: "1px solid #e5e7eb", 
//                     borderRadius: 12, 
//                     overflow: "hidden",
//                     backgroundColor: "white",
//                     marginBottom: 20
//                   }}>
//                     {/* Week days header */}
//                     <div style={{ 
//                       display: "grid", 
//                       gridTemplateColumns: "repeat(7, 1fr)", 
//                       backgroundColor: "#f8f9fa",
//                       borderBottom: "1px solid #e5e7eb"
//                     }}>
//                       {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
//                         <div 
//                           key={index}
//                           style={{ 
//                             padding: "12px 8px", 
//                             textAlign: "center", 
//                             fontWeight: 600,
//                             fontSize: 14,
//                             color: "#374151"
//                           }}
//                         >
//                           {day}
//                         </div>
//                       ))}
//                     </div>
                    
//                     {/* Calendar days */}
//                     {calendar.map((week, weekIndex) => (
//                       <div 
//                         key={weekIndex}
//                         style={{ 
//                           display: "grid", 
//                           gridTemplateColumns: "repeat(7, 1fr)",
//                           borderBottom: weekIndex < calendar.length - 1 ? "1px solid #e5e7eb" : "none"
//                         }}
//                       >
//                         {week.map((date, dateIndex) => {
//                           const available = isDateAvailable(date);
//                           const selected = isDateSelected(date);
//                           const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                          
//                           return (
//                             <div 
//                               key={dateIndex}
//                               onClick={() => handleDateSelect(date)}
//                               style={{ 
//                                 padding: "12px 8px", 
//                                 textAlign: "center",
//                                 backgroundColor: selected ? "#059669" : "white",
//                                 color: selected ? "white" : 
//                                       !isCurrentMonth ? "#d1d5db" :
//                                       available ? "#374151" : "#d1d5db",
//                                 fontWeight: selected ? 600 : 400,
//                                 cursor: available ? "pointer" : "not-allowed",
//                                 borderRight: dateIndex < 6 ? "1px solid #e5e7eb" : "none",
//                                 transition: "all 0.2s",
//                                 position: "relative"
//                               }}
//                               onMouseEnter={(e) => {
//                                 if (available && !selected) {
//                                   e.target.style.backgroundColor = "#f0fdf4";
//                                 }
//                               }}
//                               onMouseLeave={(e) => {
//                                 if (available && !selected) {
//                                   e.target.style.backgroundColor = "white";
//                                 }
//                               }}
//                             >
//                               {date.getDate()}
//                               {available && !selected && (
//                                 <div style={{
//                                   position: "absolute",
//                                   bottom: 2,
//                                   left: "50%",
//                                   transform: "translateX(-50%)",
//                                   width: 4,
//                                   height: 4,
//                                   backgroundColor: "#059669",
//                                   borderRadius: "50%"
//                                 }} />
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     ))}
//                   </div>
      
//                   {/* Time Slots */}
//                   {selectedDate && (
//                     <div>
//                       <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
//                         <FaClock color="#059669" />
//                         <span style={{ fontWeight: 600 }}>Available Time Slots for {selectedDate.toDateString()}</span>
//                       </div>
//                       <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
//                         {/* {photographer.workingHours.map((time, index) => ( */}
//                         {photographer && photographer.workingHours && photographer.workingHours.map((time, index) => (
//                           <button
//                             key={index}
//                             onClick={() => setSelectedTime(time)}
//                             style={{
//                               padding: "12px 16px",
//                               border: `2px solid ${selectedTime === time ? "#059669" : "#e5e7eb"}`,
//                               borderRadius: 8,
//                               backgroundColor: selectedTime === time ? "#f0fdf4" : "white",
//                               color: selectedTime === time ? "#059669" : "#374151",
//                               fontWeight: 600,
//                               cursor: "pointer",
//                               transition: "all 0.2s"
//                             }}
//                             onMouseEnter={(e) => {
//                               if (selectedTime !== time) {
//                                 e.target.style.borderColor = "#059669";
//                                 e.target.style.backgroundColor = "#f0fdf4";
//                               }
//                             }}
//                             onMouseLeave={(e) => {
//                               if (selectedTime !== time) {
//                                 e.target.style.borderColor = "#e5e7eb";
//                                 e.target.style.backgroundColor = "white";
//                               }
//                             }}
//                           >
//                             {time}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>


//                 {/* Booking Summary */}
//                 <div style={{ 
//                   border: "1px solid #e5e7eb", 
//                   borderRadius: 12, 
//                   padding: 24,
//                   backgroundColor: "white",
//                   position: "sticky",
//                   top: 20
//                 }}>
//                   <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Booking Summary</h3>
                  
//                   {selectedDate && (
//                     <div style={{ marginBottom: 20, padding: 16, backgroundColor: "#f0fdf4", borderRadius: 8 }}>
//                       <p style={{ margin: "4px 0", fontWeight: 600 }}>Selected Date:</p>
//                       <p style={{ margin: "4px 0", color: "#059669" }}>{selectedDate.toDateString()}</p>
//                       {selectedTime && (
//                         <>
//                           <p style={{ margin: "4px 0", fontWeight: 600, marginTop: 8 }}>Selected Time:</p>
//                           <p style={{ margin: "4px 0", color: "#059669" }}>{selectedTime}</p>
//                         </>
//                       )}
//                     </div>
//                   )}
                  
//                   <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    
//                     {/* YEH WALA DIV DYNAMIC HAI */}
//                     <div>
//                       <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>Event Type</label>
//                       <select style={{ 
//                         width: "100%", 
//                         padding: "12px", 
//                         border: "1px solid #d1d5db", 
//                         borderRadius: 8,
//                         fontSize: 16
//                       }}>
//                         value={eventType}
//                        onChange={(e) => setEventType(e.target.value)}
//                         {/* Yahaan purane hardcoded options nahi hain. Yeh dynamic hai. */}
//                         {photographer.eventTypes.map((type, index) => (
//                           <option key={index}>{type}</option>
//                         ))}
                        
                      
//                       </select>
//                     </div>
//                     {/* --- YEH NAYA CODE ADD KAREIN (USER NAME) --- */}
//               <div style={{ marginTop: 12 }}>
//                 <label style={{ fontWeight: 600, fontSize: 16, color: "#374151", marginBottom: 8, display: "block" }}>
//                   Your Name:
//                 </label>
//                 <input
//                   type="text"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   placeholder="Enter your full name"
//                   style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 16, boxSizing: 'border-box' }}
//                 />
//               </div>
            
//               {/* --- YEH NAYA CODE ADD KAREIN (USER PHONE) --- */}
//               <div style={{ marginTop: 12 }}>
//                 <label style={{ fontWeight: 600, fontSize: 16, color: "#374151", marginBottom: 8, display: "block" }}>
//                   Your Phone:
//                 </label>
//                 <input
//                   type="tel"
//                   value={userPhone}
//                   onChange={(e) => setUserPhone(e.target.value)}
//                   placeholder="Enter your phone number"
//                   style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 16, boxSizing: 'border-box' }}
//                 />
//               </div>
//                     {/* YAHAN TAK */}

                    
//                     <div>
//                       <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>Message</label>
//                       <textarea 
//                         style={{ 
//                           width: "100%", 
//                           padding: "12px", 
//                           border: "1px solid #d1d5db", 
//                           borderRadius: 8,
//                           fontSize: 16,
//                           minHeight: 100,
//                           resize: "vertical"
//                         }}
//                         placeholder="Tell us about your event and any specific requirements..."
//                       />
//                     </div>
                    
//                     <button 
//                       onClick={handleBookingSubmit}
//                       style={{
//                         backgroundColor: selectedDate && selectedTime ? "#059669" : "#9ca3af",
//                         color: "white",
//                         border: "none",
//                         padding: "14px 24px",
//                         borderRadius: 8,
//                         fontSize: 16,
//                         fontWeight: 600,
//                         cursor: selectedDate && selectedTime ? "pointer" : "not-allowed",
//                         transition: "background-color 0.2s"
//                       }}
//                       onMouseEnter={(e) => {
//                         if (selectedDate && selectedTime) {
//                           e.target.style.backgroundColor = "#047857";
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         if (selectedDate && selectedTime) {
//                           e.target.style.backgroundColor = "#059669";
//                         }
//                       }}
                    
//                     >

//                       {selectedDate && selectedTime ? "Confirm Booking" : "Select Date & Time"}
//                     </button>
//                       {bookingStatus && (
//     <div style={{
//       marginTop: 16,
//       padding: 12,
//       borderRadius: 8,
//       border: bookingStatus.error ? "1px solid #ef4444" : "1px solid #22c55e",
//       backgroundColor: bookingStatus.error ? "#fee2e2" : "#f0fdf4",
//       color: bookingStatus.error ? "#b91c1c" : "#15803d",
//       textAlign: 'left',
//       transition: 'all 0.3s ease'
//     }}>
//       {bookingStatus.message && (
//         <>
//           <strong style={{ display: 'block', marginBottom: 8, fontSize: 15 }}>{bookingStatus.message}</strong>
//           <div style={{ fontSize: 14 }}>Date: {bookingStatus.date}</div>
//           <div style={{ fontSize: 14 }}>Time: {bookingStatus.time}</div>
//           <div style={{ fontSize: 14 }}>Event: {bookingStatus.type}</div>
//         </>
//       )}
//       {bookingStatus.error && (
//         <strong style={{ fontSize: 14 }}>{bookingStatus.error}</strong>
//       )}
//     </div>
//   )}

//                   </div>
//                 </div>
//               </div>
//             </section>
      
        
      
//             {/* Social Icons */}
//               {/* Social Icons */}
// <div style={{
//   display: "flex",
//   gap: 16,
//   justifyContent: "center",
//   padding: "20px 0",
// }}>
//   {photographer.social?.facebook && (
//     <a
//       href={photographer.social.facebook}
//       target="_blank"
//       rel="noopener noreferrer"
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         width: 40,
//         height: 40,
//         backgroundColor: "#4267B2",
//         borderRadius: "50%",
//         color: "white",
//         transition: "transform 0.3s ease, box-shadow 0.3s ease",
//       }}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.transform = "scale(1.1)";
//         e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.transform = "scale(1)";
//         e.currentTarget.style.boxShadow = "none";
//       }}
//     >
//       <FaFacebookF size={18} />
//     </a>
//   )}

//   {photographer.social?.instagram && (
//     <a
//       href={photographer.social.instagram}
//       target="_blank"
//       rel="noopener noreferrer"
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         width: 40,
//         height: 40,
//         background:
//           "radial-gradient(circle at 30% 30%, #f58529, #dd2a7b, #8134af, #515bd4)",
//         borderRadius: "50%",
//         color: "white",
//         transition: "transform 0.3s ease, box-shadow 0.3s ease",
//       }}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.transform = "scale(1.1)";
//         e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.transform = "scale(1)";
//         e.currentTarget.style.boxShadow = "none";
//       }}
//     >
//       <FaInstagram size={18} />
//     </a>
//   )}

//   {photographer.social?.twitter && (
//     <a
//       href={photographer.social.twitter}
//       target="_blank"
//       rel="noopener noreferrer"
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         width: 40,
//         height: 40,
//         backgroundColor: "#1DA1F2",
//         borderRadius: "50%",
//         color: "white",
//         transition: "transform 0.3s ease, box-shadow 0.3s ease",
//       }}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.transform = "scale(1.1)";
//         e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.transform = "scale(1)";
//         e.currentTarget.style.boxShadow = "none";
//       }}
//     >
//       <FaTwitter size={18} />
//     </a>
//   )}
// </div>

//     </div>
//   );
// };

// export default PhotographerDetails;

