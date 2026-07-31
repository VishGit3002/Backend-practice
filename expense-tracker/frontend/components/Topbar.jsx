"use client";

import { HiBars3 } from "react-icons/hi2";
import useAuthStore from "@/store/authStore";

export default function Topbar({ onMenuToggle }) {
  const { user } = useAuthStore();

  return (
    <header className="glass-strong border-b border-border px-4 sm:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Hamburger for mobile */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-hover transition-all"
        >
          <HiBars3 className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {user?.name || "User"}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5 hidden sm:block">
            Here&apos;s what&apos;s happening with your expenses
          </p>
        </div>
      </div>
    </header>
  );
}
