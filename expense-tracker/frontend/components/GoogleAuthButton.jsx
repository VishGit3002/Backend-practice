"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import useAuthStore from "@/store/authStore";
import { useToast } from "@/components/Toast";
import { HiInformationCircle } from "react-icons/hi2";

export default function GoogleAuthButton({ text = "continue_with" }) {
  const { googleLogin } = useAuthStore();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      toast("No credential received from Google", "error");
      return;
    }

    setLoading(true);
    const result = await googleLogin(credentialResponse.credential);
    setLoading(false);

    if (result.success) {
      toast("Welcome! Signed in with Google 🎉", "success");
      router.push("/dashboard");
    } else {
      toast(result.message || "Failed to sign in with Google", "error");
    }
  };

  const handleError = () => {
    toast("Google authentication was cancelled or failed", "error");
  };

  if (!clientId) {
    return (
      <div className="w-full p-3 rounded-xl bg-surface border border-border/80 flex items-start gap-2.5 text-xs text-text-secondary">
        <HiInformationCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-foreground">Google Login Setup:</span> Add{" "}
          <code className="text-primary bg-primary-light px-1 py-0.5 rounded text-[11px]">
            NEXT_PUBLIC_GOOGLE_CLIENT_ID
          </code>{" "}
          in your <code className="text-foreground">frontend/.env.local</code> to activate Google Sign-In.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {loading ? (
        <div className="w-full py-3 px-4 rounded-xl bg-surface border border-border flex items-center justify-center gap-2 text-sm text-text-secondary">
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          Verifying with Google...
        </div>
      ) : (
        <div className="w-full flex justify-center [&>div]:w-full [&_iframe]:!w-full [&_iframe]:!mx-auto">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            theme="filled_black"
            shape="rectangular"
            size="large"
            width="384"
            text={text}
          />
        </div>
      )}
    </div>
  );
}
