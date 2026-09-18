package com.driveease.user.service;

import com.driveease.user.dto.AuthResponse;
import com.driveease.user.dto.LoginRequest;
import com.driveease.user.dto.RegisterRequest;

public interface AuthService {

    void register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}