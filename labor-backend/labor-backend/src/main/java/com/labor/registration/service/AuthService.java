package com.labor.registration.service;

import com.labor.registration.dto.AuthResponse;
import com.labor.registration.dto.LoginRequest;
import com.labor.registration.dto.RegisterRequest;
import com.labor.registration.entity.*;
import com.labor.registration.repository.CategoryRepository;
import com.labor.registration.repository.UserRepository;
import com.labor.registration.repository.WorkerRepository;
import com.labor.registration.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }
        if (request.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Cannot self-register as ADMIN");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        user = userRepository.save(user);

        if (request.getRole() == Role.WORKER) {
            if (request.getCategoryId() == null || request.getPrice() == null || request.getPriceUnit() == null) {
                throw new IllegalArgumentException("categoryId, price and priceUnit are required for worker registration");
            }
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid categoryId"));

            Worker worker = Worker.builder()
                    .user(user)
                    .category(category)
                    .price(request.getPrice())
                    .priceUnit(request.getPriceUnit())
                    .experienceYears(request.getExperienceYears())
                    .location(request.getLocation())
                    .description(request.getDescription())
                    .available(true)
                    .build();
            workerRepository.save(worker);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getId());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getId());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }
}
