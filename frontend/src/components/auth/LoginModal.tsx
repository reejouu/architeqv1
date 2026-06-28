"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CurrentUser } from "@/hooks/useCurrentUser";

type Props = {
  open: boolean;
  onClose: () => void;
  onAuthenticated?: (user: CurrentUser) => void;
};

export default function LoginModal({ open, onClose, onAuthenticated }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
