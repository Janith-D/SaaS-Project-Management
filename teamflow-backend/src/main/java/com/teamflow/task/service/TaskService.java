package com.teamflow.task.service;

import com.teamflow.common.exception.BadRequestException;
import com.teamflow.common.exception.ResourceNotFoundException;
import com.teamflow.notification.enums.NotificationType;
import com.teamflow.notification.service.NotificationService;
import com.teamflow.project.entity.Project;
import com.teamflow.project.repository.ProjectRepository;
import com.teamflow.task.dto.*;
import com.teamflow.task.entity.Task;
import com.teamflow.task.enums.TaskStatus;
import com.teamflow.task.repository.TaskRepository;
import com.teamflow.user.entity.User;
import com.teamflow.user.service.UserService;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional
    public TaskResponse createTask(UUID projectId, UUID userId, CreateTaskRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        User creator = userService.getUserById(userId);

        Task task = Task.builder()
                .project(project)
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .status(TaskStatus.TODO)
                .priority(request.getPriority())
                .assignee(request.getAssigneeId() != null ? userService.getUserById(request.getAssigneeId()) : null)
                .reporter(creator)
                .dueDate(request.getDueDate())
                .estimatedHours(request.getEstimatedHours())
                .labels(request.getLabels())
                .createdBy(creator)
                .parentTask(request.getParentTaskId() != null ? taskRepository.findById(request.getParentTaskId()).orElse(null) : null)
                .position(0)
                .build();

        task = taskRepository.save(task);

        if (task.getAssignee() != null) {
            notificationService.createNotification(
                    task.getAssignee().getId(),
                    NotificationType.TASK_ASSIGNED,
                    "New Task: " + task.getTitle(),
                    "You have been assigned to \"" + task.getTitle() + "\" in " + task.getProject().getName(),
                    "TASK",
                    task.getId()
            );
        }

        return toTaskResponse(task);
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> getProjectTasks(UUID projectId, TaskFilterRequest filter, Pageable pageable) {
        Specification<Task> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("project").get("id"), projectId));

            if (!Long.class.equals(query.getResultType())) {
                root.fetch("assignee", JoinType.LEFT);
                root.fetch("reporter", JoinType.LEFT);
            }

            if (filter == null) return cb.and(predicates.toArray(new Predicate[0]));

            if (filter.getStatus() != null) predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            if (filter.getPriority() != null) predicates.add(cb.equal(root.get("priority"), filter.getPriority()));
            if (filter.getType() != null) predicates.add(cb.equal(root.get("type"), filter.getType()));
            if (filter.getAssigneeId() != null) predicates.add(cb.equal(root.get("assignee").get("id"), filter.getAssigneeId()));
            if (filter.getKeyword() != null && !filter.getKeyword().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + filter.getKeyword().toLowerCase() + "%"));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return taskRepository.findAll(spec, pageable).map(this::toTaskResponse);
    }

    @Transactional(readOnly = true)
    public TaskResponse getTask(UUID taskId) {
        Task task = findTask(taskId);
        return toTaskResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(UUID taskId, UUID userId, UpdateTaskRequest request) {
        Task task = findTask(taskId);

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getAssigneeId() != null) task.setAssignee(userService.getUserById(request.getAssigneeId()));
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getEstimatedHours() != null) task.setEstimatedHours(request.getEstimatedHours());
        if (request.getActualHours() != null) task.setActualHours(request.getActualHours());
        if (request.getLabels() != null) task.setLabels(request.getLabels());

        task = taskRepository.save(task);
        return toTaskResponse(task);
    }

    @Transactional
    public void deleteTask(UUID taskId, UUID userId) {
        taskRepository.deleteById(taskId);
    }

    @Transactional
    public TaskResponse updateStatus(UUID taskId, UUID userId, UpdateTaskStatusRequest request) {
        Task task = findTask(taskId);
        TaskStatus oldStatus = task.getStatus();
        task.setStatus(request.getStatus());
        task = taskRepository.save(task);

        if (task.getAssignee() != null) {
            notificationService.createNotification(
                    task.getAssignee().getId(),
                    NotificationType.TASK_STATUS_CHANGED,
                    "Task Status Updated: " + task.getTitle(),
                    "Task \"" + task.getTitle() + "\" moved from " + oldStatus + " to " + request.getStatus(),
                    "TASK",
                    task.getId()
            );
        }

        return toTaskResponse(task);
    }

    @Transactional
    public TaskResponse updateAssignee(UUID taskId, UUID userId, UpdateTaskAssigneeRequest request) {
        Task task = findTask(taskId);
        task.setAssignee(request.getAssigneeId() != null ? userService.getUserById(request.getAssigneeId()) : null);
        task = taskRepository.save(task);

        if (task.getAssignee() != null) {
            notificationService.createNotification(
                    task.getAssignee().getId(),
                    NotificationType.TASK_ASSIGNED,
                    "Task Assigned: " + task.getTitle(),
                    "You have been assigned to \"" + task.getTitle() + "\" in " + task.getProject().getName(),
                    "TASK",
                    task.getId()
            );
        }

        return toTaskResponse(task);
    }

    @Transactional
    public TaskResponse updatePriority(UUID taskId, UUID userId, UpdateTaskPriorityRequest request) {
        Task task = findTask(taskId);
        task.setPriority(request.getPriority());
        task = taskRepository.save(task);
        return toTaskResponse(task);
    }

    @Transactional
    public TaskResponse updateDueDate(UUID taskId, UUID userId, UpdateTaskDueDateRequest request) {
        Task task = findTask(taskId);
        task.setDueDate(request.getDueDate());
        task = taskRepository.save(task);
        return toTaskResponse(task);
    }

    @Transactional
    public TaskResponse moveTask(UUID taskId, MoveTaskRequest request) {
        Task task = findTask(taskId);
        TaskStatus oldStatus = task.getStatus();
        task.setStatus(request.getNewStatus());
        task.setPosition(request.getPosition());
        task = taskRepository.save(task);

        if (task.getAssignee() != null) {
            notificationService.createNotification(
                    task.getAssignee().getId(),
                    NotificationType.TASK_STATUS_CHANGED,
                    "Task Moved: " + task.getTitle(),
                    "Task \"" + task.getTitle() + "\" moved from " + oldStatus + " to " + request.getNewStatus(),
                    "TASK",
                    task.getId()
            );
        }

        return toTaskResponse(task);
    }

    @Transactional
    public TaskResponse createSubtask(UUID parentTaskId, UUID userId, CreateTaskRequest request) {
        Task parentTask = findTask(parentTaskId);
        request.setParentTaskId(parentTaskId);
        return createTask(parentTask.getProject().getId(), userId, request);
    }

    private Task findTask(UUID taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
    }

    private TaskResponse toTaskResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .projectId(task.getProject().getId())
                .parentTaskId(task.getParentTask() != null ? task.getParentTask().getId() : null)
                .title(task.getTitle())
                .description(task.getDescription())
                .type(task.getType())
                .status(task.getStatus())
                .priority(task.getPriority())
                .assigneeId(task.getAssignee() != null ? task.getAssignee().getId() : null)
                .assigneeName(task.getAssignee() != null ? task.getAssignee().getFullName() : null)
                .reporterId(task.getReporter() != null ? task.getReporter().getId() : null)
                .reporterName(task.getReporter() != null ? task.getReporter().getFullName() : null)
                .dueDate(task.getDueDate())
                .estimatedHours(task.getEstimatedHours())
                .actualHours(task.getActualHours())
                .labels(task.getLabels())
                .position(task.getPosition())
                .subtaskCount(taskRepository.countByParentTaskId(task.getId()))
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
