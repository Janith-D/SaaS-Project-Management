package com.teamflow.user.controller;

import com.teamflow.auth.dto.response.UserResponse;
import com.teamflow.common.response.ApiResponse;
import com.teamflow.user.dto.ChangePasswordRequest;
import com.teamflow.user.dto.UpdateProfileRequest;
import com.teamflow.user.entity.User;
import com.teamflow.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(@AuthenticationPrincipal User user) {
        UserResponse response = UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .globalRole(user.getGlobalRole())
                .emailVerified(user.isEmailVerified())
                .build();
        return ResponseEntity.ok(ApiResponse.success(200, "Profile retrieved", response));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request) {
        User updated = userService.updateProfile(user.getId(), request);
        UserResponse response = UserResponse.builder()
                .id(updated.getId())
                .fullName(updated.getFullName())
                .email(updated.getEmail())
                .profileImageUrl(updated.getProfileImageUrl())
                .globalRole(updated.getGlobalRole())
                .emailVerified(updated.isEmailVerified())
                .build();
        return ResponseEntity.ok(ApiResponse.success(200, "Profile updated", response));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(200, "Password changed", null));
    }

    @PostMapping(value = "/me/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserResponse>> uploadProfileImage(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) {
        User updated = userService.updateProfileImage(user.getId(), file.getOriginalFilename());
        UserResponse response = UserResponse.builder()
                .id(updated.getId())
                .fullName(updated.getFullName())
                .email(updated.getEmail())
                .profileImageUrl(updated.getProfileImageUrl())
                .globalRole(updated.getGlobalRole())
                .emailVerified(updated.isEmailVerified())
                .build();
        return ResponseEntity.ok(ApiResponse.success(200, "Profile image updated", response));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchUsers(@RequestParam String keyword) {
        List<UserResponse> users = userService.searchUsers(keyword).stream()
                .map(u -> UserResponse.builder()
                        .id(u.getId())
                        .fullName(u.getFullName())
                        .email(u.getEmail())
                        .profileImageUrl(u.getProfileImageUrl())
                        .globalRole(u.getGlobalRole())
                        .emailVerified(u.isEmailVerified())
                        .build())
                .toList();
        return ResponseEntity.ok(ApiResponse.success(200, "Users found", users));
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deactivateAccount(@AuthenticationPrincipal User user) {
        userService.deactivateAccount(user.getId());
        return ResponseEntity.ok(ApiResponse.success(200, "Account deactivated", null));
    }
}
