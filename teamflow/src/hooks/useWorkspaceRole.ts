import { useQuery } from "@tanstack/react-query";
import { workspaceApi } from "../api/workspaceApi";
import { WorkspaceRole } from "../types/user.types";
import { usePermission } from "./usePermission";

export function useWorkspaceRole(workspaceId: string | undefined) {
  const { data: role, isLoading, error } = useQuery({
    queryKey: ["workspaceRole", workspaceId],
    queryFn: () => workspaceApi.getMyRole(workspaceId!),
    enabled: !!workspaceId
  });

  const permissions = usePermission(role);

  return {
    role,
    isLoading,
    error,
    ...permissions
  };
}
