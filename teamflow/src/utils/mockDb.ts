import { UserInfo } from "../types/auth.types";
import { Workspace, WorkspaceStats } from "../types/workspace.types";
import { WorkspaceMember } from "../types/user.types";
import { Project, ProjectStatus } from "../types/project.types";
import { Task, TaskComment, TaskAttachment, ActivityLog, TaskStatus, TaskPriority, TaskType } from "../types/task.types";

// Key names
const KEYS = {
  USER: "tf_user",
  WORKSPACES: "tf_workspaces",
  MEMBERS: "tf_members",
  PROJECTS: "tf_projects",
  TASKS: "tf_tasks",
  COMMENTS: "tf_comments",
  ATTACHMENTS: "tf_attachments",
  ACTIVITIES: "tf_activities",
  NOTIFICATIONS: "tf_notifications",
  SYSTEM_USERS: "tf_system_users",
  SUBSCRIPTION: "tf_subscription_logs"
};

// Seed initial users
const INITIAL_SYSTEM_USERS = [
  { id: "u-1", fullName: "Janet Gomez", email: "janetdgo2001@gmail.com", role: "WORKSPACE_OWNER", password: "password" },
  { id: "u-2", fullName: "Kasun Dias", email: "kasun@teamflow.com", role: "WORKSPACE_ADMIN", password: "password" },
  { id: "u-3", fullName: "Janith Perera", email: "janith@teamflow.com", role: "PROJECT_MANAGER", password: "password" },
  { id: "u-4", fullName: "Nimal Silva", email: "nimal@teamflow.com", role: "MEMBER", password: "password" },
  { id: "u-5", fullName: "Alice Smith", email: "alice@teamflow.com", role: "VIEWER", password: "password" },
  { id: "u-admin", fullName: "Platform Admin", email: "admin@teamflow.com", role: "PLATFORM_ADMIN", password: "admin123" }
];

// Seed initial workspaces
const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: "ws-1",
    name: "Acme Corp Workspace",
    description: "Primary workspace for Acme Corp product design, engineering, and support schedules.",
    slug: "acme-corp",
    ownerId: "u-1",
    plan: "PRO",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-06-18T12:00:00Z"
  },
  {
    id: "ws-2",
    name: "TeamFlow Dev Workspace",
    description: "Sandbox research workspace for core SaaS platform engineering, testing, and continuous feedback loop.",
    slug: "teamflow-dev",
    ownerId: "u-1",
    plan: "BUSINESS",
    createdAt: "2026-03-15T09:00:00Z",
    updatedAt: "2026-06-19T10:00:00Z"
  }
];

// Seed workspace members
const INITIAL_MEMBERS: Record<string, WorkspaceMember[]> = {
  "ws-1": [
    { id: "u-1", fullName: "Janet Gomez", email: "janetdgo2001@gmail.com", role: "WORKSPACE_OWNER", status: "ACTIVE", joinedDate: "2026-01-10" },
    { id: "u-2", fullName: "Kasun Dias", email: "kasun@teamflow.com", role: "WORKSPACE_ADMIN", status: "ACTIVE", joinedDate: "2026-01-12" },
    { id: "u-3", fullName: "Janith Perera", email: "janith@teamflow.com", role: "PROJECT_MANAGER", status: "ACTIVE", joinedDate: "2026-01-15" },
    { id: "u-4", fullName: "Nimal Silva", email: "nimal@teamflow.com", role: "MEMBER", status: "ACTIVE", joinedDate: "2026-01-20" },
    { id: "u-5", fullName: "Alice Smith", email: "alice@teamflow.com", role: "VIEWER", status: "PENDING", joinedDate: "2026-06-18" }
  ],
  "ws-2": [
    { id: "u-1", fullName: "Janet Gomez", email: "janetdgo2001@gmail.com", role: "WORKSPACE_OWNER", status: "ACTIVE", joinedDate: "2026-03-15" },
    { id: "u-3", fullName: "Janith Perera", email: "janith@teamflow.com", role: "WORKSPACE_ADMIN", status: "ACTIVE", joinedDate: "2026-03-16" },
    { id: "u-4", fullName: "Nimal Silva", email: "nimal@teamflow.com", role: "MEMBER", status: "ACTIVE", joinedDate: "2026-03-16" }
  ]
};

// Seed projects
const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    workspaceId: "ws-1",
    name: "TeamFlow Mobile App",
    description: "Build, style, and ship the iOS and Android react native companion apps for TeamFlow.",
    status: "ACTIVE",
    progress: 68,
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-06-19T11:00:00Z",
    startDate: "2026-02-01",
    endDate: "2026-08-30",
    ownerId: "u-3",
    members: ["u-1", "u-2", "u-3", "u-4"]
  },
  {
    id: "proj-2",
    workspaceId: "ws-1",
    name: "Spring Boot REST API",
    description: "Implement high-throughput backend services incorporating Spring Security, JDBC, and Swagger docs.",
    status: "ACTIVE",
    progress: 45,
    createdAt: "2026-02-10T11:00:00Z",
    updatedAt: "2026-06-18T16:00:00Z",
    startDate: "2026-02-15",
    endDate: "2026-07-15",
    ownerId: "u-2",
    members: ["u-1", "u-2", "u-4"]
  },
  {
    id: "proj-3",
    workspaceId: "ws-1",
    name: "Marketing Website Rewrite",
    description: "Relaunch marketing lander focusing on pricing grids, subscription comparisons, and user conversion ratios.",
    status: "PLANNING",
    progress: 10,
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-06-15T09:00:00Z",
    startDate: "2026-07-01",
    endDate: "2026-09-01",
    ownerId: "u-1",
    members: ["u-1", "u-5"]
  }
];

