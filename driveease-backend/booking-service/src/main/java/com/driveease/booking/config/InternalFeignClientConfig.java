package com.driveease.booking.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.RequestInterceptor;

@Configuration
public class InternalFeignClientConfig {

    @Bean
    public RequestInterceptor internalServiceKeyInterceptor(
            @Value("${driveease.internal.service-key}") String key) {

        return requestTemplate ->
                requestTemplate.header(
                        "X-Internal-Service-Key",
                        key
                );
    }
}