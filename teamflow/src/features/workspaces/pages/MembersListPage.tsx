import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "../../../api/workspaceApi";
import { WorkspaceRole } from "../../../types/user.types";
import { useAuth } from "../../../context/AuthContext";
import { useWorkspaceRole } from "../../../hooks/useWorkspaceRole";
import {
  Users,
  Plus,
  Trash2,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Award,
  CircleHelp,
  Fingerprint,
  Crown,
  Lock,
  X,
  AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";

export const MembersListPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const activeWsId = workspaceId || localStorage.getItem("activeWorkspaceId") || "";
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { canManageWorkspace, isOwner, role: myRole } = useWorkspaceRole(activeWsId);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>("MEMBER");
  const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string } | null>(null);

  const { data: members, isLoading } = useQuery({
    queryKey: ["members", activeWsId],
    queryFn: () => workspaceApi.getWorkspaceMembers(activeWsId),
    enabled: !!activeWsId
  });

  const inviteMutation = useMutation({
    mutationFn: (data: { email: string; role: WorkspaceRole }) =>
      workspaceApi.inviteMember(activeWsId, data.email, data.role),
    onSuccess: (newMemb) => {
      queryClient.invalidateQueries({ queryKey: ["members", activeWsId] });
      toast.success(`Invitation sent to ${newMemb.email}`);
      setIsInviteOpen(false);
      setInviteEmail("");
      setInviteRole("MEMBER");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message || "Invitation error.")
  });

  const updateRoleMutation = useMutation({
    mutationFn: (data: { memberId: string; role: WorkspaceRole }) =>
      workspaceApi.updateMemberRole(activeWsId, data.memberId, data.role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", activeWsId] });
      toast.success("Role updated successfully");
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message)
  });

  const removeMutation = useMutation({
    mutationFn: (memberId: string) => workspaceApi.removeMember(activeWsId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", activeWsId] });
      toast.success("Member removed from workspace");
      setRemoveTarget(null);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.message)
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

  const memberCount = members?.length ?? 0;
  const activeCount = members?.filter((m) => m.status === "ACTIVE").length ?? 0;
  const pendingCount = members?.filter((m) => m.status !== "ACTIVE").length ?? 0;

  const roleStyles: Record<WorkspaceRole, { bg: string; text: string; icon: any; label: string }> = {
    WORKSPACE_OWNER: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: Crown, label: "Owner" },
    WORKSPACE_ADMIN: { bg: "bg-slate-100 border-slate-250", text: "text-slate-800", icon: ShieldCheck, label: "Admin" },
    PROJECT_MANAGER: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: Award, label: "Manager" },
    MEMBER: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: Fingerprint, label: "Member" },
    VIEWER: { bg: "bg-slate-50 border-slate-200", text: "text-slate-600", icon: CircleHelp, label: "Viewer" }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">Team Members</h1>
          <p className="text-xs text-slate-500">
            {memberCount} member{memberCount !== 1 ? "s" : ""} &middot; {activeCount} active &middot; {pendingCount} pending
          </p>
        </div>
        {canManageWorkspace ? (
          <button
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Invite Member</span>
          </button>
        ) : (
          <span className="inline-flex items-center space-x-1.5 text-slate-400 text-xs font-semibold px-4 py-2.5 border border-dashed border-slate-200 rounded-lg">
            <Lock className="h-3.5 w-3.5" />
            <span>Only admins can invite</span>
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-5 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-3 bg-slate-50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : members?.length === 0 ? (
        <div className="text-center p-12 bg-white border border-slate-200 rounded-xl space-y-3">
          <Users className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No members yet</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Invite team members to collaborate on projects and tasks.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 font-bold text-[10px] uppercase tracking-wider select-none">
                  <th className="py-3 px-5">Member</th>
                  <th className="py-3 px-5">Role</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
                {members?.map((m) => {
                  const style = roleStyles[m.role] || roleStyles.MEMBER;
                  const Icon = style.icon;
                  const isMe = user?.id === m.id;
                  return (
                    <tr key={m.id} className={`hover:bg-slate-50/50 transition ${isMe ? "bg-blue-50/30" : ""}`}>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center space-x-3">
                          <div className="relative h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200 select-none shrink-0">
                            {m.fullName[0].toUpperCase()}
                            {isMe && (
                              <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-blue-500 rounded-full border-2 border-white" />
                            )}
                          </div>
                          <div>
                            <span className="block font-bold text-slate-800">
                              {m.fullName}
                              {isMe && <span className="text-blue-600 text-[10px] font-semibold ml-1">(you)</span>}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">{m.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center space-x-1 px-2.2 py-0.5 border rounded-full text-[9px] uppercase font-bold tracking-wide ${style.bg} ${style.text}`}>
                          <Icon className="h-3 w-3 shrink-0" />
                          <span>{style.label}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        {m.status === "ACTIVE" ? (
                          <span className="text-emerald-600 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ring-emerald-600/10">
                            Active
                          </span>
                        ) : (
                          <span className="text-amber-600 bg-amber-50 text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ring-amber-600/10">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {m.role !== "WORKSPACE_OWNER" && canManageWorkspace ? (
                          <div className="flex items-center justify-end space-x-2">
                            <select
                              className="text-[10px] font-semibold bg-white border border-slate-200 rounded p-1 cursor-pointer"
                              value={m.role}
                              onChange={(e) => handleRoleChange(m.id, e.target.value as WorkspaceRole)}
                              disabled={updateRoleMutation.isPending}
                            >
                              <option value="WORKSPACE_ADMIN">Admin</option>
                              <option value="PROJECT_MANAGER">Manager</option>
                              <option value="MEMBER">Member</option>
                              <option value="VIEWER">Viewer</option>
                            </select>
                            <button
                              onClick={() => setRemoveTarget({ id: m.id, name: m.fullName })}
                              className="p-1 px-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded transition"
                              title="Remove member"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : m.role === "WORKSPACE_OWNER" ? (
                          <span className="text-[10px] text-slate-400 italic">Owner</span>
                        ) : (
                          <span className="text-[10px] text-slate-300 italic">No access</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-800">Invite Member</h3>
              </div>
              <button onClick={() => setIsInviteOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg transition">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">Send an invitation to join this workspace.</p>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Email</label>
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Role</label>
                <select
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as WorkspaceRole)}
                >
                  <option value="MEMBER">Member &mdash; Create and edit tasks</option>
                  <option value="PROJECT_MANAGER">Manager &mdash; Manage projects</option>
                  <option value="WORKSPACE_ADMIN">Admin &mdash; Manage workspace</option>
                  <option value="VIEWER">Viewer &mdash; Read-only</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold text-white transition disabled:opacity-50"
                >
                  {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {removeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 border border-red-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="text-base font-black text-slate-800">Remove Member</h3>
              </div>
              <button onClick={() => setRemoveTarget(null)} className="p-1 hover:bg-slate-100 rounded-lg transition">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              Remove <span className="font-bold">{removeTarget.name}</span> from this workspace?
            </p>
            <p className="text-xs text-slate-500 mb-6">
              They will lose access to all projects, tasks, and workspace data. This action can be undone by re-inviting them.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setRemoveTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => removeMutation.mutate(removeTarget.id)}
                disabled={removeMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold text-white transition disabled:opacity-50"
              >
                {removeMutation.isPending ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MembersListPage;