// Seed tasks
const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    projectId: "proj-1",
    title: "Configure OAuth2 Login Screens",
    description: "Design mock identity selection lists, login handlers, and callback popups to meet compliance.",
    status: "IN_REVIEW",
    priority: "HIGH",
    type: "FEATURE",
    creatorId: "u-3",
    assigneeId: "u-1",
    assigneeName: "Janet Gomez",
    dueDate: "2026-06-25",
    estimatedHours: 12,
    actualHours: 10,
    position: 1000,
    createdAt: "2026-06-10T14:00:00Z",
    updatedAt: "2026-06-19T11:30:00Z",
    commentCount: 2,
    attachmentCount: 1
  },
  {
    id: "task-2",
    projectId: "proj-1",
    title: "Optimize Kanban Drag-and-Drop Frame Transitions",
    description: "Reduce render flickering during element displacement. Apply CSS hardware acceleration triggers.",
    status: "IN_PROGRESS",
    priority: "CRITICAL",
    type: "IMPROVEMENT",
    creatorId: "u-1",
    assigneeId: "u-4",
    assigneeName: "Nimal Silva",
    dueDate: "2026-06-20",
    estimatedHours: 8,
    actualHours: 6,
    position: 2000,
    createdAt: "2026-06-12T09:00:00Z",
    updatedAt: "2026-06-19T12:00:00Z",
    commentCount: 1,
    attachmentCount: 0
  },
  {
    id: "task-3",
    projectId: "proj-1",
    title: "Implement Push Notifications",
    description: "Set up FCM tokens, subscription switches in accounts workspace, and local background message listeners.",
    status: "TODO",
    priority: "MEDIUM",
    type: "FEATURE",
    creatorId: "u-3",
    assigneeId: "u-3",
    assigneeName: "Janith Perera",
    dueDate: "2026-07-05",
    estimatedHours: 16,
    actualHours: 0,
    position: 3000,
    createdAt: "2026-06-13T10:00:00Z",
    updatedAt: "2026-06-13T10:00:00Z",
    commentCount: 0,
    attachmentCount: 0
  },
  {
    id: "task-4",
    projectId: "proj-1",
    title: "Fix Analytics Dashboard Grid Flashing",
    description: "Recharts triggers scale calculations on container resize. Add debounced boundary check logic.",
    status: "BLOCKED",
    priority: "LOW",
    type: "BUG",
    creatorId: "u-2",
    assigneeId: "u-2",
    assigneeName: "Kasun Dias",
    dueDate: "2026-06-18",
    estimatedHours: 4,
    actualHours: 2,
    position: 4000,
    createdAt: "2026-06-14T11:00:00Z",
    updatedAt: "2026-06-18T15:00:00Z",
    commentCount: 1,
    attachmentCount: 0
  },
  {
    id: "task-5",
    projectId: "proj-1",
    title: "Write End-to-End Core Flow Tests",
    description: "Cover login validation rules, workspace creation modal inputs, and project switching cycles.",
    status: "DONE",
    priority: "MEDIUM",
    type: "RESEARCH",
    creatorId: "u-1",
    assigneeId: "u-4",
    assigneeName: "Nimal Silva",
    dueDate: "2026-06-15",
    estimatedHours: 20,
    actualHours: 22,
    position: 5000,
    createdAt: "2026-06-05T09:00:00Z",
    updatedAt: "2026-06-15T17:00:00Z",
    commentCount: 0,
    attachmentCount: 0
  },
  {
    id: "task-6",
    projectId: "proj-2",
    title: "Configure JWT Encryption Filter",
    description: "Introduce custom OncePerRequestFilter extraction, validation, and context setup.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    type: "FEATURE",
    creatorId: "u-2",
    assigneeId: "u-2",
    assigneeName: "Kasun Dias",
    dueDate: "2026-06-22",
    estimatedHours: 10,
    actualHours: 5,
    position: 1000,
    createdAt: "2026-06-10T08:00:00Z",
    updatedAt: "2026-06-19T09:00:00Z",
    commentCount: 0,
    attachmentCount: 1
  },
  {
    id: "task-7",
    projectId: "proj-2",
    title: "Database Index Tuning",
    description: "Analyze workspace query parameters. Introduce composite indexes on project search fields.",
    status: "TODO",
    priority: "HIGH",
    type: "IMPROVEMENT",
    creatorId: "u-2",
    assigneeId: "u-4",
    assigneeName: "Nimal Silva",
    dueDate: "2026-06-30",
    estimatedHours: 6,
    actualHours: 0,
    position: 2000,
    createdAt: "2026-06-15T12:00:00Z",
    updatedAt: "2026-06-15T12:00:00Z",
    commentCount: 0,
    attachmentCount: 0
  }
];

