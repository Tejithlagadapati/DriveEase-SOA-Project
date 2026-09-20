package com.driveease.booking.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.core.convert.converter.Converter;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // Customers and admins can create bookings
                .requestMatchers(
                    org.springframework.http.HttpMethod.POST,
                    "/api/bookings"
                ).hasAnyRole("CUSTOMER", "ADMIN")

                // Customers and admins can view bookings
                // Ownership will be checked in the service layer
                .requestMatchers(
                    org.springframework.http.HttpMethod.GET,
                    "/api/bookings/**"
                ).hasAnyRole("CUSTOMER", "ADMIN")

                // Status changes will be restricted to ADMIN
                .requestMatchers(
                    org.springframework.http.HttpMethod.PATCH,
                    "/api/bookings/**"
                ).hasRole("ADMIN")

                // Cancel/return will be authenticated for now.
                // Ownership check will be handled in service layer.
                .requestMatchers(
                    org.springframework.http.HttpMethod.POST,
                    "/api/bookings/**"
                ).hasAnyRole("CUSTOMER", "ADMIN")

                .anyRequest().authenticated()
            )

            .oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwt ->
                    jwt.jwtAuthenticationConverter(
                        jwtAuthenticationConverter()
                    )
                )
            );

        return http.build();
    }

    @Bean
    public Converter<Jwt, ? extends AbstractAuthenticationToken>
    jwtAuthenticationConverter() {

        return jwt -> {

            String role = jwt.getClaimAsString("role");

            return new JwtAuthenticationToken(
                jwt,
                List.of(
                    new SimpleGrantedAuthority(
                        "ROLE_" + role
                    )
                )
            );
        };
    }
}