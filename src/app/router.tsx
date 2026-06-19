import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

// Load Public Pages
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";

// Load Protected Pages
import DashboardOverviewPage from "../features/dashboard/pages/DashboardOverviewPage";
import ProjectsListPage from "../features/workspaces/pages/ProjectsListPage";
import MembersListPage from "../features/workspaces/pages/MembersListPage";
import ProjectDetailsPage from "../features/projects/pages/ProjectDetailsPage";
import NotificationsPage from "../features/notifications/pages/NotificationsPage";
import UserProfilePage from "../features/profile/pages/UserProfilePage";
import BillingPage from "../features/settings/pages/BillingPage";
import AdminDashboardPage from "../features/admin/pages/AdminDashboardPage";

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth boundaries */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected workspace console */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <DashboardLayout>
                <OutletFallback />
              </DashboardLayout>
            }
          >
            <Route path="/dashboard" element={<DashboardOverviewPage />} />
            <Route path="/workspaces/:workspaceId/projects" element={<ProjectsListPage />} />
            <Route path="/workspaces/:workspaceId/members" element={<MembersListPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/settings" element={<BillingPage />} />
            
            {/* Platform Admin restricted gates */}
            <Route path="/admin/users" element={<AdminDashboardPage />} />
          </Route>
        </Route>

        {/* Global wildcard fallback routing redirects */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// Simple React component mirroring react-router-dom Outlets to avoid import type differences
import { Outlet } from "react-router-dom";
const OutletFallback: React.FC = () => {
  return <Outlet />;
};

export default AppRouter;
