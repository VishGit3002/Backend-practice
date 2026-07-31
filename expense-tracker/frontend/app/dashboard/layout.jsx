"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen gradient-bg">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col relative z-10 min-w-0">
          <Topbar onMenuToggle={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
