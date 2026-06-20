import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "../../../api/workspaceApi";
import { subscriptionApi } from "../../../api/subscriptionApi";
import { reportApi } from "../../../api/reportApi";
import { Workspace } from "../../../types/workspace.types";
import {
  Settings,
  Archive,
  Trash2,
  Download,
  BarChart3,
  AlertTriangle,
  Save,
  RefreshCw,
  Users,
  FolderKanban,
  HardDrive
} from "lucide-react";
import toast from "react-hot-toast";

export const WorkspaceSettingsPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const id = workspaceId || localStorage.getItem("activeWorkspaceId") || "";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: workspace } = useQuery({
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
      toast.success("Workspace updated");
    },
    onError: (e: any) => toast.error(e.message)
  });

  const archiveMutation = useMutation({
    mutationFn: () => workspaceApi.archiveWorkspace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace archived");
      navigate("/dashboard");
    },
    onError: (e: any) => toast.error(e.message)
  });

  const deleteMutation = useMutation({
    mutationFn: () => workspaceApi.deleteWorkspace(id),
    onSuccess: () => {
      localStorage.removeItem("activeWorkspaceId");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace deleted");
      navigate("/dashboard");
    },
    onError: (e: any) => toast.error(e.message)
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <Settings className="h-5 w-5 text-slate-500" />
          <span>Workspace Settings</span>
        </h1>
        <p className="text-xs text-slate-500">Manage workspace configuration, archival, and reporting.</p>
      </div>

      {/* General Settings */}
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

      {/* Usage Stats */}
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

      {/* Export */}
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

      {/* Danger Zone */}
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
            onClick={() => {
              if (confirm("Archive this workspace? It will be hidden from the active list."))
                archiveMutation.mutate();
            }}
            disabled={archiveMutation.isPending}
            className="flex items-center space-x-1 bg-amber-100 text-amber-800 text-[10px] font-bold py-1.5 px-3 rounded-lg hover:bg-amber-200 transition disabled:opacity-50"
          >
            <Archive className="h-3.5 w-3.5" />
            <span>Archive</span>
          </button>
        </div>
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div>
            <p className="text-xs font-bold text-slate-800">Delete Workspace</p>
            <p className="text-[10px] text-slate-500">Permanently remove workspace and all associated data.</p>
          </div>
          <button
            onClick={() => {
              if (confirm("Are you sure? This action cannot be undone. Delete this workspace forever?"))
                deleteMutation.mutate();
            }}
            disabled={deleteMutation.isPending}
            className="flex items-center space-x-1 bg-red-100 text-red-700 text-[10px] font-bold py-1.5 px-3 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default WorkspaceSettingsPage;
