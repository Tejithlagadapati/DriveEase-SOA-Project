package com.driveease.vehicle.service;

import com.driveease.vehicle.dto.VehicleRequest;
import com.driveease.vehicle.entity.Vehicle;

import java.util.List;

public interface VehicleService {

    Vehicle createVehicle(VehicleRequest request);

    List<Vehicle> getAllVehicles();

    Vehicle getVehicleById(Long id);

    Vehicle updateVehicle(Long id, VehicleRequest request);

    void deleteVehicle(Long id);

    List<Vehicle> getAvailableVehicles();

    Vehicle updateStatus(Long id, String status);
}