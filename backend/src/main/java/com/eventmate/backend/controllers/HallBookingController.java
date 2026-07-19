package com.eventmate.backend.controllers;

// --- SAARI ZAROORI IMPORTS (DONO VERSION SE) ---
import java.time.LocalDate;
import java.time.format.DateTimeFormatter; // Surayya ke code se
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping; // Surayya ke code se
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.eventmate.backend.models.Hall; // Surayya ke code se
import com.eventmate.backend.models.HallBooking;
import com.eventmate.backend.models.User;
import com.eventmate.backend.payload.request.HallBookingRequest;
import com.eventmate.backend.repositories.HallBookingRepository;
import com.eventmate.backend.repositories.HallRepository;
import com.eventmate.backend.repositories.UserRepository;
import com.eventmate.backend.service.HallBookingService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000",
        "https://your-vercel-app.vercel.app"}, allowCredentials = "true")
public class HallBookingController {

    private final HallBookingService hallBookingService;

    // --- SAARI ZAROORI REPOSITORIES (DONO VERSION SE) ---
    @Autowired
    private HallBookingRepository hallBookingRepository;

    @Autowired
    private HallRepository hallRepository;

    @Autowired
    private UserRepository userRepository; // Surayya ke code se

    // Constructor (Aapke code se)
    public HallBookingController(HallBookingService hallBookingService) {
        this.hallBookingService = hallBookingService;
    }

