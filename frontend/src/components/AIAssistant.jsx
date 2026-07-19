import React, { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { Cakes } from "../pages/Cakes";
import { attires } from "../pages/Attire";

// --- Helper Functions ---
// (In functions mein koi badlaav nahi hai, yeh sab sahi hain)

// Event Type
const getEventTypeFromMessage = (text) => {
  if (text.includes("bday") || text.includes("birthday")) return "Birthday Party";
  if (text.includes("wedding")) return "Wedding";
  if (text.includes("corporate") || text.includes("business")) return "Corporate Event";
  if (text.includes("engagement") || text.includes("sagai")) return "Engagement";
  return null;
};

// Date
const parseDateFromText = (text) => {
    const months = { jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12", january: "01", february: "02", march: "03", april: "04", june: "06", july: "07", august: "08", september: "09", october: "10", november: "11", december: "12" };
    const monthDayRegex = /(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s(\d{1,2})(?:st|nd|rd|th)?(?:,?\s(\d{4}|\d{2})?)?/i;
    const dayMonthRegex = /(\d{1,2})(?:st|nd|rd|th)?\s(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:,?\s(\d{4}d{2})?)?/i;
    const euRegex = /(\d{2})[-\s./](\d{2})[-\s./](\d{4})/;
    const isoRegex = /(\d{4})[-\s./](\d{2})[-\s./](\d{2})/;
    let match;
    let day, monthName, year, month;
    const getYear = (yr) => {
        if (yr && yr.length === 2) return `20${yr}`;
        return yr || new Date().getFullYear();
    };
    match = text.match(monthDayRegex);
    if (match) {
        day = match[2]; monthName = match[1].substring(0, 3).toLowerCase(); year = getYear(match[3]); month = months[monthName];
        if (day && month && year) return `${year}-${month}-${String(day).padStart(2, '0')}`;
    }
    match = text.match(dayMonthRegex);
    if (match) {
        day = match[1]; monthName = match[2].substring(0, 3).toLowerCase(); year = getYear(match[3]); month = months[monthName];
        if (day && month && year) return `${year}-${month}-${String(day).padStart(2, '0')}`;
    }
    match = text.match(euRegex);
    if (match) return `${match[3]}-${match[2]}-${match[1]}`;
    match = text.match(isoRegex);
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;
    return null;
};

// Venue Name
// Venue Name
const getVenueNameFromMessage = (text, venueList) => {
  // 'text' pehle se hi lowercase hai
  let foundVenue = null;
  let longestMatchLength = 0;

  for (const venue of venueList) {
    // 1. Hall ka poora naam lowercase mein lein (e.g., "the skyview terrace")
    const fullNameLower = venue.hallName.toLowerCase();
    
    // 2. Hall ka "simple" naam (bina "The " ke) bhi lein (e.g., "skyview terrace")
    const simpleNameLower = fullNameLower.replace(/^the\s/i, '');

    let matchFound = false;
    let currentMatchLength = 0;

    // 3. Check karein ki kya user ka text poore naam se match karta hai
    if (text.includes(fullNameLower)) {
        matchFound = true;
        currentMatchLength = fullNameLower.length;
    } 
    // 4. Ya check karein ki kya user ka text "simple" naam se match karta hai
    else if (text.includes(simpleNameLower) && simpleNameLower.length > 0) {
        matchFound = true;
        currentMatchLength = simpleNameLower.length;
    }

    // 5. Sabse lamba match chunein (taaki "Skyview Terrace" "Skyview" se pehle match ho)
    if (matchFound && currentMatchLength > longestMatchLength) {
      foundVenue = venue.hallName; // Hamesha original naam return karein
      longestMatchLength = currentMatchLength;
    }
  }
  
  return foundVenue;
};
// Location
const getLocationFromMessage = (text) => {
  const locations = ["pune", "delhi", "mumbai", "bangalore", "lucknow", "chennai"];
  for (const loc of locations) {
    const regex = new RegExp(`\\b${loc}\\b`, 'i');
    if (regex.test(text)) {
      return loc.charAt(0).toUpperCase() + loc.slice(1);
    }
  }
  return null;
};

// Food Preference
const getFoodPrefFromMessage = (text) => {
  if (/\bnon-?veg\b/i.test(text)) return "Non-Veg";
  if (/\bveg\b/i.test(text)) return "Veg";
  if (/\bboth\b/i.test(text)) return "Both";
  return null;
};

// Budget Range
const getBudgetRangeFromMessage = (text) => {
    const parseNum = (numStr) => parseInt(String(numStr).replace(/[, ]/g, ''));
    const numRegexStr = "([\\d,]+(?:\\.\\d+)?)";
    const rangeRegex = new RegExp(`(?:between\\s+)?${numRegexStr}\\s*(?:and|to|-)\\s*${numRegexStr}`, 'i');
    let match = text.match(rangeRegex);
    if (match) {
        return { minBudget: parseNum(match[1]), maxBudget: parseNum(match[2]) };
    }
    const underRegex = new RegExp(`(?:under|below|less than|max(?:imum)?(?: budget)?)\\s+${numRegexStr}`, 'i');
    match = text.match(underRegex);
    if (match) {
        return { minBudget: null, maxBudget: parseNum(match[1]) };
    }
    const overRegex = new RegExp(`(?:over|above|more than|min(?:imum)?(?: budget)?)\\s+${numRegexStr}`, 'i');
    match = text.match(overRegex);
    if (match) {
        return { minBudget: parseNum(match[1]), maxBudget: null };
    }
    const aroundRegex = new RegExp(`(?:around|approx(?:imately)?)\\s+${numRegexStr}`, 'i');
    match = text.match(aroundRegex);
     if (match) {
        const budget = parseNum(match[1]);
        const margin = budget * 0.2;
        return { minBudget: Math.max(0, Math.floor(budget - margin)), maxBudget: Math.ceil(budget + margin) };
    }
    if (text.includes("budget")) {
        const numRegexGlobal = new RegExp(numRegexStr, 'g');
        const numbers = text.match(numRegexGlobal);
        if (numbers) {
            const parsedNumbers = numbers.map(parseNum).sort((a, b) => a - b);
            if (parsedNumbers.length === 1) {
                const budget = parsedNumbers[0];
                const margin = budget * 0.2;
                return { minBudget: Math.max(0, Math.floor(budget - margin)), maxBudget: Math.ceil(budget + margin) };
            } else if (parsedNumbers.length > 1) {
                return { minBudget: parsedNumbers[0], maxBudget: parsedNumbers[parsedNumbers.length - 1] };
            }
        }
    }
    return { minBudget: null, maxBudget: null };
};

// Capacity
const getCapacityFromMessage = (text) => {
    const rangeRegex = /(\d+)\s*[-to]+\s*(\d+)\s+(?:people|guests|capacity)\b/i;
    const specificRegex = /(\d+)\s+(?:people|guests)\b/i;
    const capacityRegex = /\bcapacity\s*(\d+)\b/i;
    const forRegex = /\bfor\s*(\d+)\b/i;
    let match = text.match(rangeRegex);
    if (match) return { minCapacity: parseInt(match[1]), maxCapacity: parseInt(match[2]) };
    match = text.match(specificRegex) || text.match(capacityRegex);
    if (match) {
        return { minCapacity: parseInt(match[1]), maxCapacity: null };
    }
    match = text.match(forRegex);
    if (match && !text.match(rangeRegex) && !text.match(specificRegex) && !text.match(capacityRegex)){
         return { minCapacity: parseInt(match[1]), maxCapacity: null };
    }
    return { minCapacity: null, maxCapacity: null };
};


// --- React Component ---
const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I'm EventMate Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const [allVenueNames, setAllVenueNames] = useState([]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchVenueNames = async () => {
       try {
         const response = await axios.get("http://localhost:8080/api/halls");
         setAllVenueNames(response.data.map(hall => ({ hallId: hall.hallId, hallName: hall.hallName })));
       } catch (error) {
         console.error("Could not fetch venue names:", error);
       }
    };
    fetchVenueNames();
  }, []);
  // 🔽 YAHAN POORA NAYA FUNCTION ADD KAREIN 🔽
  // 🔼 YAHAN TAK 🔼

