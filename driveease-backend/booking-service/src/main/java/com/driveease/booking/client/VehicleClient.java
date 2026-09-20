package com.driveease.booking.client;

import com.driveease.booking.config.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name = "VEHICLE-SERVICE",
        contextId = "vehicleClient",
        configuration = FeignClientConfig.class
)
public interface VehicleClient {

    @GetMapping("/api/vehicles/{id}")
    VehicleResponse getVehicleById(
            @PathVariable("id") Long id
    );
}