    // --- AAPKA CODE: createBooking AUR SUGGESTION LOGIC ---
    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody HallBookingRequest bookingRequest,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User must be logged in to make a booking.");
        }

        LocalDate requestedDate;
        Long requestedHallId;

        if (bookingRequest == null || bookingRequest.bookingTime() == null || bookingRequest.hallId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid booking request data.");
        }
        try {
            requestedDate = bookingRequest.bookingTime().toLocalDate();
            requestedHallId = bookingRequest.hallId();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid date or hall ID format in request.");
        }

        boolean alreadyBooked = hallBookingRepository.existsBookingOnDate(requestedHallId, requestedDate);

        if (alreadyBooked) {
            List<Long> bookedHallIds = hallBookingRepository.findBookedHallIdsOnDate(requestedDate);
            List<Hall> availableHalls = hallRepository.findByHallIdNotIn(bookedHallIds);

            List<HallSuggestion> suggestions = availableHalls.stream()
                    .map(hall -> new HallSuggestion(
                            hall.getHallId(),
                            hall.getHallName(),
                            hall.getImageLink(),
                            hall.getLocation(),
                            hall.getCapacity(),
                            hall.getBudget()
                    ))
                    //.limit(5) // Aapne limit() ko comment kiya tha, maine waisa hi rakha hai
                    .collect(Collectors.toList());

            BookingConflictResponse responseBody = new BookingConflictResponse(
                    "Booking failed. This hall is already booked for the selected date.",
                    suggestions
            );
            return ResponseEntity.status(HttpStatus.CONFLICT).body(responseBody);

        } else {
            try {
                HallBooking savedBooking = hallBookingService.createBooking(bookingRequest, userDetails.getUsername());
                return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
            } catch (IllegalStateException | EntityNotFoundException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            } catch (Exception e) {
                System.err.println("Error during booking creation: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred during booking.");
            }
        }
    }

    // --- AAPKA CODE: getBookedDates Endpoint ---
    @GetMapping("/hall/{hallId}/booked-dates")
    public ResponseEntity<List<LocalDate>> getBookedDates(@PathVariable Long hallId) {
        try {
            List<LocalDate> bookedDates = hallBookingService.getBookedDatesForHall(hallId);
            return ResponseEntity.ok(bookedDates);
        } catch (Exception e) {
            System.err.println("Error fetching booked dates: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }

    // --- AAPKA CODE: Suggestion DTO Classes ---
    public static class BookingConflictResponse {
        private String message;
        private List<HallSuggestion> suggestions;
        public BookingConflictResponse(String message, List<HallSuggestion> suggestions) { this.message = message; this.suggestions = suggestions; }
        public String getMessage() { return message; }
        public List<HallSuggestion> getSuggestions() { return suggestions; }
    }

    public static class HallSuggestion {
        private Long id;
        private String name;
        private String imageLink;
        private String location;
        private Integer capacity;
        private Integer budget;
        public HallSuggestion(Long id, String name, String imageLink, String location, Integer capacity, Integer budget) {
            this.id = id; this.name = name; this.imageLink = imageLink; this.location = location; this.capacity = capacity; this.budget = budget;
        }
        public Long getId() { return id; }
        public String getName() { return name; }
        public String getImageLink() { return imageLink; }
        public String getLocation() { return location; }
        public Integer getCapacity() { return capacity; }
        public Integer getBudget() { return budget; }
    }

    // --- SURAYYA KA CODE: BookingDetails DTO Class ---
    public static class BookingDetails {
        private Long bookingId;
        private Long hallId;
        private String hallName;
        private String hallAddress;
        private String bookingDateTime; // ISO or formatted string
        private String status;

        public BookingDetails(Long bookingId, Long hallId, String hallName, String hallAddress, String bookingDateTime, String status) {
            this.bookingId = bookingId;
            this.hallId = hallId;
            this.hallName = hallName;
            this.hallAddress = hallAddress;
            this.bookingDateTime = bookingDateTime;
            this.status = status;
        }
        public Long getBookingId() { return bookingId; }
        public Long getHallId() { return hallId; }
        public String getHallName() { return hallName; }
        public String getHallAddress() { return hallAddress; }
        public String getBookingDateTime() { return bookingDateTime; }
        public String getStatus() { return status; }
    }

    // --- SURAYYA KA CODE: Date Formatter ---
    private static final DateTimeFormatter FLAT_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    // --- SURAYYA KA CODE: getBookingDetailsForCurrentUser Endpoint ---
    @GetMapping("/user/details")
    public ResponseEntity<List<BookingDetails>> getBookingDetailsForCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(List.of());
        }
        try {
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

            List<HallBooking> bookings = hallBookingService.getBookingsByUserWithHall(user.getId());
            List<BookingDetails> details = bookings.stream()
                    .map(b -> {
                        var h = b.getHall();
                        String addr = (h != null ? (h.getLocation() != null ? h.getLocation() : h.getEventType()) : "");
                        String dateTime = b.getBookingTime() != null ? b.getBookingTime().format(FLAT_FORMATTER) : "";
                        return new BookingDetails(
                                                  b.getBookingId(),
                                                  h != null ? h.getHallId() : null,
                                                  h != null ? h.getHallName() : "Hall",
                                                  addr,
                                                  dateTime,
                                                  b.getStatus());
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(details);
        } catch (Exception e) {
            System.err.println("Error in getBookingDetailsForCurrentUser: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }

    // --- SURAYYA KA CODE: getBookingDetailsByUserId Endpoint ---
    @GetMapping("/user/{userId}/details")
    public ResponseEntity<List<BookingDetails>> getBookingDetailsByUserId(@PathVariable Long userId) {
        try {
            List<HallBooking> bookings = hallBookingService.getBookingsByUserWithHall(userId);
            List<BookingDetails> details = bookings.stream()
                    .map(b -> {
                        var h = b.getHall();
                        String addr = (h != null ? (h.getLocation() != null ? h.getLocation() : h.getEventType()) : "");
                        String dateTime = b.getBookingTime() != null ? b.getBookingTime().format(FLAT_FORMATTER) : "";
                        return new BookingDetails(
                                                  b.getBookingId(),
                                                  h != null ? h.getHallId() : null,
                                                  h != null ? h.getHallName() : "Hall",
                                                  addr,
                                                  dateTime,
                                                  b.getStatus());
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(details);
        } catch (Exception e) {
            System.err.println("Error in getBookingDetailsByUserId: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }

    // --- NEW: APIs for Updating Booking Info, Status, and Getting All Bookings ---
    
    @GetMapping("/all")
    public ResponseEntity<List<HallBooking>> getAllBookings() {
        return ResponseEntity.ok(hallBookingService.getAllBookingsWithHall());
    }

    @PutMapping("/{bookingId}")
    public ResponseEntity<?> updateBookingInfo(
            @PathVariable Long bookingId,
            @RequestBody HallBookingRequest request) {
        try {
            HallBooking updatedBooking = hallBookingService.updateBookingInfo(bookingId, request);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam String status) {
        try {
            HallBooking updatedBooking = hallBookingService.updateBookingStatus(bookingId, status);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}