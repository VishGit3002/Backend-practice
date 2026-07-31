"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiEnvelope,
  HiLockClosed,
  HiUser,
  HiSparkles,
  HiBanknotes,
  HiEye,
  HiEyeSlash,
} from "react-icons/hi2";
import useAuthStore from "@/store/authStore";
import { useToast } from "@/components/Toast";

export default function SignupPage() {
  const { signup, isAuthenticated, error, clearError } = useAuthStore();
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    balance: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated, router]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast("Password must be at least 6 characters", "warning");
      return;
    }

    setSubmitting(true);
    const result = await signup({
      ...form,
      balance: form.balance ? Number(form.balance) : 0,
    });
    setSubmitting(false);

    if (result.success) {
      toast("Account created successfully! 🎉", "success");
      router.push("/dashboard");
    } else {
      toast(result.message, "error");
    }
  };

  return (
    <div className="auth-gradient flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
            <HiSparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              SpendWise
            </h1>
            <p className="text-xs text-text-secondary uppercase tracking-widest">
              Expense Tracker
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl border border-border p-8 shadow-2xl shadow-primary/5">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-foreground">
              Create your account
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Start tracking your expenses today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Full Name
              </label>
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-primary/50 input-glow transition-all duration-200"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email Address
              </label>
              <div className="relative">
                <HiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-primary/50 input-glow transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-primary/50 input-glow transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <HiEyeSlash className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Starting Balance */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Starting Balance (₹){" "}
                <span className="text-muted font-normal">— optional</span>
              </label>
              <div className="relative">
                <HiBanknotes className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="number"
                  value={form.balance}
                  onChange={(e) =>
                    setForm({ ...form, balance: e.target.value })
                  }
                  placeholder="0.00"
                  min="0"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-primary/50 input-glow transition-all duration-200"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-danger bg-danger-light rounded-lg px-4 py-2 border border-danger/20"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-primary/25 active:scale-[0.98]"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary-hover font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
