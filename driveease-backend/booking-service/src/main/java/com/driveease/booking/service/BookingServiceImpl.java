package com.driveease.booking.service;

import com.driveease.booking.dto.BookingRequest;
import com.driveease.booking.entity.Booking;
import com.driveease.booking.repository.BookingRepository;
import com.driveease.booking.entity.BookingStatus;
import org.springframework.stereotype.Service;
import com.driveease.booking.client.VehicleClient;
import com.driveease.booking.client.UserClient;
import com.driveease.booking.client.VehicleResponse;
import com.driveease.booking.client.UserResponse;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    

    private final BookingRepository bookingRepository;
    private final VehicleClient vehicleClient;
    private final UserClient userClient;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            VehicleClient vehicleClient,
            UserClient userClient) {

        this.bookingRepository = bookingRepository;
        this.vehicleClient = vehicleClient;
        this.userClient = userClient;
    }

    @Override
    public Booking createBooking(BookingRequest request) {

        // 1. Validate dates
        if (request.getEndDate().isBefore(request.getStartDate())) {

            throw new IllegalArgumentException(
                    "End date cannot be before start date"
            );
        }

        // 2. Validate User
        UserResponse user;
        try {
            user = userClient.getUserById(request.getUserId());
        } catch (Exception e) {
            throw new IllegalStateException(
                    "User does not exist or could not be verified"
            );
        }

        // 3. Validate Vehicle
        VehicleResponse vehicle;

        try {
            vehicle = vehicleClient.getVehicleById(
                    request.getVehicleId()
            );
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Vehicle does not exist or could not be verified"
            );
        }

        // 4. Check Vehicle availability
        if ("MAINTENANCE".equals(vehicle.getStatus())
                || "INACTIVE".equals(vehicle.getStatus())) {

            throw new IllegalStateException(
                    "Vehicle is not available for booking"
            );
        }

        // 5. Check overlapping bookings
        List<BookingStatus> activeStatuses = List.of(
                BookingStatus.PENDING,
                BookingStatus.CONFIRMED,
                BookingStatus.ACTIVE
        );

        boolean overlappingBooking =
                bookingRepository
                        .existsByVehicleIdAndStatusInAndStartDateLessThanAndEndDateGreaterThan(
                                request.getVehicleId(),
                                activeStatuses,
                                request.getEndDate(),
                                request.getStartDate()
                        );

        if (overlappingBooking) {

            throw new IllegalStateException(
                    "Vehicle is already booked for the selected dates"
            );
        }

        // 6. Create booking
        Booking booking = new Booking();

        booking.setVehicleId(request.getVehicleId());
        booking.setUserId(request.getUserId());
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());

        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }

    @Override
    public Booking getBookingById(Long id) {

        return bookingRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException(
                        "Booking not found with id: " + id
                    )
                );
    }
    
    @Override
    public Booking updateBookingStatus(
            Long id,
            BookingStatus newStatus) {

        Booking booking = getBookingById(id);

        BookingStatus currentStatus = booking.getStatus();

        // Same status
        if (currentStatus == newStatus) {
            return booking;
        }

        // PENDING → CONFIRMED
        if (currentStatus == BookingStatus.PENDING
                && newStatus == BookingStatus.CONFIRMED) {

            vehicleClient.updateVehicleStatus(
                    booking.getVehicleId(),
                    "RESERVED"
            );

            booking.setStatus(BookingStatus.CONFIRMED);
        }

        // CONFIRMED → ACTIVE
        else if (currentStatus == BookingStatus.CONFIRMED
                && newStatus == BookingStatus.ACTIVE) {

            vehicleClient.updateVehicleStatus(
                    booking.getVehicleId(),
                    "RENTED"
            );

            booking.setStatus(BookingStatus.ACTIVE);
        }

        // ACTIVE → COMPLETED
        else if (currentStatus == BookingStatus.ACTIVE
                && newStatus == BookingStatus.COMPLETED) {

            vehicleClient.updateVehicleStatus(
                    booking.getVehicleId(),
                    "AVAILABLE"
            );

            booking.setStatus(BookingStatus.COMPLETED);
        }

        // PENDING → CANCELLED
        else if (currentStatus == BookingStatus.PENDING
                && newStatus == BookingStatus.CANCELLED) {

            vehicleClient.updateVehicleStatus(
                    booking.getVehicleId(),
                    "AVAILABLE"
            );

            booking.setStatus(BookingStatus.CANCELLED);
        }

        // CONFIRMED → CANCELLED
        else if (currentStatus == BookingStatus.CONFIRMED
                && newStatus == BookingStatus.CANCELLED) {

            vehicleClient.updateVehicleStatus(
                    booking.getVehicleId(),
                    "AVAILABLE"
            );

            booking.setStatus(BookingStatus.CANCELLED);
        }

        else {
            throw new IllegalStateException(
                    "Invalid booking status transition: "
                            + currentStatus
                            + " → "
                            + newStatus
            );
        }

        return bookingRepository.save(booking);
    }
    
    @Override
    public Booking cancelBooking(Long id) {

        Booking booking = getBookingById(id);

        BookingStatus currentStatus = booking.getStatus();

        if (currentStatus != BookingStatus.PENDING
                && currentStatus != BookingStatus.CONFIRMED) {

            throw new IllegalStateException(
                    "Booking cannot be cancelled from status: "
                            + currentStatus
            );
        }

        booking.setStatus(BookingStatus.CANCELLED);

        return bookingRepository.save(booking);
    }
    
    @Override
    public Booking returnBooking(Long id) {

        Booking booking = getBookingById(id);

        // Vehicle can only be returned from an ACTIVE rental
        if (booking.getStatus() != BookingStatus.ACTIVE) {

            throw new IllegalStateException(
                    "Booking cannot be returned from status: "
                            + booking.getStatus()
            );
        }

        // Return vehicle to AVAILABLE
        vehicleClient.updateVehicleStatus(
                booking.getVehicleId(),
                "AVAILABLE"
        );

        // Complete the booking
        booking.setStatus(BookingStatus.COMPLETED);

        return bookingRepository.save(booking);
    }
    
}