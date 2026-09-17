"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiEnvelope,
  HiLockClosed,
  HiSparkles,
  HiEye,
  HiEyeSlash,
  HiArrowRight,
} from "react-icons/hi2";
import useAuthStore from "@/store/authStore";
import { useToast } from "@/components/Toast";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function LoginPage() {
  const { login, isAuthenticated, error, clearError } = useAuthStore();
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
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
    setSubmitting(true);
    const result = await login(form);
    setSubmitting(false);

    if (result.success) {
      toast("Welcome back! 🎉", "success");
      router.push("/dashboard");
    } else {
      toast(result.message, "error");
    }
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background text-foreground selection:bg-primary/30">
      {/* Left: Visual Automotive Hero (Visible on lg screens) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-surface">
        {/* Background Image with Cinematic Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1920&auto=format&fit=crop"
            alt="Cinematic luxury sports car"
            className="w-full h-full object-cover object-center brightness-[0.4] contrast-[1.1] scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/50" />
          <div className="absolute inset-0 bg-radial-at-c from-primary/10 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Top: Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
            <HiSparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">
              SpendWise
            </span>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-mono">
              Performance Finance
            </p>
          </div>
        </div>

        {/* Bottom: Quote & Tag */}
        <div className="relative z-10 max-w-lg space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Financial Velocity & Precision
          </div>
          <blockquote className="space-y-2">
            <p className="text-xl font-medium text-white/95 leading-relaxed tracking-tight">
              &ldquo;Take the driver&apos;s seat of your wealth. Every expense
              tracked accelerates your journey toward financial freedom.&rdquo;
            </p>
            <footer className="text-xs text-text-secondary font-mono tracking-wide">
              Automated Tracking &bull; Real-time Analytics &bull; Cloud Sync
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right: Auth Form Container */}
      <div className="flex flex-col justify-between p-6 sm:p-12 min-h-screen relative z-10 bg-background/95 backdrop-blur-sm">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/25">
              <HiSparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">SpendWise</span>
          </div>

          {/* Switch to Signup */}
          <div className="ml-auto flex items-center gap-2 text-xs sm:text-sm text-text-secondary">
            <span className="hidden sm:inline">Don&apos;t have an account?</span>
            <Link
              href="/signup"
              className="font-medium text-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-primary/40 bg-surface/50 hover:bg-surface flex items-center gap-1.5"
            >
              Sign up
              <HiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Center: Form Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm mx-auto my-auto py-8"
        >
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-text-secondary mt-2">
              Enter your credentials below to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <HiEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface/80 border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-2.5 rounded-xl bg-surface/80 border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <HiEyeSlash className="w-4 h-4" />
                  ) : (
                    <HiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-danger bg-danger-light rounded-lg px-3.5 py-2 border border-danger/20"
              >
                {error}
              </motion.p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm hover:opacity-95 disabled:opacity-50 transition-all duration-200 shadow-md shadow-primary/20 active:scale-[0.99] mt-2 cursor-pointer"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In with Email"
              )}
            </button>
          </form>

          {/* Symmetrical Shadcn Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] text-text-secondary uppercase tracking-widest font-mono shrink-0">
              or continue with
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Google Sign-In */}
          <GoogleAuthButton text="signin_with" />
        </motion.div>
      </div>
    </div>
  );
}
