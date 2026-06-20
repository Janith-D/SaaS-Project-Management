package com.teamflow.task.repository;

import com.teamflow.task.entity.Task;
import com.teamflow.task.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID>, JpaSpecificationExecutor<Task> {
    List<Task> findByProjectIdOrderByPositionAsc(UUID projectId);
    List<Task> findByParentTaskId(UUID parentTaskId);
    long countByProjectId(UUID projectId);
    long countByProjectIdAndStatus(UUID projectId, TaskStatus status);
    long countByAssigneeIdAndStatusNot(UUID assigneeId, TaskStatus status);
    long countByAssigneeIdAndDueDateBeforeAndStatusNot(UUID assigneeId, LocalDateTime date, TaskStatus status);
    long countByParentTaskId(UUID parentTaskId);
}
