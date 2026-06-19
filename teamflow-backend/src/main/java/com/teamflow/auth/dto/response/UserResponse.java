package com.teamflow.auth.dto.response;

import com.teamflow.user.entity.GlobalRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String fullName;
    private String email;
    private String profileImageUrl;
    private GlobalRole globalRole;
    private boolean emailVerified;
}
