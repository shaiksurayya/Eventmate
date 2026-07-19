import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      clearMessage();
      return;
    }

    try {
      const response = await fetch('https://eventmate-production-b589.up.railway.app/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setMessage(`Thanks for subscribing, ${email}!`);
        setEmail('');
      } else {
        const errorText = await response.text();
        setMessage(errorText); // shows backend message (like duplicate email)
      }

      clearMessage();
    } catch (error) {
      setMessage('Something went wrong. Please try again later.');
      console.error(error);
      clearMessage();
    }
  };

  const clearMessage = () => {
    setTimeout(() => {
      setMessage('');
    }, 5000); // clears message after 5 seconds
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>EventMate AI</h4>
            <p>Your intelligent partner in crafting unforgettable events. We use AI to simplify planning and booking.</p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Signup</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Subscribe to our Newsletter</h4>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
            {message && <p className="newsletter-message">{message}</p>}
          </div>
        </div>

        <div className="copyright">
          © 2025 EventMate AI, All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
