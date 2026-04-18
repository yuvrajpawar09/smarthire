package com.smarthire.service;

import com.smarthire.dto.AuthResponse;
import com.smarthire.dto.RegisterRequest;
import com.smarthire.entity.User;
import com.smarthire.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        // Build user entity from DTO
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // NEVER store plain text
        user.setRole(request.getRole() != null ? request.getRole() : User.Role.CANDIDATE);

        userRepository.save(user);

        return new AuthResponse("Registration successful", user.getEmail(), user.getRole().name());
    }
}