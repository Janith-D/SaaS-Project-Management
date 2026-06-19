import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../../../api/notificationApi";
import {
  Bell,
  CheckCircle,
  Clock,
  Mail,
  AlertTriangle,
  FolderDot,
  Fingerprint,
  MailOpen
} from "lucide-react";
import toast from "react-hot-toast";

export const NotificationsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: list, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationApi.getNotifications()
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Alert cleared.");
    }
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All workspace notifications dismissed.");
    }
  });

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "ASSIGNMENT":
        return { bg: "bg-blue-50 text-blue-700 border-blue-200", icon: Fingerprint };
      case "MENTION":
        return { bg: "bg-amber-50 text-amber-700 border-amber-200", icon: Mail };
      case "PROJECT":
        return { bg: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: FolderDot };
      default:
        return { bg: "bg-slate-100 text-slate-700 border-slate-200", icon: Bell };
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Ecosystem Alerts</h1>
          <p className="text-xs text-slate-500">Track and manage task allocations, comment mentions and deadline reminders.</p>
        </div>
        
        {list && list.some((n) => !n.read) && (
          <button
            onClick={() => markAllMutation.mutate()}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
          >
            Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-16 bg-slate-100 animate-pulse rounded-xl" />
          <div className="h-16 bg-slate-100 animate-pulse rounded-xl" />
        </div>
      ) : !list || list.length === 0 ? (
        <div className="text-center bg-white border border-slate-200 p-8 rounded-xl space-y-2">
          <MailOpen className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">All Quiet in Sandbox</p>
          <p className="text-xs text-slate-500">We will log notifications when teammates invite or assign items on boards.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((not) => {
            const config = getTypeStyle(not.type || "DEFAULT");
            const Icon = config.icon;
            return (
              <div
                key={not.id}
                className={`flex gap-4 p-4 border rounded-xl hover:shadow-xs transition duration-150 ${
                  not.read ? "bg-white border-slate-200 opacity-65" : "bg-indigo-50/20 border-indigo-200"
                }`}
              >
                <div className={`p-2 rounded-lg border h-10 w-10 flex items-center justify-center shrink-0 ${config.bg}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-extrabold text-slate-800">{not.title}</h4>
                    {!not.read && (
                      <button
                        onClick={() => markAsReadMutation.mutate(not.id)}
                        className="text-[10px] hover:bg-slate-100 p-1 rounded font-bold text-indigo-600"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{not.message}</p>
                  <span className="text-[9px] text-slate-400 font-mono block">
                    {new Date(not.createdAt).toLocaleDateString()} at {new Date(not.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default NotificationsPage;
