package com.eventmate.backend.repositories;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.eventmate.backend.models.HallBooking;

@Repository
public interface HallBookingRepository extends JpaRepository<HallBooking, Long> {

    List<HallBooking> findByUser_Id(Long userId);

    // NEW: fetch bookings with the hall loaded to avoid lazy-init/serialization issues
    @Query("SELECT hb FROM HallBooking hb JOIN FETCH hb.hall WHERE hb.user.id = :userId")
    List<HallBooking> findByUser_IdWithHall(@Param("userId") Long userId);

    @Query("SELECT hb FROM HallBooking hb JOIN FETCH hb.hall")
    List<HallBooking> findAllWithHall();

    List<HallBooking> findByHall_HallIdAndBookingTimeBetween(Long hallId, LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<HallBooking> findByHall_HallId(Long hallId);

    boolean existsByHall_HallIdAndUser_IdAndBookingTimeBetween(Long hallId, Long userId, LocalDateTime startOfDay, LocalDateTime endOfDay);

    @Query("SELECT CASE WHEN COUNT(hb) > 0 THEN TRUE ELSE FALSE END " +
            "FROM HallBooking hb WHERE hb.hall.hallId = :hallId AND FUNCTION('DATE', hb.bookingTime) = :bookingDate")
    boolean existsBookingOnDate(@Param("hallId") Long hallId, @Param("bookingDate") LocalDate bookingDate);

    @Query("SELECT DISTINCT hb.hall.hallId FROM HallBooking hb WHERE FUNCTION('DATE', hb.bookingTime) = :bookingDate")
    List<Long> findBookedHallIdsOnDate(@Param("bookingDate") LocalDate bookingDate);

    Long countByUser_Id(Long userId);
}