import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWorkspace } from "../../../context/WorkspaceContext";
import { workspaceApi } from "../../../api/workspaceApi";
import { projectApi } from "../../../api/projectApi";
import { taskApi } from "../../../api/taskApi";
import { commentApi } from "../../../api/commentApi";
import { TaskStatus, TaskPriority, TaskType, Task, TaskComment, TaskAttachment } from "../../../types/task.types";
import {
  FolderKanban,
  Search,
  Filter,
  Plus,
  ArrowLeft,
  Calendar,
  Sparkles,
  MessageCircle,
  Paperclip,
  Trash2,
  Clock,
  ChevronRight,
  User,
  X,
  FileText,
  Image,
  UploadCloud,
  Loader2,
  Download
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate, formatBytes } from "../../../utils/formatDate";

export const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const activeProjId = projectId || "";
  const queryClient = useQueryClient();
  const { activeWorkspace } = useWorkspace();

  const activeWsId = activeWorkspace?.id || "";

  // Filter and Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("ALL");

  // Create Task form and modal toggles
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [createColumnTarget, setCreateColumnTarget] = useState<TaskStatus>("TODO");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("MEDIUM");
  const [taskType, setTaskType] = useState<TaskType>("TASK");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskAssigneeId, setTaskAssigneeId] = useState("");
  const [taskEstHours, setTaskEstHours] = useState(4);

  // Active Drag State for rendering visually highlighted drop zones
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDragOverColumn, setActiveDragOverColumn] = useState<TaskStatus | null>(null);

  // Active Task details drawer/modal states
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Detail Drawer Inner forms
  const [commentText, setCommentText] = useState("");
  const [editingTaskDesc, setEditingTaskDesc] = useState("");
  const [editingTaskEst, setEditingTaskEst] = useState(0);
  const [editingTaskAct, setEditingTaskAct] = useState(0);

  // Queries
  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ["project", activeProjId],
    queryFn: () => projectApi.getProjects(activeWsId).then((list) => list.find((p) => p.id === activeProjId) || null),
    enabled: !!activeProjId
  });

  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks", activeProjId],
    queryFn: () => taskApi.getTasks(activeProjId),
    enabled: !!activeProjId
  });

  const { data: workspaceMembers } = useQuery({
    queryKey: ["members", activeWsId],
    queryFn: () => workspaceApi.getWorkspaceMembers(activeWsId),
    enabled: !!activeWsId
  });

  const { data: comments, refetch: refetchComments } = useQuery({
    queryKey: ["comments", selectedTask?.id],
    queryFn: () => commentApi.getComments(selectedTask!.id),
    enabled: !!selectedTask?.id
  });

  const { data: attachments, refetch: refetchAttachments } = useQuery({
    queryKey: ["attachments", selectedTask?.id],
    queryFn: () => commentApi.getAttachments(selectedTask!.id),
    enabled: !!selectedTask?.id
  });

  // Task Mutations
  const createTaskMutation = useMutation({
    mutationFn: (data: Partial<Task>) => taskApi.createTask(activeProjId, data),
    onSuccess: (newT) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeProjId] });
      queryClient.invalidateQueries({ queryKey: ["workspaceStats", activeWsId] });
      queryClient.invalidateQueries({ queryKey: ["activityLogs", activeWsId] });
      toast.success(`Task "${newT.title}" created successfully!`);
      closeCreateModal();
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message)
  });

  const updateTaskMutation = useMutation({
    mutationFn: (variables: { id: string; updates: Partial<Task> }) =>
      taskApi.updateTask(variables.id, variables.updates),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeProjId] });
      queryClient.invalidateQueries({ queryKey: ["workspaceStats", activeWsId] });
      queryClient.invalidateQueries({ queryKey: ["activityLogs", activeWsId] });
      
      // Update selected task if currently active in details drawer
      if (selectedTask?.id === updatedTask.id) {
        setSelectedTask(updatedTask);
      }
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message)
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeProjId] });
      queryClient.invalidateQueries({ queryKey: ["workspaceStats", activeWsId] });
      queryClient.invalidateQueries({ queryKey: ["activityLogs", activeWsId] });
      toast.success("Task deleted permanently.");
      closeDetailDrawer();
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message)
  });

  // Comment & Attachment Mutations
  const addCommentMutation = useMutation({
    mutationFn: (content: string) => commentApi.addComment(selectedTask!.id, content),
    onSuccess: () => {
      refetchComments();
      queryClient.invalidateQueries({ queryKey: ["tasks", activeProjId] });
      setCommentText("");
      toast.success("Comment posted!");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message)
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id: string) => commentApi.deleteComment(id),
    onSuccess: () => {
      refetchComments();
      queryClient.invalidateQueries({ queryKey: ["tasks", activeProjId] });
      toast.success("Comment deleted.");
    }
  });

  const uploadAttachmentMutation = useMutation({
    mutationFn: (variables: { name: string; type: string; size: number }) =>
      commentApi.uploadAttachment(selectedTask!.id, variables.name, variables.type, variables.size),
    onSuccess: () => {
      refetchAttachments();
      queryClient.invalidateQueries({ queryKey: ["tasks", activeProjId] });
      toast.success("Attachment linked successfully!");
    }
  });

  const deleteAttachmentMutation = useMutation({
    mutationFn: (id: string) => commentApi.deleteAttachment(id),
    onSuccess: () => {
      refetchAttachments();
      queryClient.invalidateQueries({ queryKey: ["tasks", activeProjId] });
      toast.success("Attachment removed.");
    }
  });

  // Kanban HTML5 Drag & Drop event receivers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
    setActiveDragId(taskId);
  };

  const handleDragEnd = () => {
    setActiveDragId(null);
    setActiveDragOverColumn(null);
  };

  const handleDragOverColumn = (e: React.DragEvent, column: TaskStatus) => {
    e.preventDefault();
    if (activeDragOverColumn !== column) {
      setActiveDragOverColumn(column);
    }
  };

  const handleDropOnColumn = (e: React.DragEvent, column: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    
    if (taskId) {
      // Find the moving task
      const targetTask = tasks?.find((t) => t.id === taskId);
      if (targetTask && targetTask.status !== column) {
        // Trigger mutate with optimistic updating feedback
        updateTaskMutation.mutate({ id: taskId, updates: { status: column } });
        toast.success(`Task moved to ${column.replace("_", " ")}`);
      }
    }
    setActiveDragId(null);
    setActiveDragOverColumn(null);
  };

  // Drawer details modifier methods
  const handleSaveDescription = () => {
    if (!selectedTask) return;
    updateTaskMutation.mutate({
      id: selectedTask.id,
      updates: { description: editingTaskDesc }
    });
    toast.success("Description details saved.");
  };

  const handleSaveHours = () => {
    if (!selectedTask) return;
    updateTaskMutation.mutate({
      id: selectedTask.id,
      updates: { estimatedHours: editingTaskEst, actualHours: editingTaskAct }
    });
    toast.success("Logged hours metrics adjusted.");
  };

  const handlePostCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentMutation.mutate(commentText);
  };

  const handleLocalFileUploadSimulation = () => {
    const fileName = prompt("Enter simulated file name (e.g., api_response.json):") || "wireframe_v2.png";
    const fileType = fileName.endsWith(".json") ? "application/json" : "image/png";
    const fileSize = Math.floor(Math.random() * 4500000) + 50000;
    
    uploadAttachmentMutation.mutate({ name: fileName, type: fileType, size: fileSize });
  };

  const closeCreateModal = () => {
    setIsCreateTaskOpen(false);
    setTaskTitle("");
    setTaskDesc("");
    setTaskPriority("MEDIUM");
    setTaskType("TASK");
    setTaskDueDate("");
    setTaskAssigneeId("");
    setTaskEstHours(4);
  };

  const openCreateModalFor = (col: TaskStatus) => {
    setCreateColumnTarget(col);
    setIsCreateTaskOpen(true);
  };

  const openDetailDrawer = (task: Task) => {
    setSelectedTask(task);
    setEditingTaskDesc(task.description);
    setEditingTaskEst(task.estimatedHours || 0);
    setEditingTaskAct(task.actualHours || 0);
    setIsDetailDrawerOpen(true);
  };

  const closeDetailDrawer = () => {
    setIsDetailDrawerOpen(false);
    setSelectedTask(null);
    setCommentText("");
  };

  // Filter Tasks list
  const filteredTasks = tasks?.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === "ALL" || t.assigneeId === assigneeFilter;
    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const columns: { title: string; status: TaskStatus; color: string }[] = [
    { title: "To Do", status: "TODO", color: "border-slate-300 bg-slate-50 text-slate-800" },
    { title: "In Progress", status: "IN_PROGRESS", color: "border-blue-300 bg-blue-50/40 text-blue-800" },
    { title: "In Review", status: "IN_REVIEW", color: "border-amber-300 bg-amber-50/40 text-amber-800" },
    { title: "Blocked", status: "BLOCKED", color: "border-rose-300 bg-rose-50/40 text-rose-800" },
    { title: "Completed Done", status: "DONE", color: "border-emerald-300 bg-emerald-50/40 text-emerald-800" }
  ];

  const typeLabels: Record<TaskType, { name: string; style: string }> = {
    TASK: { name: "Task", style: "bg-slate-100 text-slate-700" },
    BUG: { name: "Bug", style: "bg-red-100 text-red-700" },
    FEATURE: { name: "Feature", style: "bg-blue-100 text-blue-750 font-bold font-sans" },
    IMPROVEMENT: { name: "Improvement", style: "bg-emerald-100 text-emerald-700" },
    RESEARCH: { name: "Research", style: "bg-amber-100 text-amber-700" },
    EPIC: { name: "Epic", style: "bg-purple-100 text-purple-700" },
    STORY: { name: "User Story", style: "bg-teal-100 text-teal-700" }
  };

  const priorityLabels: Record<TaskPriority, { name: string; style: string }> = {
    LOW: { name: "Low", style: "bg-slate-50 text-slate-400 border-slate-100" },
    MEDIUM: { name: "Med", style: "bg-blue-50 text-blue-600 border-blue-100" },
    HIGH: { name: "High", style: "bg-amber-50 text-amber-600 border-amber-100 animate-pulse" },
    CRITICAL: { name: "CRITICAL", style: "bg-red-50 text-red-600 border-red-200 uppercase font-extrabold font-sans text-[8px]" }
  };

  return (
    <div className="space-y-6">
      {/* Header breadcrumb bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-xs text-slate-500 hover:text-blue-600 font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Hub Overview
          </Link>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight font-sans">
              {project ? project.name : "Loading Project Board..."}
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            {project?.description || "Dynamic sprint roadmap. Grab task handles to shift stages instantly."}
          </p>
        </div>

        <button
          onClick={() => openCreateModalFor("TODO")}
          className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg cursor-pointer transition shadow-xs shrinking-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task Card</span>
        </button>
      </div>

      {/* SEARCH / FILTERS BAR PANEL */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search by title or details..."
            className="w-full text-xs font-medium pl-9 pr-3 py-2 bg-slate-100/60 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:bg-white transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Priority</span>
          <select
            className="text-xs font-semibold bg-slate-100/60 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="ALL">All Levels</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        {/* Member filter */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Assignee</span>
          <select
            className="text-xs font-semibold bg-slate-100/60 border border-slate-200 rounded-lg p-1.5 focus:outline-none max-w-44 focus:ring-2 focus:ring-blue-500/25"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
          >
            <option value="ALL">All Members</option>
            {workspaceMembers?.map((member) => (
              <option key={member.id} value={member.id}>
                {member.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KANBAN BOARD DRAG FEED CONTAINER */}
      {isTasksLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="h-64 bg-slate-100 animate-pulse rounded-xl border border-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start select-none">
          {columns.map((col) => {
            const columnTasks = filteredTasks?.filter((t) => t.status === col.status) || [];
            const isDragOver = activeDragOverColumn === col.status;

            return (
              <div
                key={col.status}
                onDragOver={(e) => handleDragOverColumn(e, col.status)}
                onDrop={(e) => handleDropOnColumn(e, col.status)}
                className={`bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3 transition duration-150 min-h-[480px] flex flex-col shadow-xs ${
                  isDragOver ? "bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/10" : ""
                }`}
              >
                {/* Column header */}
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 select-none">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-700 tracking-tight">{col.title}</span>
                    <span className="bg-slate-200 text-slate-600 text-[10px] font-extrabold px-1.8 py-0.2 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => openCreateModalFor(col.status)}
                    className="p-1 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Column Card Lists */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {columnTasks.length === 0 ? (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-[10px] text-slate-450 font-bold font-mono">
                      DROP CARDS HERE
                    </div>
                  ) : (
                    columnTasks.map((t) => {
                      const typeLabel = typeLabels[t.type] || typeLabels.TASK;
                      const prioLabel = priorityLabels[t.priority] || priorityLabels.LOW;

                      return (
                        <div
                          key={t.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, t.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => openDetailDrawer(t)}
                          className={`bg-white p-3.5 border border-slate-200 rounded-xl cursor-grab hover:border-blue-400 active:cursor-grabbing hover:shadow-md transition group relative ${
                            activeDragId === t.id ? "opacity-30 border-dashed border-blue-400" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2.5">
                            <span className={`text-[8px] font-bold px-1.8 py-0.5 rounded-full uppercase ${typeLabel.style}`}>
                              {typeLabel.name}
                            </span>
                            <span className={`text-[8px] font-bold px-1.8 py-0.5 border rounded-full uppercase ${prioLabel.style}`}>
                              {prioLabel.name}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition">
                            {t.title}
                          </h4>

                          {t.description && (
                            <p className="text-[10px] text-slate-405 font-medium line-clamp-1 mt-1 leading-normal">
                              {t.description}
                            </p>
                          )}

                          {/* Footer with due dates and assignee info */}
                          <div className="flex justify-between items-center mt-3.5 pt-2.5 border-t border-slate-100 select-none">
                            <div className="flex items-center space-x-2 text-[9px] font-bold text-slate-400">
                              {t.dueDate ? (
                                <span className={`flex items-center space-x-0.5 leading-none ${new Date(t.dueDate) < new Date() && t.status !== "DONE" ? "text-red-500 animate-pulse" : ""}`}>
                                  <Calendar className="h-3 w-3 shrink-0" />
                                  <span>{formatDate(t.dueDate)}</span>
                                </span>
                              ) : null}
                              {t.commentCount || t.attachmentCount ? (
                                <div className="flex items-center space-x-1.5 leading-none">
                                  {t.commentCount ? (
                                    <span className="flex items-center space-x-0.5" title="comments">
                                      <MessageCircle className="h-3 w-3 inline" />
                                      <span>{t.commentCount}</span>
                                    </span>
                                  ) : null}
                                  {t.attachmentCount ? (
                                    <span className="flex items-center space-x-0.5" title="attachments">
                                      <Paperclip className="h-3 w-3 inline" />
                                      <span>{t.attachmentCount}</span>
                                    </span>
                                  ) : null}
                                </div>
                              ) : null}
                            </div>

                            {/* User Avatar circle */}
                            <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-extrabold text-blue-600 border border-slate-200 select-none" title={t.assigneeName || "Unassigned"}>
                              {t.assigneeName ? t.assigneeName.split(" ").map((n) => n[0]).join("") : "U"}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE TASK CARD WINDOW MODAL */}
      {isCreateTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-black text-slate-800 mb-1">Create Sprint Task Card</h3>
            <p className="text-xs text-slate-500 mb-4">Introduce details, priority guidelines, type and deadlines.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!taskTitle.trim()) return;
                createTaskMutation.mutate({
                  title: taskTitle,
                  description: taskDesc,
                  priority: taskPriority,
                  type: taskType,
                  dueDate: taskDueDate ? taskDueDate + "T23:59:00" : undefined,
                  assigneeId: taskAssigneeId || undefined,
                  estimatedHours: taskEstHours,
                  status: createColumnTarget
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Integrate token validation middleware"
                  className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Scope description</label>
                <textarea
                  placeholder="Summarize engineering goals, test metrics expectations..."
                  rows={2}
                  className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none animate-none"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Task Type</label>
                  <select
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as TaskType)}
                  >
                    <option value="TASK">Task</option>
                    <option value="BUG">Bug</option>
                    <option value="FEATURE">Feature</option>
                    <option value="IMPROVEMENT">Improvement</option>
                    <option value="RESEARCH">Research</option>
                    <option value="EPIC">Epic</option>
                    <option value="STORY">User Story</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Priority</label>
                  <select
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Expected due date</label>
                  <input
                    type="date"
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Owner designee</label>
                  <select
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    value={taskAssigneeId}
                    onChange={(e) => setTaskAssigneeId(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {workspaceMembers?.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Estimated Hours: {taskEstHours} hrs</label>
                <input
                  type="range"
                  min="1"
                  max="40"
                  className="w-full h-8 accent-blue-600 bg-slate-50 rounded-lg"
                  value={taskEstHours}
                  onChange={(e) => setTaskEstHours(parseInt(e.target.value))}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={createTaskMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold text-white transition disabled:opacity-50"
                >
                  {createTaskMutation.isPending ? "Creating..." : "Establish task card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TASK DETAILS SLIDE-OUT DRAWER OVERLAY */}
      {isDetailDrawerOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
          <div
            onClick={closeDetailDrawer}
            className="absolute inset-0"
          />

          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer close cross */}
            <button
              onClick={closeDetailDrawer}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Title & Status info with High Density formatting */}
            <div className="space-y-3 pb-4 border-b border-slate-100 select-none">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase inline-block ${typeLabels[selectedTask.type]?.style || ""}`}>
                {selectedTask.type}
              </span>
              <h2 className="text-base font-black text-slate-800 pr-8 font-sans">{selectedTask.title}</h2>
              
              {/* Controls block in details header */}
              <div className="grid grid-cols-3 gap-3 text-[11px] font-semibold text-slate-500 pt-1.5">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Column Stage</span>
                  <select
                    className="p-1.5 bg-slate-50 border border-slate-200 rounded w-full text-xs font-bold focus:ring-1 focus:ring-blue-500/20"
                    value={selectedTask.status}
                    onChange={(e) => updateTaskMutation.mutate({ id: selectedTask.id, updates: { status: e.target.value as TaskStatus } })}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="BLOCKED">Blocked</option>
                    <option value="DONE">Completed Done</option>
                  </select>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Task Priority</span>
                  <select
                    className="p-1.5 bg-slate-50 border border-slate-200 rounded w-full text-xs font-bold focus:ring-1 focus:ring-blue-500/20"
                    value={selectedTask.priority}
                    onChange={(e) => updateTaskMutation.mutate({ id: selectedTask.id, updates: { priority: e.target.value as TaskPriority } })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Assignee Spot</span>
                  <select
                    className="p-1.5 bg-slate-50 border border-slate-200 rounded w-full text-xs font-bold focus:ring-1 focus:ring-blue-500/20"
                    value={selectedTask.assigneeId || ""}
                    onChange={(e) => updateTaskMutation.mutate({ id: selectedTask.id, updates: { assigneeId: e.target.value || "" } })}
                  >
                    <option value="">Unassigned</option>
                    {workspaceMembers?.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description editing blocks */}
            <div className="py-5 border-b border-slate-100 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scope Objectives details</span>
              <textarea
                className="w-full text-xs font-medium p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/25 resize-none h-20 animate-none"
                placeholder="Details of code structure metrics or endpoints expected..."
                value={editingTaskDesc}
                onChange={(e) => setEditingTaskDesc(e.target.value)}
              />
              <div className="flex justify-between items-center select-none">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this card from roadmap permanently?")) {
                      deleteTaskMutation.mutate(selectedTask.id);
                    }
                  }}
                  className="inline-flex items-center space-x-1 hover:bg-red-50 text-red-500 text-xs py-1 px-2.5 rounded transition"
                >
                  <Trash2 className="h-4.5 w-4.5 inline" />
                  <span>Obliterate Card</span>
                </button>
                <button
                  onClick={handleSaveDescription}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-1.5 px-4 rounded-lg transition"
                >
                  Save description changes
                </button>
              </div>
            </div>

            {/* Work Estimator section */}
            <div className="py-5 border-b border-slate-100 space-y-3.5 select-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Work hours progression</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Estimated Hours Required</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500/20 w-full"
                    value={editingTaskEst}
                    onChange={(e) => setEditingTaskEst(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Actual hours spent</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500/20 w-full"
                    value={editingTaskAct}
                    onChange={(e) => setEditingTaskAct(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                {/* Visual calculation graph link */}
                <div className="text-[10px] text-slate-400 font-bold">
                  EXPEDITION BURNDOWN RATIO:{" "}
                  <strong className="text-slate-800">
                    {editingTaskEst > 0 ? Math.round((editingTaskAct / editingTaskEst) * 100) : 0}%
                  </strong>
                </div>
                <button
                  onClick={handleSaveHours}
                  className="bg-blue-600 hover:bg-blue-700 font-bold px-3 py-1 text-white text-[10px] rounded transition"
                >
                  Save Hours
                </button>
              </div>
            </div>

            {/* Collaborative attachments area */}
            <div className="py-5 border-b border-slate-100 space-y-3">
              <div className="flex justify-between items-center select-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Linked file attachments</span>
                <button
                  onClick={handleLocalFileUploadSimulation}
                  className="text-[10px] text-blue-650 hover:text-blue-800 font-bold flex items-center space-x-1"
                >
                  <UploadCloud className="h-4 w-4 inline" />
                  <span>Attach simulated document</span>
                </button>
              </div>

              {/* List Attachments files */}
              <div className="space-y-2">
                {attachments && attachments.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-bold italic py-1">No attached specs files.</p>
                ) : (
                  attachments?.map((att) => {
                    const isImg = att.type.startsWith("image/");
                    return (
                      <div key={att.id} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200/65 rounded-xl text-[11px] font-medium leading-none">
                        <div className="flex items-center space-x-2.5 truncate max-w-sm">
                          {isImg ? (
                            <Image className="h-4 w-4 text-blue-500 shrink-0" />
                          ) : (
                            <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                          )}
                          <div className="truncate">
                            <span className="block truncate font-bold text-slate-700">{att.name}</span>
                            <span className="text-[9px] text-slate-400 font-normal mt-0.5 block">{formatBytes(att.size)}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2.5 shrink-0">
                          <a
                            href={att.url}
                            target="_blank"
                            rel="referrer"
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-blue-600"
                            title="Open Preview link"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </a>
                          <button
                            onClick={() => deleteAttachmentMutation.mutate(att.id)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500"
                            title="detach file"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Collaborative Conversation Comments thread */}
            <div className="py-5 space-y-4 flex-1 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Conversation Feed</span>

              {/* Comments Scroller */}
              <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1 flex-1">
                {comments && comments.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No notes on this task yet. Post a brief message card to help developers!</p>
                ) : (
                  comments?.map((c) => (
                    <div key={c.id} className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex space-x-2 text-[11px]">
                      <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-blue-600 select-none shrink-0 text-[10px]">
                        {c.authorName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-800 truncate">{c.authorName}</span>
                          <div className="flex items-center space-x-2 text-[9px] text-slate-400">
                            <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <button
                              onClick={() => deleteCommentMutation.mutate(c.id)}
                              className="text-red-400 hover:text-red-650"
                              title="delete comment note"
                            >
                              <X className="h-3 w-3 inline cursor-pointer" />
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-600 leading-normal font-medium">{c.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Form Comment post input card */}
              <form onSubmit={handlePostCommentSubmit} className="pt-3 flex space-x-2 relative select-none">
                <input
                  type="text"
                  placeholder="Post comment... Mentions support e.g. @Kasun Dias"
                  className="flex-1 text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  maxLength={180}
                  required
                />
                <button
                  type="submit"
                  disabled={addCommentMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer transition disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectDetailsPage;
