package com.teamflow.user.service;

import com.teamflow.common.exception.BadRequestException;
import com.teamflow.common.exception.ResourceNotFoundException;
import com.teamflow.user.dto.ChangePasswordRequest;
import com.teamflow.user.dto.UpdateProfileRequest;
import com.teamflow.user.entity.User;
import com.teamflow.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public User updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = getUserById(userId);
        user.setFullName(request.getFullName());
        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = getUserById(userId);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public User updateProfileImage(UUID userId, String imageUrl) {
        User user = getUserById(userId);
        user.setProfileImageUrl(imageUrl);
        return userRepository.save(user);
    }

    public List<User> searchUsers(String keyword) {
        return userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword);
    }

    @Transactional
    public void deactivateAccount(UUID userId) {
        User user = getUserById(userId);
        user.setActive(false);
        userRepository.save(user);
    }
}
