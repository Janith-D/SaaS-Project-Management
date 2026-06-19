package com.teamflow.task.repository;

import com.teamflow.task.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID>, JpaSpecificationExecutor<Task> {
    List<Task> findByProjectIdOrderByPositionAsc(UUID projectId);
    List<Task> findByParentTaskId(UUID parentTaskId);
    long countByProjectId(UUID projectId);
    long countByProjectIdAndStatus(UUID projectId, String status);
    long countByAssigneeIdAndStatusNot(UUID assigneeId, String status);
    long countByAssigneeIdAndDueDateBeforeAndStatusNot(UUID assigneeId, java.time.LocalDateTime date, String status);
    long countByParentTaskId(UUID parentTaskId);
}
