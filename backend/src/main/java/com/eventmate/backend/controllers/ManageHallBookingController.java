package com.eventmate.backend.controllers;

import com.eventmate.backend.models.ManageHallBooking;
import com.eventmate.backend.repositories.ManageHallBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/managehallbookings")
@CrossOrigin(origins = {"http://localhost:5173", "https://eventmate-pi.vercel.app"}) // change to your React origin if needed
public class ManageHallBookingController {

    @Autowired
    private ManageHallBookingRepository bookingRepository;

    // Get all bookings
    @GetMapping
    public List<ManageHallBooking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Create booking (checks are on frontend or you can also check here)
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody ManageHallBooking booking) {
        // simple server-side duplicate check
        if (booking.getHallId() == null || booking.getBookingDate() == null) {
            return ResponseEntity.badRequest().body("hallId and bookingDate are required");
        }

        boolean exists = bookingRepository.existsByHallIdAndBookingDate(
                booking.getHallId(), booking.getBookingDate());

        if (exists) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", false);
            resp.put("message", "Date already booked for this hall");
            return ResponseEntity.status(409).body(resp);
        }

        if (booking.getStatus() == null) booking.setStatus("Booked");
        ManageHallBooking saved = bookingRepository.save(booking);
        return ResponseEntity.ok(saved);
    }

    // Check endpoint: is this hall booked on a date?
    // Example: /api/managehallbookings/check?hallId=1&date=2025-10-27
    @GetMapping("/check")
    public Map<String, Object> checkBooking(
            @RequestParam Long hallId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        boolean exists = bookingRepository.existsByHallIdAndBookingDate(hallId, date);
        Map<String, Object> resp = new HashMap<>();
        resp.put("exists", exists);
        return resp;
    }

    // Get bookings for a hall
    @GetMapping("/byHall/{hallId}")
    public List<ManageHallBooking> getBookingsForHall(@PathVariable Long hallId) {
        return bookingRepository.findByHallId(hallId);
    }

    // Get bookings for an owner (by owner phone)
    @GetMapping("/byOwner")
    public List<ManageHallBooking> getBookingsForOwner(@RequestParam String ownerPhone) {
        return bookingRepository.findByOwnerPhone(ownerPhone);
    }
}