const handleFrontendQuery = (lowerMessage) => {
    
    // --- Cake Logic ---
    if (lowerMessage.includes("cake") || lowerMessage.includes("bakery") || lowerMessage.includes("flabour")) {
      let results = cakes; // Sabhi cakes se shuru karein
      let criteria = "";   // User ko batane ke liye ki kya filter hua

      // === 1. Location Filter (Yeh pehle se tha) ===
      const locations = ["pune", "delhi", "mumbai", "bangalore", "lucknow", "chennai"];
      let foundLoc = null;
      for (const loc of locations) {
        if (lowerMessage.includes(loc)) {
          foundLoc = loc.charAt(0).toUpperCase() + loc.slice(1);
          break;
        }
      }
      if (foundLoc) {
        results = results.filter(c => c.location === foundLoc);
        criteria += ` in ${foundLoc}`;
      }
      // === 1b. Generic Flavour Query ===
// (Jab user "list of flavour" pooche)
const flavourKeywords = [
    "chocolate", "vanilla", "red velvet", "strawberry", "pineapple", 
    "butterscotch", "oreo", "mango", "lemon", "black forest", "marble", 
    "coconut", "orange", "salted caramel", "coffee", "almond", 
    "peanut butter", "matcha", "pistachio", "funfetti", "tiramisu", "blueberry"
];

// 🔽 YAHAN NAYA CODE PASTE KAREIN 🔽
if (lowerMessage.includes("flavour") && !flavourKeywords.some(f => lowerMessage.includes(f))) {
  // Agar user ne "flavour" poocha, lekin koi specific flavour (jaise chocolate) nahi bataya

  // Check karein ki user "list" ya "all" maang raha hai
  if (lowerMessage.includes("list") || lowerMessage.includes("all")) {
    const flavourList = cakes.map(c => `• ${c.name}:\n  ${c.flavour}`).join('\n\n');
    return `Here is the list of all available flavours by shop:\n\n${flavourList}`;
  }

  // Wahi purana fallback agar user "list" nahi poochta
  return "You can see the flavours for each shop on the 'Cakes' page, or ask me about a specific bakery (e.g., 'what flavours does Sweet Delights have?').";
}
      let foundFlavours = [];

      // Check karein ki user ne kaunse flavours pooche hain
      for (const flavour of flavourKeywords) {
        if (lowerMessage.includes(flavour)) {
          foundFlavours.push(flavour);
        }
      }

      // Agar user ne flavour poocha hai, toh results ko filter karein
      if (foundFlavours.length > 0) {
        results = results.filter(cake => {
          const cakeFlavoursLower = cake.flavour.toLowerCase();
          // Check karein ki cake ke flavour string mein user ke pooche gaye SABHI flavours hain ya nahi
          return foundFlavours.every(f => cakeFlavoursLower.includes(f));
        });
        // Criteria message ko update karein
        criteria += ` with ${foundFlavours.join(' and ')}`;
      }
      
      // === 3. Price Range Filter (Yeh aapke paas pehle se sahi chal raha hai) ===
      // Jaise "between 2,000-4,000"
      const priceRegex = /between\s*([\d,]+)\s*-\s*([\d,]+)/i;
      const priceMatch = lowerMessage.match(priceRegex);
      
      if (priceMatch) {
        const minPrice = parseInt(priceMatch[1].replace(/,/g, ''));
        const maxPrice = parseInt(priceMatch[2].replace(/,/g, ''));
        
        results = results.filter(cake => {
            // Cake ke price string se min/max nikalein (e.g., "₹ 2,000 - 4,000...")
            const cakePriceMatch = cake.price.match(/([\d,]+)\s*-\s*([\d,]+)/);
            if (cakePriceMatch) {
                const cakeMin = parseInt(cakePriceMatch[1].replace(/,/g, ''));
                const cakeMax = parseInt(cakePriceMatch[2].replace(/,/g, ''));
                // Check karein ki price range overlap hoti hai ya nahi
                return cakeMin >= minPrice && cakeMax <= maxPrice;
            }
            return false;
        });
        criteria += ` in the price range ₹${minPrice}-₹${maxPrice}`;
      }

      // === 4. Specific Shop Flavour Query (Jab user ek dukan ke flavour pooche) ===
      for (const cake of cakes) {
          if (lowerMessage.includes(cake.name.toLowerCase()) && (lowerMessage.includes("flavour") || lowerMessage.includes("flavor"))) {
              return `${cake.name} offers these flavours: ${cake.flavour}`;
          }
      }
      
     // 🔽 YAHAN SE BADLEIN 🔽
// === 5. Generic Price/Budget Query ===
if ((lowerMessage.includes("price") || lowerMessage.includes("budget")) && lowerMessage.includes("cake")) {

  // Check karein ki user "list" ya "common price" maang raha hai
  if (lowerMessage.includes("list") || lowerMessage.includes("all budget") || lowerMessage.includes("common price")) {
    const priceList = cakes.map(c => `• ${c.name}: ${c.price}`).join('\n');
    return `Here are the price ranges for all cake shops:\n${priceList}`;
  }

  // Purana fallback jawaab agar user sirf "price" pooche
  return "You can find the price for each cake on the 'Cakes' page by clicking on them.";
}
// 🔼 YAHAN TAK 🔼 
      // === Final Reply ===
      if (results.length === 0) {
        // Agar koi result nahi mila
        return `Sorry, I couldn't find any cake shops${criteria}.`;
      }
      
      // Agar filter ke baad bhi saare results aa gaye (matlab user ne sirf "cake" likha)
      if (results.length === cakes.length && criteria.length === 0) {
           const names = results.map(c => `• ${c.name} (${c.location})`).join('\n');
           return `Okay, I found these cake shops:\n${names}`;
      }
      
      // Filtered reply (jab location, flavour, ya price se filter hua ho)
      const names = results.map(c => `• ${c.name} (${c.location})`).join('\n');
      return `Okay, I found these cake shops${criteria}:\n${names}`;
    }

    // --- Attire Logic (Isko waise hi rehne dein jaisa pehle tha) ---
    if (lowerMessage.includes("attire") || lowerMessage.includes("dress") || lowerMessage.includes("outfit") || lowerMessage.includes("shop of attire")) {
      let results = attires; 
      let criteria = "";
      
      const locations = ["pune", "delhi", "mumbai", "bangalore", "lucknow", "chennai"];
      let foundLoc = null;
      for (const loc of locations) {
        if (lowerMessage.includes(loc)) {
          foundLoc = loc.charAt(0).toUpperCase() + loc.slice(1);
          break;
        }
      }
      if (foundLoc) {
        results = results.filter(a => a.location === foundLoc);
        criteria = ` in ${foundLoc}`;
      }
      // 🔽 YAHAN SE NAYA CODE ADD KAREIN 🔽

// === Price Range Filter (YAHI ADD KARNA HAI) ===
const priceRegex = /between\s*([\d,]+)\s*-\s*([\d,]+)/i;
const priceMatch = lowerMessage.match(priceRegex);

if (priceMatch) {
  const minPrice = parseInt(priceMatch[1].replace(/,/g, ''));
  const maxPrice = parseInt(priceMatch[2].replace(/,/g, ''));

  results = results.filter(attire => {
      // Attire ke price string se min/max nikalein (e.g., "₹ 1,75000 - 10,00000")
      // 💥 Note: Hum yahan bhi wahi logic use kar rahe hain jo 'Cakes' ke liye kiya tha
      const attirePriceMatch = attire.price.match(/([\d,]+)\s*-\s*([\d,]+)/);
      if (attirePriceMatch) {
          const attireMin = parseInt(attirePriceMatch[1].replace(/,/g, ''));
          const attireMax = parseInt(attirePriceMatch[2].replace(/,/g, ''));

          // Check karein ki attire ki range user ke budget ke ANDAR hai
          return attireMin >= minPrice && attireMax <= maxPrice;
      }
      return false;
  });
  criteria += ` in the price range ₹${minPrice}-₹${maxPrice}`;
}
// 🔽 YAHAN SE BADLEIN 🔽
// === Generic Price/Budget Query (YAHI NAYA HAI) ===
if ((lowerMessage.includes("price") || lowerMessage.includes("budget")) && lowerMessage.includes("attire")) {

  // Check karein ki user "list" ya "common price" maang raha hai
  if (lowerMessage.includes("list") || lowerMessage.includes("all budget") || lowerMessage.includes("common price")) {
    const priceList = attires.map(a => `• ${a.name}: ${a.price}`).join('\n');
    return `Here are the price ranges for all attire shops:\n${priceList}`;
  }

  // Purana fallback jawaab agar user sirf "price" pooche
  return "You can find the price range for each attire shop on the 'Attire' page.";
}
// 🔼 YAHAN TAK 🔼
      if (results.length === 0) return "Sorry, I couldn't find any attire shops matching that criteria.";
      
      const names = results.map(a => `• ${a.name} (${a.location})`).join('\n');
      return `Okay, I found these attire shops${criteria}:\n${names}`;
    }
    
    return null; // Agar cake/attire ka sawaal nahi hai, toh null return karein
  };

  // --- HANDLE SEND FUNCTION (Yahi Combined Logic Hai) ---
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const messageText = input.trim();
    const lowerMessage = messageText.toLowerCase();
    setInput("");

    setMessages((prev) => [...prev, { sender: "bot", text: "🤖 Searching..." }]);
       // 🔽 YAHAN SE NAYA CODE ADD KAREIN 🔽

