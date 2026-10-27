package com.schooltrack.service;

import com.schooltrack.dto.*;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    UserDto getCurrentUser(String username);
}
