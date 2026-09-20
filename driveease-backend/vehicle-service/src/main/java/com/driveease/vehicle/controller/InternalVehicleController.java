package com.driveease.vehicle.controller;

import com.driveease.vehicle.entity.Vehicle;
import com.driveease.vehicle.service.VehicleService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/internal/vehicles")
public class InternalVehicleController {

    private final VehicleService vehicleService;
    private final String internalKey;

    public InternalVehicleController(
            VehicleService vehicleService,
            @Value("${driveease.internal.service-key}") String internalKey) {

        this.vehicleService = vehicleService;
        this.internalKey = internalKey;
    }

    @PatchMapping("/{id}/status")
    public Vehicle updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestHeader("X-Internal-Service-Key") String key) {

        if (!internalKey.equals(key)) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Invalid internal service key"
            );
        }

        return vehicleService.updateStatus(
                id,
                status
        );
    }
}