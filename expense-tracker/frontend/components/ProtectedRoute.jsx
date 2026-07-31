"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, getUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-3 border-primary/30 border-t-primary animate-spin" />
          <p className="text-text-secondary text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return children;
}
