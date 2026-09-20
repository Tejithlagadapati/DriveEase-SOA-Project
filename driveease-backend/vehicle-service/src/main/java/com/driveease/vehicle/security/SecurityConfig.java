package com.driveease.vehicle.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

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
            		
            	.requestMatchers("/api/internal/**").permitAll()

                // Anyone with a valid JWT can view vehicles
                .requestMatchers(
                    org.springframework.http.HttpMethod.GET,
                    "/api/vehicles/**"
                ).hasAnyRole("CUSTOMER", "ADMIN")

                // Only ADMIN can create/update/delete/change status
                .requestMatchers(
                    org.springframework.http.HttpMethod.POST,
                    "/api/vehicles/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    org.springframework.http.HttpMethod.PUT,
                    "/api/vehicles/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    org.springframework.http.HttpMethod.DELETE,
                    "/api/vehicles/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    org.springframework.http.HttpMethod.PATCH,
                    "/api/vehicles/**"
                ).hasRole("ADMIN")

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
    public Converter<Jwt, ? extends AbstractAuthenticationToken> jwtAuthenticationConverter() {

        return jwt -> {

            String role = jwt.getClaimAsString("role");

            return new JwtAuthenticationToken(
                    jwt,
                    java.util.List.of(
                            new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                    "ROLE_" + role
                            )
                    )
            );
        };
    }
}