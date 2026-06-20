import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { adminApi } from "../../../api/adminApi";
import {
  ShieldAlert,
  Users,
  Building,
  Terminal,
  FileCheck2,
  Activity,
  ArrowRight
} from "lucide-react";

export const AdminDashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => adminApi.getStats()
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <ShieldAlert className="h-5 w-5 text-rose-600" />
          <span>Admin Dashboard</span>
        </h1>
        <p className="text-xs text-slate-500">Platform-wide statistics and management overview.</p>
      </div>

      {isLoading ? (
        <p className="text-xs text-slate-400">Loading admin data...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 border rounded-xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Users</span>
              <div className="flex items-center space-x-2.5 mt-1.5">
                <Users className="h-5 w-5 text-indigo-600" />
                <span className="text-xl font-bold text-slate-800">{stats?.totalUsers ?? 0}</span>
              </div>
            </div>
            <div className="bg-white p-4 border rounded-xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Workspaces</span>
              <div className="flex items-center space-x-2.5 mt-1.5">
                <Building className="h-5 w-5 text-emerald-600" />
                <span className="text-xl font-bold text-slate-800">{stats?.totalWorkspaces ?? 0}</span>
              </div>
            </div>
            <div className="bg-white p-4 border rounded-xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Projects</span>
              <div className="flex items-center space-x-2.5 mt-1.5">
                <Terminal className="h-5 w-5 text-amber-600" />
                <span className="text-xl font-bold text-slate-800">{stats?.totalProjects ?? 0}</span>
              </div>
            </div>
            <div className="bg-white p-4 border rounded-xl shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active (30d)</span>
              <div className="flex items-center space-x-2.5 mt-1.5">
                <Activity className="h-5 w-5 text-rose-600" />
                <span className="text-xl font-bold text-slate-800">{stats?.activeUsersLast30 ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Link
              to="/admin/users"
              className="bg-white p-5 border rounded-2xl hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-bold text-slate-700 block">User Management</span>
                <p className="text-[10px] text-slate-400 mt-1">View, search, and disable user accounts</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition" />
            </Link>
            <Link
              to="/admin/workspaces"
              className="bg-white p-5 border rounded-2xl hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-bold text-slate-700 block">All Workspaces</span>
                <p className="text-[10px] text-slate-400 mt-1">Browse workspace stats and ownership</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition" />
            </Link>
            <Link
              to="/admin/audit-logs"
              className="bg-white p-5 border rounded-2xl hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-bold text-slate-700 block">Audit Logs</span>
                <p className="text-[10px] text-slate-400 mt-1">System-wide administrative audit trail</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
export default AdminDashboardPage;
