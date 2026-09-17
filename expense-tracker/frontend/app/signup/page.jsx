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
  HiArrowRight,
} from "react-icons/hi2";
import useAuthStore from "@/store/authStore";
import { useToast } from "@/components/Toast";
import GoogleAuthButton from "@/components/GoogleAuthButton";

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
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background text-foreground selection:bg-primary/30">
      {/* Left: Visual Automotive Hero (Visible on lg screens) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-surface">
        {/* Background Image with Cinematic Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1920&auto=format&fit=crop"
            alt="High performance luxury hypercar"
            className="w-full h-full object-cover object-center brightness-[0.4] contrast-[1.1] scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/50" />
          <div className="absolute inset-0 bg-radial-at-c from-secondary/10 via-transparent to-transparent pointer-events-none" />
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
              Next-Gen Wealth Intelligence
            </p>
          </div>
        </div>

        {/* Bottom: Quote & Tag */}
        <div className="relative z-10 max-w-lg space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Precision Financial Architecture
          </div>
          <blockquote className="space-y-2">
            <p className="text-xl font-medium text-white/95 leading-relaxed tracking-tight">
              &ldquo;Engineering your personal balance sheet with the precision
              of high performance motorsport.&rdquo;
            </p>
            <footer className="text-xs text-text-secondary font-mono tracking-wide">
              Smart Budgets &bull; Automated Categorization &bull; Real-time Insights
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right: Auth Form Container */}
      <div className="flex flex-col justify-between p-6 sm:p-12 min-h-screen relative z-10 bg-background/95 backdrop-blur-sm overflow-y-auto">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/25">
              <HiSparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">SpendWise</span>
          </div>

          {/* Switch to Login */}
          <div className="ml-auto flex items-center gap-2 text-xs sm:text-sm text-text-secondary">
            <span className="hidden sm:inline">Already have an account?</span>
            <Link
              href="/login"
              className="font-medium text-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-primary/40 bg-surface/50 hover:bg-surface flex items-center gap-1.5"
            >
              Sign in
              <HiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Center: Form Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm mx-auto my-auto py-6"
        >
          {/* Header */}
          <div className="mb-6 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Create an account
            </h1>
            <p className="text-sm text-text-secondary mt-1.5">
              Enter your details below to begin tracking your expenses
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface/80 border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
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
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
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
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
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

            {/* Starting Balance */}
            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
                Starting Balance (₹){" "}
                <span className="text-muted lowercase font-normal">(optional)</span>
              </label>
              <div className="relative">
                <HiBanknotes className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="number"
                  value={form.balance}
                  onChange={(e) =>
                    setForm({ ...form, balance: e.target.value })
                  }
                  placeholder="0.00"
                  min="0"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface/80 border border-border text-foreground placeholder:text-muted text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Error */}
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
                  Creating account...
                </span>
              ) : (
                "Create Account with Email"
              )}
            </button>
          </form>

          {/* Symmetrical Shadcn Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] text-text-secondary uppercase tracking-widest font-mono shrink-0">
              or continue with
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Google Sign-Up */}
          <GoogleAuthButton text="signup_with" />
        </motion.div>
      </div>
    </div>
  );
}
