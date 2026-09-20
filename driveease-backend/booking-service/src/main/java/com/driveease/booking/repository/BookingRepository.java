package com.driveease.booking.repository;

import com.driveease.booking.entity.Booking;
import com.driveease.booking.entity.BookingStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    List<Booking> findByVehicleIdAndStatusIn(
            Long vehicleId,
            List<BookingStatus> statuses
    );

    boolean existsByVehicleIdAndStatusInAndStartDateLessThanAndEndDateGreaterThan(
            Long vehicleId,
            List<BookingStatus> statuses,
            LocalDate endDate,
            LocalDate startDate
    );
}