package com.teamflow.common.event;

import com.teamflow.activitylog.service.ActivityLogService;
import com.teamflow.auditlog.enums.AuditEventType;
import com.teamflow.auditlog.service.AuditLogService;
import com.teamflow.common.exception.ResourceNotFoundException;
import com.teamflow.notification.enums.NotificationType;
import com.teamflow.notification.service.NotificationService;
import com.teamflow.project.entity.Project;
import com.teamflow.project.repository.ProjectRepository;
import com.teamflow.task.entity.Task;
import com.teamflow.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class EventListeners {

    private static final Logger log = LoggerFactory.getLogger(EventListeners.class);

    private final ActivityLogService activityLogService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    @EventListener
    public void handleUserRegistered(UserRegisteredEvent event) {
        auditLogService.log(null, AuditEventType.USER_REGISTERED,
                "User registered: " + event.getEmail(), null);
    }

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleTaskCreated(TaskCreatedEvent event) {
        activityLogService.log(event.getWorkspaceId(), event.getProjectId(), event.getTaskId(),
                event.getReporterId(), "TASK_CREATED", "Task", event.getTaskId(),
                "Task \"" + event.getTaskTitle() + "\" was created");
    }

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleTaskAssigned(TaskAssignedEvent event) {
        activityLogService.log(event.getWorkspaceId(), event.getProjectId(), event.getTaskId(),
                event.getAssignedBy(), "TASK_ASSIGNED", "Task", event.getTaskId(),
                "Task \"" + event.getTaskTitle() + "\" was assigned to user");

        if (event.getAssigneeId() != null && !event.getAssigneeId().equals(event.getAssignedBy())) {
            String title = "Task assigned to you";
            String message = "You have been assigned task: " + event.getTaskTitle();
            notificationService.createNotification(event.getAssigneeId(), NotificationType.TASK_ASSIGNED,
                    title, message, "task", event.getTaskId());
        }
    }

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleTaskStatusChanged(TaskStatusChangedEvent event) {
        activityLogService.log(event.getWorkspaceId(), event.getProjectId(), event.getTaskId(),
                event.getChangedBy(), "TASK_STATUS_CHANGED", "Task", event.getTaskId(),
                "Task \"" + event.getTaskTitle() + "\" changed from " + event.getOldStatus()
                        + " to " + event.getNewStatus());
    }

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleCommentAdded(CommentAddedEvent event) {
        Task task = taskRepository.findById(event.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        UUID workspaceId = task.getProject().getWorkspace().getId();
        UUID projectId = task.getProject().getId();

        activityLogService.log(workspaceId, projectId, event.getTaskId(),
                event.getAuthorId(), "COMMENT_ADDED", "Comment",
                event.getCommentId(), "Comment added to task \"" + task.getTitle() + "\"");

        if (task.getAssignee() != null && !task.getAssignee().getId().equals(event.getAuthorId())) {
            notificationService.createNotification(task.getAssignee().getId(),
                    NotificationType.COMMENT_ADDED, "New comment on task",
                    event.getContent(), "task", event.getTaskId());
        }
    }

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleProjectCreated(ProjectCreatedEvent event) {
        activityLogService.log(event.getWorkspaceId(), event.getProjectId(), null,
                event.getCreatedBy(), "PROJECT_CREATED", "Project", event.getProjectId(),
                "Project \"" + event.getProjectName() + "\" was created");
    }

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleMemberInvited(MemberInvitedEvent event) {
        activityLogService.log(event.getWorkspaceId(), null, null,
                event.getInvitedBy(), "MEMBER_INVITED", "Invitation", event.getInvitationId(),
                "Invitation sent to " + event.getEmail());
    }
}
