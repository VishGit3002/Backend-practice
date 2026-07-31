"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiHome,
  HiCurrencyRupee,
  HiArrowRightOnRectangle,
  HiSparkles,
  HiUser,
  HiXMark,
  HiCalendarDays,
  HiEnvelope,
  HiChevronUp,
} from "react-icons/hi2";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: HiHome },
  { href: "/dashboard/expenses", label: "Expenses", icon: HiCurrencyRupee },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (onClose) onClose();
  };

  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <>
      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          glass-strong flex flex-col border-r border-border py-6 px-4 z-50
          fixed top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header row: Logo + mobile close button */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3"
            onClick={handleNavClick}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <HiSparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                SpendWise
              </h1>
              <p className="text-[10px] text-text-secondary uppercase tracking-widest">
                Expense Tracker
              </p>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-hover transition-all"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={handleNavClick}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-primary bg-primary-light"
                      : "text-text-secondary hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary"
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                      }}
                    />
                  )}
                  <Icon className="w-5 h-5" />
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Profile section at bottom */}
        <div className="relative mt-125.5">
          {/* Profile popover */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="absolute bottom-full left-0 right-0 mb-2 glass-strong rounded-xl border border-border shadow-2xl shadow-primary/10 overflow-hidden"
              >
                {/* Profile header */}
                <div className="px-4 pt-4 pb-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/20">
                      <HiUser className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-text-secondary truncate">
                        {user?.email || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile info */}
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <HiEnvelope className="w-4 h-4 text-muted flex-shrink-0" />
                    <span className="text-text-secondary truncate">
                      {user?.email || "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <HiCalendarDays className="w-4 h-4 text-muted flex-shrink-0" />
                    <div>
                      <span className="text-text-secondary">Joined </span>
                      <span className="text-foreground font-medium">
                        {createdAt}
                      </span>
                    </div>
                  </div>
                  {user?.balance !== undefined && (
                    <div className="flex items-center gap-3 text-sm">
                      <HiCurrencyRupee className="w-4 h-4 text-muted flex-shrink-0" />
                      <div>
                        <span className="text-text-secondary">Balance </span>
                        <span className="text-success font-medium">
                          ₹{user.balance.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Logout */}
                <div className="px-3 pb-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger/80 hover:text-danger hover:bg-danger-light transition-all duration-200"
                  >
                    <HiArrowRightOnRectangle className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Profile trigger button */}
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface-hover transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/20 flex-shrink-0">
              <HiUser className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] text-text-secondary truncate">
                {user?.email || ""}
              </p>
            </div>
            <HiChevronUp
              className={`w-4 h-4 text-muted transition-transform duration-200 flex-shrink-0 ${
                profileOpen ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>
      </aside>
    </>
  );
}
