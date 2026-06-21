package com.teamflow.common.config;

import com.teamflow.comment.entity.Comment;
import com.teamflow.comment.repository.CommentRepository;
import com.teamflow.notification.enums.NotificationType;
import com.teamflow.notification.entity.Notification;
import com.teamflow.notification.repository.NotificationRepository;
import com.teamflow.project.entity.Project;
import com.teamflow.project.entity.ProjectMember;
import com.teamflow.project.enums.ProjectMemberRole;
import com.teamflow.project.enums.ProjectStatus;
import com.teamflow.project.repository.ProjectMemberRepository;
import com.teamflow.project.repository.ProjectRepository;
import com.teamflow.task.entity.Task;
import com.teamflow.task.enums.TaskPriority;
import com.teamflow.task.enums.TaskStatus;
import com.teamflow.task.enums.TaskType;
import com.teamflow.task.repository.TaskRepository;
import com.teamflow.user.entity.GlobalRole;
import com.teamflow.user.entity.User;
import com.teamflow.user.repository.UserRepository;
import com.teamflow.workspace.entity.Workspace;
import com.teamflow.workspace.entity.WorkspaceMember;
import com.teamflow.workspace.enums.WorkspaceMemberRole;
import com.teamflow.workspace.repository.WorkspaceMemberRepository;
import com.teamflow.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final TaskRepository taskRepository;
    private final CommentRepository commentRepository;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (workspaceRepository.count() > 0) {
            log.info("Seed data already exists, skipping initialization");
            return;
        }

        log.info("Initializing seed data...");
        createUsers();
        log.info("Seed data created successfully");
    }

    private void createUsers() {
        // Super admin (platform-level access)
        User admin = User.builder()
                .fullName("Super Admin")
                .email("admin@tf.com")
                .password(passwordEncoder.encode("password123"))
                .globalRole(GlobalRole.SUPER_ADMIN)
                .emailVerified(true)
                .active(true)
                .build();
        admin = userRepository.save(admin);

        // Workspace owner
        User test = User.builder()
                .fullName("Test User")
                .email("test@tf.com")
                .password(passwordEncoder.encode("password123"))
                .globalRole(GlobalRole.USER)
                .emailVerified(true)
                .active(true)
                .build();
        test = userRepository.save(test);

        // Regular member
        User alice = User.builder()
                .fullName("Alice Johnson")
                .email("alice@tf.com")
                .password(passwordEncoder.encode("password123"))
                .globalRole(GlobalRole.USER)
                .emailVerified(true)
                .active(true)
                .build();
        alice = userRepository.save(alice);

        // Regular member
        User bob = User.builder()
                .fullName("Bob Smith")
                .email("bob@tf.com")
                .password(passwordEncoder.encode("password123"))
                .globalRole(GlobalRole.USER)
                .emailVerified(true)
                .active(true)
                .build();
        bob = userRepository.save(bob);

        // Workspace admin
        User charlie = User.builder()
                .fullName("Charlie Brown")
                .email("charlie@tf.com")
                .password(passwordEncoder.encode("password123"))
                .globalRole(GlobalRole.USER)
                .emailVerified(true)
                .active(true)
                .build();
        charlie = userRepository.save(charlie);

        // Project manager
        User diana = User.builder()
                .fullName("Diana Prince")
                .email("diana@tf.com")
                .password(passwordEncoder.encode("password123"))
                .globalRole(GlobalRole.USER)
                .emailVerified(true)
                .active(true)
                .build();
        diana = userRepository.save(diana);

        // Viewer (read-only)
        User eve = User.builder()
                .fullName("Eve Adams")
                .email("eve@tf.com")
                .password(passwordEncoder.encode("password123"))
                .globalRole(GlobalRole.USER)
                .emailVerified(true)
                .active(true)
                .build();
        eve = userRepository.save(eve);

        createWorkspacesAndData(admin, test, alice, bob, charlie, diana, eve);
    }

    private void createWorkspacesAndData(User admin, User test, User alice, User bob, User charlie, User diana, User eve) {
        // --- Workspace 1: Acme Corp (full team with all roles) ---
        Workspace acme = workspaceRepository.save(Workspace.builder()
                .name("Acme Corp")
                .description("Main product development workspace")
                .owner(test)
                .archived(false)
                .build());

        // All six workspace roles represented
        workspaceMemberRepository.save(WorkspaceMember.builder()
                .workspace(acme).user(test).role(WorkspaceMemberRole.WORKSPACE_OWNER).build());
        workspaceMemberRepository.save(WorkspaceMember.builder()
                .workspace(acme).user(charlie).role(WorkspaceMemberRole.WORKSPACE_ADMIN).build());
        workspaceMemberRepository.save(WorkspaceMember.builder()
                .workspace(acme).user(diana).role(WorkspaceMemberRole.PROJECT_MANAGER).build());
        workspaceMemberRepository.save(WorkspaceMember.builder()
                .workspace(acme).user(alice).role(WorkspaceMemberRole.MEMBER).build());
        workspaceMemberRepository.save(WorkspaceMember.builder()
                .workspace(acme).user(bob).role(WorkspaceMemberRole.MEMBER).build());
        workspaceMemberRepository.save(WorkspaceMember.builder()
                .workspace(acme).user(eve).role(WorkspaceMemberRole.VIEWER).build());

        // Projects for Acme Corp
        Project website = createProject(acme, test, "Website Redesign", "Modernizing the company website and improving UX", ProjectStatus.ACTIVE);
        Project mobileApp = createProject(acme, test, "Mobile App", "Building the cross-platform mobile application", ProjectStatus.ACTIVE);
        Project q2Planning = createProject(acme, test, "Q2 Planning", "Quarter 2 roadmap and sprint planning", ProjectStatus.PLANNING);
        Project legacyMigration = createProject(acme, test, "Legacy Migration", "Migrating legacy systems to the new platform", ProjectStatus.COMPLETED);
        Project apiGateway = createProject(acme, test, "API Gateway", "Centralized API gateway for microservices", ProjectStatus.ON_HOLD);

        // Project members with varied project-level roles
        addProjectMember(website, test, ProjectMemberRole.PROJECT_MANAGER);
        addProjectMember(website, alice, ProjectMemberRole.MEMBER);
        addProjectMember(website, diana, ProjectMemberRole.MEMBER);
        addProjectMember(mobileApp, test, ProjectMemberRole.PROJECT_MANAGER);
        addProjectMember(mobileApp, alice, ProjectMemberRole.MEMBER);
        addProjectMember(mobileApp, bob, ProjectMemberRole.MEMBER);
        addProjectMember(mobileApp, diana, ProjectMemberRole.PROJECT_MANAGER);
        addProjectMember(q2Planning, test, ProjectMemberRole.PROJECT_MANAGER);
        addProjectMember(q2Planning, alice, ProjectMemberRole.MEMBER);
        addProjectMember(q2Planning, charlie, ProjectMemberRole.MEMBER);
        addProjectMember(legacyMigration, test, ProjectMemberRole.PROJECT_MANAGER);
        addProjectMember(legacyMigration, bob, ProjectMemberRole.MEMBER);
        addProjectMember(apiGateway, test, ProjectMemberRole.PROJECT_MANAGER);
        addProjectMember(apiGateway, charlie, ProjectMemberRole.MEMBER);
        addProjectMember(apiGateway, diana, ProjectMemberRole.PROJECT_MANAGER);
        addProjectMember(apiGateway, eve, ProjectMemberRole.VIEWER);

        // Tasks for Website Redesign
        Task t1 = createTask(website, test, "Design new homepage layout", "Create wireframes and high-fidelity mockups for the homepage", TaskType.TASK, TaskPriority.HIGH, TaskStatus.IN_PROGRESS, alice);
        Task t2 = createTask(website, test, "Implement responsive navigation", "Build a mobile-first responsive navbar component", TaskType.TASK, TaskPriority.MEDIUM, TaskStatus.TODO, test);
        Task t3 = createTask(website, test, "Create component library", "Document and build reusable UI components in Storybook", TaskType.EPIC, TaskPriority.HIGH, TaskStatus.IN_REVIEW, diana);
        Task t4 = createTask(website, test, "Set up CI/CD pipeline", "Configure GitHub Actions for automated deployment", TaskType.TASK, TaskPriority.MEDIUM, TaskStatus.DONE, bob);
        Task t5 = createTask(website, test, "Write unit tests", "Achieve 80% code coverage on core modules", TaskType.TASK, TaskPriority.LOW, TaskStatus.TODO, test);
        createTask(website, test, "Fix SEO meta tags", "Add proper meta descriptions and Open Graph tags", TaskType.BUG, TaskPriority.MEDIUM, TaskStatus.BLOCKED, alice);

        // Tasks for Mobile App
        Task t7 = createTask(mobileApp, test, "Set up React Native project", "Initialize the project with necessary dependencies", TaskType.TASK, TaskPriority.HIGH, TaskStatus.DONE, test);
        Task t8 = createTask(mobileApp, test, "Design login screen", "Implement authentication UI with email and social login", TaskType.FEATURE, TaskPriority.HIGH, TaskStatus.IN_PROGRESS, alice);
        createTask(mobileApp, test, "Implement API integration layer", "Build the API client with interceptors and error handling", TaskType.TASK, TaskPriority.MEDIUM, TaskStatus.TODO, bob);
        createTask(mobileApp, test, "Push notifications setup", "Configure Firebase Cloud Messaging for push notifications", TaskType.FEATURE, TaskPriority.LOW, TaskStatus.TODO, null);
        createTask(mobileApp, test, "Performance profiling", "Profile app startup time and optimize bundle size", TaskType.IMPROVEMENT, TaskPriority.MEDIUM, TaskStatus.TODO, diana);
        createTask(mobileApp, test, "Implement offline mode", "Add offline-first support with local storage sync", TaskType.FEATURE, TaskPriority.MEDIUM, TaskStatus.TODO, charlie);

        // Tasks for Q2 Planning
        createTask(q2Planning, test, "Define sprint goals", "Outline objectives and key results for Q2 sprints", TaskType.TASK, TaskPriority.HIGH, TaskStatus.TODO, test);
        createTask(q2Planning, charlie, "Resource allocation", "Review team capacity and assign resources", TaskType.TASK, TaskPriority.MEDIUM, TaskStatus.TODO, alice);

        // Tasks for Legacy Migration (all done)
        createTask(legacyMigration, test, "Audit existing codebase", "Document all legacy systems and dependencies", TaskType.TASK, TaskPriority.HIGH, TaskStatus.DONE, bob);
        createTask(legacyMigration, test, "Migrate database", "Move data from legacy to new PostgreSQL schema", TaskType.TASK, TaskPriority.CRITICAL, TaskStatus.DONE, test);
        createTask(legacyMigration, test, "Update API endpoints", "Rewrite REST endpoints to match new spec", TaskType.TASK, TaskPriority.HIGH, TaskStatus.DONE, bob);
        createTask(legacyMigration, test, "Final testing and sign-off", "Run integration tests and get stakeholder approval", TaskType.TASK, TaskPriority.MEDIUM, TaskStatus.DONE, test);

        // Tasks for API Gateway
        createTask(apiGateway, charlie, "Design API contract", "Define OpenAPI spec for all gateway routes", TaskType.TASK, TaskPriority.HIGH, TaskStatus.IN_PROGRESS, diana);
        createTask(apiGateway, charlie, "Implement rate limiting", "Add rate limiting per client API key", TaskType.TASK, TaskPriority.MEDIUM, TaskStatus.TODO, charlie);
        createTask(apiGateway, charlie, "Set up authentication proxy", "Route all requests through JWT validation middleware", TaskType.FEATURE, TaskPriority.HIGH, TaskStatus.TODO, null);

        // Comments
        createComment(t1, alice, "I've drafted the initial wireframes. The homepage will feature a hero section with a CTA, followed by feature highlights and a testimonial carousel. @TestUser would love your feedback on the color palette.");
        createComment(t1, test, "Looks great! Let's go with the blue-primary scheme we discussed. I left some notes in Figma.");
        createComment(t8, bob, "Make sure we support both email/password and Google OAuth. I can help with the backend integration.");
        createComment(t7, test, "Project initialized successfully. Using React Native 0.76 with the new architecture enabled.");
        createComment(t3, diana, "I've started the Storybook integration. Will share the preview link by EOD.");
        createComment(createTask(website, test, "Accessibility audit", "Run Lighthouse audit and fix WCAG violations", TaskType.TASK, TaskPriority.MEDIUM, TaskStatus.TODO, eve), eve, "I can run the initial audit this week. Should we target AA compliance?");

        // Notifications (pre-generate some so the UI shows activity immediately)
        createNotification(alice, NotificationType.TASK_ASSIGNED, "New Task: Design login screen", "You have been assigned to \"Design login screen\" in Mobile App", "TASK", t8.getId());
        createNotification(alice, NotificationType.COMMENT_ADDED, "New Comment on: Design new homepage layout", "Test User commented on \"Design new homepage layout\"", "TASK", t1.getId());
        createNotification(bob, NotificationType.TASK_ASSIGNED, "New Task: Implement API integration layer", "You have been assigned to \"Implement API integration layer\" in Mobile App", "TASK", null);
        createNotification(test, NotificationType.PROJECT_COMPLETED, "Project Completed: Legacy Migration", "Project \"Legacy Migration\" has been marked as completed", "PROJECT", legacyMigration.getId());
        createNotification(charlie, NotificationType.TASK_ASSIGNED, "New Task: Implement offline mode", "You have been assigned to \"Implement offline mode\" in Mobile App", "TASK", null);
        createNotification(diana, NotificationType.TASK_ASSIGNED, "New Task: Design API contract", "You have been assigned to \"Design API contract\" in API Gateway", "TASK", null);

        // --- Workspace 2: Side Project (small team, owner + member) ---
        Workspace side = workspaceRepository.save(Workspace.builder()
                .name("Side Project")
                .description("Personal experiments and side projects")
                .owner(test)
                .archived(false)
                .build());

        workspaceMemberRepository.save(WorkspaceMember.builder()
                .workspace(side).user(test).role(WorkspaceMemberRole.WORKSPACE_OWNER).build());
        workspaceMemberRepository.save(WorkspaceMember.builder()
                .workspace(side).user(bob).role(WorkspaceMemberRole.MEMBER).build());

        Project blog = createProject(side, test, "Blog Engine", "A lightweight markdown blog engine built with Spring Boot and React", ProjectStatus.ACTIVE);
        addProjectMember(blog, test, ProjectMemberRole.PROJECT_MANAGER);
        addProjectMember(blog, bob, ProjectMemberRole.MEMBER);

        createTask(blog, test, "Design database schema", "Create tables for posts, tags, and comments", TaskType.TASK, TaskPriority.HIGH, TaskStatus.DONE, test);
        createTask(blog, test, "Build REST API", "Implement CRUD endpoints for blog posts with pagination", TaskType.TASK, TaskPriority.HIGH, TaskStatus.IN_PROGRESS, test);
        createTask(blog, test, "Create admin dashboard", "Build a simple admin UI for managing posts", TaskType.FEATURE, TaskPriority.MEDIUM, TaskStatus.TODO, bob);
        createTask(blog, test, "Markdown rendering", "Integrate a markdown parser for content rendering", TaskType.TASK, TaskPriority.MEDIUM, TaskStatus.TODO, test);
        createTask(blog, test, "SEO optimization", "Add sitemap generation and meta tag management", TaskType.IMPROVEMENT, TaskPriority.LOW, TaskStatus.TODO, null);

        log.info("Created 2 workspaces, 8 projects, 30 tasks, 6 comments, and 6 notifications");
    }

    private Project createProject(Workspace ws, User creator, String name, String description, ProjectStatus status) {
        return projectRepository.save(Project.builder()
                .workspace(ws)
                .name(name)
                .description(description)
                .status(status)
                .createdBy(creator)
                .archived(false)
                .build());
    }

    private void addProjectMember(Project project, User user, ProjectMemberRole role) {
        projectMemberRepository.save(ProjectMember.builder()
                .project(project)
                .user(user)
                .role(role)
                .build());
    }

    private Task createTask(Project project, User creator, String title, String description,
                            TaskType type, TaskPriority priority, TaskStatus status, User assignee) {
        return taskRepository.save(Task.builder()
                .project(project)
                .title(title)
                .description(description)
                .type(type)
                .status(status)
                .priority(priority)
                .assignee(assignee)
                .reporter(creator)
                .createdBy(creator)
                .position(0)
                .build());
    }

    private void createComment(Task task, User author, String content) {
        commentRepository.save(Comment.builder()
                .task(task)
                .author(author)
                .content(content)
                .build());
    }

    private void createNotification(User user, NotificationType type, String title, String message,
                                     String relatedEntityType, UUID relatedEntityId) {
        notificationRepository.save(Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .relatedEntityType(relatedEntityType)
                .relatedEntityId(relatedEntityId)
                .read(false)
                .build());
    }
}