// 1. Pehle frontend logic (Cake/Attire) check karein
const frontendReply = handleFrontendQuery(lowerMessage);

if (frontendReply) {
  // Agar frontend se jawaab mil gaya (Cake/Attire)
  setMessages((prev) => {
    const updated = [...prev];
    const searchMsgIndex = updated.findIndex(m => m.text === "🤖 Searching...");
    if (searchMsgIndex !== -1) {
        updated[searchMsgIndex] = { sender: "bot", text: frontendReply };
    } else {
        // Failsafe
        updated[updated.length - 1] = { sender: "bot", text: frontendReply };
    }
    return updated;
  });
  return; // Function ko yahin rok dein, backend call na karein
}

// 2. Agar frontend se jawaab nahi mila, tabhi backend logic run karein
// (Neeche ka code aapka existing backend logic hai, usko waise hi rehne dein)

// --- 🔼 YAHAN TAK NAYA CODE ADD KAREIN 🔼 ---

    // Sabhi entities ko extract karein
    const eventType = getEventTypeFromMessage(lowerMessage);
    const detectedDate = parseDateFromText(lowerMessage);
    const venueName = getVenueNameFromMessage(lowerMessage, allVenueNames);
    const location = getLocationFromMessage(lowerMessage);
    const foodPref = getFoodPrefFromMessage(lowerMessage);
    const budgetInfo = getBudgetRangeFromMessage(lowerMessage);
    const capacityInfo = getCapacityFromMessage(lowerMessage);
    
    // Destructure karein
    const { minBudget, maxBudget } = budgetInfo;
    const { minCapacity, maxCapacity } = capacityInfo;
    
    let botReply = "";
    let calledSpecificAPI = false;
    
    // --- Yahi hai mukhya logic ---
    let useSmartBot = false;
    
    // Planner aur Photographer ke keywords
    const smartKeywords = [
        "planner", "planners", "priya", "rajesh", "himanshu", "aakash", // Planner
        "photographer", "photographers", "riya", "chandan", "aashutosh", // Photographer
        "specialization", "price", "rating" // General
    ];
    
    // 1. Check karein ki kya yeh "smart" sawaal hai
    for (const keyword of smartKeywords) {
        if (lowerMessage.includes(keyword)) {
            useSmartBot = true;
            break;
        }
    }

    // 2. Agar smart sawaal nahi hai, toh Venue logic chalaayein
    if (!useSmartBot) {
        // Priority 1: Specific Hall + Date Check
        if (venueName && detectedDate) {
          calledSpecificAPI = true;
          try {
            const response = await axios.get(`http://localhost:8080/api/halls/check-availability?hallName=${encodeURIComponent(venueName)}&date=${detectedDate}`);
            botReply = response.data.message;
          } catch (err) {
            botReply = "⚠️ Sorry, I couldn't check that specific venue.";
          }
        }
        // Priority 2: General Search (Date, Location, etc.)
        else if (detectedDate || location || foodPref || minBudget !== null || maxBudget !== null || minCapacity !== null || maxCapacity !== null || eventType || lowerMessage.includes("venue")) {
          calledSpecificAPI = true;
          try {
            const params = new URLSearchParams();
            if (detectedDate) params.append('date', detectedDate);
            if (location) params.append('location', location);
            if (foodPref) params.append('food', foodPref);
            if (minBudget !== null) params.append('minBudget', minBudget);
            if (maxBudget !== null) params.append('maxBudget', maxBudget);
            if (minCapacity !== null) params.append('minCapacity', minCapacity);
            if (maxCapacity !== null) params.append('maxCapacity', maxCapacity);
            if (eventType) params.append('eventType', eventType);

            const response = await axios.get(`http://localhost:8080/api/halls/search?${params.toString()}`);

            if (response.status === 204 || response.data.length === 0) {
              botReply = "Sorry, I couldn't find any venues matching all your criteria.";
            } else {
              const hallNames = response.data.map(hall => hall.hallName).join('\n• ');
              let criteriaDesc = [];
              if (location) criteriaDesc.push(`in ${location}`);
              if (foodPref) criteriaDesc.push(`with ${foodPref} food`);
              if (minBudget !== null && maxBudget !== null) criteriaDesc.push(`between ₹${minBudget.toLocaleString()}-₹${maxBudget.toLocaleString()}`);
              else if (minBudget !== null) criteriaDesc.push(`above ₹${minBudget.toLocaleString()}`);
              else if (maxBudget !== null) criteriaDesc.push(`under ₹${maxBudget.toLocaleString()}`);
              if (minCapacity !== null && maxCapacity !== null) criteriaDesc.push(`for ${minCapacity}-${maxCapacity} guests`);
              else if (minCapacity !== null) criteriaDesc.push(`for ${minCapacity}+ guests`);
              if (detectedDate) criteriaDesc.push(`available on ${detectedDate}`);

              botReply = `Okay, I found these venues ${criteriaDesc.join(' ')}:\n• ${hallNames}`;
            }
          } catch (err) {
            botReply = "⚠️ Sorry, I had trouble searching for venues.";
          }
        }
        // Priority 3: Only Event Type search
        else if (eventType) {
          calledSpecificAPI = true;
          try {
            const response = await axios.get(`http://localhost:8080/api/halls/by-event-type?type=${encodeURIComponent(eventType)}`);
            if (response.status === 204 || response.data.length === 0) {
              botReply = `Sorry, I couldn't find any specific venues listed primarily for ${eventType}.`;
            } else {
              const hallNames = response.data.map(hall => hall.hallName).join('\n• ');
              botReply = `Here are venues suitable for a ${eventType}:\n• ${hallNames}`;
            }
          } catch (err) {
            botReply = "⚠️ Sorry, I had trouble getting that list.";
          }
        }
    }
    // --- Venue Logic Khatam ---


    // Priority 4: Fallback to Smart Bot
    // (Agar yeh 'smart' sawaal tha, ya agar koi venue API call nahi hui)
    if (useSmartBot || !calledSpecificAPI) {
        try {
            console.log("Calling Smart Bot API (/api/bot/ask) for query:", messageText); // DEBUG
            const response = await axios.post("http://localhost:8080/api/bot/ask", {
                query: messageText 
            });
            
            botReply = response.data.answer;

        } catch (err) {
            console.error("Error calling Smart Bot API (/api/bot/ask):", err);
            botReply = "⚠️ Sorry, I'm having trouble connecting to the chat server.";
        }
    }

    // Final message ko update karein
    setMessages((prev) => {
      const updated = [...prev];
      const searchMsgIndex = updated.findIndex(m => m.text === "🤖 Searching...");
      if (searchMsgIndex !== -1) {
          updated[searchMsgIndex] = { sender: "bot", text: botReply };
      } else {
          updated[updated.length - 1] = { sender: "bot", text: botReply };
      }
      return updated;
    });
  };
    // --- HANDLE SEND FUNCTION KHATAM ---
  return (
     <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
            backgroundColor: "#4A90E2", // Brighter blue
            color: "white",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: 'none', // Remove border
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)", // Stronger shadow
            cursor: "pointer",
            fontSize: '24px', // Larger emoji
            transition: 'transform 0.2s ease-in-out', // Add transition
         }}
         // Add hover effect
         onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
         onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
          🤖
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: 'absolute', // Position relative to the button container
            bottom: '75px', // Place above the button
            right: '0', // Align to the right
            width: "340px", // Slightly wider
            height: "500px", // Slightly taller
            backgroundColor: "#f9f9f9", // Lighter background
            border: "1px solid #ddd", // Subtle border
            borderRadius: "15px", // Softer corners
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)", // Softer shadow
            transition: 'opacity 0.3s ease, transform 0.3s ease', // Animation
            opacity: 1,
            transform: 'translateY(0)'
          }}
        >
          {/* Header */}
          <div
            style={{
              //backgroundColor: "#4A90E2", // Match button blue
              backgroundColor: "black",
              color: "white",
              padding: "12px 15px", // Adjust padding
              fontWeight: "600", // Slightly bolder
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "1rem", // Standard size
              borderTopLeftRadius: '15px', // Match parent rounding
              borderTopRightRadius: '15px',
            }}
          >
            <span>EventMate Bot 🤖</span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "1.1rem", // Slightly larger close icon
                padding: '5px' // Easier to click
              }}
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "15px", // More padding
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px", // Slightly more space
              background: '#ffffff', // White message area background
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end",
                  backgroundColor: msg.sender === "bot" ? "#ECEFF1" : "#4A90E2", // Bot: light grey, User: blue
                  color: msg.sender === "bot" ? "#263238" : "#fff", // Darker text for bot
                  padding: "10px 15px", // Adjust padding
                  borderRadius: "20px", // More rounded bubbles
                  maxWidth: "85%", // Allow slightly wider messages
                  whiteSpace: "pre-line", // Keep line breaks
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)", // Subtle shadow on bubbles
                  wordWrap: 'break-word', // Ensure long words wrap
                  fontSize: '0.95rem' // Slightly adjust font size
                }}
              >
                {/* Render text, potentially handling markdown or links later */}
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef}></div> {/* For auto-scrolling */}
          </div>

          {/* Input */}
          <div style={{ display: "flex", padding: "10px 15px", borderTop: "1px solid #ddd", background: '#f0f0f0' }}>
             <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === "Enter" && handleSend()}
               placeholder="Ask me about venues or planners..." // More specific placeholder
               style={{
                 flex: 1,
                 padding: "10px 15px", // Match button padding
                 borderRadius: "20px", // Match bubble rounding
                 border: "1px solid #ccc",
                 outline: "none",
                 fontSize: '0.95rem',
               }}
             />
            <button
              onClick={handleSend}
              style={{
                marginLeft: "10px", // More space
                backgroundColor: "#4A90E2", // Match user bubble/button blue
                color: "white",
                border: "none",
                padding: "10px 18px", // Adjust padding
                borderRadius: "20px", // Match input rounding
                fontWeight: "600", // Bolder text
                cursor: "pointer",
                fontSize: '0.95rem',
                transition: 'background-color 0.2s ease', // Hover effect
              }}
              // Add hover effect
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#357ABD'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4A90E2'}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default AIAssistant;