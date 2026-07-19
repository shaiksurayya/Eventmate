import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindHall.css'; // Sunishchit karein ki CSS file ka path sahi hai

const FindHall = () => {
    const navigate = useNavigate();

    // Database se aaye saare venues ko store karega
    const [allVenues, setAllVenues] = useState([]);

    // Saare filters ke liye states
    const [searchTerm, setSearchTerm] = useState('');
    
    // ✅ YAHAN BADLAAV KIYA GAYA HAI: 'eventType' ko 'category' kar diya hai
    const [category, setCategory] = useState('All'); 
    
    const [location, setLocation] = useState('All');
    const [foodPref, setFoodPref] = useState('All');
    const [capacity, setCapacity] = useState('All');
    const [budget, setBudget] = useState('All');

    // Backend se data fetch karne ke liye
    useEffect(() => {
        const fetchHalls = async () => {
            try {
                // Backend API se data fetch karein
                const response = await fetch('https://eventmate-production-b589.up.railway.app/api/halls');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // Database fields ko component ke anusaar map karein
                const formattedData = data.map(hall => ({
                    id: hall.hallId,
                    name: hall.hallName,
                    category: hall.categories, // Hum is field ka istemaal karenge
                    image: hall.imageLink,
                    location: hall.location,
                    eventType: hall.eventType, // Yeh abhi bhi data mein hai, par hum filter ke liye 'category' use karenge
                    food: hall.food,
                    capacity: hall.capacity,
                    budget: hall.budget
                }));

                setAllVenues(formattedData);
            } catch (error) {
                console.error("Error fetching hall data:", error);
            }
        };

        fetchHalls();
    }, []); // Empty array ka matlab hai ki yeh sirf ek baar component load hone par chalega

    
    // --- YEH SABSE ZAROORI HISSA HAI (FILTERING LOGIC) ---
    const filteredVenues = useMemo(() => {
        let venues = allVenues;

        // 1. Search term filter
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase().trim();
            venues = venues.filter(venue =>
                venue.name && venue.name.toLowerCase().includes(lowerSearchTerm)
            );
        }

        // 2. Event type (Category) filter
        if (category !== 'All') {
            const lowerCategory = category.toLowerCase().trim();
            venues = venues.filter(venue =>
                // Sunishchit karein ki yeh 'venue.category' ko check kar raha hai
                venue.category && venue.category.toLowerCase().trim() === lowerCategory
            );
        }

        // 3. Location filter (Yeh aapka sahi kaam kar raha hai)
        if (location !== 'All') {
            const lowerLocation = location.toLowerCase().trim();
            venues = venues.filter(venue =>
                venue.location && venue.location.toLowerCase().trim() === lowerLocation
            );
        }

        // 4. Food preference filter
        if (foodPref !== 'All') {
            const lowerFoodPref = foodPref.toLowerCase().trim();
            venues = venues.filter(venue =>
                // Sunishchit karein ki yeh 'venue.food' ko check kar raha hai
                venue.food && venue.food.toLowerCase().trim() === lowerFoodPref
            );
        }

        // 5. Capacity filter (Yeh aapka sahi kaam kar raha hai)
        if (capacity !== 'All') {
            const [min, max] = capacity.split('-').map(Number);
            venues = venues.filter(venue => 
                venue.capacity >= min && (max ? venue.capacity <= max : true)
            );
        }

        // 6. Budget filter (Yeh aapka sahi kaam kar raha hai)
        if (budget !== 'All') {
            const [min, max] = budget.split('-').map(Number);
            venues = venues.filter(venue => 
                venue.budget >= min && (max ? venue.budget <= max : true)
            );
        }

        return venues; // Filter ki hui list return karein

    }, [searchTerm, category, location, foodPref, capacity, budget, allVenues]);
  
    const handleCheckAvailability = (venueId) => {
        navigate(`/venue/${venueId}`);
    };

    // --- YEH POORA JSX (HTML) HAI ---
    return (
        <div className="find-hall-container">
            {/* ✅ YEH POORA SIDEBAR AB WAPAS SAHI HAI */}
            <aside className="sidebar">
                <h3>Find Halls</h3>
                
                {/* Search Bar */}
                <div className="filter-group">
                    <label htmlFor="hallSearch">Search Event Hall Name</label>
                    <input
                        type="text"
                        id="hallSearch"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        list="hall-names"
                    />
                    <datalist id="hall-names">
                        {allVenues.map(venue => (
                            <option key={venue.id} value={venue.name} />
                        ))}
                    </datalist>
                </div>
                
            {/* Event Type Dropdown (Sahi Spelling ke Saath) */}
                <div className="filter-group">
                    <label>Select Event Type</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="All">All</option>
                        {/* Database se 100% match karti hui values */}
                        <option value="Engagement">Engagement</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Birthday Party">Birthday Party</option> {/* 'P' bada hai */}
                        <option value="Corporate Event">Corporate Event</option>
                    </select>
                </div>

                {/* Location Dropdown (Yeh pehle se sahi tha) */}
                <div className="filter-group">
                    <label>Select Location</label>
                    <select value={location} onChange={(e) => setLocation(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Pune">Pune</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Lucknow">Lucknow</option>
                        <option value="Chennai">Chennai</option>
                    </select>
                </div>
                
                {/* Food Dropdown (Sahi Spelling ke Saath) */}
                <div className="filter-group">
                    <label>Food Preference</label>
                    <select value={foodPref} onChange={(e) => setFoodPref(e.target.value)}>
                        <option value="All">All</option>
                        {/* Database se 100% match karti hui values */}
                        <option value="Both">Both</option>
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                    </select>
                </div>

                {/* Capacity Dropdown */}
                <div className="filter-group">
                    <label>Capacity</label>
                    <select value={capacity} onChange={(e) => setCapacity(e.target.value)}>
                        <option value="All">All</option>
                        <option value="500-1000">500-1000</option>
                        <option value="1000-2000">1000-2000</option>
                        <option value="2000-3000">2000-3000</option>
                    </select>
                </div>

                {/* Budget Dropdown */}
                <div className="filter-group">
                    <label>Budget (In INR)</label>
                    <select value={budget} onChange={(e) => setBudget(e.target.value)}>
                        <option value="All">All</option>
                        <option value="50000-100000">50000-100000</option>
                        <option value="100000-200000">100000-200000</option>
                        <option value="200000-300000">200000-300000</option>
                    </select>
                </div>
            </aside>

            {/* --- YEH MAIN CONTENT AREA HAI JAHAN HALLS DIKHTE HAIN --- */}
            <main className="main-content">
                <div className="halls-grid">
                    {/* Check karein ki filter ke baad halls bache hain ya nahi */}
                    {filteredVenues.length > 0 ? (
                        // Agar halls hain, toh unhein map karke dikhayein
                        filteredVenues.map(venue => (
                            <div className="hall-card" key={venue.id}>
                                <div className="hall-image-container">
                                    <img src={venue.image} alt={venue.name} className="hall-image" />
                                </div>
                                <div className="hall-details">
                                    <h4>{venue.name}</h4>
                                    <button
                                        className="availability-btn"
                                        onClick={() => handleCheckAvailability(venue.id)}
                                    >
                                        Check Availability
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Agar koi hall nahi mila, toh yeh message dikhayein
                        <p className="no-results">No halls found matching your criteria.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FindHall;
