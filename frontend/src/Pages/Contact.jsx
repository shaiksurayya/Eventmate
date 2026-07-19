// import React from 'react';
// import './Contact.css'; // ✨ Nayi CSS file import karein
// import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'; // ✨ Icons import karein

// const Contact = () => {
//   return (
//     <div className="contact-page-container">
//       {/* --- Page ka Header Section --- */}
//       <div className="contact-header">
//         <h1>Get In Touch</h1>
//         <p>We're here to help you plan smarter & celebrate better.</p>
//       </div>

//       {/* --- Form aur Info ka Main Container --- */}
//       <div className="contact-main-content">
//         {/* Left Column: Form */}
//         <div className="contact-form-section">
//           <h2>Send us a Message</h2>
//           <form>
//             <div className="form-group">
//               <label htmlFor="name">Your full name</label>
//               <input type="text" id="name" placeholder="Your full name" required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="email">Email</label>
//               <input type="email" id="email" placeholder="you@example.com" required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="message">Message</label>
//               <textarea id="message" rows="6" placeholder="Write your message..." required></textarea>
//             </div>
//             <button type="submit" className="submit-btn">Send Message</button>
//           </form>
//         </div>

//         {/* Right Column: Contact Info */}
//         <div className="contact-info-section">
//           <h2>Contact Info</h2>
//           <p>
//             Have any questions about planning your next event? Our team is ready to assist you.
//           </p>
//           <div className="info-item">
//             <FaEnvelope className="info-icon" />
//             <span>eventmate.planner.ai@gmail.com</span>
//           </div>
//           <div className="info-item">
//             <FaPhone className="info-icon" />
//             <span>+1 (555) 123-4567</span>
//           </div>
//           <div className="info-item">
//             <FaMapMarkerAlt className="info-icon" />
//             <span>123 Event Avenue, Lucknow, UP</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contact;








import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://eventmate-production-b589.up.railway.app/api/contact/send', formData);
      alert(response.data);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      alert('Error sending message. Try again!');
      console.error(error);
    }
  };

  return (
    <div className="contact-page-container">
      <div className="contact-header">
        <h1>Get In Touch</h1>
        <p>We're here to help you plan smarter & celebrate better.</p>
      </div>
      <div className="contact-main-content">
        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your full name</label>
              <input type="text" id="name" placeholder="Your full name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="6" placeholder="Write your message..." value={formData.message} onChange={handleChange} required></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>

        <div className="contact-info-section">
          <h2>Contact Info</h2>
          <p>Have any questions about planning your next event? Our team is ready to assist you.</p>
          <div className="info-item">
            <FaEnvelope className="info-icon" />
            <span>eventmate.planner.ai@gmail.com</span>
          </div>
          <div className="info-item">
            <FaPhone className="info-icon" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="info-item">
            <FaMapMarkerAlt className="info-icon" />
            <span>123 Event Avenue, Lucknow, UP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
