package com.driveease.booking.controller;

import com.driveease.booking.dto.BookingRequest;
import com.driveease.booking.entity.Booking;
import com.driveease.booking.service.BookingService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.driveease.booking.entity.BookingStatus;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(
            BookingService bookingService) {

        this.bookingService = bookingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Booking createBooking(
            @Valid @RequestBody BookingRequest request) {

        return bookingService.createBooking(request);
    }

    @GetMapping
    public List<Booking> getAllBookings() {

        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(
            @PathVariable Long id) {

        return bookingService.getBookingById(id);
    }
    
    @PatchMapping("/{id}/status")
    public Booking updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status) {

        return bookingService.updateBookingStatus(
                id,
                status
        );
    }
    
    @PostMapping("/{id}/cancel")
    public Booking cancelBooking(
            @PathVariable Long id) {

        return bookingService.cancelBooking(id);
    }
    
    @PostMapping("/{id}/return")
    public Booking returnBooking(
            @PathVariable Long id) {

        return bookingService.returnBooking(id);
    }
}