// Seed comments
const INITIAL_COMMENTS: TaskComment[] = [
  {
    id: "c-1",
    taskId: "task-1",
    authorId: "u-2",
    authorName: "Kasun Dias",
    content: "Make sure client logins are cached securely. Standard OAuth callback URI should use the live app URL.",
    createdAt: "2026-06-11T15:00:00Z"
  },
  {
    id: "c-2",
    taskId: "task-1",
    authorId: "u-1",
    authorName: "Janet Gomez",
    content: "Absolutely. I've designed a fallback mechanism to handle sandboxed browser variables gracefully too. @Kasun Dias",
    createdAt: "2026-06-12T10:00:00Z"
  },
  {
    id: "c-3",
    taskId: "task-2",
    authorId: "u-1",
    authorName: "Janet Gomez",
    content: "Perfect, Nimal! Let me know if you run into any layout issues on small-screen sizes.",
    createdAt: "2026-06-19T10:15:00Z"
  },
  {
    id: "c-4",
    taskId: "task-4",
    authorId: "u-4",
    authorName: "Nimal Silva",
    content: "The chart container expands beyond parent overflow borders during mobile drawer slide-out.",
    createdAt: "2026-06-17T11:00:00Z"
  }
];

// Seed attachments
const INITIAL_ATTACHMENTS: TaskAttachment[] = [
  {
    id: "att-1",
    taskId: "task-1",
    name: "oauth_flow_diagram.png",
    size: 245000,
    type: "image/png",
    url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
    uploadedBy: "u-3",
    uploadedByName: "Janith Perera",
    uploadedAt: "2026-06-11T14:30:00Z"
  },
  {
    id: "att-2",
    taskId: "task-6",
    name: "security_spec.pdf",
    size: 1540000,
    type: "application/pdf",
    url: "#",
    uploadedBy: "u-2",
    uploadedByName: "Kasun Dias",
    uploadedAt: "2026-06-11T09:00:00Z"
  }
];

// Seed Activity Logs
const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: "act-1",
    workspaceId: "ws-1",
    projectId: "proj-1",
    taskId: "task-2",
    userId: "u-4",
    userName: "Nimal Silva",
    action: "moved task 'Optimize Kanban Drag-and-Drop Frame Transitions' from TODO to IN_PROGRESS",
    timestamp: "2026-06-19T12:00:00Z"
  },
  {
    id: "act-2",
    workspaceId: "ws-1",
    projectId: "proj-1",
    taskId: "task-1",
    userId: "u-1",
    userName: "Janet Gomez",
    action: "added a comment on task 'Configure OAuth2 Login Screens'",
    timestamp: "2026-06-19T10:00:00Z"
  },
  {
    id: "act-3",
    workspaceId: "ws-1",
    projectId: "proj-2",
    taskId: "task-6",
    userId: "u-2",
    userName: "Kasun Dias",
    action: "uploaded attachment 'security_spec.pdf' to task 'Configure JWT Encryption Filter'",
    timestamp: "2026-06-18T16:00:00Z"
  },
  {
    id: "act-4",
    workspaceId: "ws-1",
    projectId: "proj-1",
    taskId: "task-5",
    userId: "u-4",
    userName: "Nimal Silva",
    action: "completed task 'Write End-to-End Core Flow Tests'",
    timestamp: "2026-06-15T17:00:00Z"
  }
];

// Seed Notifications
const INITIAL_NOTIFICATIONS = [
  {
    id: "not-1",
    userId: "u-1",
    title: "Assigned Task",
    message: "Janith Perera assigned you to task: Configure OAuth2 Login Screens.",
    read: false,
    createdAt: "2026-06-19T10:00:00Z",
    type: "ASSIGNMENT"
  },
  {
    id: "not-2",
    userId: "u-1",
    title: "Comment Mention",
    message: "Kasun Dias mentioned you in a comment on Configure JWT Encryption Filter: '@Janet Gomez check the key.'",
    read: false,
    createdAt: "2026-06-19T11:15:00Z",
    type: "MENTION"
  },
  {
    id: "not-3",
    userId: "u-1",
    title: "Project Milestone",
    message: "Project 'TeamFlow Mobile App' status updated to ACTIVE.",
    read: true,
    createdAt: "2026-06-18T09:00:00Z",
    type: "PROJECT"
  }
];

// Initialize localStorage databases if empty
export function initDb() {
  if (!localStorage.getItem(KEYS.SYSTEM_USERS)) {
    localStorage.setItem(KEYS.SYSTEM_USERS, JSON.stringify(INITIAL_SYSTEM_USERS));
  }
  if (!localStorage.getItem(KEYS.WORKSPACES)) {
    localStorage.setItem(KEYS.WORKSPACES, JSON.stringify(INITIAL_WORKSPACES));
  }
  if (!localStorage.getItem(KEYS.MEMBERS)) {
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
  }
  if (!localStorage.getItem(KEYS.PROJECTS)) {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  }
  if (!localStorage.getItem(KEYS.TASKS)) {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
  }
  if (!localStorage.getItem(KEYS.COMMENTS)) {
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
  }
  if (!localStorage.getItem(KEYS.ATTACHMENTS)) {
    localStorage.setItem(KEYS.ATTACHMENTS, JSON.stringify(INITIAL_ATTACHMENTS));
  }
  if (!localStorage.getItem(KEYS.ACTIVITIES)) {
    localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
}

// Help utility for simple promises simulating artificial latency (300ms)
const resolveWithDelay = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 250);
  });
};

