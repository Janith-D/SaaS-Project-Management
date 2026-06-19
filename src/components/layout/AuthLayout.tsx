import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Activity } from "lucide-react";

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50">
      {/* Visual branding section */}
      <div className="hidden lg:flex lg:col-span-5 bg-indigo-950 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle decorative mesh background */}
        <div className="absolute inset-0 bg-radial-[circle_at_top_right] from-indigo-900/40 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex items-center space-x-3 z-10">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-600/30">
            <Activity className="h-6 w-6 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight">TeamFlow</span>
        </div>

        <div className="space-y-6 z-10 max-w-sm">
          <h1 className="text-3xl font-bold tracking-tight leading-tight">
            Streamline tasks, projects, & workspace goals in real-time.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Unite your dev teams with an interactive Kanban board, real-time activity metrics, sub-task breakdowns, and role scopes. Designed specifically for robust Spring Boot development feedback.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-indigo-300 text-xs z-10 border-t border-indigo-900/60 pt-6">
          <ShieldCheck className="h-4 w-4" />
          <span>Security verified. Offline sandbox active.</span>
        </div>
      </div>

      {/* Main interactive form section */}
      <div className="lg:col-span-7 flex flex-col justify-center px-4 sm:px-12 lg:px-20 py-12">
        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
