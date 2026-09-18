package com.driveease.user.security;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;

import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;

    private final long expiration;

    public JwtService(
            @Value("${driveease.jwt.secret}") String secret,
            @Value("${driveease.jwt.expiration}") long expiration) {

        SecretKey secretKey = new SecretKeySpec(
                secret.getBytes(),
                "HmacSHA256"
        );

        this.jwtEncoder =
                NimbusJwtEncoder
                        .withSecretKey(secretKey)
                        .algorithm(MacAlgorithm.HS256)
                        .build();

        this.expiration = expiration;
    }

    public String generateToken(
            Long userId,
            String email,
            String role) {

        Instant now = Instant.now();

        JwtClaimsSet claims =
                JwtClaimsSet.builder()

                        .subject(email)

                        .claim("userId", userId)

                        .claim("role", role)

                        .issuedAt(now)

                        .expiresAt(
                                now.plusMillis(expiration)
                        )

                        .build();

        JwsHeader header =
                JwsHeader.with(MacAlgorithm.HS256)
                        .build();

        JwtEncoderParameters parameters =
                JwtEncoderParameters.from(
                        header,
                        claims
                );

        return jwtEncoder
                .encode(parameters)
                .getTokenValue();
    }
}