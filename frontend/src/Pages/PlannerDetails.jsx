import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaPhone, FaArrowLeft, FaTimes } from "react-icons/fa";
import apiClient from '../api/axiosConfig'; // API call ke liye
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// =======================================================
// === 1. LOCAL AVAILABILITY & BOOKING COMPONENT (NEW) ===
// =======================================================

// Time slots ka dummy data
const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "03:00 PM", "04:00 PM", "05:00 PM", "07:00 PM", 
    "08:00 PM", "09:00 PM", "10:00 PM"
];

//const eventTypes = ["Wedding", "Corporate Event", "Birthday Party", "Engagement"];

const formatDate = (date) => {
    // LocalDate format (YYYY-MM-DD) mein convert karein
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};


const AvailabilityBookingComponent = ({ resourceId, resourceType,eventOptions,plannerId }) => {
  const finalEventTypes = eventOptions || ["Wedding", "Corporate Event", "Birthday Party", "Engagement"]; 
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [eventType, setEventType] = useState(eventOptions[0]);
    const [userName, setUserName] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [bookingStatus, setBookingStatus] = useState(null); // {message, error, date, etc.}
    const navigate = useNavigate();

    // Booking attempt karne ka logic
    const handleBookingSubmit = async () => {
        setBookingStatus(null); 

        // 1. Validation
        if (!selectedDate || !selectedTime || !eventType || !userName || !userPhone) {
            setBookingStatus({ 
                error: "Please select date, time, event type, and fill in your name and phone." 
            });
            setTimeout(() => setBookingStatus(null), 4000); 
            return;
        }
        
        const formattedDate = formatDate(selectedDate);
        const bookingRequest = {
            plannerId: resourceId, // Planner ID use kiya
            bookingDate: formattedDate,
            userName: userName,
            userPhone: userPhone,
            eventType: eventType
        };

        const apiEndpoint = "/api/planners/book"; 

        try {
            await apiClient.post(apiEndpoint, bookingRequest); 
            setBookingStatus({ 
                message: `Booking Confirmed!`,
                date: selectedDate?.toDateString(),
                time: selectedTime,
                type: eventType
            });
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setBookingStatus({ 
                    error: "This planner is already booked on " + formattedDate
                });

            } else {
                const errorMsg = error.response?.data?.message || "Booking failed. Please try again.";
                setBookingStatus({ error: errorMsg });
                setTimeout(() => setBookingStatus(null), 5000);
            }
        }
    };

    // Calendar ki logic
    const isDateAvailable = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    };

    return (
        <div style={bookingStyles.container}>
            {/* Left Side: Calendar and Slots */}
            <div style={bookingStyles.leftPanel}>
                <h3 style={bookingStyles.header}>Availability & Booking</h3>
                <p style={bookingStyles.subHeader}>Select Date & Time</p>
                
                {/* Calendar */}
                <div style={bookingStyles.calendarContainer}>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                            setSelectedTime(""); // Time clear karein jab date badle
                        }}
                        filterDate={isDateAvailable}
                        inline
                        minDate={new Date()}
                        // Calendar style ko adjust karein agar zaroori ho
                    />
                </div>

                {/* Available Time Slots */}
                {selectedDate && (
                    <div style={bookingStyles.slotsContainer}>
                        <p style={bookingStyles.slotsHeader}>
                            Available Time Slots for {selectedDate.toDateString()}
                        </p>
                        <div style={bookingStyles.slotsGrid}>
                            {timeSlots.map(time => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    style={{
                                        ...bookingStyles.slotButton,
                                        backgroundColor: selectedTime === time ? '#059669' : '#f0f0f0',
                                        color: selectedTime === time ? 'white' : '#333',
                                    }}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Side: Booking Summary and Form */}
            <div style={bookingStyles.rightPanel}>
                <h3 style={bookingStyles.summaryHeader}>Booking Summary</h3>
                
                {/* Form Fields */}
                <select 
                    value={eventType} 
                    onChange={(e) => setEventType(e.target.value)}
                    style={bookingStyles.inputField}
                >
                    {eventOptions.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>

                <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)}
                    style={bookingStyles.inputField}
                />

                <input 
                    type="tel" 
                    placeholder="Your Phone" 
                    value={userPhone} 
                    onChange={(e) => setUserPhone(e.target.value)}
                    style={bookingStyles.inputField}
                />
                
                <textarea 
                    placeholder="Tell us about your event and any specific requirements..."
                    rows="4"
                    style={bookingStyles.inputField}
                />

                {/* Confirm Booking Button */}
                <button 
                    onClick={handleBookingSubmit}
                    style={{
                        ...bookingStyles.bookingBtn,
                        backgroundColor: (selectedDate && selectedTime) ? '#059669' : '#ccc',
                        cursor: (selectedDate && selectedTime) ? 'pointer' : 'not-allowed',
                    }}
                    disabled={!selectedDate || !selectedTime}
                >
                    {selectedDate && selectedTime ? "Confirm Booking" : "Select Date & Time"}
                </button>

                {/* Booking Status Message */}
                {bookingStatus && (
                    <div style={{
                        ...bookingStyles.statusMessage,
                        backgroundColor: bookingStatus.error ? '#f8d7da' : '#d4edda',
                        color: bookingStatus.error ? '#721c24' : '#155724',
                        borderColor: bookingStatus.error ? '#ef4444' : '#22c55e',
                    }}>
                        {bookingStatus.error ? (
                            <strong style={{ fontSize: 15 }}>{bookingStatus.error}</strong>
                        ) : (
                            <>
                                <strong style={{ display: 'block', marginBottom: 5 }}>{bookingStatus.message}</strong>
                                <small>Date: {bookingStatus.date}, Time: {bookingStatus.time}, Event: {bookingStatus.type}</small>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Booking Component Styles ---
const bookingStyles = {
    container: {
        display: 'flex',
        gap: '40px',
        padding: '30px',
        borderRadius: '16px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        marginTop: '30px',
    },
    leftPanel: {
        flex: 1.2,
        minWidth: '350px',
    },
    rightPanel: {
        flex: 1,
        minWidth: '280px',
        padding: '20px',
        background: '#f9fafb',
        borderRadius: '12px',
    },
    header: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#059669',
        marginBottom: '15px',
    },
    subHeader: {
        fontSize: '1rem',
        fontWeight: 500,
        color: '#333',
        marginBottom: '15px',
    },
    calendarContainer: {
        // Calendar library ke styles ko override karne ke liye zaroori ho sakta hai
    },
    slotsContainer: {
        marginTop: '25px',
        paddingTop: '15px',
        borderTop: '1px solid #eee',
    },
    slotsHeader: {
        fontSize: '0.95rem',
        fontWeight: 600,
        marginBottom: '10px',
        color: '#1f2937',
    },
    slotsGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
    },
    slotButton: {
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    summaryHeader: {
        fontSize: '1.3rem',
        fontWeight: 600,
        color: '#1f2937',
        marginBottom: '20px',
    },
    inputField: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        boxSizing: 'border-box',
    },
    bookingBtn: {
        width: '100%',
        padding: '15px',
        borderRadius: '8px',
        border: 'none',
        color: 'white',
        fontSize: '1.1rem',
        fontWeight: 600,
        transition: 'background-color 0.2s',
    },
    statusMessage: {
        marginTop: 16,
        padding: 12,
        borderRadius: 8,
        border: '1px solid',
        textAlign: 'center',
        fontSize: '0.9rem',
    }
};

// =======================================================
// === 2. PlannerDetails Component (Existing Structure) ===
// =======================================================

// === Data ===
const planners = [
  // ... (Aapka diya gaya planners ka data) ...
  {
    id: 1,
    plannerName: "Priya Singh",    
    plannerImage: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg", 
    rating: 4.9,
    price: "₹15,000",
    phone: "+91 91234 56780",
    description: "Specializes in luxury weddings, corporate events, and bday parties.",
     availableEventTypes: ["Wedding", "Corporate Event", "Birthday Party"], 
   // companyName: "Elegant Events", 
    portfolio: [
        "/images/trending1.jpg", 
        "/images/trending2.jpeg", 
        "https://images.pexels.com/photos/3835638/pexels-photo-3835638.jpeg",
        "https://media.istockphoto.com/id/2153497521/photo/moroccan-cultural-wedding-organization.jpg?s=2048x2048&w=is&k=20&c=6-0YPLf-u_A8y4dEO9AuzKg1A82mdVFS6F-V-pQw2Cw=",
        "https://media.istockphoto.com/id/450955083/photo/wedding.jpg?s=1024x1024&w=is&k=20&c=NrSTxwM01CQ6k5z_R_EJ0cEjHAZ4c8essmpIzRNwdnM=",
        "https://images.pexels.com/photos/50675/banquet-wedding-society-deco-50675.jpeg",
        "https://media.istockphoto.com/id/1133692578/photo/exhibition-event-hall-blur-background-of-trade-show-business-world-or-international-expo.jpg?s=2048x2048&w=is&k=20&c=YTnHhSaD9oWH-QWORQ1V8iPxsTwug3msm4VGGReVrlo=",
        "https://media.istockphoto.com/id/2183824556/photo/three-candles-on-a-candlestick-burning-at-a-party.jpg?s=1024x1024&w=is&k=20&c=VBBFeOf2AlQFYWiNnRhFC4zjppxfb_H4yNhf4yKTQuc=",
        "https://media.istockphoto.com/id/961798406/photo/stylish-champagne-glasses-and-food-appetizers-on-table-at-wedding-reception-luxury-catering-at.jpg?s=2048x2048&w=is&k=20&c=Ijq2AuCY88HyIHk3VLlNJH85l9IQdwNNuDfaONVVqp4=",
    ],
  },
  {
    id: 2,
    plannerName: "Rajesh Kumar",   
    plannerImage: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg", 
    rating: 4.7,
    price: "₹10,000",
    phone: "+91 90123 45678",
    description: "Known for destination weddings,Engagement and corporate events.",
    availableEventTypes: ["Wedding", "Corporate Event", "Engagement"], 
    //companyName: "Dream Planners", 
    portfolio: [
      "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg", 
      "/images/trending4.jpeg",
      "/images/trending5.jpeg",
      "https://media.istockphoto.com/id/1455919586/photo/the-beautiful-decorations-cultural-program.jpg?s=1024x1024&w=is&k=20&c=J-63Pn0mhVhPT9yUBbogYGIRVGya6PTJngwpxsSgNHI=",
      "https://images.pexels.com/photos/32854448/pexels-photo-32854448.jpeg",
      "https://media.istockphoto.com/id/2238876846/photo/indian-traditional-wedding-ceremony-interiors-and-decorations.jpg?s=2048x2048&w=is&k=20&c=p7jD-TSxnGigDfhJvvdaatuwFKPQxuQnt8DLNOVqX7Y=",
      "https://media.istockphoto.com/id/1125802247/photo/abstract-blurred-image-of-conference-and-presentation-in-the-conference-hall.jpg?s=2048x2048&w=is&k=20&c=AvtzuNwftNaKMtDbB5aML2x441WxFvUn3r6jovt3Zeo=",
      "https://media.istockphoto.com/id/1059441412/photo/abstract-blurred-event-exhibition-with-people-background-business-convention-show-concept.jpg?s=2048x2048&w=is&k=20&c=sO7rKJhCkCOqP94c4_Jut3BC4e2vpUI8_SwwNLwTXgs=",
      "https://media.istockphoto.com/id/2034042466/photo/beautiful-table-decorated-for-15th-birthday.jpg?s=2048x2048&w=is&k=20&c=5l-j8nDFAuLiFAhGDs2-T-OFz3DgwOguQqUkaSMd6zI=",
      "https://media.istockphoto.com/id/2197936306/photo/birthday-party-decorations-three-tiered-cake-with-pink-roses-happy-birthday-text-topper-and.jpg?s=2048x2048&w=is&k=20&c=P-WMfPd38giHrhErH46ZYeldsDggOmHyDxxPwTh09O4=",
    ],
  },
  {
    id: 3,
    plannerName: "Himanshu Sharma",
    rating: 4.8, 
    price: "₹20,000", 
    phone: "+91 90459 84170", 
    plannerImage:"https://media.istockphoto.com/id/1412021265/photo/head-shot-portrait-smiling-bearded-man-looking-at-camera.jpg?s=2048x2048&w=is&k=20&c=M4dFUZwVsUEUfLi5ixFjubRgx2ly-QxV5llizOAz3rs=", 
    description: "Specializes in Engagement, Bday and luxary Wedding",
    availableEventTypes: ["Wedding", "Engagement", "Birthday Party"], 
    //companyName: "Sharma Events",
    portfolio: [
      "https://media.istockphoto.com/id/2172503802/photo/romantic-wedding-ceremony-on-the-sunny-beach.jpg?s=2048x2048&w=is&k=20&c=NzObe4VVkhbNU-I_AiEj4CsCIvx9JVMCzq2hxyLYblE=",
      "https://media.istockphoto.com/id/2238874796/photo/indian-traditional-wedding-ceremony-interiors-and-decorations.jpg?s=2048x2048&w=is&k=20&c=3QWPzilepCIeOQZmF6Svf89G6C0WVc2wVdYn7FGDNYQ=",
      "https://media.istockphoto.com/id/2195948319/photo/indian-wedding-interiors-and-decorations.jpg?s=2048x2048&w=is&k=20&c=yQ31b_IaY_NVQQMWALmqtfu9cr6siqsdEaXpXccRSsQ=",
      "https://media.istockphoto.com/id/2196449572/photo/indian-wedding-interiors-and-decorations.jpg?s=2048x2048&w=is&k=20&c=5NclCrOw8x3wVX9o5Mwzr-aqP6P3QCW6tvPspqVtrCI=",
      "https://media.istockphoto.com/id/1163718652/photo/delicious-wedding-reception-birthday-cake-on-a-background-balloons-party-decor-copy-space.jpg?s=2048x2048&w=is&k=20&c=0CsKiE2O2oy8xAf8iAh8vffGuHFl2csA32Kq4c5NKFo=",
      "https://media.istockphoto.com/id/1446334741/photo/desserts-and-table-decorations-for-parties-and-celebrations-photography-of-snacks-and.jpg?s=2048x2048&w=is&k=20&c=W_T4nsYSZJU1YEw5x2JHzIrNPw_6Hxuegd4VTAzyBxY=",
    ]
  },
  {
    id: 4,
    plannerName: "Aakash Pandey",
    rating: 4.6, 
    price: "₹25,000", 
    phone: "+91 90459 84170", 
    plannerImage: "https://media.istockphoto.com/id/1459185149/photo/portrait-of-young-man-shaking-head-as-yes-sign-approval.jpg?s=1024x1024&w=is&k=20&c=5bvev5LhMOH7ZCUO3jnPPCVkc0RwnMppRV0ncZZAW4Q=",
    description: "Specializes in all types of events and parties",
   availableEventTypes: ["Wedding", "Corporate Event","Engagement", "Birthday Party"], 
    //companyName: "Aakash Events",
    portfolio: [
      "https://media.istockphoto.com/id/2172827163/photo/wedding-setty-back-with-floral-decorations.jpg?s=2048x2048&w=is&k=20&c=B90kHcL20hk_-VMNysUVCfyycsxS5Y1vT9022iMENPA=",
      "https://media.istockphoto.com/id/996257874/photo/wedding-table-with-flower-compositions.jpg?s=1024x1024&w=is&k=20&c=Prx9f4FEJvBNgJR7F1VKgzmgc3fIMqWRCFoNLsvUbbM=",
      "https://images.pexels.com/photos/33417234/pexels-photo-33417234.jpeg",
      "https://images.pexels.com/photos/32994470/pexels-photo-32994470.jpeg",
      "/images/trending3.jpeg",
      "https://media.istockphoto.com/id/1454170096/photo/pink-decoration-with-balloons-and-swans-for-birthday-party.jpg?s=2048x2048&w=is&k=20&c=IdiOyGrGuYN8k_I4B6Ot8UiHH5OwxYX1PdNE5AQP3Ow=",
      "https://media.istockphoto.com/id/530686143/photo/group-of-conference-participants-standing-in-lobby-of-conference-center-socializing-during.jpg?s=2048x2048&w=is&k=20&c=silyy0mNTULmxji7j5SkdsJfBVxhWBWMBcC27JJosOM=",
      "https://media.istockphoto.com/id/521046338/photo/bokeh-light-and-blurred-people-in-convention-hall.jpg?s=2048x2048&w=is&k=20&c=CLcOXz6g37siDoh5DSUNc-RH3wY7moz1oIJuxnhxKj4=",
    ]
  }

];

// --- ---

const PlannerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // id ko number mein convert karke planner dhoondhein
  const planner = planners.find((p) => p.id === parseInt(id)); 
  const [selectedImage, setSelectedImage] = useState(null);

  // useEffect se backend se planner details fetch karein (Production use ke liye)
  /*
  useEffect(() => {
    // Backend se data fetch karne ka logic yahan aayega
    apiClient.get(/api/planners/${id})
      .then(response => setPlanner(response.data))
      .catch(error => console.error("Error fetching planner details:", error));
  }, [id]);
  */

  if (!planner) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px", color: "#6b7280" }}>
        Planner not found
      </h2>
    );
  }
  
  // Planner ID ko number mein convert karein
  const plannerId = parseInt(id); 

  return (
    <div
      style={{
        padding: "40px 24px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Header Section */}
      <header
        style={{
          textAlign: "center",
          marginBottom: "40px",
          position: "relative",
          paddingBottom: "12px",
        }}
      >
        <FaArrowLeft
          size={20}
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: "#059669",
          }}
          onClick={() => navigate(-1)} 
        />
        <h1
          style={{
            fontSize: "2.2rem",
            fontWeight: 700,
            color: "#1f2937",
            letterSpacing: "1px",
          }}
        >
          {planner.plannerName}
        </h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Rated {planner.rating} ★
        </p>
      </header>

      {/* Main Info Section */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "32px",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "50px",
          background: "linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%)",
          borderRadius: "20px",
          padding: "30px 25px",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)";
        }}
      >
        {/* Left Image (Planner Profile Photo) */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "50%",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
            width: "200px",
            height: "200px",
            flexShrink: 0,
          }}
        >
          <img
            src={planner.plannerImage}
            alt={planner.plannerName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>

        {/* Details Section */}
        <div
          style={{
            flex: 1,
            minWidth: "280px",
            background: "#ffffffcc",
            backdropFilter: "blur(6px)",
            borderRadius: "16px",
            padding: "20px 24px",
            boxShadow: "inset 0 0 10px rgba(255,255,255,0.5)",
          }}
        >
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "4px",
            }}
          >
            {planner.plannerName}
          </h2>
          
          <h3
             style={{
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "#059669",
              marginBottom: "12px",
            }}
          >
            {planner.companyName ?? "EventMate Planner"} {/* ?? default value */}
          </h3>

          <p
            style={{
              fontSize: "1rem",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#fbbf24",
            }}
          >
            <FaStar /> <strong>{planner.rating}</strong>
          </p>

          <p style={{ marginBottom: "8px", color: "#374151" }}>
            <strong style={{ color: "#059669" }}>Price:</strong> {planner.price}
          </p>

          <p
            style={{
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#059669",
              fontWeight: 500,
            }}
          >
            <FaPhone /> {planner.phone}
          </p>

          <p
            style={{
              marginTop: "14px",
              color: "#4b5563",
              lineHeight: "1.6",
              fontSize: "0.96rem",
            }}
          >
            {planner.description}
          </p>

          <div
            style={{
              marginTop: "16px",
              height: "2px",
              width: "60%",
              background: "linear-gradient(to right, #059669, transparent)",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>
      
      {/* -------------------------------------------------------------------------------- */}
      {/* --- YAHAN PAR NAYA BOOKING SECTION ADD HUA HAI (AvailabilityBookingComponent) --- */}
      {/* -------------------------------------------------------------------------------- */}
      
      {/* Portfolio Section */}
      <section>
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: 600,
            marginBottom: "16px",
            color: "#1f2937",
            textAlign: "center",
          }}
        >
          Portfolio
        </h2>

        <div
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            padding: "10px 0",
            scrollBehavior: "smooth",
          }}
        >
          {planner.portfolio.map((img, index) => (
            <div
              key={index}
              style={{
                flex: "0 0 auto",
                position: "relative",
                width: "300px",
                height: "200px",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.querySelector(".view-btn").style.opacity = 1)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.querySelector(".view-btn").style.opacity = 0)
              }
            >
              <img
                src={img}
                alt={`portfolio-${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <button
                className="view-btn"
                onClick={() => setSelectedImage(img)}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0, 0, 0, 0.6)",
                  color: "#fff",
                  border: "1px solid #fff",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                View Photo
              </button>
            </div>
          ))}
        </div>
      </section>
      <section style={{ marginBottom: "50px" }}>
        <AvailabilityBookingComponent 
            resourceId={plannerId} // Planner ki ID yahan se pass hogi
            resourceType="planner" // Booking logic ke liye type
            eventOptions={planner.availableEventTypes}
        />
      </section>
      {/* -------------------------------------------------------------------------------- */}
      

      {/* Modal for Fullscreen Image */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "2rem",
              cursor: "pointer",
            }}
          >
            <FaTimes />
          </button>
          <img
            src={selectedImage}
            alt="Fullscreen portfolio"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PlannerDetails;









// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { FaStar, FaPhone, FaArrowLeft, FaTimes } from "react-icons/fa";

// // === Data ===
// // ===== PORTFOLIO IMAGES KO UPDATE KAR DIYA GAYA HAI =====
// const planners = [
//   {
//     id: 1,
//     //companyName: "Elegant Events", 
//     plannerName: "Priya Singh",    
//     plannerImage: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg", 
//     rating: 4.9,
//     price: "₹15,000",
  
//     image: "https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg", 
//     phone: "+91 91234 56780",
//     description: "Specializes in luxury weddings, corporate events, and bday parties.",

//     portfolio: [
//       // Nayi Images (Specialization ke hisab se)
//       //trending venues sare add hai hall page mein(Weeding)
//       "/images/trending1.jpg",//1planner 
//       "/images/trending2.jpeg",//1plann
//      //// "/images/trending4.jpeg" ,//2plann
//       //"/images/trending5.jpeg",//2plann
//        //"/images/trending3.jpeg",//4 plann

//       //1 to 10  for planner
//       //weddings venue
//        "https://images.pexels.com/photos/3835638/pexels-photo-3835638.jpeg",//hall page,1 plann
//        "https://media.istockphoto.com/id/2153497521/photo/moroccan-cultural-wedding-organization.jpg?s=2048x2048&w=is&k=20&c=6-0YPLf-u_A8y4dEO9AuzKg1A82mdVFS6F-V-pQw2Cw=",//hall page,1 plann
//        "https://media.istockphoto.com/id/450955083/photo/wedding.jpg?s=1024x1024&w=is&k=20&c=NrSTxwM01CQ6k5z_R_EJ0cEjHAZ4c8essmpIzRNwdnM=",//hall page,1 plann
//       //"https://media.istockphoto.com/id/1455919586/photo/the-beautiful-decorations-cultural-program.jpg?s=1024x1024&w=is&k=20&c=J-63Pn0mhVhPT9yUBbogYGIRVGya6PTJngwpxsSgNHI=",//hall page,2plann
//       //"https://images.pexels.com/photos/32854448/pexels-photo-32854448.jpeg",//hall page,2 plann
      
//      // "https://media.istockphoto.com/id/2238876846/photo/indian-traditional-wedding-ceremony-interiors-and-decorations.jpg?s=2048x2048&w=is&k=20&c=p7jD-TSxnGigDfhJvvdaatuwFKPQxuQnt8DLNOVqX7Y=",//hall page,2plann
//       // "https://media.istockphoto.com/id/2195948319/photo/indian-wedding-interiors-and-decorations.jpg?s=2048x2048&w=is&k=20&c=yQ31b_IaY_NVQQMWALmqtfu9cr6siqsdEaXpXccRSsQ=",//hall,3 plann
//       // "https://media.istockphoto.com/id/2196449572/photo/indian-wedding-interiors-and-decorations.jpg?s=2048x2048&w=is&k=20&c=5NclCrOw8x3wVX9o5Mwzr-aqP6P3QCW6tvPspqVtrCI=",//hall//3 plann
//       // "https://images.pexels.com/photos/33417234/pexels-photo-33417234.jpeg",//hall,4 plann
//       // "https://images.pexels.com/photos/32994470/pexels-photo-32994470.jpeg",//hall,4 plann
//       //11-20
//       //corporate venue
//     "https://images.pexels.com/photos/50675/banquet-wedding-society-deco-50675.jpeg",//hall,1plann
//     "https://media.istockphoto.com/id/1133692578/photo/exhibition-event-hall-blur-background-of-trade-show-business-world-or-international-expo.jpg?s=2048x2048&w=is&k=20&c=YTnHhSaD9oWH-QWORQ1V8iPxsTwug3msm4VGGReVrlo=",//corporate images and add in hall,1 plann
//     // "https://media.istockphoto.com/id/1125802247/photo/abstract-blurred-image-of-conference-and-presentation-in-the-conference-hall.jpg?s=2048x2048&w=is&k=20&c=AvtzuNwftNaKMtDbB5aML2x441WxFvUn3r6jovt3Zeo=",//4phot//hall,2 plann
//     // "https://media.istockphoto.com/id/1059441412/photo/abstract-blurred-event-exhibition-with-people-background-business-convention-show-concept.jpg?s=2048x2048&w=is&k=20&c=sO7rKJhCkCOqP94c4_Jut3BC4e2vpUI8_SwwNLwTXgs=",//find hall//hall page,2 plann
//    //"https://media.istockphoto.com/id/821463698/photo/microphone-over-the-abstract-blurred-photo-of-conference-hall-or-seminar-room-with-attendee.jpg?s=1024x1024&w=is&k=20&c=nQMCyAx-XkqX69RolGa2THHi8XJSdthHdZ9izvArrcc=",//1 phot
   
//   //  "https://media.istockphoto.com/id/1446478773/photo/business-people-are-talking-together-during-a-teambuilding-event-in-a-luxury-restaurant.jpg?s=1024x1024&w=is&k=20&c=wnxvvWERYGtVTfrydCfUblJjIZKUSRw-vkpOOsuWzXM=",
//   //"https://media.istockphoto.com/id/530686143/photo/group-of-conference-participants-standing-in-lobby-of-conference-center-socializing-during.jpg?s=2048x2048&w=is&k=20&c=silyy0mNTULmxji7j5SkdsJfBVxhWBWMBcC27JJosOM=",//hall,4 plann
  
//   // "https://media.istockphoto.com/id/521046338/photo/bokeh-light-and-blurred-people-in-convention-hall.jpg?s=2048x2048&w=is&k=20&c=CLcOXz6g37siDoh5DSUNc-RH3wY7moz1oIJuxnhxKj4=",//remain to add in hall,4 plann
//   //bday venue
//    "https://media.istockphoto.com/id/2183824556/photo/three-candles-on-a-candlestick-burning-at-a-party.jpg?s=1024x1024&w=is&k=20&c=VBBFeOf2AlQFYWiNnRhFC4zjppxfb_H4yNhf4yKTQuc=",//hall,1 plann
//    "https://media.istockphoto.com/id/961798406/photo/stylish-champagne-glasses-and-food-appetizers-on-table-at-wedding-reception-luxury-catering-at.jpg?s=2048x2048&w=is&k=20&c=Ijq2AuCY88HyIHk3VLlNJH85l9IQdwNNuDfaONVVqp4=",//find hall page,1 plann
//    //20-30
// //   "https://media.istockphoto.com/id/1163718652/photo/delicious-wedding-reception-birthday-cake-on-a-background-balloons-party-decor-copy-space.jpg?s=2048x2048&w=is&k=20&c=0CsKiE2O2oy8xAf8iAh8vffGuHFl2csA32Kq4c5NKFo=",//bday parties images//hall,3 plann
// //   "https://media.istockphoto.com/id/1446334741/photo/desserts-and-table-decorations-for-parties-and-celebrations-photography-of-snacks-and.jpg?s=2048x2048&w=is&k=20&c=W_T4nsYSZJU1YEw5x2JHzIrNPw_6Hxuegd4VTAzyBxY=",//find hall,3 plann
// // "https://media.istockphoto.com/id/1454170096/photo/pink-decoration-with-balloons-and-swans-for-birthday-party.jpg?s=2048x2048&w=is&k=20&c=IdiOyGrGuYN8k_I4B6Ot8UiHH5OwxYX1PdNE5AQP3Ow=",//hall,4 plann
// //engagement venue
// //  "https://media.istockphoto.com/id/2034042466/photo/beautiful-table-decorated-for-15th-birthday.jpg?s=2048x2048&w=is&k=20&c=5l-j8nDFAuLiFAhGDs2-T-OFz3DgwOguQqUkaSMd6zI=",//hall page,2plann
// //  "https://media.istockphoto.com/id/2197936306/photo/birthday-party-decorations-three-tiered-cake-with-pink-roses-happy-birthday-text-topper-and.jpg?s=2048x2048&w=is&k=20&c=P-WMfPd38giHrhErH46ZYeldsDggOmHyDxxPwTh09O4=",//hall,2plann

// //  "https://media.istockphoto.com/id/2172503802/photo/romantic-wedding-ceremony-on-the-sunny-beach.jpg?s=2048x2048&w=is&k=20&c=NzObe4VVkhbNU-I_AiEj4CsCIvx9JVMCzq2hxyLYblE=",//engagement image // hall page,3plann
// //  "https://media.istockphoto.com/id/2238874796/photo/indian-traditional-wedding-ceremony-interiors-and-decorations.jpg?s=2048x2048&w=is&k=20&c=3QWPzilepCIeOQZmF6Svf89G6C0WVc2wVdYn7FGDNYQ=",//hall page,3plann
//   // "https://media.istockphoto.com/id/2172827163/photo/wedding-setty-back-with-floral-decorations.jpg?s=2048x2048&w=is&k=20&c=B90kHcL20hk_-VMNysUVCfyycsxS5Y1vT9022iMENPA=",//hall,4 plann
//   //  "https://media.istockphoto.com/id/996257874/photo/wedding-table-with-flower-compositions.jpg?s=1024x1024&w=is&k=20&c=Prx9f4FEJvBNgJR7F1VKgzmgc3fIMqWRCFoNLsvUbbM=",//hall,4 plann
   
   
//    // for photographer
// //    "https://media.istockphoto.com/id/2172827084/photo/beautiful-wedding-setty-back-with-floral-decorations.jpg?s=1024x1024&w=is&k=20&c=DmMETIVIcn7AHyXe0NKy6OVjlnTfrVDBbnsWyYQxTDQ=",
// //   //30-40
// //    "https://media.istockphoto.com/id/850920718/photo/wedding-altar-with-flowers.jpg?s=2048x2048&w=is&k=20&c=1Y0RAqwsOqWb8uXny4DlSgEUgFrkjO4x73tH5kk6QZk=",
// //   "https://media.istockphoto.com/id/2195983883/photo/indian-couples-holding-hands-close-up.jpg?s=2048x2048&w=is&k=20&c=txprTHyIkNI6hkSp8xcP8v2omDYd3xUyRFkin5qL71A=",//photographer
// //   "https://media.istockphoto.com/id/2195984095/photo/indian-couples-holding-hands-close-up.jpg?s=2048x2048&w=is&k=20&c=aRpmdV_vJO-e59HPzOgeYtMfOzjOKL9vFxMuE9k0Gyo=",
// //   "https://media.istockphoto.com/id/2195984093/photo/indian-couples-holding-hands-close-up.jpg?s=2048x2048&w=is&k=20&c=YRJR-wk4oRgwiEtMGGmsssE-8yDBdvgNlo7qJSJMSPw=",
// //  "https://media.istockphoto.com/id/1140927833/photo/bride-and-groom-hands-holding-bridal-showing-wedding-jewelry-ring-bangles.jpg?s=1024x1024&w=is&k=20&c=KkvcBfVjrueR4K1bRSJADZ9ahRd6zbA4zNp5uuexQlk=",

// //      "https://media.istockphoto.com/id/1399000012/photo/guests-throwing-confetti-over-bride-and-groom-as-they-walk-past-after-their-wedding-ceremony.jpg?s=2048x2048&w=is&k=20&c=G8zuGJUuEK9HXwx1xEYPYwrcajt8r3K8nSVFeEzLHFY=",//couple
// //       "https://media.istockphoto.com/id/1190043570/photo/happy-wedding-photography-of-bride-and-groom-at-wedding-ceremony-wedding-tradition-sprinkled.jpg?s=1024x1024&w=is&k=20&c=dEnXwMGSpfySpEepRWDVY_c7pHyhOZpv2RG5_QggqzY=",
// //       "https://media.istockphoto.com/id/1397574789/photo/together-we-make-the-world-better.jpg?s=1024x1024&w=is&k=20&c=8caxy0OpDGOc5qA-M-JpMN4cxVMOFJrXgfOASXk43Qo=",
// //       "https://media.istockphoto.com/id/1191384303/photo/kids-birthday-party-outdoors-in-garden-in-summer-celebration-concept.jpg?s=1024x1024&w=is&k=20&c=XC9KYXoOakanikSIeZrKfvv6OPAhYC8U848pqoVT6wY=",//bday
// //         "https://media.istockphoto.com/id/1458481862/photo/asian-chinese-lesbian-couple-celebrating-birthday-outdoor-dining-with-friends.jpg?s=2048x2048&w=is&k=20&c=J99r0-JWty-ESlqyfGBh88G0BR6YoqdVeRO89jZms5k=",//4
// //          //40-50
// //         "https://media.istockphoto.com/id/1215683644/photo/friends-celebration-birthday-with-cake.jpg?s=2048x2048&w=is&k=20&c=WhEZeIT2eG2cmIPO1o5WNYXudRjOEK3nTiqMOtzw_GA=",
// //         "https://media.istockphoto.com/id/1173607293/photo/100-years-old-birthday-cake-to-old-woman.jpg?s=2048x2048&w=is&k=20&c=dlpQ5XkT9v_NFA7icrN9F5wBxJEknxJt1tJhAaH-LGQ=",
// //           "https://media.istockphoto.com/id/1002144354/photo/friends-presenting-birthday-cake-to-girl.jpg?s=2048x2048&w=is&k=20&c=FAr-blR20QVjKvgDdwOXMb7LFntO3I6oH1YMrEJGnhc=",
// //          "https://media.istockphoto.com/id/655007524/photo/friends-give-a-birthday-cake-to-their-friend.jpg?s=2048x2048&w=is&k=20&c=Pz-K99DTjjQwEvMnhXPqBIaB3eSlUUla-ca-ky0SyYI=",
// //          "https://media.istockphoto.com/id/907380874/photo/excited-young-woman-gets-birthday-cake.jpg?s=2048x2048&w=is&k=20&c=3vTwmedQ1W1r1GfO-hFClxBQ4HQp-BP5GyZAarEwKCQ=",
// //          "https://media.istockphoto.com/id/851103324/photo/closeup-groom-and-bride-are-holding-hands-at-wedding-day-ang-show-rings-concept-of-love-family.jpg?s=1024x1024&w=is&k=20&c=M79IQgooL3hnBw8zznW3mQhtCeI2V5x5FBj4gFPJt5A=",
// //          //4
// //          "https://media.istockphoto.com/id/1187919612/photo/commitment.jpg?s=2048x2048&w=is&k=20&c=vTG_PHFWQuG2cOKhC94Umf22os5SYYlqIBdA84oC5n0=",
// //            "https://media.istockphoto.com/id/893123282/photo/wedding-champagne-toast-stock-image.jpg?s=2048x2048&w=is&k=20&c=Mt9OAW6_IvMQKyuf9GtMzyjlHGt45nfIFhvdKpRnAMo=",
// //           "https://media.istockphoto.com/id/1193554655/photo/bride-and-groom-holding-hands.jpg?s=1024x1024&w=is&k=20&c=XKDHER3z0YJDXKKrKGeuTkoQCR3KYd1Z5EYiZzPHlIE=",
// //            "https://media.istockphoto.com/id/668001632/photo/bride-hands-with-ring-and-wedding-bouquet-of-flowers.jpg?s=1024x1024&w=is&k=20&c=QE9SouNmnNrzv6sM_FENNQtl0DK0LE1sr_3XFS_-hvs=",//4pho
// //           //50-60
// //         //    "https://media.istockphoto.com/id/1468883858/photo/wedding-ceremony-of-the-newlyweds-on-the-glade.jpg?s=2048x2048&w=is&k=20&c=aEE2_dOWCK4F4F261ivqwcDC1m3lFXmwJtngl7RY2G4=",3photo
// //         //     "https://media.istockphoto.com/id/1468888361/photo/wedding-ceremony-of-the-newlyweds-on-the-glade.jpg?s=1024x1024&w=is&k=20&c=QH_6nug8e433mWH13Y5Bpyvxuk1CG7C5Ieo7GyneE7s=",
// //         //  "https://media.istockphoto.com/id/1468886519/photo/wedding-ceremony-of-the-newlyweds-on-the-glade.jpg?s=2048x2048&w=is&k=20&c=YhL7QaXOB9o37sIlnhxix7-jWEKL0zbfjQsgJWX6378=",//also for wedding planner
// //           "https://media.istockphoto.com/id/1468885278/photo/wedding-ceremony-of-the-newlyweds-on-the-glade.jpg?s=2048x2048&w=is&k=20&c=emAM8gucxecDAPWO9Q1ejaO68ejc-fRh4SBg6rp2BUI=",
// //          "https://media.istockphoto.com/id/1468883993/photo/wedding-ceremony-of-the-newlyweds-on-the-glade.jpg?s=2048x2048&w=is&k=20&c=L0IwnX99DKP_NOnp8pWWJnvZJhRBeyVhi3ZeRr3Ztfc=",
         
// //          "https://media.istockphoto.com/id/1211496765/photo/indian-bride-hands-with-henna-tattoo-ready-for-traditional-wedding-ceremony.jpg?s=2048x2048&w=is&k=20&c=FZr2GQ7GPzPg8qun-Y-TdAm9YcZ9UY6FHZn7lj7ZcLc=",
// //          "https://media.istockphoto.com/id/1400225567/photo/floral-offerings-to-the-bride.jpg?s=2048x2048&w=is&k=20&c=Hoi-IJeYeDkTnGk3aPhRGbD834L4ShNb5EL1yfx2iXo=",
// //          "https://media.istockphoto.com/id/489247146/photo/happy-indian-couple-at-their-wedding.jpg?s=2048x2048&w=is&k=20&c=SR1jOlZnH7BTxtvXyLMGs22UmXQBdtauqu5xH9ph9dc=",//4photo
// //          "https://media.istockphoto.com/id/2200874372/photo/loving-groom-and-bride-in-wedding-ceremony.jpg?s=2048x2048&w=is&k=20&c=3-yzOCjE4tgRJbmsZjpWEKneJYqRmXd4c_oZ7LSNGHE=",
// //          "https://media.istockphoto.com/id/2200874881/photo/loving-groom-looking-at-bride-in-wedding-ceremony.jpg?s=2048x2048&w=is&k=20&c=NnZkm8DnV2igmuuMx1APvrY7z1HO1nKiog0ADQM7hQs=",
// //          //61
// //          "https://media.istockphoto.com/id/486879530/photo/happy-indian-couple-at-their-wedding.jpg?s=2048x2048&w=is&k=20&c=fzH7OAy9tuPnvsiUqfz8bzO5kOWcLrJuCr_McSbYPF8=",
        
// //          "https://media.istockphoto.com/id/1454343788/photo/closeup-of-the-groom-and-the-bride-holding-hands-during-a-traditional-indian-wedding.jpg?s=2048x2048&w=is&k=20&c=vNxV-p1JuGUn-DePdtcrNXDzqr1cvpDugaJpIjfGQmA=",
// //          "https://media.istockphoto.com/id/2200577335/photo/happy-bride-showing-bangles-to-groom-in-wedding-ceremony.jpg?s=2048x2048&w=is&k=20&c=P0t0fbgKxykXhksxFluDRFriFVDa54ycV171ylyboGw=",

//     ],
//   },
//   {
//     id: 2,
//     //companyName: "Dream Planners", 
//     plannerName: "Rajesh Kumar",   
//     plannerImage: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg", 
//     rating: 4.7,
//     price: "₹10,000",
  
//     image: "https://images.pexels.com/photos/3757144/pexels-photo-3757144.jpeg",
//     phone: "+91 90123 45678",
//     description: "Known for destination weddings,Engagement and corporate events.",
//     portfolio: [
//       // Nayi Images (Specialization ke hisab se)
//      // "https://images.pexels.com/photos/32854448/pexels-photo-32854448.jpeg",
//       "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg", // Destination Wedding (Beach)
//       //"https://media.istockphoto.com/id/1455919586/photo/the-beautiful-decorations-cultural-program.jpg?s=1024x1024&w=is&k=20&c=J-63Pn0mhVhPT9yUBbogYGIRVGya6PTJngwpxsSgNHI=",
//       //"https://media.istockphoto.com/id/1125802247/photo/abstract-blurred-image-of-conference-and-presentation-in-the-conference-hall.jpg?s=2048x2048&w=is&k=20&c=AvtzuNwftNaKMtDbB5aML2x441WxFvUn3r6jovt3Zeo=",
//       //"https://media.istockphoto.com/id/1059441412/photo/abstract-blurred-event-exhibition-with-people-background-business-convention-show-concept.jpg?s=2048x2048&w=is&k=20&c=sO7rKJhCkCOqP94c4_Jut3BC4e2vpUI8_SwwNLwTXgs=",
//        // "https://media.istockphoto.com/id/1446334741/photo/desserts-and-table-decorations-for-parties-and-celebrations-photography-of-snacks-and.jpg?s=2048x2048&w=is&k=20&c=W_T4nsYSZJU1YEw5x2JHzIrNPw_6Hxuegd4VTAzyBxY=",
//         //"https://media.istockphoto.com/id/2172827163/photo/wedding-setty-back-with-floral-decorations.jpg?s=2048x2048&w=is&k=20&c=B90kHcL20hk_-VMNysUVCfyycsxS5Y1vT9022iMENPA=",
//        // "https://media.istockphoto.com/id/821463698/photo/microphone-over-the-abstract-blurred-photo-of-conference-hall-or-seminar-room-with-attendee.jpg?s=1024x1024&w=is&k=20&c=nQMCyAx-XkqX69RolGa2THHi8XJSdthHdZ9izvArrcc=",
//    //"https://media.istockphoto.com/id/1446478773/photo/business-people-are-talking-together-during-a-teambuilding-event-in-a-luxury-restaurant.jpg?s=1024x1024&w=is&k=20&c=wnxvvWERYGtVTfrydCfUblJjIZKUSRw-vkpOOsuWzXM=",
//   //"https://media.istockphoto.com/id/530686143/photo/group-of-conference-participants-standing-in-lobby-of-conference-center-socializing-during.jpg?s=2048x2048&w=is&k=20&c=silyy0mNTULmxji7j5SkdsJfBVxhWBWMBcC27JJosOM=",
//      "/images/trending4.jpeg" ,//2plann
//       "/images/trending5.jpeg",//2plann
//       "https://media.istockphoto.com/id/1455919586/photo/the-beautiful-decorations-cultural-program.jpg?s=1024x1024&w=is&k=20&c=J-63Pn0mhVhPT9yUBbogYGIRVGya6PTJngwpxsSgNHI=",//hall page
//       "https://images.pexels.com/photos/32854448/pexels-photo-32854448.jpeg",//hall page
      
//       "https://media.istockphoto.com/id/2238876846/photo/indian-traditional-wedding-ceremony-interiors-and-decorations.jpg?s=2048x2048&w=is&k=20&c=p7jD-TSxnGigDfhJvvdaatuwFKPQxuQnt8DLNOVqX7Y=",//hall page
//      "https://media.istockphoto.com/id/1125802247/photo/abstract-blurred-image-of-conference-and-presentation-in-the-conference-hall.jpg?s=2048x2048&w=is&k=20&c=AvtzuNwftNaKMtDbB5aML2x441WxFvUn3r6jovt3Zeo=",//4phot//hall
//     "https://media.istockphoto.com/id/1059441412/photo/abstract-blurred-event-exhibition-with-people-background-business-convention-show-concept.jpg?s=2048x2048&w=is&k=20&c=sO7rKJhCkCOqP94c4_Jut3BC4e2vpUI8_SwwNLwTXgs=",//find hall//hall page
//     "https://media.istockphoto.com/id/2034042466/photo/beautiful-table-decorated-for-15th-birthday.jpg?s=2048x2048&w=is&k=20&c=5l-j8nDFAuLiFAhGDs2-T-OFz3DgwOguQqUkaSMd6zI=",//hall page
//  "https://media.istockphoto.com/id/2197936306/photo/birthday-party-decorations-three-tiered-cake-with-pink-roses-happy-birthday-text-topper-and.jpg?s=2048x2048&w=is&k=20&c=P-WMfPd38giHrhErH46ZYeldsDggOmHyDxxPwTh09O4=",//hall


//     ],
//   },
//     // Himanshu ka data
//   {
//     id: 3,
//     plannerName: "Himanshu Sharma",
//     rating: 4.8, 
    
//     price: "₹20000", 
//     phone: "=91 90459 84170", 
//     plannerImage:"https://media.istockphoto.com/id/1412021265/photo/head-shot-portrait-smiling-bearded-man-looking-at-camera.jpg?s=2048x2048&w=is&k=20&c=M4dFUZwVsUEUfLi5ixFjubRgx2ly-QxV5llizOAz3rs=",  // Yahan profile pic ka link daalein
//     description: "Specializes in Engagement, Bday and luxary Wedding",
//     portfolio: [
//     "https://media.istockphoto.com/id/2172503802/photo/romantic-wedding-ceremony-on-the-sunny-beach.jpg?s=2048x2048&w=is&k=20&c=NzObe4VVkhbNU-I_AiEj4CsCIvx9JVMCzq2hxyLYblE=",//engagement image // hall page
//  "https://media.istockphoto.com/id/2238874796/photo/indian-traditional-wedding-ceremony-interiors-and-decorations.jpg?s=2048x2048&w=is&k=20&c=3QWPzilepCIeOQZmF6Svf89G6C0WVc2wVdYn7FGDNYQ=",//hall page
//   "https://media.istockphoto.com/id/2195948319/photo/indian-wedding-interiors-and-decorations.jpg?s=2048x2048&w=is&k=20&c=yQ31b_IaY_NVQQMWALmqtfu9cr6siqsdEaXpXccRSsQ=",//hall
//       "https://media.istockphoto.com/id/2196449572/photo/indian-wedding-interiors-and-decorations.jpg?s=2048x2048&w=is&k=20&c=5NclCrOw8x3wVX9o5Mwzr-aqP6P3QCW6tvPspqVtrCI=",//hall
//         "https://media.istockphoto.com/id/1163718652/photo/delicious-wedding-reception-birthday-cake-on-a-background-balloons-party-decor-copy-space.jpg?s=2048x2048&w=is&k=20&c=0CsKiE2O2oy8xAf8iAh8vffGuHFl2csA32Kq4c5NKFo=",//bday parties images//hall
//   "https://media.istockphoto.com/id/1446334741/photo/desserts-and-table-decorations-for-parties-and-celebrations-photography-of-snacks-and.jpg?s=2048x2048&w=is&k=20&c=W_T4nsYSZJU1YEw5x2JHzIrNPw_6Hxuegd4VTAzyBxY=",//find hall



//     ]
//   },

//   // Aakash ka data
//   {
//     id: 4,
//     plannerName: "Aakash Pandey",
  
//     rating: 4.6, 
     
//     price: "₹25000", 
//     phone: "9045984170", // Number check kar lein
//     plannerImage: "https://media.istockphoto.com/id/1459185149/photo/portrait-of-young-man-shaking-head-as-yes-sign-approval.jpg?s=1024x1024&w=is&k=20&c=5bvev5LhMOH7ZCUO3jnPPCVkc0RwnMppRV0ncZZAW4Q=", // Yahan profile pic ka link daalein
//     description: "Specializes in all types of events and parties",
//     portfolio: [
//     "https://media.istockphoto.com/id/2172827163/photo/wedding-setty-back-with-floral-decorations.jpg?s=2048x2048&w=is&k=20&c=B90kHcL20hk_-VMNysUVCfyycsxS5Y1vT9022iMENPA=",//hall
//    "https://media.istockphoto.com/id/996257874/photo/wedding-table-with-flower-compositions.jpg?s=1024x1024&w=is&k=20&c=Prx9f4FEJvBNgJR7F1VKgzmgc3fIMqWRCFoNLsvUbbM=",//hall
//   "https://images.pexels.com/photos/33417234/pexels-photo-33417234.jpeg",//hall
//       "https://images.pexels.com/photos/32994470/pexels-photo-32994470.jpeg",//hall
//        "/images/trending3.jpeg",
// "https://media.istockphoto.com/id/1454170096/photo/pink-decoration-with-balloons-and-swans-for-birthday-party.jpg?s=2048x2048&w=is&k=20&c=IdiOyGrGuYN8k_I4B6Ot8UiHH5OwxYX1PdNE5AQP3Ow=",
// "https://media.istockphoto.com/id/530686143/photo/group-of-conference-participants-standing-in-lobby-of-conference-center-socializing-during.jpg?s=2048x2048&w=is&k=20&c=silyy0mNTULmxji7j5SkdsJfBVxhWBWMBcC27JJosOM=",//hall
  
//    "https://media.istockphoto.com/id/521046338/photo/bokeh-light-and-blurred-people-in-convention-hall.jpg?s=2048x2048&w=is&k=20&c=CLcOXz6g37siDoh5DSUNc-RH3wY7moz1oIJuxnhxKj4=",//remain to add in hall

//     ]
//   }

//   // --- YAHAN TAK ADD KAREIN ---


// ];

// // --- ---

// const PlannerDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const planner = planners.find((p) => p.id === parseInt(id));
//   const [selectedImage, setSelectedImage] = useState(null);

//   if (!planner) {
//     return (
//       <h2 style={{ textAlign: "center", marginTop: "50px", color: "#6b7280" }}>
//         Planner not found
//       </h2>
//     );
//   }

//   return (
//     <div
//       style={{
//         padding: "40px 24px",
//         maxWidth: "1200px",
//         margin: "0 auto",
//         fontFamily: "Poppins, sans-serif",
//       }}
//     >
//       {/* Header Section */}
//       <header
//         style={{
//           textAlign: "center",
//           marginBottom: "40px",
//           position: "relative",
//           paddingBottom: "12px",
//         }}
//       >
//         <FaArrowLeft
//           size={20}
//           style={{
//             position: "absolute",
//             left: 0,
//             top: "50%",
//             transform: "translateY(-50%)",
//             cursor: "pointer",
//             color: "#059669",
//           }}
//           onClick={() => navigate(-1)} 
//         />
//         <h1
//           style={{
//             fontSize: "2.2rem",
//             fontWeight: 700,
//             color: "#1f2937",
//             letterSpacing: "1px",
//           }}
//         >
//           {planner.plannerName} {/* Yahaan plannerName aa gaya */}
//         </h1>
//         <p style={{ color: "#6b7280", marginTop: "8px" }}>
//           {planner.location} • Rated {planner.rating} ★
//         </p>
//       </header>

//       {/* Main Info Section (UPDATED) */}
//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: "32px",
//           alignItems: "center",
//           justifyContent: "center",
//           marginBottom: "50px",
//           background: "linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%)",
//           borderRadius: "20px",
//           padding: "30px 25px",
//           boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
//           transition: "transform 0.3s ease, box-shadow 0.3s ease",
//         }}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.transform = "translateY(-4px)";
//           e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.12)";
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.transform = "translateY(0)";
//           e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)";
//         }}
//       >
//         {/* Left Image (Ab Planner ki Profile Photo) */}
//         <div
//           style={{
//             position: "relative",
//             overflow: "hidden",
//             borderRadius: "50%", // Photo ko gol kar diya
//             boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
//             width: "200px", // Size adjust kiya
//             height: "200px", // Size adjust kiya
//             flexShrink: 0, // Taaki image choti na ho
//           }}
//         >
//           <img
//             src={planner.plannerImage} // src ko plannerImage se badal diya
//             alt={planner.plannerName}  // alt ko plannerName se badal diya
//             style={{
//               width: "100%", // Fit karne ke liye
//               height: "100%", // Fit karne ke liye
//               objectFit: "cover",
//               transition: "transform 0.4s ease",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//             onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//           />
//         </div>

//         {/* Details Section (UPDATED) */}
//         <div
//           style={{
//             flex: 1,
//             minWidth: "280px",
//             background: "#ffffffcc",
//             backdropFilter: "blur(6px)",
//             borderRadius: "16px",
//             padding: "20px 24px",
//             boxShadow: "inset 0 0 10px rgba(255,255,255,0.5)",
//           }}
//         >
//           <h2
//             style={{
//               fontSize: "1.6rem",
//               fontWeight: 600,
//               color: "#111827",
//               marginBottom: "4px", // Margin kam kiya
//             }}
//           >
//             {planner.plannerName} {/* Yahaan plannerName hai */}
//           </h2>
          
//           <h3
//              style={{
//               fontSize: "1.1rem", // Company ka naam thoda chhota
//               fontWeight: 500,
//               color: "#059669", // Company ko highlight kiya
//               marginBottom: "12px",
//             }}
//           >
//             {planner.companyName} {/* Yahaan companyName hai */}
//           </h3>

//           <p
//             style={{
//               fontSize: "1rem",
//               marginBottom: "10px",
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               color: "#fbbf24",
//             }}
//           >
//             <FaStar /> <strong>{planner.rating}</strong>
//           </p>

//           {/* <p style={{ marginBottom: "8px", color: "#374151" }}> */}
//             {/* <strong style={{ color: "#059669" }}>Location:</strong> {planner.location} */}
//           {/* </p> */}

//           <p style={{ marginBottom: "8px", color: "#374151" }}>
//             <strong style={{ color: "#059669" }}>Price:</strong> {planner.price}
//           </p>

//           <p
//             style={{
//               marginBottom: "10px",
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               color: "#059669",
//               fontWeight: 500,
//             }}
//           >
//             <FaPhone /> {planner.phone}
//           </p>

//           <p
//             style={{
//               marginTop: "14px",
//               color: "#4b5563",
//               lineHeight: "1.6",
//               fontSize: "0.96rem",
//             }}
//           >
//             {planner.description}
//           </p>

//           {/* Fancy Divider */}
//           <div
//             style={{
//               marginTop: "16px",
//               height: "2px",
//               width: "60%",
//               background: "linear-gradient(to right, #059669, transparent)",
//               borderRadius: "4px",
//             }}
//           />
//         </div>
//       </div>

//       {/* Portfolio Section (Yeh waisa hi rahega) */}
//       <section>
//         <h2
//           style={{
//             fontSize: "1.8rem",
//             fontWeight: 600,
//             marginBottom: "16px",
//             color: "#1f2937",
//             textAlign: "center",
//           }}
//         >
//           Portfolio
//         </h2>

//         <div
//           style={{
//             display: "flex",
//             gap: "16px",
//             overflowX: "auto",
//             padding: "10px 0",
//             scrollBehavior: "smooth",
//           }}
//         >
//           {planner.portfolio.map((img, index) => (
//             <div
//               key={index}
//               style={{
//                 flex: "0 0 auto",
//                 position: "relative",
//                 width: "300px",
//                 height: "200px",
//                 borderRadius: "12px",
//                 overflow: "hidden",
//                 boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//                 cursor: "pointer",
//                 transition: "transform 0.3s ease",
//               }}
//               onMouseEnter={(e) =>
//                 (e.currentTarget.querySelector(".view-btn").style.opacity = 1)
//               }
//               onMouseLeave={(e) =>
//                 (e.currentTarget.querySelector(".view-btn").style.opacity = 0)
//               }
//             >
//               <img
//                 src={img}
//                 alt={`portfolio-${index}`}
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                 }}
//               />
//               <button
//                 className="view-btn"
//                 onClick={() => setSelectedImage(img)}
//                 style={{
//                   position: "absolute",
//                   bottom: "10px",
//                   left: "50%",
//                   transform: "translateX(-50%)",
//                   background: "rgba(0, 0, 0, 0.6)",
//                   color: "#fff",
//                   border: "1px solid #fff",
//                   padding: "6px 14px",
//                   borderRadius: "20px",
//                   fontSize: "0.9rem",
//                   cursor: "pointer",
//                   opacity: 0,
//                   transition: "opacity 0.3s ease",
//                 }}
//               >
//                 View Photo
//               </button>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Modal for Fullscreen Image */}
//       {selectedImage && (
//         <div
//           onClick={() => setSelectedImage(null)}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             background: "rgba(0, 0, 0, 0.8)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//         >
//           <button
//             onClick={() => setSelectedImage(null)}
//             style={{
//               position: "absolute",
//               top: "20px",
//               right: "20px",
//               background: "transparent",
//               border: "none",
//               color: "white",
//               fontSize: "2rem",
//               cursor: "pointer",
//             }}
//           >
//             <FaTimes />
//           </button>
//           <img
//             src={selectedImage}
//             alt="Fullscreen portfolio"
//             style={{
//               maxWidth: "90%",
//               maxHeight: "90%",
//               objectFit: "contain",
//               borderRadius: "8px",
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default PlannerDetails;