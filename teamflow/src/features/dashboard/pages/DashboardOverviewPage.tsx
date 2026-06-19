import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardApi } from "../../../api/dashboardApi";
import { projectApi } from "../../../api/projectApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import {
  FolderKanban,
  CheckCircle,
  Clock,
  Users,
  AlertTriangle,
  PlayCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  History,
  FileSpreadsheet
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate, formatTimeAgo } from "../../../utils/formatDate";

export const DashboardOverviewPage: React.FC = () => {
  const queryClient = useQueryClient();
  const activeWsId = localStorage.getItem("activeWorkspaceId") || "ws-1";

  // State for Create Project quick-toggle
  const [isQuickProjectOpen, setIsQuickProjectOpen] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");

  // Query Stats
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["workspaceStats", activeWsId],
    queryFn: () => dashboardApi.getWorkspaceStats(activeWsId),
    enabled: !!activeWsId
  });

  // Query Activity Logs
  const { data: logs, isLoading: isLogsLoading } = useQuery({
    queryKey: ["activityLogs", activeWsId],
    queryFn: () => dashboardApi.getActivityLogs(activeWsId),
    enabled: !!activeWsId
  });

  // Query Projects
  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["projects", activeWsId],
    queryFn: () => projectApi.getProjects(activeWsId),
    enabled: !!activeWsId
  });

  // Mutation for creating project
  const createProjectMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      projectApi.createProject(activeWsId, data),
    onSuccess: (newProj) => {
      queryClient.invalidateQueries({ queryKey: ["projects", activeWsId] });
      queryClient.invalidateQueries({ queryKey: ["workspaceStats", activeWsId] });
      queryClient.invalidateQueries({ queryKey: ["activityLogs", activeWsId] });
      toast.success(`Project "${newProj.name}" created!`);
      setNewProjName("");
      setNewProjDesc("");
      setIsQuickProjectOpen(false);
    },
    onError: (e: any) => toast.error(e.message)
  });

  const handleQuickProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) {
      toast.error("Please provide a project name");
      return;
    }
    createProjectMutation.mutate({ name: newProjName, description: newProjDesc });
  };

  // Mock data calculations for charting fallback
  const statusData = [
    { name: "To Do", value: 3, color: "#6366f1" },
    { name: "In Progress", value: 4, color: "#0ea5e9" },
    { name: "In Review", value: 2, color: "#f59e0b" },
    { name: "Blocked", value: 1, color: "#ef4444" },
    { name: "Done", value: 5, color: "#10b981" }
  ];

  const priorityData = [
    { name: "Low", value: 2, fill: "#94a3b8" },
    { name: "Medium", value: 5, fill: "#6366f1" },
    { name: "High", value: 4, fill: "#f59e0b" },
    { name: "Critical", value: 2, fill: "#ef4444" }
  ];

  const handleDownloadWorkspacePDFReport = () => {
    toast.loading("Compiling project reports...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Workspace Activity Report downloaded to local system (Mock PDF)!");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header section with High Density typography, colors, and layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 font-sans">Workspace Hub</h1>
          <p className="text-xs text-slate-500">
            Real-time charts, productivity metrics, and recent team activities.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadWorkspacePDFReport}
            className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-2 px-3 border border-slate-200 rounded-lg cursor-pointer transition shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Workspace Report (PDF)</span>
          </button>
          <button
            onClick={() => setIsQuickProjectOpen(true)}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg cursor-pointer transition shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Metrics high density grid row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition hover:shadow-md">
          <p className="text-[11px] text-slate-500 uppercase mb-1 font-bold tracking-tight">Active Projects</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black text-slate-900 leading-none">
              {stats ? stats.activeProjects : "12"}
            </h3>
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
              +2 this week
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition hover:shadow-md">
          <p className="text-[11px] text-slate-500 uppercase mb-1 font-bold tracking-tight">Tasks Completed</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black text-slate-900 leading-none">
              {stats ? Math.round(stats.totalTasks * (stats.completionPercentage / 100)) : "142"}
            </h3>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
              86% efficiency
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition hover:shadow-md">
          <p className="text-[11px] text-slate-500 uppercase mb-1 font-bold tracking-tight">Team Capacity</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black text-slate-900 leading-none">
              92%
            </h3>
            <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
              High usage
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition hover:shadow-md">
          <p className="text-[11px] text-red-500/85 uppercase mb-1 font-bold tracking-tight">Avg. Velocity</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-black text-slate-900 leading-none">
              24.5
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold">
              pts/sprint
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Status Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 lg:col-span-8 space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              <span>Project Tasks Progress Spectrum</span>
            </span>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 py-0.5 px-2 rounded-full">
              Full Spectrum
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority breakdown with High Density style */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 lg:col-span-4 flex flex-col justify-between shadow-sm">
          <div className="pb-2 border-b border-slate-100 mb-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Tasks Priority Ratios
            </span>
          </div>
          <div className="h-40 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={62}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-4 text-[11px] text-slate-550 font-medium">
            <div className="flex justify-between items-center">
              <span className="flex items-center"><span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block mr-2" />Critical</span>
              <span className="font-bold text-slate-700 font-mono">2 tickets</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center"><span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block mr-2" />High</span>
              <span className="font-bold text-slate-700 font-mono">4 tickets</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center"><span className="h-2.5 w-2.5 rounded-full bg-indigo-500 inline-block mr-2" />Medium</span>
              <span className="font-bold text-slate-700 font-mono">5 tickets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projects overview & Activities timeline split-row with High Density grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Active Projects slots */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 lg:col-span-7 shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Active Projects Matrix
            </span>
            <Link
              to={activeWsId ? `/workspaces/${activeWsId}/projects` : "/dashboard"}
              className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 uppercase tracking-wider"
            >
              <span>See all projects</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
            {isProjectsLoading ? (
              <p className="text-xs text-slate-450">Loading projects...</p>
            ) : projects?.length === 0 ? (
              <p className="text-xs text-slate-450">No projects established. Create one to get started.</p>
            ) : (
              projects?.map((proj) => (
                <div key={proj.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition duration-150">
                  <div className="flex justify-between items-start mb-1.5">
                    <Link to={`/projects/${proj.id}`} className="text-xs font-bold text-slate-800 hover:text-blue-600 block truncate max-w-72 transition-colors">
                      {proj.name}
                    </Link>
                    <span className="text-[9px] bg-slate-200/60 font-semibold text-slate-600 px-2 py-0.5 rounded uppercase font-mono">
                      {proj.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-2.5">{proj.description}</p>
                  
                  {/* Progress indicator */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                      <span>PROJECT METRICS RUN</span>
                      <span className="text-slate-700">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200/70 h-1 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${proj.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Workspace activity feed with High Density action feed style */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 lg:col-span-5 flex flex-col shadow-sm">
          <div className="pb-3 border-b border-slate-100 mb-4 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <History className="h-4 w-4 text-slate-400" />
              <span>Workspace Action Feed</span>
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="space-y-3.5 max-h-76 overflow-y-auto pr-1 flex-1">
            {isLogsLoading ? (
              <p className="text-xs text-slate-400">Gathering logs...</p>
            ) : logs?.length === 0 ? (
              <div className="text-center p-6 text-xs text-slate-400">
                No recorded actions available.
              </div>
            ) : (
              logs?.map((act) => (
                <div key={act.id} className="flex space-x-2.5 text-[11px] items-start">
                  <div className="h-6 w-6 rounded-full bg-slate-100 text-[9px] flex items-center justify-center font-bold text-slate-600 shrink-0 select-none border border-slate-200">
                    {act.userName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 leading-normal">
                      <strong className="font-semibold text-slate-900">{act.userName}</strong>{" "}
                      {act.action}
                    </p>
                    <span className="text-[9px] text-slate-450 block mt-0.5 uppercase tracking-wider font-mono">
                      {formatTimeAgo(act.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* QUICK CONSOLE CREATE PROJECT MODAL */}
      {isQuickProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-black text-slate-800 mb-1">Initiate Workspace Project</h3>
            <p className="text-xs text-slate-500 mb-4">Introduce a clean Kanban slate and set priorities.</p>

            <form onSubmit={handleQuickProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Spring Boot Sec integration"
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Tagline or Scope Description</label>
                <textarea
                  placeholder="Summarize user metrics expectations, testing boundaries, etc."
                  rows={3}
                  className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuickProjectOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={createProjectMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold text-white transition disabled:opacity-50"
                >
                  {createProjectMutation.isPending ? "Creating..." : "Establish Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardOverviewPage;
