import React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../../api/adminApi";
import { Building, Users, FolderKanban, Calendar } from "lucide-react";

export const AdminWorkspacesPage: React.FC = () => {
  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["adminWorkspaces"],
    queryFn: () => adminApi.getWorkspaces()
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <Building className="h-5 w-5 text-emerald-600" />
          <span>All Workspaces</span>
        </h1>
        <p className="text-xs text-slate-500">Monitor all workspaces across the platform.</p>
      </div>

      {isLoading ? (
        <p className="text-xs text-slate-400">Loading workspaces...</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-bold border-b">
                <th className="p-3">Name</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Plan</th>
                <th className="p-3 text-center">Members</th>
                <th className="p-3 text-center">Projects</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {workspaces?.map((ws) => (
                <tr key={ws.id} className="border-b hover:bg-slate-50 transition">
                  <td className="p-3 font-bold text-slate-800">{ws.name}</td>
                  <td className="p-3 text-slate-600">{ws.ownerName}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      ws.plan === "FREE" ? "bg-slate-100 text-slate-600" :
                      ws.plan === "PRO" ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {ws.plan}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="flex items-center justify-center space-x-1">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span>{ws.memberCount}</span>
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="flex items-center justify-center space-x-1">
                      <FolderKanban className="h-3.5 w-3.5 text-slate-400" />
                      <span>{ws.projectCount}</span>
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 text-[11px]">
                    {new Date(ws.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!workspaces || workspaces.length === 0) && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400 text-xs">No workspaces found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default AdminWorkspacesPage;
