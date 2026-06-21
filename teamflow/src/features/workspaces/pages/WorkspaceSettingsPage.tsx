import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "../../../api/workspaceApi";
import { subscriptionApi } from "../../../api/subscriptionApi";
import { reportApi } from "../../../api/reportApi";
import { Workspace } from "../../../types/workspace.types";
import { useAuth } from "../../../context/AuthContext";
import { useWorkspaceRole } from "../../../hooks/useWorkspaceRole";
import {
  Settings,
  Archive,
  Trash2,
  Download,
  BarChart3,
  AlertTriangle,
  Save,
  Users,
  FolderKanban,
  HardDrive,
  ShieldCheck,
  ShieldAlert,
  Lock,
  X
} from "lucide-react";
import toast from "react-hot-toast";

export const WorkspaceSettingsPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const id = workspaceId || localStorage.getItem("activeWorkspaceId") || "";

  const { role, isLoading: roleLoading, canManageWorkspace, isOwner } = useWorkspaceRole(id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const { data: workspace, isLoading: wsLoading } = useQuery({
    queryKey: ["workspace", id],
    queryFn: () => workspaceApi.getWorkspace(id),
    enabled: !!id
  });

  const { data: usage } = useQuery({
    queryKey: ["workspaceUsage", id],
    queryFn: () => subscriptionApi.getUsage(id),
    enabled: !!id
  });

  useEffect(() => {
    if (workspace) {
      setName(workspace.name);
      setDescription(workspace.description);
    }
  }, [workspace]);

  const updateMutation = useMutation({
    mutationFn: () => workspaceApi.updateWorkspace(id, { name, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", id] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace updated successfully");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message)
  });

  const archiveMutation = useMutation({
    mutationFn: () => workspaceApi.archiveWorkspace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace archived successfully");
      navigate("/dashboard");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message)
  });

  const deleteMutation = useMutation({
    mutationFn: () => workspaceApi.deleteWorkspace(id),
    onSuccess: () => {
      localStorage.removeItem("activeWorkspaceId");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace deleted permanently");
      navigate("/dashboard");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message)
  });

  const handleDownloadPdf = async () => {
    try {
      const blob = await reportApi.downloadWorkspacePdf(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `workspace-${id}-report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Report downloaded");
    } catch (e) {
      toast.error("Failed to download report");
    }
  };

  if (roleLoading || wsLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <div className="h-7 bg-slate-100 animate-pulse w-48 rounded" />
          <div className="h-4 bg-slate-50 animate-pulse w-72 mt-2 rounded" />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="h-5 bg-slate-100 animate-pulse w-24 rounded" />
          <div className="h-10 bg-slate-50 animate-pulse rounded-lg" />
          <div className="h-20 bg-slate-50 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!canManageWorkspace) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-10 space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
            <Lock className="h-6 w-6 text-slate-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Restricted Access</h2>
          <p className="text-sm text-slate-500">
            You need <span className="font-bold text-slate-700">Workspace Admin</span> or higher permissions to access settings.
          </p>
          <p className="text-xs text-slate-400">
            Your current role: <span className="font-semibold uppercase">{role?.replace("WORKSPACE_", "")}</span>
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Settings className="h-5 w-5 text-slate-500" />
            <span>Workspace Settings</span>
          </h1>
          <p className="text-xs text-slate-500">Manage workspace configuration, archival, and reporting.</p>
        </div>
        {role && (
          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
            isOwner
              ? "bg-blue-50 border-blue-200 text-blue-700"
              : "bg-slate-100 border-slate-200 text-slate-700"
          }`}>
            {isOwner ? <ShieldAlert className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
            <span>{isOwner ? "Owner" : "Admin"}</span>
          </span>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-800">General</h2>
        <div>
          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Name</label>
          <input
            type="text"
            className="w-full text-sm font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Description</label>
          <textarea
            rows={3}
            className="w-full text-sm font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          onClick={() => updateMutation.mutate()}
          disabled={updateMutation.isPending}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{updateMutation.isPending ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
          <BarChart3 className="h-4 w-4 text-indigo-500" />
          <span>Usage</span>
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-50 p-3 rounded-lg">
            <Users className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-slate-800">{usage?.memberCount ?? workspace?.memberCount ?? 0}</p>
            <p className="text-[10px] text-slate-500">Members</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <FolderKanban className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-slate-800">{usage?.projectCount ?? workspace?.projectCount ?? 0}</p>
            <p className="text-[10px] text-slate-500">Projects</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <HardDrive className="h-5 w-5 text-amber-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-slate-800">{usage ? `${(usage.storageUsed / (1024 * 1024)).toFixed(1)}MB` : "0MB"}</p>
            <p className="text-[10px] text-slate-500">Storage</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
        <h2 className="text-sm font-bold text-slate-800">Export</h2>
        <p className="text-xs text-slate-500">Download a PDF report of all workspace activity and metrics.</p>
        <button
          onClick={handleDownloadPdf}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 px-4 rounded-lg transition"
        >
          <Download className="h-4 w-4" />
          <span>Download Workspace PDF Report</span>
        </button>
      </div>

      <div className="bg-white border border-red-200 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-red-700 flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Danger Zone</span>
        </h2>
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div>
            <p className="text-xs font-bold text-slate-800">Archive Workspace</p>
            <p className="text-[10px] text-slate-500">Hide this workspace from active views. Data is preserved.</p>
          </div>
          <button
            onClick={() => setArchiveModalOpen(true)}
            disabled={archiveMutation.isPending}
            className="flex items-center space-x-1 bg-amber-100 text-amber-800 text-[10px] font-bold py-1.5 px-3 rounded-lg hover:bg-amber-200 transition disabled:opacity-50"
          >
            <Archive className="h-3.5 w-3.5" />
            <span>Archive</span>
          </button>
        </div>
        {isOwner && (
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div>
              <p className="text-xs font-bold text-slate-800">Delete Workspace</p>
              <p className="text-[10px] text-slate-500">Permanently remove workspace and all associated data. This action cannot be undone.</p>
            </div>
            <button
              onClick={() => setDeleteModalOpen(true)}
              disabled={deleteMutation.isPending}
              className="flex items-center space-x-1 bg-red-100 text-red-700 text-[10px] font-bold py-1.5 px-3 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
        {!isOwner && (
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg opacity-60">
            <div>
              <p className="text-xs font-bold text-slate-500">Delete Workspace</p>
              <p className="text-[10px] text-slate-400">Only the workspace owner can delete. Contact your owner to request deletion.</p>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold italic">Owner only</span>
          </div>
        )}
      </div>

      {archiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Archive className="h-5 w-5 text-amber-600" />
                <h3 className="text-base font-black text-slate-800">Archive Workspace</h3>
              </div>
              <button onClick={() => setArchiveModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg transition">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              Are you sure you want to archive <span className="font-bold">{workspace?.name}</span>?
            </p>
            <p className="text-xs text-slate-500 mb-6">
              The workspace will be hidden from active views. All projects, tasks, and member data will be preserved and can be restored later.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setArchiveModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => { archiveMutation.mutate(); setArchiveModalOpen(false); }}
                disabled={archiveMutation.isPending}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-xs font-bold text-white transition disabled:opacity-50"
              >
                {archiveMutation.isPending ? "Archiving..." : "Confirm Archive"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 border border-red-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                <h3 className="text-base font-black text-slate-800">Delete Workspace</h3>
              </div>
              <button onClick={() => { setDeleteModalOpen(false); setDeleteConfirm(""); }} className="p-1 hover:bg-slate-100 rounded-lg transition">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-xs font-bold text-red-700">This action cannot be undone</p>
              <p className="text-[11px] text-red-600 mt-1">
                All projects, tasks, comments, attachments, and member data will be permanently deleted.
              </p>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Type <span className="font-bold text-red-600">{workspace?.name}</span> to confirm:
            </p>
            <input
              type="text"
              className="w-full text-sm p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 mb-4"
              placeholder={`Type "${workspace?.name}" to confirm`}
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => { setDeleteModalOpen(false); setDeleteConfirm(""); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => { deleteMutation.mutate(); setDeleteModalOpen(false); }}
                disabled={deleteConfirm !== workspace?.name || deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold text-white transition disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default WorkspaceSettingsPage;