import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi } from "../../../api/projectApi";
import { ProjectStatus } from "../../../types/project.types";
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit,
  ArrowUpRight,
  TrendingUp,
  Sliders,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "../../../utils/formatDate";

export const ProjectsListPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const activeWsId = workspaceId || localStorage.getItem("activeWorkspaceId") || "";
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("PLANNING");
  const [progress, setProgress] = useState(0);

  // Query Workspace Projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", activeWsId],
    queryFn: () => projectApi.getProjects(activeWsId),
    enabled: !!activeWsId
  });

  // Create Project mutation
  const createProjMutation = useMutation({
    mutationFn: (data: { name: string; description: string; status: ProjectStatus }) =>
      projectApi.createProject(activeWsId, data),
    onSuccess: (newProj) => {
      queryClient.invalidateQueries({ queryKey: ["projects", activeWsId] });
      toast.success(`Project "${newProj.name}" created!`);
      closeModal();
    },
    onError: (e: any) => toast.error(e.message)
  });

  // Update Project mutation
  const updateProjMutation = useMutation({
    mutationFn: (data: { id: string; updates: any }) =>
      projectApi.updateProject(data.id, data.updates),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["projects", activeWsId] });
      toast.success(`Project "${updated.name}" updated successfully.`);
      closeModal();
    },
    onError: (e: any) => toast.error(e.message)
  });

  // Delete Project mutation
  const deleteProjMutation = useMutation({
    mutationFn: (id: string) => projectApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", activeWsId] });
      toast.success("Project archive finalized.");
    },
    onError: (e: any) => toast.error(e.message)
  });

  const openCreateModal = () => {
    setEditingProject(null);
    setName("");
    setDescription("");
    setStatus("PLANNING");
    setProgress(0);
    setIsModalOpen(true);
  };

  const openEditModal = (proj: any) => {
    setEditingProject(proj);
    setName(proj.name);
    setDescription(proj.description);
    setStatus(proj.status);
    setProgress(proj.progress);
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
        updates: { name, description, status, progress }
      });
    } else {
      createProjMutation.mutate({ name, description, status });
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm("Archiving project will freeze comments and Kanban cards. Proceed?")) {
      deleteProjMutation.mutate(id);
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">Active Projects</h1>
          <p className="text-xs text-slate-500">
            Structure your company objectives into specific workspaces, project modules and sprints.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg cursor-pointer transition shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Project Node</span>
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-20 bg-slate-100 animate-pulse rounded-lg" />
          <div className="h-20 bg-slate-100 animate-pulse rounded-lg" />
        </div>
      ) : projects?.length === 0 ? (
        <div className="text-center p-10 bg-white border border-slate-200 rounded-xl space-y-3">
          <FolderKanban className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No Projects Established</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Introduce task lists and timeline metrics by creating your first workspace project.
          </p>
          <button
            onClick={openCreateModal}
            className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold py-1.5 px-3 rounded-lg transition"
          >
            Create first project node
          </button>
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
                      {proj.status}
                    </span>
                    <Link
                      to={`/projects/${proj.id}`}
                      className="block text-sm font-bold text-slate-800 hover:text-blue-600 transition truncate max-w-56"
                    >
                      {proj.name}
                    </Link>
                  </div>
                  <div className="flex space-x-1 shrink-0">
                    <button
                      onClick={() => openEditModal(proj)}
                      className="p-1 px-1.5 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded transition"
                      title="Edit project configs"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(proj.id, e)}
                      className="p-1 px-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition"
                      title="Archive scope"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 h-8">
                  {proj.description || "No project description provided."}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span>ACTIVATED TIME</span>
                  <span className="text-slate-600">{formatDate(proj.createdAt)}</span>
                </div>
              </div>

              {/* Progress and card link footer */}
              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 space-y-3">
                <div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 mb-1">
                    <span>SPRINT RESOLUTION RATIO</span>
                    <span className="text-slate-800">{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                <Link
                  to={`/projects/${proj.id}`}
                  className="w-full flex items-center justify-center space-x-1 bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold py-2 border border-slate-200 hover:border-blue-300 rounded-lg transition"
                >
                  <span>Open Kanban Board</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / UPDATE MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-black text-slate-800 mb-1">
              {editingProject ? "Reconfigure Project Node" : "Instantiate Project Node"}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {editingProject ? "Update descriptions and status locks." : "Create a clean template project node."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Android Customer Companion"
                  className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Tagline or Description</label>
                <textarea
                  placeholder="Provide brief objective scope variables..."
                  rows={3}
                  className="w-full text-xs font-medium p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Project Status</label>
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

                {editingProject && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Progress Ratio ({progress}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="w-full h-8 accent-blue-600 bg-slate-100 rounded-lg cursor-pointer"
                      value={progress}
                      onChange={(e) => setProgress(parseInt(e.target.value))}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={createProjMutation.isPending || updateProjMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold text-white transition disabled:opacity-50"
                >
                  {createProjMutation.isPending || updateProjMutation.isPending ? "Syncing..." : "Sync configurations"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectsListPage;
