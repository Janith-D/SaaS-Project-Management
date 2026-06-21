import { WorkspaceRole } from "../types/user.types";

export function usePermission(role?: WorkspaceRole) {
  const isOwner = role === "WORKSPACE_OWNER";
  const isAdmin = role === "WORKSPACE_ADMIN" || isOwner;
  const isManager = role === "PROJECT_MANAGER" || isAdmin;
  const isMember = role === "MEMBER" || isManager;
  const isViewer = role === "VIEWER";

  return {
    isOwner,
    isAdmin,
    isManager,
    isMember,
    isViewer,
    canManageWorkspace: isAdmin,
    canInviteMembers: isAdmin,
    canCreateProjects: isManager,
    canEditProjects: isManager,
    canCreateTasks: isMember,
    canMoveTasks: isMember,
    canComment: isMember,
    roleRank: isOwner ? 4 : role === "WORKSPACE_ADMIN" ? 3 : role === "PROJECT_MANAGER" ? 2 : role === "MEMBER" ? 1 : 0
  };
}
