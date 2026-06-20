import React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../../api/adminApi";
import { Shield, User, Clock } from "lucide-react";

export const AdminAuditLogsPage: React.FC = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["adminAuditLogs"],
    queryFn: () => adminApi.getAuditLogs()
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <Shield className="h-5 w-5 text-rose-600" />
          <span>Audit Logs</span>
        </h1>
        <p className="text-xs text-slate-500">Track administrative actions and system-wide events.</p>
      </div>

      {isLoading ? (
        <p className="text-xs text-slate-400">Loading audit logs...</p>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
          {(!logs || logs.length === 0) ? (
            <p className="text-slate-500 text-center py-8">No audit log entries found.</p>
          ) : (
            logs.map((log: any) => (
              <div key={log.id} className="border-b border-slate-800 pb-2 flex items-start space-x-3">
                <User className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300">
                    <span className="text-indigo-400 font-bold">{log.actorName || log.userName || "System"}</span>
                    : <span className="text-slate-400">{log.action || log.description}</span>
                  </p>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {new Date(log.createdAt || log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
export default AdminAuditLogsPage;
