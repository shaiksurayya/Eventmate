package com.eventmate.backend.service;

import com.eventmate.backend.models.Hall;
import com.eventmate.backend.models.HallBooking;
import com.eventmate.backend.models.User;
import com.eventmate.backend.payload.request.HallBookingRequest;
import com.eventmate.backend.repositories.HallBookingRepository;
import com.eventmate.backend.repositories.HallRepository;
import com.eventmate.backend.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HallBookingService {

    private final HallBookingRepository hallBookingRepository;
    private final HallRepository hallRepository;
    private final UserRepository userRepository;

    public HallBookingService(HallBookingRepository hallBookingRepository, HallRepository hallRepository, UserRepository userRepository) {
        this.hallBookingRepository = hallBookingRepository;
        this.hallRepository = hallRepository;
        this.userRepository = userRepository;
    }

    public HallBooking createBooking(HallBookingRequest bookingRequest, String userEmail) {
        Hall hall = hallRepository.findById(bookingRequest.hallId())
                .orElseThrow(() -> new EntityNotFoundException("Hall not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        LocalDateTime requestedTime = bookingRequest.bookingTime();
        LocalDateTime startOfDay = requestedTime.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = requestedTime.toLocalDate().atTime(23, 59, 59);

        List<HallBooking> existingBookingsOnDate = hallBookingRepository
                .findByHall_HallIdAndBookingTimeBetween(hall.getHallId(), startOfDay, endOfDay);
        if (!existingBookingsOnDate.isEmpty()) {
            throw new IllegalStateException("This hall is already booked for the selected date.");
        }

        boolean userAlreadyBooked = hallBookingRepository
                .existsByHall_HallIdAndUser_IdAndBookingTimeBetween(hall.getHallId(), user.getId(), startOfDay, endOfDay);
        if (userAlreadyBooked) {
            throw new IllegalStateException("You have already booked this hall for the selected date.");
        }

        HallBooking booking = new HallBooking();
        booking.setBookingTime(bookingRequest.bookingTime());
        booking.setHall(hall);
        booking.setUser(user);
        booking.setUserName(bookingRequest.userName());
        booking.setUserPhone(bookingRequest.userPhone());

        return hallBookingRepository.save(booking);
    }

    public List<LocalDate> getBookedDatesForHall(Long hallId) {
        return hallBookingRepository.findByHall_HallId(hallId)
                .stream()
                .map(booking -> booking.getBookingTime().toLocalDate())
                .collect(Collectors.toList());
    }

    // Get all bookings made by a user (original)
    public List<HallBooking> getBookingsByUser(Long userId) {
        return hallBookingRepository.findByUser_Id(userId);
    }

    // NEW: Get all bookings by user with hall eagerly fetched (safe for serialization)
    public List<HallBooking> getBookingsByUserWithHall(Long userId) {
        return hallBookingRepository.findByUser_IdWithHall(userId);
    }

    public List<HallBooking> getAllBookingsWithHall() {
        return hallBookingRepository.findAllWithHall();
    }

    // NEW: Update booking info
    public HallBooking updateBookingInfo(Long bookingId, HallBookingRequest request) {
        HallBooking booking = hallBookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));
        
        if (request.bookingTime() != null) {
            booking.setBookingTime(request.bookingTime());
        }
        if (request.userName() != null) {
            booking.setUserName(request.userName());
        }
        if (request.userPhone() != null) {
            booking.setUserPhone(request.userPhone());
        }
        
        return hallBookingRepository.save(booking);
    }

    // NEW: Update status (for confirm, delete request, etc)
    public HallBooking updateBookingStatus(Long bookingId, String status) {
        HallBooking booking = hallBookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));
        booking.setStatus(status);
        return hallBookingRepository.save(booking);
    }
}
