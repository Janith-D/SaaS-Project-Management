import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardApi } from "../../../api/dashboardApi";
import {
  ShieldAlert,
  Users,
  Building,
  Terminal,
  Activity,
  UserCheck,
  Search,
  Eye,
  AlertTriangle,
  FileCheck2,
  Lock,
  Unlock
} from "lucide-react";
import toast from "react-hot-toast";

export const AdminDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [userQuery, setUserQuery] = useState("");
  const [disabledUsers, setDisabledUsers] = useState<Record<string, boolean>>({});
  const [disabledWorkspaces, setDisabledWorkspaces] = useState<Record<string, boolean>>({});

  // Fetch admin diagnostics statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => dashboardApi.getAdminStats()
  });

  const handleToggleUserStatus = (userId: string, name: string) => {
    const originallyDisabled = !!disabledUsers[userId];
    setDisabledUsers((prev) => ({ ...prev, [userId]: !originallyDisabled }));
    
    if (originallyDisabled) {
      toast.success(`User Account "${name}" enabled successfully.`);
    } else {
      toast.error(`User Account "${name}" temporarily disabled. Sessions terminated.`);
    }
  };

  const handleToggleWorkspaceStatus = (wsId: string, name: string) => {
    const originallyDisabled = !!disabledWorkspaces[wsId];
    setDisabledWorkspaces((prev) => ({ ...prev, [wsId]: !originallyDisabled }));
    
    if (originallyDisabled) {
      toast.success(`Workspace "${name}" activated successfully.`);
    } else {
      toast.error(`Workspace "${name}" disabled. Resource nodes frozen.`);
    }
  };

  // Mock global administrative audits
  const auditLogs = [
    { id: "a-1", user: "Kasun Dias", action: "Assigned PRO Subscription plan to Acme Corp", time: "2026-06-19 11:32" },
    { id: "a-2", user: "Janet Gomez", action: "Initiated Workspace switch over sequence", time: "2026-06-19 10:15" },
    { id: "a-3", user: "Janith Perera", action: "Invited Alice Smith to ws-1 workspace seat", time: "2026-06-18 16:45" },
    { id: "a-4", user: "Admin", action: "Configured CORS Sandbox security filter controls", time: "2026-06-18 09:00" }
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <ShieldAlert className="h-5 w-5 text-rose-600" />
          <span>Superuser Diagnostic Portal</span>
        </h1>
        <p className="text-xs text-slate-500">Monitor overall user signups, company workspaces and lock profiles.</p>
      </div>

      {isLoading ? (
        <p className="text-xs text-slate-400">Loading admin parameters...</p>
      ) : (
        <>
          {/* Stats count boxes */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 border rounded-xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registrations</span>
              <div className="flex items-center space-x-2.5 mt-1.5">
                <Users className="h-5 w-5 text-indigo-600" />
                <span className="text-xl font-bold text-slate-800">{stats?.totalUsers || "0"} Accounts</span>
              </div>
            </div>

            <div className="bg-white p-4 border rounded-xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Workspaces</span>
              <div className="flex items-center space-x-2.5 mt-1.5">
                <Building className="h-5 w-5 text-emerald-600" />
                <span className="text-xl font-bold text-slate-800">{stats?.totalWorkspaces || "0"} Teams</span>
              </div>
            </div>

            <div className="bg-white p-4 border rounded-xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issue nodes</span>
              <div className="flex items-center space-x-2.5 mt-1.5">
                <Terminal className="h-5 w-5 text-amber-600" />
                <span className="text-xl font-bold text-slate-800">{stats?.totalTasks || "0"} Tasks</span>
              </div>
            </div>

            <div className="bg-white p-4 border rounded-xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security overrides</span>
              <div className="flex items-center space-x-2.5 mt-1.5">
                <FileCheck2 className="h-5 w-5 text-rose-600" />
                <span className="text-xl font-bold text-slate-800">4 Audited Logs</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* User directories management */}
            <div className="bg-white p-5 border rounded-2xl lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Platform Signups Directory</span>
                <div className="relative">
                  <Search className="absolute inset-y-0 left-0 pl-2 text-slate-400 h-3.5 w-3.5 mt-1.5" />
                  <input
                    type="text"
                    placeholder="Search accounts..."
                    className="pl-7 pr-2 py-1 text-xs border rounded focus:outline-none"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-bold border-b">
                      <th className="p-2">Employee</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Auth Claim</th>
                      <th className="p-2 text-right">Access lock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.users
                      ?.filter((u: any) => u.fullName.toLowerCase().includes(userQuery.toLowerCase()))
                      ?.map((u: any) => {
                        const isDisabled = !!disabledUsers[u.id];
                        return (
                          <tr key={u.id} className="border-b hover:bg-slate-50 transition">
                            <td className="p-2 font-bold text-slate-800 truncate max-w-44">{u.fullName}</td>
                            <td className="p-2 truncate max-w-44 font-mono text-[11px]">{u.email}</td>
                            <td className="p-2">{u.role}</td>
                            <td className="p-2 text-right">
                              <button
                                onClick={() => handleToggleUserStatus(u.id, u.fullName)}
                                className={`p-1 px-2.5 rounded text-[10px] font-bold transition flex items-center space-x-1 ml-auto ${
                                  isDisabled 
                                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" 
                                    : "bg-red-50 text-red-700 hover:bg-red-100"
                                }`}
                              >
                                {isDisabled ? (
                                  <>
                                    <Unlock className="h-3 w-3" />
                                    <span>Restore Account</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="h-3 w-3" />
                                    <span>Disable Account</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Workspaces overview & Audits split */}
            <div className="lg:col-span-4 space-y-5">
              {/* Workspaces List */}
              <div className="bg-white p-5 border rounded-2xl space-y-3.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Company Workspaces</span>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {stats?.workspaces?.map((ws: any) => {
                    const isDisabled = !!disabledWorkspaces[ws.id];
                    return (
                      <div key={ws.id} className="flex justify-between items-center p-2.5 bg-slate-50 border rounded-xl text-xs font-medium">
                        <div className="truncate">
                          <span className="block truncate font-bold text-slate-800">{ws.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono">Tear Status: {ws.plan}</span>
                        </div>
                        <button
                          onClick={() => handleToggleWorkspaceStatus(ws.id, ws.name)}
                          className={`p-1 rounded text-[9px] font-bold ${
                            isDisabled ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                          }`}
                        >
                          {isDisabled ? "Enable" : "Freeze"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Audit trail */}
              <div className="bg-slate-950 p-5 rounded-2xl text-slate-300 font-mono text-[10px] space-y-3 shadow-xl">
                <div className="flex items-center space-x-1.5 text-rose-500 border-b border-slate-800 pb-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-extrabold uppercase tracking-widest text-[9px]">Administrative Logging Console</span>
                </div>
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="border-b border-slate-900 pb-1.5">
                      <span className="text-slate-500 font-bold">[{log.time}]</span>{" "}
                      <span className="text-indigo-400">{log.user}:</span>{" "}
                      <span className="text-slate-400">{log.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default AdminDashboardPage;
