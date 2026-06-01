"use client";

import React, { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { Tv, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface TurnstileProtectionProps {
  onVerify: () => void;
}

export const TurnstileProtection: React.FC<TurnstileProtectionProps> = ({
  onVerify,
}) => {
  const [status, setStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { theme, systemTheme } = useTheme();

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Determine Turnstile theme based on next-themes
  const currentTheme = theme === "system" ? systemTheme : theme;
  const turnstileTheme = currentTheme === "light" ? "light" : "dark";

  const handleSuccess = async (token: string) => {
    setStatus("verifying");
    setErrorMessage(null);
    try {
      const success = await verifyTurnstileToken(token);
      if (success) {
        setStatus("success");
        setTimeout(() => {
          onVerify();
        }, 300);
      } else {
        setStatus("error");
        setErrorMessage("Verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Turnstile verification error:", err);
      setStatus("error");
      setErrorMessage("Connection timeout. Please refresh.");
    }
  };

  const handleError = () => {
    setStatus("error");
    setErrorMessage("Widget failed to load. Please disable ad-blockers.");
  };

  const handleReset = () => {
    setStatus("idle");
    setErrorMessage(null);
  };

  if (!siteKey) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center bg-background text-foreground">
        <AlertCircle className="w-6 h-6 text-destructive mb-4" />
        <p className="text-sm text-muted-foreground max-w-sm">
          Missing <code>NEXT_PUBLIC_TURNSTILE_SITE_KEY</code> environment
          variable.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background select-none">
      <div className="flex flex-col items-center gap-10 w-full max-w-sm px-6">
        {/* Minimal Logo */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-primary/10 p-4 rounded-2xl text-primary">
            <Tv className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            <span className="text-primary font-black">IPTV</span>
          </h1>
        </div>

        {/* Turnstile / Status Container */}
        <div className="min-h-[65px] flex items-center justify-center w-full">
          {status === "idle" && (
            <div className="animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both">
              <Turnstile
                siteKey={siteKey}
                onSuccess={handleSuccess}
                onError={handleError}
                onExpire={handleReset}
                options={{
                  theme: turnstileTheme,
                  size: "normal",
                }}
              />
            </div>
          )}

          {(status === "verifying" || status === "success") && (
            <div className="flex flex-col items-center gap-3 animate-in fade-in duration-300">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="text-sm font-medium text-muted-foreground">
                {status === "success" ? "Access Granted" : "Verifying..."}
              </span>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in-95 duration-300">
              <p className="text-sm text-destructive font-medium">
                {errorMessage}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="w-full text-xs font-semibold"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>

        {/* Subtle Footer */}
        <div className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-widest animate-in fade-in duration-700 delay-300 fill-mode-both">
          Protected by Cloudflare
        </div>
      </div>
    </div>
  );
};
