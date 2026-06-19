import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { workspaceApi } from "../../api/workspaceApi";
import { notificationApi } from "../../api/notificationApi";
import { Workspace } from "../../types/workspace.types";
import {
  FolderKanban,
  Bell,
  LogOut,
  Users,
  Settings,
  LayoutDashboard,
  Menu,
  X,
  Activity,
  User,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronDown,
  Lock,
  PlusCircle,
  HelpCircle
} from "lucide-react";
import toast from "react-hot-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

  // Load workspaces and active workspace selection
  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const list = await workspaceApi.getWorkspaces();
        setWorkspaces(list);
        
        const savedWsId = localStorage.getItem("activeWorkspaceId");
        const found = list.find((w) => w.id === savedWsId);
        if (found) {
          setActiveWorkspace(found);
        } else if (list.length > 0) {
          setActiveWorkspace(list[0]);
          localStorage.setItem("activeWorkspaceId", list[0].id);
        }
      } catch (e) {
        console.error("Workspace load failure", e);
      }
    }
    loadWorkspaces();
  }, []);

  // Fetch notifications periodically or on mount
  const handleFetchNotifications = async () => {
    try {
      const data = await notificationApi.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    handleFetchNotifications();
    const interval = setInterval(handleFetchNotifications, 12000);
    return () => clearInterval(interval);
  }, [user]);

  const handleWorkspaceChange = (ws: Workspace) => {
    setActiveWorkspace(ws);
    localStorage.setItem("activeWorkspaceId", ws.id);
    setIsWorkspaceDropdownOpen(false);
    toast.success(`Switched to workspace: ${ws.name}`);
    // Refresh or redirect to Dashboard list
    navigate(`/dashboard`);
  };

  const handleMarkNotificationRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      toast.success("Notification marked as read");
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications quieted");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateWorkspacePrompt = () => {
    const wsName = prompt("Enter a descriptive name for your new workspace:");
    if (!wsName) return;
    const wsDesc = prompt("Provide a short workspace tagline:") || "";
    
    workspaceApi
      .createWorkspace({ name: wsName, description: wsDesc })
      .then((newWs) => {
        setWorkspaces((prev) => [...prev, newWs]);
        handleWorkspaceChange(newWs);
      })
      .catch((e) => toast.error(e.message || "Failed to establish workspace"));
  };

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Safely logged out!");
      navigate("/login");
    } catch (e) {
      toast.error("Logout error occurred");
    }
  };

  const menuItems = [
    {
      name: "Dashboard Analytics",
      path: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Workspace Projects",
      path: activeWorkspace ? `/workspaces/${activeWorkspace.id}/projects` : "/dashboard",
      icon: FolderKanban
    },
    {
      name: "Team Members",
      path: activeWorkspace ? `/workspaces/${activeWorkspace.id}/members` : "/dashboard",
      icon: Users
    },
    {
      name: "All Notifications",
      path: "/notifications",
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      name: "Plan & Billing",
      path: "/settings",
      icon: Sparkles
    }
  ];

  // Derive simple breadcrumbs
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = ["TeamFlow"];
  if (activeWorkspace) {
    breadcrumbs.push(activeWorkspace.name);
  }
  if (pathSegments.includes("projects")) {
    breadcrumbs.push("Projects");
  } else if (pathSegments.includes("members")) {
    breadcrumbs.push("Members");
  } else if (pathSegments.includes("notifications")) {
    breadcrumbs.push("Notifications");
  } else if (pathSegments.includes("settings")) {
    breadcrumbs.push("Plan Upgrade");
  } else if (pathSegments.includes("admin")) {
    breadcrumbs.push("Admin Panel");
  } else {
    breadcrumbs.push("Analytics Overview");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans overflow-hidden">
      {/* Sidebar Panel - Desktop view */}
      <aside className="hidden md:flex md:w-64 flex-col bg-[#0F172A] flex-shrink-0 border-r border-slate-800">
        <div className="h-16 flex items-center space-x-3 px-6 border-b border-slate-800 bg-[#0B0F19]">
          <div className="bg-blue-500 p-1.5 rounded-lg text-white">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-sans">TeamFlow</span>
        </div>

        {/* Workspace Quick Switcher inside Sidebar */}
        <div className="px-4 py-3 border-b border-slate-800 bg-[#111A2E]/50">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Active Workspace
          </label>
          <div className="relative">
            <button
              onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/60 hover:bg-slate-800/80 border border-slate-700/65 rounded-lg text-left text-xs font-semibold text-slate-200 transition duration-150"
            >
              <span className="truncate">
                {activeWorkspace ? activeWorkspace.name : "Select Workspace"}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-1.5" />
            </button>

            {isWorkspaceDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                <div className="max-h-52 overflow-y-auto">
                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => handleWorkspaceChange(ws)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition ${
                        activeWorkspace?.id === ws.id
                          ? "bg-blue-600 text-white font-semibold"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <div className="truncate">
                        <span className="block truncate font-medium">{ws.name}</span>
                        <span className="text-[9px] text-slate-400 truncate block">
                          {ws.plan} Plan
                        </span>
                      </div>
                      {ws.plan === "BUSINESS" && (
                        <span className="bg-amber-100/20 text-amber-300 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                          Biz
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-800 pt-1 mt-1">
                  <button
                    onClick={handleCreateWorkspacePrompt}
                    className="w-full flex items-center px-3 py-2 text-xs font-medium text-blue-400 hover:bg-slate-800 transition"
                  >
                    <PlusCircle className="h-3.5 w-3.5 mr-2 shrink-0" />
                    Create Workspace
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Navigation items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path.split("/projects")[0] + "/projects"));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full select-none">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Exclusive Platform Admin Access */}
          {user?.role === "PLATFORM_ADMIN" && (
            <div className="pt-4 border-t border-slate-850 mt-4">
              <span className="text-[9px] font-bold text-red-400/80 uppercase tracking-wider block px-3 mb-1.5 flex items-center space-x-1">
                <Lock className="h-3 w-3 inline" /> <span>Admin Operations</span>
              </span>
              <Link
                to="/admin/users"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-semibold transition ${
                  location.pathname.startsWith("/admin")
                    ? "bg-rose-950/50 text-rose-200"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <Settings className="h-4 w-4 text-rose-500" />
                <span>Superuser Panel</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Sidebar Footer detailing Active Plan and User controls */}
        <div className="p-4 border-t border-slate-800 bg-[#0B0F19]">
          {activeWorkspace && (
            <div className="bg-slate-800/40 rounded-lg p-3.5 mb-3.5">
              <p className="text-xs text-slate-400 mb-1.5">
                Plan: <span className="text-white font-semibold underline">{activeWorkspace.plan}</span>
              </p>
              <div className="w-full bg-slate-700 h-1.5 rounded-full">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: activeWorkspace.plan === "FREE" ? "40%" : "85%" }}></div>
              </div>
              <p className="text-[9px] text-slate-500 mt-1.5 leading-normal">
                {activeWorkspace.plan === "FREE" 
                  ? "40% workspace capacity used."
                  : "Unlimited High-Velocity projects enabled."}
              </p>
              {activeWorkspace.plan === "FREE" && (
                <Link
                  to="/settings"
                  className="mt-2 block text-center text-[10px] bg-blue-600 hover:bg-blue-505 font-bold py-1 px-2.5 rounded text-white transition-opacity"
                >
                  Increase Limits
                </Link>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-xs shrink-0 select-none">
                {user?.fullName.split(" ").map((n) => n[0]).join("") || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{user?.fullName}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Logout Account"
              className="p-1 px-2 text-slate-400 hover:text-red-400 hover:bg-slate-850 rounded transition duration-150 shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Column space */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-1.5 text-slate-500 hover:bg-slate-50 rounded-lg transition"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>

            {/* Breadcrumb path locator matching High Density aesthetic */}
            <div className="hidden sm:flex items-center text-xs text-slate-500 font-sans select-none">
              <span>Workspaces</span>
              <svg className="w-4 h-4 mx-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-900 font-semibold uppercase tracking-wider">
                {activeWorkspace ? activeWorkspace.name : "Acme Global Dev"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Quick Search placeholder matching Design HTML */}
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Quick Search..." 
                className="w-64 h-9 bg-slate-100 border-none rounded-full px-4 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-150" 
                onClick={() => toast.success("Command Console activated")}
              />
            </div>

            {/* Playful indicator of Fallback status */}
            {import.meta.env.VITE_USE_MOCK_FALLBACK === "true" && (
              <span className="hidden lg:inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ring-emerald-600/10">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span>Sandbox Demo Play</span>
              </span>
            )}

            {/* Notification drop-down container */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
                  setIsUserMenuOpen(false);
                }}
                className="p-1.5 text-slate-400 hover:text-blue-600 rounded-full cursor-pointer relative transition duration-150"
              >
                <Bell className="h-5.5 w-5.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>

              {isNotificationDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-150">
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Workspace Alerts</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllNotificationsRead}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold transition"
                      >
                        Quiet all
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400">
                        <Clock className="h-6 w-6 mx-auto mb-1.5 text-slate-300" />
                        <p className="text-xs">No active alerts</p>
                      </div>
                    ) : (
                      notifications.map((not) => (
                        <div
                           key={not.id}
                           className={`p-3 text-xs transition duration-150 ${
                             not.read ? "bg-white opacity-70" : "bg-indigo-50/40 hover:bg-indigo-50/70"
                           }`}
                        >
                          <div className="flex justify-between items-start mb-0.5">
                            <span className="font-bold text-slate-700">{not.title}</span>
                            {!not.read && (
                              <button
                                onClick={(e) => handleMarkNotificationRead(not.id, e)}
                                className="text-[9px] text-indigo-500 hover:text-indigo-700 font-medium"
                              >
                                Done
                              </button>
                            )}
                          </div>
                          <p className="text-slate-500 leading-normal mb-1">{not.message}</p>
                          <span className="text-[9px] text-slate-400 block">
                            {new Date(not.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-slate-100 text-center bg-slate-50/50">
                    <Link
                      to="/notifications"
                      onClick={() => setIsNotificationDropdownOpen(false)}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold block"
                    >
                      View all notifications page
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile circular button with menu matching High Density aesthetic */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6 relative">
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsNotificationDropdownOpen(false);
                }}
                className="flex items-center gap-3 text-left focus:outline-none focus:ring-0 group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{user?.fullName}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
                    {user?.role === "PLATFORM_ADMIN" ? "Super Admin" : "Lead Architect"}
                  </p>
                </div>
                <div className="w-9 h-9 bg-slate-200 hover:bg-slate-300 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-blue-600 text-xs transition duration-150">
                   {user?.fullName.split(" ").map((n) => n[0]).join("") || "U"}
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800 leading-none mb-1">{user?.fullName}</p>
                    <p className="text-[10px] text-slate-400 truncate leading-none">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <User className="h-3.5 w-3.5 mr-2" />
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="h-3.5 w-3.5 mr-2" />
                    Billing & Limits
                  </Link>
                  {user?.role === "PLATFORM_ADMIN" && (
                    <Link
                      to="/admin/users"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-rose-700 hover:bg-rose-50"
                    >
                      <Lock className="h-3.5 w-3.5 mr-2 text-rose-500" />
                      Superuser Dashboard
                    </Link>
                  )}
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left transition"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic content canvas */}
        <main className="flex-1 p-8 overflow-y-auto w-full">
          {children}
        </main>

        {/* Status Bar */}
        <footer className="h-8 bg-slate-50 border-t border-slate-200 px-6 flex items-center justify-between text-[10px] text-slate-400 select-none">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>API: Connected</span>
            </div>
            <span>DB: PostgreSQL 15.2</span>
            <span>Version: 2.1.4-stable</span>
          </div>
          <div className="flex gap-4 items-center font-mono">
            <span>NODE: teamflow-cluster-01</span>
            <span className="text-slate-300">|</span>
            <span>UPTIME: 14d 2h 14m</span>
          </div>
        </footer>
      </div>

      {/* MOBILE DRAWER SIDEBAR SCREEN OVERLAY */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative flex flex-col w-64 max-w-xs bg-[#0F172A] border-r border-slate-800 h-full z-10 p-5 shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2 px-1 pb-4 border-b border-slate-800 mb-4 mt-2">
              <Activity className="h-5 w-5 text-indigo-400" />
              <span className="text-sm font-bold text-white tracking-tight font-sans">TeamFlow Mobile</span>
            </div>

            {/* Switchers on Mobile */}
            <div className="mb-4">
              <label className="text-[9px] font-bold text-slate-550 uppercase tracking-wider block mb-1">
                Workspace Swapper
              </label>
              <select
                className="w-full text-xs font-semibold p-2 bg-slate-800 border border-slate-705 text-slate-200 rounded"
                value={activeWorkspace?.id || ""}
                onChange={(e) => {
                  const match = workspaces.find((w) => w.id === e.target.value);
                  if (match) handleWorkspaceChange(match);
                }}
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name} ({ws.plan})
                  </option>
                ))}
              </select>
            </div>

            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <IconComponent className="h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs">
                  {user?.fullName[0] || "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate leading-tight">{user?.fullName}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMobileSidebarOpen(false);
                  handleSignOut();
                }}
                className="p-1 px-2 text-slate-400 hover:text-red-400 text-xs rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardLayout;
