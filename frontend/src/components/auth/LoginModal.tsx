"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { CurrentUser } from "@/hooks/useCurrentUser";

type Props = {
  open: boolean;
  onClose: () => void;
  onAuthenticated?: (user: CurrentUser) => void;
};

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  google_email_taken: "This email is already registered with a password. Sign in with your password instead.",
  google_state_mismatch: "That Google sign-in link expired. Please try again.",
  google_auth_failed: "Google sign-in failed. Please try again.",
};

export default function LoginModal({ open, onClose, onAuthenticated }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("error");
    if (code) setError(GOOGLE_ERROR_MESSAGES[code] || "Something went wrong. Please try again.");
  }, [searchParams]);

  if (!open) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "signup" ? { name, email, password } : { email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      const user = data.user as CurrentUser;
      if (onAuthenticated) {
        onAuthenticated(user);
      } else if (!user.onboardingComplete) {
        router.push("/?modal=onboarding");
      } else {
        router.push("/canvas");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full bg-[#3a3650] border-[3px] border-[#4a4660] shadow-[3px_3px_0px_#1a1828] px-3 py-2.5 text-[13px] font-semibold text-[#e8e6f0] placeholder:text-[#6e6b80] focus:outline-none focus:border-[#c78caf] transition-colors rounded-none";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#636798]/30 backdrop-blur-[3px]" onClick={onClose} />

      <div className="relative w-full max-w-[360px] bg-[#2d2a3e] border-[3px] border-[#4a4660] shadow-[8px_8px_0px_#1a1828] overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[#c78caf] to-[#9b7ec8]" />

        <div className="px-6 pt-7 pb-8 space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#c78caf]">
              Architeq
            </p>
            <h2 className="text-xl font-black text-[#e8e6f0] tracking-tight">
              {mode === "login" ? "Sign in to your workspace" : "Create your workspace"}
            </h2>
          </div>

          <a
            href="/api/auth/google/start"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#f3f3f2] border-[3px] border-[#4a4660] shadow-[4px_4px_0px_#1a1828] text-[13px] font-bold text-[#2d2a3e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1a1828] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </a>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#4a4660]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6e6b80]">or continue with email</span>
            <div className="flex-1 h-px bg-[#4a4660]" />
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              minLength={8}
              required
            />

            {error && <p className="text-[11px] font-bold text-[#e85d5d]">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#f3f3f2] border-[3px] border-[#4a4660] shadow-[4px_4px_0px_#1a1828] text-[13px] font-bold text-[#2d2a3e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1a1828] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50"
            >
              {submitting ? "Please wait..." : mode === "login" ? "Sign in" : "Sign up"}
            </button>
          </form>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError(null);
              }}
              className="text-[12px] font-semibold text-[#c78caf] hover:text-[#e8e6f0] transition-colors"
            >
              {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
            <button
              onClick={onClose}
              className="text-[12px] font-semibold text-[#6e6b80] hover:text-[#c78caf] transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
