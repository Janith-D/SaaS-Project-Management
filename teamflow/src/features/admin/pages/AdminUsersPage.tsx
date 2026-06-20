import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../../api/adminApi";
import {
  Users,
  Search,
  Lock,
  Unlock,
  Shield,
  Mail,
  Calendar
} from "lucide-react";
import toast from "react-hot-toast";

export const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => adminApi.getUsers()
  });

  const disableMutation = useMutation({
    mutationFn: (userId: string) => adminApi.disableUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success("User status toggled");
    },
    onError: (e: any) => toast.error(e.message)
  });

  const filtered = (users || []).filter(
    (u) =>
      u.fullName.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <span>User Management</span>
          </h1>
          <p className="text-xs text-slate-500">View and manage all registered platform users.</p>
        </div>
        <div className="relative">
          <Search className="absolute inset-y-0 left-0 pl-2.5 text-slate-400 h-4 w-4 mt-2" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-xs text-slate-400">Loading users...</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-bold border-b">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Verified</th>
                <th className="p-3">Status</th>
                <th className="p-3">Joined</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b hover:bg-slate-50 transition">
                  <td className="p-3 font-bold text-slate-800">{u.fullName}</td>
                  <td className="p-3 text-slate-600 font-mono text-[11px]">{u.email}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      u.globalRole === "SUPER_ADMIN" ? "bg-rose-100 text-rose-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {u.globalRole}
                    </span>
                  </td>
                  <td className="p-3">
                    {u.emailVerified ? (
                      <span className="text-emerald-600 font-bold">Yes</span>
                    ) : (
                      <span className="text-slate-400">No</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center space-x-1 text-[10px] font-bold ${
                      u.enabled ? "text-emerald-600" : "text-red-600"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.enabled ? "bg-emerald-500" : "bg-red-500"}`} />
                      <span>{u.enabled ? "Active" : "Disabled"}</span>
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => disableMutation.mutate(u.id)}
                      disabled={disableMutation.isPending}
                      className={`inline-flex items-center space-x-1 text-[10px] font-bold py-1 px-2.5 rounded-lg transition ${
                        u.enabled
                          ? "bg-red-50 text-red-700 hover:bg-red-100"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      } disabled:opacity-50`}
                    >
                      {u.enabled ? (
                        <><Lock className="h-3 w-3" /><span>Disable</span></>
                      ) : (
                        <><Unlock className="h-3 w-3" /><span>Enable</span></>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400 text-xs">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default AdminUsersPage;
