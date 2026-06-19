package com.teamflow.auth.service;

import com.teamflow.auth.dto.request.*;
import com.teamflow.auth.dto.response.AuthResponse;
import com.teamflow.auth.dto.response.UserResponse;
import com.teamflow.auth.entity.EmailVerification;
import com.teamflow.auth.entity.RefreshToken;
import com.teamflow.auth.repository.EmailVerificationRepository;
import com.teamflow.auth.repository.RefreshTokenRepository;
import com.teamflow.auth.security.JwtTokenProvider;
import com.teamflow.common.exception.BadRequestException;
import com.teamflow.common.exception.DuplicateResourceException;
import com.teamflow.common.exception.ResourceNotFoundException;
import com.teamflow.user.entity.GlobalRole;
import com.teamflow.user.entity.User;
import com.teamflow.user.repository.UserRepository;
import com.teamflow.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Value("${app.jwt.access-token-expiration-ms}")
    private long accessTokenExpirationMs;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .globalRole(GlobalRole.USER)
                .emailVerified(false)
                .active(true)
                .build();

        user = userRepository.save(user);

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshTokenStr = jwtTokenProvider.generateRefreshToken(user.getId(), user.getEmail());

        saveRefreshToken(user, refreshTokenStr);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .expiresIn(accessTokenExpirationMs)
                .user(toUserResponse(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userService.getUserByEmail(request.getEmail());

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshTokenStr = jwtTokenProvider.generateRefreshToken(user.getId(), user.getEmail());

        saveRefreshToken(user, refreshTokenStr);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .expiresIn(accessTokenExpirationMs)
                .user(toUserResponse(user))
                .build();
    }

    public AuthResponse refreshAccessToken(RefreshTokenRequest request) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (storedToken.isRevoked() || storedToken.isExpired()) {
            throw new BadRequestException("Refresh token is revoked or expired");
        }

        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        User user = storedToken.getUser();
        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId(), user.getEmail());

        saveRefreshToken(user, newRefreshToken);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .expiresIn(accessTokenExpirationMs)
                .user(toUserResponse(user))
                .build();
    }

    @Transactional
    public void logout(UUID userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return;
        }

        String token = UUID.randomUUID().toString();
        EmailVerification verification = EmailVerification.builder()
                .user(user)
                .token(token)
                .type("PASSWORD_RESET")
                .expiresAt(LocalDateTime.now().plusHours(24))
                .used(false)
                .build();

        emailVerificationRepository.save(verification);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        EmailVerification verification = emailVerificationRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        if (verification.isUsed() || verification.isExpired()) {
            throw new BadRequestException("Reset token is used or expired");
        }

        if (!"PASSWORD_RESET".equals(verification.getType())) {
            throw new BadRequestException("Invalid token type");
        }

        verification.setUsed(true);
        emailVerificationRepository.save(verification);

        User user = verification.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void verifyEmail(String token) {
        EmailVerification verification = emailVerificationRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));

        if (verification.isUsed() || verification.isExpired()) {
            throw new BadRequestException("Verification token is used or expired");
        }

        if (!"EMAIL_VERIFICATION".equals(verification.getType())) {
            throw new BadRequestException("Invalid token type");
        }

        verification.setUsed(true);
        emailVerificationRepository.save(verification);

        User user = verification.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
    }

    public UserResponse getCurrentUser(UUID userId) {
        User user = userService.getUserById(userId);
        return toUserResponse(user);
    }

    private void saveRefreshToken(User user, String token) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(token)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .globalRole(user.getGlobalRole())
                .emailVerified(user.isEmailVerified())
                .build();
    }
}
