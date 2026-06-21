import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi } from "../../../api/projectApi";
import { ProjectStatus } from "../../../types/project.types";
import { useWorkspaceRole } from "../../../hooks/useWorkspaceRole";
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit,
  ArrowUpRight,
  Lock,
  X,
  AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "../../../utils/formatDate";

export const ProjectsListPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const activeWsId = workspaceId || localStorage.getItem("activeWorkspaceId") || "";
  const queryClient = useQueryClient();

  const { canCreateProjects, canEditProjects } = useWorkspaceRole(activeWsId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("PLANNING");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", activeWsId],
    queryFn: () => projectApi.getProjects(activeWsId),
    enabled: !!activeWsId
  });

  const createProjMutation = useMutation({
    mutationFn: (data: { name: string; description: string; status: ProjectStatus }) =>
      projectApi.createProject(activeWsId, data),
    onSuccess: (newProj) => {
      queryClient.invalidateQueries({ queryKey: ["projects", activeWsId] });
      toast.success(`"${newProj.name}" created successfully`);
      closeModal();
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message)
  });

  const updateProjMutation = useMutation({
    mutationFn: (data: { id: string; updates: any }) =>
      projectApi.updateProject(data.id, data.updates),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["projects", activeWsId] });
      toast.success(`"${updated.name}" updated`);
      closeModal();
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message)
  });

  const deleteProjMutation = useMutation({
    mutationFn: (id: string) => projectApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", activeWsId] });
      toast.success("Project deleted");
      setDeleteTarget(null);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message)
  });

  const openCreateModal = () => {
    setEditingProject(null);
    setName("");
    setDescription("");
    setStatus("PLANNING");
    setIsModalOpen(true);
  };

  const openEditModal = (proj: any) => {
    setEditingProject(proj);
    setName(proj.name);
    setDescription(proj.description);
    setStatus(proj.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProject) {
      updateProjMutation.mutate({
        id: editingProject.id,
        updates: { name, description, status }
      });
    } else {
      createProjMutation.mutate({ name, description, status });
    }
  };

  const statusColors: Record<ProjectStatus, string> = {
    PLANNING: "bg-slate-100 text-slate-700 border-slate-200",
    ACTIVE: "bg-blue-50 text-blue-700 border-blue-200",
    ON_HOLD: "bg-amber-50 text-amber-700 border-amber-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
    ARCHIVED: "bg-purple-50 text-purple-700 border-purple-200"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">Projects</h1>
          <p className="text-xs text-slate-500">
            {projects?.length ?? 0} project{(projects?.length ?? 0) !== 1 ? "s" : ""} in this workspace
          </p>
        </div>
        {canCreateProjects ? (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition shadow-xs shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        ) : (
          <span className="inline-flex items-center space-x-1.5 text-slate-400 text-xs font-semibold px-4 py-2.5 border border-dashed border-slate-200 rounded-lg">
            <Lock className="h-3.5 w-3.5" />
            <span>Managers can create projects</span>
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : projects?.length === 0 ? (
        <div className="text-center p-12 bg-white border border-slate-200 rounded-xl space-y-3">
          <FolderKanban className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No projects yet</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create your first project to start organizing tasks and tracking progress.
          </p>
          {canCreateProjects && (
            <button
              onClick={openCreateModal}
              className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold py-1.5 px-3 rounded-lg transition"
            >
              Create project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects?.map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-slate-200 rounded-xl shadow-xs hover:shadow-md hover:border-blue-200 transition duration-150 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full uppercase ${statusColors[proj.status]}`}>
                      {proj.status === "ON_HOLD" ? "On Hold" : proj.status}
                    </span>
                    <Link
                      to={`/projects/${proj.id}`}
                      className="block text-sm font-bold text-slate-800 hover:text-blue-600 transition truncate max-w-44"
                    >
                      {proj.name}
                    </Link>
                  </div>
                  {canEditProjects && (
                    <div className="flex space-x-1 shrink-0">
                      <button
                        onClick={() => openEditModal(proj)}
                        className="p-1 px-1.5 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded transition"
                        title="Edit project"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(proj)}
                        className="p-1 px-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition"
                        title="Delete project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 h-8">
                  {proj.description || "No description"}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold uppercase tracking-wide">Created</span>
                  <span className="text-slate-600 font-medium">{formatDate(proj.createdAt)}</span>
                </div>
              </div>

              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
                <Link
                  to={`/projects/${proj.id}`}
                  className="w-full flex items-center justify-center space-x-1 bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold py-2 border border-slate-200 hover:border-blue-300 rounded-lg transition"
                >
                  <span>Open Board</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-800">
                {editingProject ? "Edit Project" : "Create Project"}
              </h3>
              <button onClick={closeModal} className="p-1 hover:bg-slate-100 rounded-lg transition">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mobile App Redesign"
                  className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Description</label>
                <textarea
                  placeholder="Brief description of project goals..."
                  rows={3}
                  className="w-full text-xs font-medium p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Status</label>
                <select
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                >
                  <option value="PLANNING">Planning</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProjMutation.isPending || updateProjMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold text-white transition disabled:opacity-50"
                >
                  {createProjMutation.isPending || updateProjMutation.isPending
                    ? "Saving..."
                    : editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 border border-red-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="text-base font-black text-slate-800">Delete Project</h3>
              </div>
              <button onClick={() => setDeleteTarget(null)} className="p-1 hover:bg-slate-100 rounded-lg transition">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              Delete <span className="font-bold">{deleteTarget.name}</span>?
            </p>
            <p className="text-xs text-slate-500 mb-6">
              All tasks, comments, and attachments within this project will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProjMutation.mutate(deleteTarget.id)}
                disabled={deleteProjMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold text-white transition disabled:opacity-50"
              >
                {deleteProjMutation.isPending ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectsListPage;