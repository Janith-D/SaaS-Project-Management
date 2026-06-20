import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { workspaceApi } from "../api/workspaceApi";
import { Workspace } from "../types/workspace.types";

interface WorkspaceContextValue {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  workspacesLoaded: boolean;
  setActiveWorkspace: (ws: Workspace) => void;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspaceState] = useState<Workspace | null>(null);
  const [workspacesLoaded, setWorkspacesLoaded] = useState(false);

  const loadWorkspaces = useCallback(async () => {
    if (!user) {
      setWorkspaces([]);
      setActiveWorkspaceState(null);
      localStorage.removeItem("activeWorkspaceId");
      setWorkspacesLoaded(true);
      return;
    }
    try {
      const list = await workspaceApi.getWorkspaces();
      setWorkspaces(list);

      const savedWsId = localStorage.getItem("activeWorkspaceId");
      const found = list.find((w) => w.id === savedWsId);
      if (found) {
        setActiveWorkspaceState(found);
      } else if (list.length > 0) {
        setActiveWorkspaceState(list[0]);
        localStorage.setItem("activeWorkspaceId", list[0].id);
      } else {
        localStorage.removeItem("activeWorkspaceId");
        setActiveWorkspaceState(null);
      }
    } catch (e) {
      console.error("Workspace load failure", e);
    } finally {
      setWorkspacesLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      loadWorkspaces();
    }
  }, [authLoading, loadWorkspaces]);

  const setActiveWorkspace = useCallback((ws: Workspace) => {
    setActiveWorkspaceState(ws);
    localStorage.setItem("activeWorkspaceId", ws.id);
  }, []);

  return (
    <WorkspaceContext.Provider value={{
      workspaces,
      activeWorkspace,
      workspacesLoaded,
      setActiveWorkspace,
      refreshWorkspaces: loadWorkspaces,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
