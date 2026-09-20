package com.driveease.booking.service;

import com.driveease.booking.dto.BookingRequest;
import com.driveease.booking.entity.Booking;
import com.driveease.booking.entity.BookingStatus;

import java.util.List;

public interface BookingService {

    Booking createBooking(BookingRequest request);

    List<Booking> getAllBookings();

    Booking getBookingById(Long id);
    
    Booking updateBookingStatus(Long id, BookingStatus newStatus);

    Booking cancelBooking(Long id);
    
    Booking returnBooking(Long id);
}