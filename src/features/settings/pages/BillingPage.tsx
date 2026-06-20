import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "../../../api/workspaceApi";
import { Workspace } from "../../../types/workspace.types";
import {
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  Briefcase,
  Layers,
  Users2,
  Lock,
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";

export const BillingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const activeWsId = localStorage.getItem("activeWorkspaceId") || "";

  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);

  // Load workspaces
  useEffect(() => {
    async function fetchWs() {
      try {
        const list = await workspaceApi.getWorkspaces();
        const found = list.find((w) => w.id === activeWsId) || list[0];
        if (found) setActiveWorkspace(found);
      } catch (err) {
        console.error(err);
      }
    }
    fetchWs();
  }, [activeWsId]);

  const updatePlanMutation = useMutation({
    mutationFn: (plan: "FREE" | "PRO" | "BUSINESS") =>
      workspaceApi.updateWorkspace(activeWsId, {
        name: activeWorkspace?.name || "Acme Corp Workspace",
        description: activeWorkspace?.description || "",
        plan
      }),
    onSuccess: (updated) => {
      setActiveWorkspace(updated);
      queryClient.invalidateQueries({ queryKey: ["workspaceStats", activeWsId] });
      toast.success(`Ecosystem upgraded! Workspace updated to: ${updated.plan}`);
    },
    onError: (e: any) => toast.error(e.message)
  });

  const handleUpgradePlan = (plan: "FREE" | "PRO" | "BUSINESS") => {
    updatePlanMutation.mutate(plan);
  };

  const plans = [
    {
      id: "FREE" as const,
      name: "FREE SANDBOX",
      price: "$0",
      description: "Simple agile trackers for single engineers or testing models.",
      icon: Layers,
      color: "border-slate-200 text-slate-800",
      buttonBg: "bg-slate-100 text-slate-800 hover:bg-slate-200",
      features: [
        "1 Workspace project limit",
        "Up to 5 Collaborators slots",
        "Interactive HTML5 Kanban Boards",
        "Mock files attachments",
        "CORS Sandbox Proxy"
      ]
    },
    {
      id: "PRO" as const,
      name: "ENTERPRISE PRO",
      price: "$15/mo",
      description: "Great for expanding agencies and collaborative developers.",
      icon: Zap,
      color: "border-blue-600 ring-2 ring-blue-550/10 text-slate-850",
      isPopular: true,
      buttonBg: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/10",
      features: [
        "Unlimited space projects",
        "Unlimited invited collaborators",
        "Interactive HTML5 Kanban Boards",
        "Mock files attachments (high size limits)",
        "Priority live email alerts support",
        "Spring Security JWT validation ready"
      ]
    },
    {
      id: "BUSINESS" as const,
      name: "AGILE BUSINESS",
      price: "$39/mo",
      description: "Maximum scale configuration incorporating advanced analytics logs.",
      icon: Briefcase,
      color: "border-amber-400 text-slate-800",
      buttonBg: "bg-slate-900 text-white hover:bg-slate-805",
      features: [
        "Unlimited everything",
        "Dedicated workspace switcher metrics",
        "Sub-tasks estimators dashboard",
        "Ecosystem activities burndown logs",
        "Auto-generate PDF project reports",
        "REST security composite tokens support"
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header section */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2 font-sans">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span>Workspace Upgrades</span>
          </h1>
          <p className="text-xs text-slate-500">
            Increase workspace quotas and unleash unlimited project nodes.
          </p>
        </div>

        {activeWorkspace && (
          <div className="bg-white border p-3 rounded-lg flex items-center space-x-3 text-xs leading-none">
            <span className="text-slate-400 font-bold block">Current tier:</span>
            <span className="bg-blue-50 text-blue-700 font-extrabold py-1 px-3 rounded border border-blue-100 uppercase tracking-wider text-[10px]">
              {activeWorkspace.plan}
            </span>
          </div>
        )}
      </div>

      {/* Usage bar card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex justify-between items-center text-xs select-none">
          <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[10px]">Resource quota utilization</span>
          <span className="text-slate-400 font-medium">
            Projects established:{" "}
            <strong className="text-slate-800">
              {activeWorkspace?.plan === "FREE" ? "1 / 1 slot used" : "2 / Unlimited slots"}
            </strong>
          </span>
        </div>
        
        {/* Underbar indicator */}
        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              activeWorkspace?.plan === "FREE" ? "bg-amber-500" : "bg-blue-600"
            }`}
            style={{ width: activeWorkspace?.plan === "FREE" ? "100%" : "35%" }}
          />
        </div>
        <p className="text-[10px] text-slate-400 leading-normal">
          {activeWorkspace?.plan === "FREE"
            ? "Your FREE plan allows 1 project listing. Complete your pending project goals or upgrade to expand workspace lanes."
            : "Project quota expands indefinitely on pro configurations."}
        </p>
      </div>

      {/* Grid comparing active rates cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((p) => {
          const isActivePlan = activeWorkspace?.plan === p.id;
          const CardIcon = p.icon;

          return (
            <div
              key={p.id}
              className={`bg-white border rounded-xl p-5 flex flex-col justify-between hover:shadow-lg transition duration-200 relative overflow-hidden ${p.color}`}
            >
              {p.isPopular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] font-extrabold py-1 px-4 rounded-bl-xl uppercase tracking-widest select-none shadow-sm animate-pulse">
                  Popular Solution
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center space-x-2.5">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 animate-pulse-subtle">
                    <CardIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block animate-none">
                    {p.name}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight block">
                    {p.price}
                  </span>
                  <p className="text-[11px] text-slate-500 leading-normal">{p.description}</p>
                </div>

                <div className="border-t border-slate-150 pt-3 mt-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                    What we encompass:
                  </span>
                  <ul className="space-y-2 text-[11px] text-slate-600 font-medium">
                    {p.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 leading-none">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 select-none">
                <button
                  type="button"
                  onClick={() => handleUpgradePlan(p.id)}
                  disabled={isActivePlan}
                  className={`w-full py-2.5 px-4 text-xs font-bold rounded-lg cursor-pointer transition text-center ${p.buttonBg} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isActivePlan ? "Active Workspace Tier" : "Assign Plan level"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default BillingPage;
