package com.driveease.booking.service;

import com.driveease.booking.client.InternalVehicleClient;
import com.driveease.booking.client.UserClient;
import com.driveease.booking.client.UserResponse;
import com.driveease.booking.client.VehicleClient;
import com.driveease.booking.client.VehicleResponse;
import com.driveease.booking.dto.BookingRequest;
import com.driveease.booking.entity.Booking;
import com.driveease.booking.entity.BookingStatus;
import com.driveease.booking.repository.BookingRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final VehicleClient vehicleClient;
    private final InternalVehicleClient internalVehicleClient;
    private final UserClient userClient;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            VehicleClient vehicleClient,
            InternalVehicleClient internalVehicleClient,
            UserClient userClient) {

        this.bookingRepository = bookingRepository;
        this.vehicleClient = vehicleClient;
        this.internalVehicleClient = internalVehicleClient;
        this.userClient = userClient;
    }

    // =========================================================
    // CURRENT USER
    // =========================================================

    private Long getCurrentUserId() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtAuth) {

            return jwtAuth.getToken()
                    .getClaim("userId");
        }

        throw new IllegalStateException(
                "Unable to determine current user"
        );
    }

    // =========================================================
    // ADMIN CHECK
    // =========================================================

    private boolean isAdmin() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        return authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority()
                                .equals("ROLE_ADMIN")
                );
    }

    // =========================================================
    // CREATE BOOKING
    // =========================================================

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

            user = userClient.getUserById(
                    request.getUserId()
            );

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

        // 4. Check vehicle availability
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

    // =========================================================
    // GET ALL BOOKINGS
    // =========================================================

    @Override
    public List<Booking> getAllBookings() {

        // Admin can see all bookings
        if (isAdmin()) {

            return bookingRepository.findAll();
        }

        // Customer can see only their own bookings
        Long currentUserId = getCurrentUserId();

        return bookingRepository.findByUserId(currentUserId);
    }

    // =========================================================
    // GET BOOKING BY ID
    // =========================================================

    @Override
    public Booking getBookingById(Long id) {

        Booking booking =
                bookingRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with id: " + id
                                )
                        );

        // Admin can access any booking
        if (isAdmin()) {

            return booking;
        }

        // Customer can access only their own booking
        Long currentUserId = getCurrentUserId();

        if (!booking.getUserId().equals(currentUserId)) {

            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not authorized to access this booking"
            );
        }

        return booking;
    }

    // =========================================================
    // UPDATE BOOKING STATUS
    // ADMIN OPERATION
    // =========================================================

    @Override
    public Booking updateBookingStatus(
            Long id,
            BookingStatus newStatus) {

        Booking booking = getBookingById(id);

        BookingStatus currentStatus =
                booking.getStatus();

        // Same status
        if (currentStatus == newStatus) {

            return booking;
        }

        // -----------------------------------------------------
        // PENDING → CONFIRMED
        // -----------------------------------------------------

        if (currentStatus == BookingStatus.PENDING
                && newStatus == BookingStatus.CONFIRMED) {

            internalVehicleClient.updateVehicleStatus(
                    booking.getVehicleId(),
                    "RESERVED"
            );

            booking.setStatus(
                    BookingStatus.CONFIRMED
            );
        }

        // -----------------------------------------------------
        // CONFIRMED → ACTIVE
        // -----------------------------------------------------

        else if (currentStatus == BookingStatus.CONFIRMED
                && newStatus == BookingStatus.ACTIVE) {

            internalVehicleClient.updateVehicleStatus(
                    booking.getVehicleId(),
                    "RENTED"
            );

            booking.setStatus(
                    BookingStatus.ACTIVE
            );
        }

        // -----------------------------------------------------
        // ACTIVE → COMPLETED
        // -----------------------------------------------------

        else if (currentStatus == BookingStatus.ACTIVE
                && newStatus == BookingStatus.COMPLETED) {

            internalVehicleClient.updateVehicleStatus(
                    booking.getVehicleId(),
                    "AVAILABLE"
            );

            booking.setStatus(
                    BookingStatus.COMPLETED
            );
        }

        // -----------------------------------------------------
        // PENDING → CANCELLED
        // -----------------------------------------------------

        else if (currentStatus == BookingStatus.PENDING
                && newStatus == BookingStatus.CANCELLED) {

            internalVehicleClient.updateVehicleStatus(
                    booking.getVehicleId(),
                    "AVAILABLE"
            );

            booking.setStatus(
                    BookingStatus.CANCELLED
            );
        }

        // -----------------------------------------------------
        // CONFIRMED → CANCELLED
        // -----------------------------------------------------

        else if (currentStatus == BookingStatus.CONFIRMED
                && newStatus == BookingStatus.CANCELLED) {

            internalVehicleClient.updateVehicleStatus(
                    booking.getVehicleId(),
                    "AVAILABLE"
            );

            booking.setStatus(
                    BookingStatus.CANCELLED
            );
        }

        // -----------------------------------------------------
        // INVALID TRANSITION
        // -----------------------------------------------------

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

    // =========================================================
    // CANCEL BOOKING
    // CUSTOMER / ADMIN
    // =========================================================
    @Override
    public Booking cancelBooking(Long id) {

        Booking booking = getBookingById(id);

        BookingStatus currentStatus =
                booking.getStatus();

        // Only PENDING or CONFIRMED bookings
        // can be cancelled
        if (currentStatus != BookingStatus.PENDING
                && currentStatus != BookingStatus.CONFIRMED) {

            throw new IllegalStateException(
                    "Booking cannot be cancelled from status: "
                            + currentStatus
            );
        }

        // Mark this booking as cancelled first
        booking.setStatus(
                BookingStatus.CANCELLED
        );

        bookingRepository.save(booking);

        // Check whether another active booking
        // still exists for this vehicle
        List<BookingStatus> activeStatuses = List.of(
                BookingStatus.PENDING,
                BookingStatus.CONFIRMED,
                BookingStatus.ACTIVE
        );

        boolean hasOtherActiveBooking =
                bookingRepository
                        .existsByVehicleIdAndIdNotAndStatusIn(
                                booking.getVehicleId(),
                                booking.getId(),
                                activeStatuses
                        );

        // Only make vehicle AVAILABLE if
        // there are no other active bookings
        if (!hasOtherActiveBooking) {

            internalVehicleClient.updateVehicleStatus(
                    booking.getVehicleId(),
                    "AVAILABLE"
            );
        }

        return booking;
    }

    // =========================================================
    // RETURN BOOKING
    // CUSTOMER / ADMIN
    // =========================================================

    @Override
    public Booking returnBooking(Long id) {

        Booking booking = getBookingById(id);

        // Vehicle can only be returned from ACTIVE rental
        if (booking.getStatus() != BookingStatus.ACTIVE) {

            throw new IllegalStateException(
                    "Booking cannot be returned from status: "
                            + booking.getStatus()
            );
        }

        // Return vehicle to AVAILABLE
        internalVehicleClient.updateVehicleStatus(
                booking.getVehicleId(),
                "AVAILABLE"
        );

        // Complete booking
        booking.setStatus(
                BookingStatus.COMPLETED
        );

        return bookingRepository.save(booking);
    }
}