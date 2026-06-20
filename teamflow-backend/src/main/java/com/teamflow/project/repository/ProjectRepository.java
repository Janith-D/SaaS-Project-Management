package com.teamflow.project.repository;

import com.teamflow.project.entity.Project;
import com.teamflow.project.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByWorkspaceIdAndArchivedFalseOrderByCreatedAtDesc(UUID workspaceId);
    List<Project> findByWorkspaceIdOrderByCreatedAtDesc(UUID workspaceId);
    long countByWorkspaceId(UUID workspaceId);
    long countByWorkspaceIdAndStatus(UUID workspaceId, ProjectStatus status);
}
