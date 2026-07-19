// File Location: src/main/java/com/eventmate/backend/controllers/HallController.java

// package com.eventmate.backend.controllers;

// import com.eventmate.backend.models.Hall;
// import com.eventmate.backend.repositories.HallRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity; // <-- NEW IMPORT
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable; // <-- NEW IMPORT
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import java.util.List;

// @RestController
// @RequestMapping("/api/halls")
// @CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
// public class HallController {

//     @Autowired
//     private HallRepository hallRepository;

//     // This existing method gets ALL halls
//     @GetMapping
//     public List<Hall> getAllHalls() {
//         return hallRepository.findAll();
//     }

//     // --- NEW METHOD ADDED BELOW ---
//     // This new method gets a SINGLE hall by its ID
//     @GetMapping("/{id}")
//     public ResponseEntity<Hall> getHallById(@PathVariable Long id) {
//         // Find the hall in the database
//         // If found, return it with a 200 OK status
//         // If not found, return a 404 Not Found status
//         return hallRepository.findById(id)
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }
// }
// File Location: src/main/java/com/eventmate/backend/controllers/HallController.java

package com.eventmate.backend.controllers;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.util.StringUtils; 
import java.util.Optional; // <-- 1. NAYA IMPORT

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity; // <-- 2. NAYA IMPORT
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController; // <-- 3. NAYA IMPORT

import com.eventmate.backend.models.Hall;
import com.eventmate.backend.repositories.HallBookingRepository; // <-- 4. NAYA IMPORT
import com.eventmate.backend.repositories.HallRepository;


@RestController
@RequestMapping("/api/halls")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000","https://eventmate-pi.vercel.app"})
public class HallController {

    @Autowired
    private HallRepository hallRepository;

    // --- 5. NAYA REPOSITORY ADD KAREIN ---
    @Autowired
    private HallBookingRepository hallBookingRepository;


    // --- YEH AAPKA EXISTING METHOD HAI (FindHall.jsx ke liye) ---
    @GetMapping
    public List<Hall> getAllHalls() {
        return hallRepository.findAll();
    }

    // --- YEH AAPKA EXISTING METHOD HAI (VenueDetails.jsx ke liye) ---
    @GetMapping("/{id}")
    public ResponseEntity<Hall> getHallById(@PathVariable Long id) {
        return hallRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- 6. YEH NAYA API ENDPOINT HAI (Chatbot ke liye) ---
    @GetMapping("/available")
    public ResponseEntity<List<Hall>> getAvailableHalls(
            @RequestParam("date")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        try {
            // Pehle, uss date par book ho chuke sabhi hall ki ID dhoondhein
            List<Long> bookedHallIds = hallBookingRepository.findBookedHallIdsOnDate(date);

            List<Hall> availableHalls;
            if (bookedHallIds.isEmpty()) {
                // Agar koi hall book nahi hai, toh saare hall available hain
                availableHalls = hallRepository.findAll();
            } else {
                // Warna, booked halls ko chhod kar baaki sab return karein
                availableHalls = hallRepository.findByHallIdNotIn(bookedHallIds);
            }
            return ResponseEntity.ok(availableHalls);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
        @GetMapping("/by-event-type")
    public ResponseEntity<List<Hall>> getHallsByEventType(@RequestParam("type") String eventType) {
        try {
            // Naye repository method ko call karein
            List<Hall> halls = hallRepository.findByEventType(eventType);
            
            if (halls.isEmpty()) {
                return ResponseEntity.noContent().build(); // List khaali hai
            }
            return ResponseEntity.ok(halls); // List return karein
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
        @GetMapping("/check-availability")
    public ResponseEntity<Map<String, Object>> checkSpecificHallAvailability(
            @RequestParam("hallName") String hallName,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        try {
            // 1. Hall ko naam se dhoondhein
            Optional<Hall> optionalHall = hallRepository.findByHallNameIgnoreCase(hallName.trim()); // Trim whitespace

            if (!optionalHall.isPresent()) {
                return ResponseEntity.ok(Map.of("available", false, "message", "Venue not found."));
            }

            Hall hall = optionalHall.get();

            // 2. Check karein ki woh hall uss date par booked hai ya nahi
            boolean isBooked = hallBookingRepository.existsBookingOnDate(hall.getHallId(), date);

            if (isBooked) {
                return ResponseEntity.ok(Map.of("available", false, "message", hall.getHallName() + " is booked on " + date + "."));
            } else {
                return ResponseEntity.ok(Map.of("available", true, "message", hall.getHallName() + " is available on " + date + "!"));
            }

        } catch (Exception e) {
            System.err.println("Error checking specific hall availability: " + e.getMessage());
            Map<String, Object> errorBody = new HashMap<>();
          errorBody.put("available", false);
          errorBody.put("message", "Could not check availability.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorBody);
        }
    }
     @GetMapping("/search")
    public ResponseEntity<List<Hall>> searchHalls(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String food,
            @RequestParam(required = false) Integer minBudget,
            @RequestParam(required = false) Integer maxBudget,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Integer maxCapacity,
             @RequestParam(required = false) String eventType,
           
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        try {
            // Step 1: Pehle basic filters (location, budget, capacity, food) se halls filter karein
            // Agar food preference 'Veg' ya 'Non-Veg' hai, toh usse pass karein, warna 'Both' ya null pass karein
            String foodFilter = (food != null && (food.equalsIgnoreCase("Veg") || food.equalsIgnoreCase("Non-Veg"))) ? food : null;
            
            List<Hall> filteredHalls = hallRepository.findWithFilters(
                    StringUtils.hasText(location) ? location.trim() : null,
                    
                
                    foodFilter, // Sirf Veg/Non-Veg pass karein
                    minBudget,
                    maxBudget,
                    minCapacity,
                    maxCapacity,
                    StringUtils.hasText(eventType) ? eventType.trim() : null
            );

            // Step 2: Agar date bhi di gayi hai, toh availability check karein
            if (date != null) {
                // Uss date par booked halls ki ID nikaalein
                List<Long> bookedHallIds = hallBookingRepository.findBookedHallIdsOnDate(date);
                
                // Agar koi hall book hai, toh filtered list se unhein hata dein
                if (!bookedHallIds.isEmpty()) {
                    filteredHalls.removeIf(hall -> bookedHallIds.contains(hall.getHallId()));
                }
            }
            
            // Step 3: Result return karein
            if (filteredHalls.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(filteredHalls);

        } catch (Exception e) {
            System.err.println("Error during hall search: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


}
    
