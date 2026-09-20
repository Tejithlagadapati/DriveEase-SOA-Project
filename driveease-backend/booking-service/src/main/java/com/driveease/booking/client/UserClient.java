package com.driveease.booking.client;

import com.driveease.booking.config.FeignClientConfig;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "USER-SERVICE",
        configuration = FeignClientConfig.class
)
public interface UserClient {

    @GetMapping("/api/users/{id}")
    UserResponse getUserById(
            @PathVariable("id") Long id
    );
}