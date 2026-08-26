package com.labor.registration.service;

import com.labor.registration.dto.UserResponse;
import com.labor.registration.dto.UserUpdateRequest;
import com.labor.registration.entity.User;
import com.labor.registration.repository.UserRepository;
import com.labor.registration.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CurrentUserProvider currentUserProvider;

    public UserResponse getMyProfile() {
        return toResponse(currentUserProvider.getCurrentUser());
    }

    public UserResponse updateMyProfile(UserUpdateRequest request) {
        User user = currentUserProvider.getCurrentUser();
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        return toResponse(userRepository.save(user));
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }
}
