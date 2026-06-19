import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "../../../api/workspaceApi";
import { WorkspaceRole } from "../../../types/user.types";
import {
  Users,
  Plus,
  Trash2,
  Mail,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  Award,
  CircleHelp,
  Fingerprint
} from "lucide-react";
import toast from "react-hot-toast";

export const MembersListPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const activeWsId = workspaceId || localStorage.getItem("activeWorkspaceId") || "ws-1";
  const queryClient = useQueryClient();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>("MEMBER");

  // Query Workspace Members
  const { data: members, isLoading } = useQuery({
    queryKey: ["members", activeWsId],
    queryFn: () => workspaceApi.getWorkspaceMembers(activeWsId),
    enabled: !!activeWsId
  });

  // Invite Member Mutation
  const inviteMutation = useMutation({
    mutationFn: (data: { email: string; role: WorkspaceRole }) =>
      workspaceApi.inviteMember(activeWsId, data.email, data.role),
    onSuccess: (newMemb) => {
      queryClient.invalidateQueries({ queryKey: ["members", activeWsId] });
      toast.success(`Invitation dispatched to ${newMemb.email}!`);
      setIsInviteOpen(false);
      setInviteEmail("");
      setInviteRole("MEMBER");
    },
    onError: (e: any) => toast.error(e.message || "Invitation error.")
  });

  // Update Role Mutation
  const updateRoleMutation = useMutation({
    mutationFn: (data: { memberId: string; role: WorkspaceRole }) =>
      workspaceApi.updateMemberRole(activeWsId, data.memberId, data.role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", activeWsId] });
      toast.success("Team member permission level adjusted.");
    },
    onError: (e: any) => toast.error(e.message)
  });

  // Remove Member Mutation
  const removeMutation = useMutation({
    mutationFn: (memberId: string) => workspaceApi.removeMember(activeWsId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", activeWsId] });
      toast.success("Workspace seat relinquished safely.");
    },
    onError: (e: any) => toast.error(e.message)
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email");
      return;
    }
    inviteMutation.mutate({ email: inviteEmail, role: inviteRole });
  };

  const handleRoleChange = (memberId: string, role: WorkspaceRole) => {
    updateRoleMutation.mutate({ memberId, role });
  };

  const handleRemoveMember = (memberId: string, name: string) => {
    if (confirm(`Revoke workspace access for ${name}?`)) {
      removeMutation.mutate(memberId);
    }
  };

  const roleStyles: Record<WorkspaceRole, { bg: string; text: string; icon: any }> = {
    WORKSPACE_OWNER: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: ShieldAlert },
    WORKSPACE_ADMIN: { bg: "bg-slate-100 border-slate-250", text: "text-slate-800", icon: ShieldCheck },
    PROJECT_MANAGER: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: Award },
    MEMBER: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: Fingerprint },
    VIEWER: { bg: "bg-slate-50 border-slate-200", text: "text-slate-600", icon: CircleHelp }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">Team Headcount</h1>
          <p className="text-xs text-slate-500">
            Invite colleagues, establish roles, and orchestrate sprint access parameters.
          </p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg cursor-pointer transition shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="h-6 bg-slate-100 animate-pulse w-3/4 rounded" />
          <div className="h-10 bg-slate-50 animate-pulse rounded" />
          <div className="h-10 bg-slate-50 animate-pulse rounded" />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 font-bold text-[10px] uppercase tracking-wider select-none">
                  <th className="py-3 px-5">Participant Details</th>
                  <th className="py-3 px-5">Workspace Role</th>
                  <th className="py-3 px-5">Member Status</th>
                   <th className="py-3 px-5 text-right">Adjustment Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
                {members?.map((m) => {
                  const style = roleStyles[m.role] || roleStyles.MEMBER;
                  const Icon = style.icon;
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-blue-650 border border-slate-200 select-none">
                            {m.fullName[0].toUpperCase()}
                          </div>
                          <div>
                            <span className="block font-bold text-slate-800">{m.fullName}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{m.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center space-x-1 px-2.2 py-0.5 border rounded-full text-[9px] uppercase font-bold tracking-wide ${style.bg} ${style.text}`}>
                          <Icon className="h-3 w-3 shrink-0" />
                          <span>{m.role.replace("WORKSPACE_", "").replace("_", " ")}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        {m.status === "ACTIVE" ? (
                          <span className="text-emerald-600 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ring-emerald-600/10">
                            Active Card
                          </span>
                        ) : (
                          <span className="text-amber-600 bg-amber-50 text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ring-amber-600/10 animate-pulse">
                            Invite Dispatched
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Role edit select menu */}
                          {m.role !== "WORKSPACE_OWNER" && (
                            <select
                              className="text-[10px] font-semibold bg-white border border-slate-200 rounded p-1"
                              value={m.role}
                              onChange={(e) => handleRoleChange(m.id, e.target.value as WorkspaceRole)}
                              disabled={updateRoleMutation.isPending}
                            >
                              <option value="WORKSPACE_ADMIN">Admin</option>
                              <option value="PROJECT_MANAGER">Manager</option>
                              <option value="MEMBER">Member</option>
                              <option value="VIEWER">Viewer</option>
                            </select>
                          )}

                          {m.role !== "WORKSPACE_OWNER" && (
                            <button
                              onClick={() => handleRemoveMember(m.id, m.fullName)}
                              className="p-1 px-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded transition"
                              title="Expel seat"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INVITE MEMBER MODAL */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-black text-slate-800 mb-1">Invite Workspace seat</h3>
            <p className="text-xs text-slate-500 mb-4">Grant dashboard or sprint manager privileges instantly.</p>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Email Coordinates</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="email"
                    placeholder="teammate@company.com"
                    className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Assigned permission tier</label>
                <select
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as WorkspaceRole)}
                >
                  <option value="MEMBER">Member (Create & Commit tasks)</option>
                  <option value="PROJECT_MANAGER">Project Manager (Re-order & edit project nodes)</option>
                  <option value="WORKSPACE_ADMIN">Workspace Admin (Manage members & settings)</option>
                  <option value="VIEWER">Viewer (Read-only observation)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={inviteMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold text-white transition disabled:opacity-50"
                >
                  {inviteMutation.isPending ? "Inviting..." : "Dispatch Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default MembersListPage;
