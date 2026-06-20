/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./app/queryClient";
import { AuthProvider } from "./context/AuthContext";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import AppRouter from "./app/router";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WorkspaceProvider>
          {/* Real-time elegant feedback toast triggers */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#0f172a",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "600",
              borderRadius: "10px",
              padding: "10px 16px"
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff"
              }
            }
          }}
        />
        <AppRouter />
        </WorkspaceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
