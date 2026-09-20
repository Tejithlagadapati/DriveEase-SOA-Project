package com.driveease.booking.client;

import com.driveease.booking.config.InternalFeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name = "VEHICLE-SERVICE",
        contextId = "internalVehicleClient",
        configuration = InternalFeignClientConfig.class
)

public interface InternalVehicleClient {

    @PatchMapping("/api/internal/vehicles/{id}/status")
    VehicleResponse updateVehicleStatus(
            @PathVariable("id") Long id,
            @RequestParam("status") String status
    );
}