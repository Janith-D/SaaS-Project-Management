package com.teamflow.workspace.repository;

import com.teamflow.workspace.entity.Invitation;
import com.teamflow.workspace.enums.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InvitationRepository extends JpaRepository<Invitation, UUID> {
    Optional<Invitation> findByToken(String token);
    List<Invitation> findByWorkspaceId(UUID workspaceId);
    Optional<Invitation> findByWorkspaceIdAndEmailAndStatus(UUID workspaceId, String email, InvitationStatus status);
    List<Invitation> findByEmailAndStatus(String email, InvitationStatus status);
}
