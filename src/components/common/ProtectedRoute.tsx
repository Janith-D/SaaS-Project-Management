import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">
          Loading TeamFlow Workspace...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default ProtectedRoute;
