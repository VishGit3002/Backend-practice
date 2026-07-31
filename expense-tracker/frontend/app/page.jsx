"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function Home() {
  const { isAuthenticated, isLoading, getUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-3 border-primary/30 border-t-primary animate-spin" />
        <p className="text-text-secondary text-sm">Loading SpendWise...</p>
      </div>
    </div>
  );
}
