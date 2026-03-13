"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const ROLES = ["Founder", "Product Manager", "Engineer", "Designer", "Other"] as const;
const TEAM_SIZES = ["Just me", "2-10", "11-50", "50+"] as const;
const INTENTS = ["Personal project", "Startup", "Client work", "Enterprise"] as const;

type Props = {
  open: boolean;
};

export default function OnboardingModal({ open }: Props) {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [intent, setIntent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!role || !teamSize) {
      setError("Please choose your role and team size.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, teamSize, intent: intent || undefined }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/canvas");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  const selectClass =
    "w-full bg-[#3a3650] border-[3px] border-[#4a4660] shadow-[3px_3px_0px_#1a1828] px-3 py-2.5 text-[13px] font-semibold text-[#e8e6f0] focus:outline-none focus:border-[#c78caf] transition-colors appearance-none rounded-none";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#636798]/30 backdrop-blur-[3px]" />

      <div className="relative w-full max-w-[360px] bg-[#2d2a3e] border-[3px] border-[#4a4660] shadow-[8px_8px_0px_#1a1828] overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[#9b7ec8] to-[#c78caf]" />

        <div className="px-6 pt-7 pb-8 space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#c78caf]">
              Architeq
            </p>
            <h2 className="text-xl font-black text-[#e8e6f0] tracking-tight">
              Personalize your workspace
            </h2>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#b0adbe]">
                Your role
              </label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className={selectClass}>
                <option value="">Select your role</option>
                {ROLES.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#b0adbe]">
                Team size
              </label>
              <select value={teamSize} onChange={(e) => setTeamSize(e.target.value)} className={selectClass}>
                <option value="">Select team size</option>
                {TEAM_SIZES.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#b0adbe]">
                Building this for{" "}
                <span className="text-[#6e6b80] lowercase font-semibold">(optional)</span>
              </label>
              <select value={intent} onChange={(e) => setIntent(e.target.value)} className={selectClass}>
                <option value="">Choose an option</option>
                {INTENTS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-[11px] font-bold text-[#e85d5d]">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#c78caf] border-[3px] border-[#4a4660] shadow-[4px_4px_0px_#1a1828] text-[13px] font-bold text-[#2d2a3e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1a1828] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#1a1828]"
            >
              {submitting ? "Saving..." : "Continue to canvas →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