const rejectWithDelay = (msg: string): Promise<any> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(msg));
    }, 250);
  });
};

export const mockDb = {
  // Authentication
  login: async (email: string, password: string): Promise<{ accessToken: string; user: UserInfo }> => {
    initDb();
    const list = JSON.parse(localStorage.getItem(KEYS.SYSTEM_USERS) || "[]");
    const user = list.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return rejectWithDelay("Invalid credentials. Try janetdgo2001@gmail.com and password.");
    }
    if (user.password !== password) {
      return rejectWithDelay("Incorrect password. Default password is 'password'.");
    }

    const token = `tf-jwt-token-for-${user.id}-${Date.now()}`;
    const authData = { id: user.id, fullName: user.fullName, email: user.email, role: user.role };
    localStorage.setItem(KEYS.USER, JSON.stringify(authData));
    localStorage.setItem("accessToken", token);

    return resolveWithDelay({ accessToken: token, user: authData });
  },

  register: async (fullName: string, email: string) => {
    initDb();
    const list = JSON.parse(localStorage.getItem(KEYS.SYSTEM_USERS) || "[]");
    if (list.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      return rejectWithDelay("An account is already registered with this email address.");
    }

    const newUser = {
      id: `u-${Date.now()}`,
      fullName,
      email,
      role: "MEMBER",
      password: "password"
    };

    list.push(newUser);
    localStorage.setItem(KEYS.SYSTEM_USERS, JSON.stringify(list));

    // Also automatically add this user to workspaces so they have things to view
    const membersMap = JSON.parse(localStorage.getItem(KEYS.MEMBERS) || "{}");
    if (membersMap["ws-1"]) {
      membersMap["ws-1"].push({
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: "MEMBER",
        status: "ACTIVE",
        joinedDate: new Date().toISOString().split("T")[0]
      });
      localStorage.setItem(KEYS.MEMBERS, JSON.stringify(membersMap));
    }

    return resolveWithDelay(newUser);
  },

  getCurrentUser: async (): Promise<UserInfo | null> => {
    initDb();
    const localUser = localStorage.getItem(KEYS.USER);
    if (!localUser) return resolveWithDelay(null);
    return resolveWithDelay(JSON.parse(localUser));
  },

  logout: async () => {
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem("accessToken");
    return resolveWithDelay(true);
  },

  // Workspaces
  getWorkspaces: async (): Promise<Workspace[]> => {
    initDb();
    const list = JSON.parse(localStorage.getItem(KEYS.WORKSPACES) || "[]");
    // Append member and project counts
    const projects = JSON.parse(localStorage.getItem(KEYS.PROJECTS) || "[]");
    const membersMap = JSON.parse(localStorage.getItem(KEYS.MEMBERS) || "{}");

    const hydrated = list.map((ws: Workspace) => ({
      ...ws,
      projectCount: projects.filter((p: any) => p.workspaceId === ws.id).length,
      memberCount: (membersMap[ws.id] || []).length
    }));
    return resolveWithDelay(hydrated);
  },

  createWorkspace: async (name: string, description: string): Promise<Workspace> => {
    initDb();
    const list = JSON.parse(localStorage.getItem(KEYS.WORKSPACES) || "[]");
    const currentUser = JSON.parse(localStorage.getItem(KEYS.USER) || "{}");
    const id = `ws-${Date.now()}`;
    const newWs: Workspace = {
      id,
      name,
      description,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      ownerId: currentUser.id || "u-1",
      plan: "FREE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.push(newWs);
    localStorage.setItem(KEYS.WORKSPACES, JSON.stringify(list));

    // Add owner to workspace members
    const membersMap = JSON.parse(localStorage.getItem(KEYS.MEMBERS) || "{}");
    membersMap[id] = [
      {
        id: currentUser.id || "u-1",
        fullName: currentUser.fullName || "Janet Gomez",
        email: currentUser.email || "janetdgo2001@gmail.com",
        role: "WORKSPACE_OWNER",
        status: "ACTIVE",
        joinedDate: new Date().toISOString().split("T")[0]
      }
    ];
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify(membersMap));

    // Log activity
    mockDb.addActivityLog(id, undefined, undefined, `${currentUser.fullName || "User"} created workspace "${name}"`);

    return resolveWithDelay(newWs);
  },

  updateWorkspace: async (id: string, name: string, description: string, plan?: "FREE" | "PRO" | "BUSINESS"): Promise<Workspace> => {
    const list = JSON.parse(localStorage.getItem(KEYS.WORKSPACES) || "[]");
    const wsIdx = list.findIndex((w: any) => w.id === id);
    if (wsIdx === -1) return rejectWithDelay("Workspace not found");

    list[wsIdx] = {
      ...list[wsIdx],
      name,
      description,
      plan: plan || list[wsIdx].plan,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(KEYS.WORKSPACES, JSON.stringify(list));
    return resolveWithDelay(list[wsIdx]);
  },

  deleteWorkspace: async (id: string): Promise<boolean> => {
    const list = JSON.parse(localStorage.getItem(KEYS.WORKSPACES) || "[]");
    const filtered = list.filter((w: any) => w.id !== id);
    localStorage.setItem(KEYS.WORKSPACES, JSON.stringify(filtered));
    return resolveWithDelay(true);
  },

  getWorkspaceMembers: async (workspaceId: string): Promise<WorkspaceMember[]> => {
    initDb();
    const membersMap = JSON.parse(localStorage.getItem(KEYS.MEMBERS) || "{}");
    return resolveWithDelay(membersMap[workspaceId] || []);
  },

  inviteMember: async (workspaceId: string, email: string, role: any): Promise<WorkspaceMember> => {
    initDb();
    const membersMap = JSON.parse(localStorage.getItem(KEYS.MEMBERS) || "{}");
    const systemUsers = JSON.parse(localStorage.getItem(KEYS.SYSTEM_USERS) || "[]");
    const matchedUser = systemUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    const membersList = membersMap[workspaceId] || [];
    if (membersList.some((m: any) => m.email.toLowerCase() === email.toLowerCase())) {
      return rejectWithDelay("User is already a member or has a pending invitation in this workspace.");
    }

    const newMember: WorkspaceMember = {
      id: matchedUser ? matchedUser.id : `u-${Date.now()}`,
      fullName: matchedUser ? matchedUser.fullName : email.split("@")[0],
      email,
      role,
      status: "PENDING",
      joinedDate: new Date().toISOString().split("T")[0]
    };

    membersList.push(newMember);
    membersMap[workspaceId] = membersList;
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify(membersMap));

    // Log activity
    const currentUser = JSON.parse(localStorage.getItem(KEYS.USER) || "{}");
    mockDb.addActivityLog(workspaceId, undefined, undefined, `${currentUser.fullName || "User"} invited ${newMember.fullName} (${email}) as ${role.replace("WORKSPACE_", "")}`);

    return resolveWithDelay(newMember);
  },

  updateMemberRole: async (workspaceId: string, memberId: string, role: any): Promise<WorkspaceMember> => {
    const membersMap = JSON.parse(localStorage.getItem(KEYS.MEMBERS) || "{}");
    const membersList = membersMap[workspaceId] || [];
    const idx = membersList.findIndex((m: any) => m.id === memberId);
    if (idx === -1) return rejectWithDelay("Member not found in workspace");

    membersList[idx].role = role;
    membersMap[workspaceId] = membersList;
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify(membersMap));
    return resolveWithDelay(membersList[idx]);
  },

  removeMember: async (workspaceId: string, memberId: string): Promise<boolean> => {
    const membersMap = JSON.parse(localStorage.getItem(KEYS.MEMBERS) || "{}");
    const membersList = membersMap[workspaceId] || [];
    const filtered = membersList.filter((m: any) => m.id !== memberId);
    membersMap[workspaceId] = filtered;
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify(membersMap));
    return resolveWithDelay(true);
  },

  // Projects
  getProjects: async (workspaceId: string): Promise<Project[]> => {
    initDb();
    const list = JSON.parse(localStorage.getItem(KEYS.PROJECTS) || "[]");
    return resolveWithDelay(list.filter((p: Project) => p.workspaceId === workspaceId));
  },

  createProject: async (workspaceId: string, name: string, description: string, status: ProjectStatus = "PLANNING"): Promise<Project> => {
    initDb();
    const list = JSON.parse(localStorage.getItem(KEYS.PROJECTS) || "[]");
    const currentUser = JSON.parse(localStorage.getItem(KEYS.USER) || "{}");
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      workspaceId,
      name,
      description,
      status,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startDate: new Date().toISOString().split("T")[0],
      ownerId: currentUser.id || "u-1",
      members: [currentUser.id || "u-1"]
    };
    list.push(newProj);
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(list));

    // Log Activity
    mockDb.addActivityLog(workspaceId, newProj.id, undefined, `${currentUser.fullName || "User"} created project "${name}" in state ${status}`);

    return resolveWithDelay(newProj);
  },

  updateProject: async (projectId: string, updates: Partial<Project>): Promise<Project> => {
    const list = JSON.parse(localStorage.getItem(KEYS.PROJECTS) || "[]");
    const idx = list.findIndex((p: any) => p.id === projectId);
    if (idx === -1) return rejectWithDelay("Project not found");

    const updated = {
      ...list[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    list[idx] = updated;
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(list));

    // Log status transitions explicitly
    if (updates.status && updates.status !== list[idx].status) {
      const currentUser = JSON.parse(localStorage.getItem(KEYS.USER) || "{}");
      mockDb.addActivityLog(list[idx].workspaceId, projectId, undefined, `${currentUser.fullName || "User"} updated project "${list[idx].name}" status to ${updates.status}`);
    }

    return resolveWithDelay(updated);
  },

  deleteProject: async (projectId: string): Promise<boolean> => {
    const list = JSON.parse(localStorage.getItem(KEYS.PROJECTS) || "[]");
    const filtered = list.filter((p: any) => p.id !== projectId);
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(filtered));
    return resolveWithDelay(true);
  },

  // Tasks
  getTasks: async (projectId: string): Promise<Task[]> => {
    initDb();
    const list = JSON.parse(localStorage.getItem(KEYS.TASKS) || "[]");
    return resolveWithDelay(list.filter((t: Task) => t.projectId === projectId));
  },

  createTask: async (projectId: string, taskData: Partial<Task>): Promise<Task> => {
    initDb();
    const list = JSON.parse(localStorage.getItem(KEYS.TASKS) || "[]");
    const currentUser = JSON.parse(localStorage.getItem(KEYS.USER) || "{}");
    const systemUsers = JSON.parse(localStorage.getItem(KEYS.SYSTEM_USERS) || "[]");

    let assigneeName = undefined;
    if (taskData.assigneeId) {
      const match = systemUsers.find((u: any) => u.id === taskData.assigneeId);
      if (match) assigneeName = match.fullName;
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      projectId,
      title: taskData.title || "Untitled Task",
      description: taskData.description || "",
      status: taskData.status || "TODO",
      priority: taskData.priority || "MEDIUM",
      type: taskData.type || "TASK",
      creatorId: currentUser.id || "u-1",
      assigneeId: taskData.assigneeId,
      assigneeName,
      dueDate: taskData.dueDate,
      estimatedHours: taskData.estimatedHours || 0,
      actualHours: taskData.actualHours || 0,
      position: list.length * 1000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      commentCount: 0,
      attachmentCount: 0
    };

    list.push(newTask);
    localStorage.setItem(KEYS.TASKS, JSON.stringify(list));

    // Find workspace for logging
    const projects = JSON.parse(localStorage.getItem(KEYS.PROJECTS) || "[]");
    const project = projects.find((p: any) => p.id === projectId);
    const workspaceId = project ? project.workspaceId : "";

    mockDb.addActivityLog(workspaceId, projectId, newTask.id, `${currentUser.fullName || "User"} added task "${newTask.title}"`);

    // Create assignments notifications
    if (newTask.assigneeId && newTask.assigneeId !== currentUser.id) {
      mockDb.createNotification(
        newTask.assigneeId,
        "Task Assigned",
        `${currentUser.fullName || "Someone"} assigned you the task: "${newTask.title}"`,
        "ASSIGNMENT"
      );
    }

    return resolveWithDelay(newTask);
  },

  updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    const list = JSON.parse(localStorage.getItem(KEYS.TASKS) || "[]");
    const idx = list.findIndex((t: any) => t.id === taskId);
    if (idx === -1) return rejectWithDelay("Task not found");

    const systemUsers = JSON.parse(localStorage.getItem(KEYS.SYSTEM_USERS) || "[]");
    let assigneeName = list[idx].assigneeName;
    if (updates.assigneeId !== undefined) {
      if (updates.assigneeId === "") {
        updates.assigneeId = undefined;
        assigneeName = undefined;
      } else {
        const match = systemUsers.find((u: any) => u.id === updates.assigneeId);
        if (match) assigneeName = match.fullName;
      }
    }

    const oldStatus = list[idx].status;
    const oldAssigneeId = list[idx].assigneeId;

    const updated = {
      ...list[idx],
      ...updates,
      assigneeName,
      updatedAt: new Date().toISOString()
    };
    list[idx] = updated;
    localStorage.setItem(KEYS.TASKS, JSON.stringify(list));

    // Retrieve workspace context
    const projects = JSON.parse(localStorage.getItem(KEYS.PROJECTS) || "[]");
    const project = projects.find((p: any) => p.id === updated.projectId);
    const workspaceId = project ? project.workspaceId : "";
    const currentUser = JSON.parse(localStorage.getItem(KEYS.USER) || "{}");

    // Log Activity based on dynamic state changes
    if (updates.status && updates.status !== oldStatus) {
      mockDb.addActivityLog(workspaceId, updated.projectId, taskId, `${currentUser.fullName || "User"} moved task "${updated.title}" from ${oldStatus} to ${updates.status}`);
      
      // Notify creator / watchers
      if (updated.creatorId !== currentUser.id) {
        mockDb.createNotification(updated.creatorId, "Task Status Updated", `Task "${updated.title}" was moved to ${updates.status} by ${currentUser.fullName}`, "PROJECT");
      }
    }

    if (updates.assigneeId !== undefined && updates.assigneeId !== oldAssigneeId) {
      if (updates.assigneeId) {
        mockDb.addActivityLog(workspaceId, updated.projectId, taskId, `${currentUser.fullName || "User"} assigned task "${updated.title}" to ${assigneeName}`);
        if (updates.assigneeId !== currentUser.id) {
          mockDb.createNotification(updates.assigneeId, "Task Assigned", `${currentUser.fullName} assigned you to "${updated.title}"`, "ASSIGNMENT");
        }
      } else {
        mockDb.addActivityLog(workspaceId, updated.projectId, taskId, `${currentUser.fullName || "User"} unassigned task "${updated.title}"`);
      }
    }

    return resolveWithDelay(updated);
  },

  deleteTask: async (taskId: string): Promise<boolean> => {
    const list = JSON.parse(localStorage.getItem(KEYS.TASKS) || "[]");
    const filtered = list.filter((t: any) => t.id !== taskId);
    localStorage.setItem(KEYS.TASKS, JSON.stringify(filtered));
    return resolveWithDelay(true);
  },

  // Comments
  getComments: async (taskId: string): Promise<TaskComment[]> => {
    initDb();
    const list = JSON.parse(localStorage.getItem(KEYS.COMMENTS) || "[]");
    return resolveWithDelay(list.filter((c: TaskComment) => c.taskId === taskId));
  },

  addComment: async (taskId: string, content: string): Promise<TaskComment> => {
    initDb();
    const list = JSON.parse(localStorage.getItem(KEYS.COMMENTS) || "[]");
    const currentUser = JSON.parse(localStorage.getItem(KEYS.USER) || "{}");
    const newComment: TaskComment = {
      id: `c-${Date.now()}`,
      taskId,
      authorId: currentUser.id || "u-1",
      authorName: currentUser.fullName || "Janet Gomez",
      content,
      createdAt: new Date().toISOString()
    };
    list.push(newComment);
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(list));

    // Increase comment count in task
    const tasks = JSON.parse(localStorage.getItem(KEYS.TASKS) || "[]");
    const tIdx = tasks.findIndex((t: any) => t.id === taskId);
    if (tIdx !== -1) {
      tasks[tIdx].commentCount = (tasks[tIdx].commentCount || 0) + 1;
      localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));

      // Activity log
      const projects = JSON.parse(localStorage.getItem(KEYS.PROJECTS) || "[]");
      const project = projects.find((p: any) => p.id === tasks[tIdx].projectId);
      const wsId = project ? project.workspaceId : "";
      mockDb.addActivityLog(wsId, tasks[tIdx].projectId, taskId, `${newComment.authorName} commented on task "${tasks[tIdx].title}"`);

      // Handle mentions
      const mentions = content.match(/@([a-zA-Z0-9\s]+)/g);
      if (mentions) {
        const systemUsers = JSON.parse(localStorage.getItem(KEYS.SYSTEM_USERS) || "[]");
        mentions.forEach((mention) => {
          const name = mention.substring(1).trim();
          const target = systemUsers.find((u: any) => u.fullName.toLowerCase().includes(name.toLowerCase()));
          if (target && target.id !== currentUser.id) {
            mockDb.createNotification(target.id, "Comment Mention", `${newComment.authorName} mentioned you in a comment: "${content.slice(0, 50)}..."`, "MENTION");
          }
        });
      }

      // Notify task assignee
      if (tasks[tIdx].assigneeId && tasks[tIdx].assigneeId !== currentUser.id) {
        mockDb.createNotification(tasks[tIdx].assigneeId, "New Comment", `${newComment.authorName} commented on your assigned task: "${tasks[tIdx].title}"`, "COMMENT");
      }
    }

    return resolveWithDelay(newComment);
  },

  deleteComment: async (commentId: string): Promise<boolean> => {
    const list = JSON.parse(localStorage.getItem(KEYS.COMMENTS) || "[]");
    const comment = list.find((c: any) => c.id === commentId);
    if (!comment) return resolveWithDelay(false);

    const filtered = list.filter((c: any) => c.id !== commentId);
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(filtered));

    // Decrease count
    const tasks = JSON.parse(localStorage.getItem(KEYS.TASKS) || "[]");
    const tIdx = tasks.findIndex((t: any) => t.id === comment.taskId);
    if (tIdx !== -1) {
      tasks[tIdx].commentCount = Math.max(0, (tasks[tIdx].commentCount || 1) - 1);
      localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    }

    return resolveWithDelay(true);
  },

  // Attachments
  getAttachments: async (taskId: string): Promise<TaskAttachment[]> => {
    initDb();
    const list = JSON.parse(localStorage.getItem(KEYS.ATTACHMENTS) || "[]");
    return resolveWithDelay(list.filter((att: TaskAttachment) => att.taskId === taskId));
  },

  uploadAttachment: async (taskId: string, name: string, type: string, size: number, mockUrl?: string): Promise<TaskAttachment> => {
    initDb();
    const list = JSON.parse(localStorage.getItem(KEYS.ATTACHMENTS) || "[]");
    const currentUser = JSON.parse(localStorage.getItem(KEYS.USER) || "{}");
    const newAtt: TaskAttachment = {
      id: `att-${Date.now()}`,
      taskId,
      name,
      size,
      type,
      url: mockUrl || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
      uploadedBy: currentUser.id || "u-1",
      uploadedByName: currentUser.fullName || "Janet Gomez",
      uploadedAt: new Date().toISOString()
    };
    list.push(newAtt);
    localStorage.setItem(KEYS.ATTACHMENTS, JSON.stringify(list));

    // Maximize count
    const tasks = JSON.parse(localStorage.getItem(KEYS.TASKS) || "[]");
    const tIdx = tasks.findIndex((t: any) => t.id === taskId);
    if (tIdx !== -1) {
      tasks[tIdx].attachmentCount = (tasks[tIdx].attachmentCount || 0) + 1;
      localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));

      const projects = JSON.parse(localStorage.getItem(KEYS.PROJECTS) || "[]");
      const project = projects.find((p: any) => p.id === tasks[tIdx].projectId);
      const wsId = project ? project.workspaceId : "";
      mockDb.addActivityLog(wsId, tasks[tIdx].projectId, taskId, `${newAtt.uploadedByName} uploaded attachment ${name} to task "${tasks[tIdx].title}"`);
    }

    return resolveWithDelay(newAtt);
  },

  deleteAttachment: async (attId: string): Promise<boolean> => {
    const list = JSON.parse(localStorage.getItem(KEYS.ATTACHMENTS) || "[]");
    const att = list.find((a: any) => a.id === attId);
    if (!att) return resolveWithDelay(false);

    const filtered = list.filter((a: any) => a.id !== attId);
    localStorage.setItem(KEYS.ATTACHMENTS, JSON.stringify(filtered));

    // Decrease count
    const tasks = JSON.parse(localStorage.getItem(KEYS.TASKS) || "[]");
    const tIdx = tasks.findIndex((t: any) => t.id === att.taskId);
    if (tIdx !== -1) {
      tasks[tIdx].attachmentCount = Math.max(0, (tasks[tIdx].attachmentCount || 1) - 1);
      localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    }

    return resolveWithDelay(true);
  },

  // Activities
  getActivities: async (workspaceId: string): Promise<ActivityLog[]> => {
    initDb();
    const list = JSON.parse(localStorage.getItem(KEYS.ACTIVITIES) || "[]");
    return resolveWithDelay(
      list
        .filter((act: ActivityLog) => act.workspaceId === workspaceId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    );
  },

  addActivityLog: (workspaceId: string, projectId: string | undefined, taskId: string | undefined, action: string) => {
    initDb();
    const list = JSON.parse(localStorage.getItem(KEYS.ACTIVITIES) || "[]");
    const currentUser = JSON.parse(localStorage.getItem(KEYS.USER) || "{}");
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      workspaceId,
      projectId,
      taskId,
      userId: currentUser.id || "u-1",
      userName: currentUser.fullName || "Janet Gomez",
      action,
      timestamp: new Date().toISOString()
    };
    list.unshift(newLog);
    localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(list));
  },

  // Notifications
  getNotifications: async (): Promise<any[]> => {
    initDb();
    const list = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || "[]");
    const currentUser = JSON.parse(localStorage.getItem(KEYS.USER) || "{}");
    return resolveWithDelay(list.filter((n: any) => n.userId === currentUser.id));
  },

  createNotification: (userId: string, title: string, message: string, type: string) => {
    initDb();
    const list = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || "[]");
    list.unshift({
      id: `not-${Date.now()}`,
      userId,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString(),
      type
    });
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  markNotificationRead: async (notId: string): Promise<boolean> => {
    const list = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || "[]");
    const idx = list.findIndex((n: any) => n.id === notId);
    if (idx !== -1) {
      list[idx].read = true;
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
      return resolveWithDelay(true);
    }
    return resolveWithDelay(false);
  },

  markAllNotificationsRead: async (): Promise<boolean> => {
    const list = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || "[]");
    const currentUser = JSON.parse(localStorage.getItem(KEYS.USER) || "{}");
    const updated = list.map((n: any) => {
      if (n.userId === currentUser.id) {
        return { ...n, read: true };
      }
      return n;
    });
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return resolveWithDelay(true);
  },

  // Stats Analytics
  getWorkspaceStats: async (workspaceId: string): Promise<WorkspaceStats> => {
    initDb();
    const projectsList: Project[] = JSON.parse(localStorage.getItem(KEYS.PROJECTS) || "[]").filter((p: any) => p.workspaceId === workspaceId);
    const projIds = projectsList.map((p) => p.id);
    const tasksList: Task[] = JSON.parse(localStorage.getItem(KEYS.TASKS) || "[]").filter((t: any) => projIds.includes(t.projectId));
    const membersList = JSON.parse(localStorage.getItem(KEYS.MEMBERS) || "{}")[workspaceId] || [];

    const totalProjects = projectsList.length;
    const activeProjects = projectsList.filter((p) => p.status === "ACTIVE").length;
    const completedProjects = projectsList.filter((p) => p.status === "COMPLETED").length;
    const totalMembers = membersList.length;
    const totalTasks = tasksList.length;

    const todayStr = new Date().toISOString().split("T")[0];
    const overdueTasks = tasksList.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED" && t.dueDate && t.dueDate < todayStr).length;

    const doneTasks = tasksList.filter((t) => t.status === "DONE").length;
    const completionPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    return resolveWithDelay({
      totalProjects,
      activeProjects,
      completedProjects,
      totalMembers,
      totalTasks,
      overdueTasks,
      completionPercentage
    });
  },

  // Platform Administration
  getAdminStats: async (): Promise<any> => {
    initDb();
    const systemUsers = JSON.parse(localStorage.getItem(KEYS.SYSTEM_USERS) || "[]");
    const workspaces = JSON.parse(localStorage.getItem(KEYS.WORKSPACES) || "[]");
    const projects = JSON.parse(localStorage.getItem(KEYS.PROJECTS) || "[]");
    const tasks = JSON.parse(localStorage.getItem(KEYS.TASKS) || "[]");

    return resolveWithDelay({
      totalUsers: systemUsers.length,
      totalWorkspaces: workspaces.length,
      totalProjects: projects.length,
      totalTasks: tasks.length,
      users: systemUsers.map((u: any) => ({ id: u.id, fullName: u.fullName, email: u.email, role: u.role })),
      workspaces: workspaces.map((w: any) => ({ id: w.id, name: w.name, plan: w.plan, projectsCount: projects.filter((p: any) => p.workspaceId === w.id).length }))
    });
  }
};
