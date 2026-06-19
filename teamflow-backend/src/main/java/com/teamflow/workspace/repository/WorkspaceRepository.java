package com.teamflow.workspace.repository;

import com.teamflow.workspace.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {
    List<Workspace> findByOwnerIdAndArchivedFalseOrderByCreatedAtDesc(UUID ownerId);
    long countByOwnerId(UUID ownerId);
}
