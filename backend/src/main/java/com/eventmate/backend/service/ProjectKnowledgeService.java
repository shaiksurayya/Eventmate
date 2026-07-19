package com.eventmate.backend.service;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;

import io.github.cdimascio.dotenv.Dotenv;

@Service
public class ProjectKnowledgeService {

    private final Map<String, String> knowledgeBase;
    private final String apiKey;

    public ProjectKnowledgeService() {
        Dotenv dotenv = Dotenv.configure()
        .ignoreIfMissing()
        .load();
        this.apiKey = dotenv.get("OPENROUTER_API_KEY");

        this.knowledgeBase = new HashMap<>();

        // --- Teammate ka Knowledge (Project Files, Venues) ---
        knowledgeBase.put("hall.java", "Hall.java is the JPA Entity for venue/hall details. It stores info like name, location, capacity, and price per day. It maps to the 'halls' database table.");
        knowledgeBase.put("loginrequest.java", "LoginRequest.java is a DTO (Data Transfer Object) used to receive user credentials (username and password) from the frontend during the login process.");
        knowledgeBase.put("jwtauthfilter.java", "JwtAuthFilter.java is a crucial Spring Security filter. Its job is to intercept every incoming request, extract the JWT token, validate it, and set the user's authentication context.");
        knowledgeBase.put("trendingvenues.jsx", "TrendingVenues.jsx is a React component on the user's dashboard. It fetches and displays a list of the most popular halls/venues based on booking history.");
        knowledgeBase.put("aiassistant.jsx", "AIAssistant.jsx is the main React component responsible for rendering the EventMate Bot chat interface on the frontend and sending user queries to the backend.");
        knowledgeBase.put("hall booking flow", "The hall booking flow involves the user selecting a hall, submitting a request (handled by HallBookingController), and the booking details being saved in the 'bookings' table.");
        knowledgeBase.put("user.java", "User.java is the JPA Entity for storing user data like email, password, and roles (USER or OWNER).");
        knowledgeBase.put("securityconfig.java", "SecurityConfig.java is where we configure Spring Security. It defines which endpoints are public (like /api/auth/login) and which are private.");
        knowledgeBase.put("owner", "An 'Owner' is a type of user who can register their own venues (halls) in the system. They have a separate dashboard to manage their bookings.");
        knowledgeBase.put("controller", "A 'Controller' in Spring Boot (like HallController.java) handles incoming API requests from the frontend and sends back a response.");
        knowledgeBase.put("hello", "Hello! I'm EventMate Assistant. I can help you find the perfect venue or answer questions about the EventMate project code.");
        knowledgeBase.put("hi", "Hi there! I can assist you with finding venues ,planner, photographer ,cake shop ,attire shop . How can I help you today?");
        knowledgeBase.put("hey", "Hey! Ready to find a venue? Just tell me the date, location, or budget.");
        knowledgeBase.put("greetings", "Greetings! I'm here to help you plan your event.");  

        // --- Aapka Naya Knowledge (Planners, Photographers) ---
        // (Yeh hissa aapke teammate ke code mein nahi tha)
        knowledgeBase.put("planner", "Planners are event professionals you can hire. You can view their profiles, check availability, and book them for your event.");
        knowledgeBase.put("photographer", "Photographers are available to capture your event. You can browse their portfolios, see their pricing, and book them directly through our platform.");
        knowledgeBase.put("book planner", "To book a planner, go to the 'Planners' page, select a planner, choose a date and time, and confirm your booking.");
        knowledgeBase.put("book photographer", "To book a photographer, visit the 'Photographers' section, pick your favorite, check their available slots, and confirm the booking.");
        // 🔽 YAHAN ADD KAREIN 🔽
        knowledgeBase.put("cake", "Cakes can be ordered from various bakeries listed on our 'Cakes' page. You can see their flavors, pricing, and order via WhatsApp.");
        knowledgeBase.put("cakes", "Cakes can be ordered from various bakeries listed on our 'Cakes' page. You can see their flavors, pricing, and order via WhatsApp.");
        knowledgeBase.put("attire", "You can find wedding attire shops on the 'Attire' page. Browse bridal and groom wear, check prices, and contact vendors via WhatsApp.");
        knowledgeBase.put("flavour", "You can see available flavours for each cake shop by clicking on them on the 'Cakes' page, or ask me about a specific bakery!");
        // 🔼 YAHAN TAK 🔼
    
    }

    /**
     * Sawaal ke aadhaar par knowledge base se jawaab dhoondhta hai.
     */
    public String getAnswer(String question) {
        if (question == null || question.trim().isEmpty()) {
            return "Please ask a specific question about an EventMate feature, file, or component.";
        }

        String lowerCaseQuestion = question.toLowerCase(Locale.ROOT);

        // Key-word Matching Logic
        // Yeh loop ab venues, files, planners, aur photographers sabko check karega
        for (Map.Entry<String, String> entry : knowledgeBase.entrySet()) {
            if (lowerCaseQuestion.contains(entry.getKey())) {
                return entry.getValue();
            }
        }

        // Agar koi match nahi mila (Fallback)
        System.out.println("Using API Key (hidden): " + (apiKey != null ? "Loaded Successfully" : "Not Found"));
        // Yeh behtar fallback message hai
        return "Sorry, I don't have specific information about that right now."; 
    }
}
