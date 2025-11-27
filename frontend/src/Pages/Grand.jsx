import React from "react";
import { useNavigate } from "react-router-dom";
import "./GrandHall.css";

export default function Grand() {
  const navigate = useNavigate();

  // Redirect to login page always when user clicks any "Check Availability" button
  const handleCheckAvailability = (item) => {
    navigate("/login");
  };

  const venues = [
    {
      id: 1,
      name: "Elite Banquets",
      img: "https://images.pexels.com/photos/3835638/pexels-photo-3835638.jpeg",
    },
    {
      id: 2,
      name: "Royal Gardens",
      img: "https://images.unsplash.com/photo-1542665952-14513db15293?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "The Heritage Club",
      img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "The Golden Atrium",
      img: "https://media.istockphoto.com/id/2153497521/photo/moroccan-cultural-wedding-organization.jpg?s=2048x2048&w=is&k=20&c=6-0YPLf-u_A8y4dEO9AuzKg1A82mdVFS6F-V-pQw2Cw=",
    },
    {
      id: 5,
      name: "The Lotus Pavilion",
      img: "https://images.pexels.com/photos/33417234/pexels-photo-33417234.jpeg",
    },
  ];

  const planners = [
    {
      id: 1,
      name: "Priya Singh",
      role: "Luxury weddings, corporate events and birthday parties",
      img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Destination weddings, engagement and corporate events",
      img: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    // {
    //   id: 3,
    //   name: "Himanshu Sharma",
    //   role: "Engagements, birthdays and luxury weddings",
    //   img: "https://media.istockphoto.com/id/1412021265/photo/head-shot-portrait-smiling-bearded-man-looking-at-camera.jpg?s=2048x2048&w=is&k=20&c=M4dFUZwVsUEUfLi5ixFjubRgx2ly-QxV5llizOAz3rs=",
    // },
    // {
    //   id: 4,
    //   name: "Aakash Pandey",
    //   role: "All types of events and parties",
    //   img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
    // },
  ];

  const photographers = [
    {
      id: 1,
      name: "Riya Photographer",
      role: "Cinematic Wedding Photography",
      img: "https://images.pexels.com/photos/4240505/pexels-photo-4240505.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 2,
      name: "Aashutosh Photographers",
      role: "Expert in all types of photography",
      img: "https://images.pexels.com/photos/3785104/pexels-photo-3785104.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  const cakes = [
    {
      id: 1,
      name: "Lavish Layer Cakes",
      role: "Multi-tier Designer Cakes",
      img: "https://images.pexels.com/photos/15591269/pexels-photo-15591269.jpeg",
    },
    {
      id: 2,
      name: "Royal Icing Bakery",
      role: "Custom Themed Cakes",
      img: "https://images.pexels.com/photos/30232984/pexels-photo-30232984.jpeg",
    },
  ];

  const attires = [
    {
      id: 1,
      name: "Royal Wedding Attire",
      role: "Designer Bridal Wear",
      img: "https://media.istockphoto.com/id/2200850333/photo/bride-with-dupatta-on-head-looking-down-in-wedding-ceremony.jpg?s=2048x2048&w=is&k=20&c=k_Smom1XAf6VqpvlrCzliVSmelpGLkuUd-by_9YzglE=",
    },
    {
      id: 2,
      name: "Alexander McQueen & Givenchy",
      role: "Luxury Groom Attire",
      img: "https://media.istockphoto.com/id/484227639/photo/traditional-ladies-wear-saries-at-marketplace-madhya-pradesh.jpg?s=2048x2048&w=is&k=20&c=PXIM2RQPBVv9BtSAn-LV1WPUEbRytXwBpRf-Dnik_fU=",
    },
  ];

  const renderCard = (item, type) => (
    <div className="gh-card" key={`${type}-${item.id}`}>
      <><div className="gh-card-media">
            <img src={item.img} alt={item.name} />
            <div className="gh-card-overlay">
                <button
                    className="gh-cta"
                    onClick={() => handleCheckAvailability({ ...item, type })}
                >
                    Check Availability
                </button>
            </div>
        </div><div className="gh-card-body">
                <h3>{item.name}</h3>
                {item.role && <p className="gh-sub">{item.role}</p>}
            </div></>
    </div>
  );

  return (
    <div className="gh-page">
      {/* HERO BANNER */}
      <section className="gh-hero">
        <img
          className="gh-hero-bg"
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1800&q=80&auto=format&fit=crop"
          alt="Grand Hall Hero"
        />
        <div className="gh-hero-content">
          <h1>Grand Settings for Unforgettable Moments</h1>
          <p>
            Discover our curated collection of grand venues and trusted vendors —
            everything you need to plan a celebration that will be remembered forever.
          </p>
        </div>
      </section>

      {/* VENUES */}
      <section className="gh-section">
        <div className="gh-section-header">
          <h2>Our Most Impressive Venues</h2>
        </div>
        <div className="gh-grid">{venues.map((v) => renderCard(v, "venue"))}</div>
      </section>

      {/* PLANNERS */}
      <section className="gh-section gh-alt">
        <div className="gh-section-header">
          <h2>Planners — Grand Events</h2>
        </div>
        <div className="gh-grid">{planners.map((p) => renderCard(p, "planner"))}</div>
      </section>

      {/* PHOTOGRAPHERS */}
      <section className="gh-section">
        <div className="gh-section-header">
          <h2>Photographers — Grand Events</h2>
        </div>
        <div className="gh-grid">
          {photographers.map((ph) => renderCard(ph, "photographer"))}
        </div>
      </section>

      {/* CAKES */}
      <section className="gh-section gh-alt">
        <div className="gh-section-header">
          <h2>Cakes — Grand Events</h2>
        </div>
        <div className="gh-grid">{cakes.map((c) => renderCard(c, "cake"))}</div>
      </section>

      {/* ATTIRES */}
      <section className="gh-section">
        <div className="gh-section-header">
          <h2>Attires — Grand Events</h2>
        </div>
        <div className="gh-grid">{attires.map((a) => renderCard(a, "attire"))}</div>
      </section>
    </div>
  );
}