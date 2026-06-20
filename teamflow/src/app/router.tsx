import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

// Load Public Pages
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";

// Load Protected Pages
import DashboardOverviewPage from "../features/dashboard/pages/DashboardOverviewPage";
import ProjectsListPage from "../features/workspaces/pages/ProjectsListPage";
import MembersListPage from "../features/workspaces/pages/MembersListPage";
import WorkspaceSettingsPage from "../features/workspaces/pages/WorkspaceSettingsPage";
import ProjectDetailsPage from "../features/projects/pages/ProjectDetailsPage";
import NotificationsPage from "../features/notifications/pages/NotificationsPage";
import UserProfilePage from "../features/profile/pages/UserProfilePage";
import BillingPage from "../features/settings/pages/BillingPage";

// Admin Pages
import AdminDashboardPage from "../features/admin/pages/AdminDashboardPage";
import AdminUsersPage from "../features/admin/pages/AdminUsersPage";
import AdminWorkspacesPage from "../features/admin/pages/AdminWorkspacesPage";
import AdminAuditLogsPage from "../features/admin/pages/AdminAuditLogsPage";

const OutletFallback: React.FC = () => <Outlet />;

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth boundaries */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

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
            <Route path="/workspaces/:workspaceId/settings" element={<WorkspaceSettingsPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/settings" element={<BillingPage />} />

            {/* Platform Admin restricted gates */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/workspaces" element={<AdminWorkspacesPage />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
          </Route>
        </Route>

        {/* Global wildcard fallback routing redirects */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
