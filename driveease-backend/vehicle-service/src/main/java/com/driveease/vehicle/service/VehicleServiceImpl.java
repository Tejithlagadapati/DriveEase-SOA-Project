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

        try {
            VehicleStatus vehicleStatus =
                    VehicleStatus.valueOf(status.toUpperCase());

            vehicle.setStatus(vehicleStatus);

        } catch (IllegalArgumentException e) {

            throw new IllegalArgumentException(
                    "Invalid vehicle status: " + status
            );
        }

        return vehicleRepository.save(vehicle);
    }
}