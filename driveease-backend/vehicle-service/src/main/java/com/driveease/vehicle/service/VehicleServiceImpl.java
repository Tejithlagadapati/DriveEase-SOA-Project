package com.driveease.vehicle.service;

import com.driveease.vehicle.dto.VehicleRequest;
import com.driveease.vehicle.entity.Vehicle;
import com.driveease.vehicle.entity.VehicleStatus;
import com.driveease.vehicle.exception.VehicleNotFoundException;
import com.driveease.vehicle.repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class VehicleServiceImpl implements VehicleService {

	private final VehicleRepository vehicleRepository;

    public VehicleServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }
	

    @Override
    public Vehicle createVehicle(VehicleRequest request) {

        if (vehicleRepository.existsByRegistrationNumber(
                request.getRegistrationNumber())) {

            throw new IllegalArgumentException(
                    "Vehicle with this registration number already exists"
            );
        }

        Vehicle vehicle = new Vehicle();

        vehicle.setRegistrationNumber(request.getRegistrationNumber());
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setYear(request.getYear());
        vehicle.setDailyRate(request.getDailyRate());
        vehicle.setStatus(VehicleStatus.AVAILABLE);

        return vehicleRepository.save(vehicle);
    }

    @Override
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Override
    public Vehicle getVehicleById(Long id) {

        return vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new VehicleNotFoundException(
                                "Vehicle not found with id: " + id
                        ));
    }

    @Override
    public Vehicle updateVehicle(Long id, VehicleRequest request) {

        Vehicle vehicle = getVehicleById(id);

        vehicle.setRegistrationNumber(request.getRegistrationNumber());
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setYear(request.getYear());
        vehicle.setDailyRate(request.getDailyRate());

        return vehicleRepository.save(vehicle);
    }

    @Override
    public void deleteVehicle(Long id) {

        Vehicle vehicle = getVehicleById(id);

        vehicleRepository.delete(vehicle);
    }

    @Override
    public List<Vehicle> getAvailableVehicles() {

        return vehicleRepository.findByStatus(
                VehicleStatus.AVAILABLE
        );
    }

    @Override
    public Vehicle updateStatus(Long id, String status) {

        Vehicle vehicle = getVehicleById(id);

        VehicleStatus newStatus;

        try {
            newStatus = VehicleStatus.valueOf(
                    status.toUpperCase()
            );
        } catch (IllegalArgumentException e) {

            throw new IllegalArgumentException(
                    "Invalid vehicle status: " + status
            );
        }

        VehicleStatus currentStatus = vehicle.getStatus();

        if (currentStatus == newStatus) {
            return vehicle;
        }

        if (currentStatus == VehicleStatus.AVAILABLE
                && newStatus == VehicleStatus.RESERVED) {

            vehicle.setStatus(newStatus);
        }

        else if (currentStatus == VehicleStatus.RESERVED
                && newStatus == VehicleStatus.RENTED) {

            vehicle.setStatus(newStatus);
        }

        else if (currentStatus == VehicleStatus.RESERVED
                && newStatus == VehicleStatus.AVAILABLE) {

            // Booking cancelled before rental started
            vehicle.setStatus(newStatus);
        }

        else if (currentStatus == VehicleStatus.RENTED
                && newStatus == VehicleStatus.AVAILABLE) {

            // Vehicle returned after rental
            vehicle.setStatus(newStatus);
        }

        else if (currentStatus == VehicleStatus.AVAILABLE
                && newStatus == VehicleStatus.MAINTENANCE) {

            vehicle.setStatus(newStatus);
        }

        else if (currentStatus == VehicleStatus.MAINTENANCE
                && newStatus == VehicleStatus.AVAILABLE) {

            vehicle.setStatus(newStatus);
        }

        else {
            throw new IllegalStateException(
                    "Invalid vehicle status transition: "
                            + currentStatus
                            + " → "
                            + newStatus
            );
        }

        return vehicleRepository.save(vehicle);
    }
}