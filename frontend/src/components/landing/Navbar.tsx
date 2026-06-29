"use client";

import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type Props = {
  onLoginClick: () => void;
};

export default function Navbar({ onLoginClick }: Props) {
    const router = useRouter();
    const { user, status, refetch } = useCurrentUser();
    const firstName = user?.name?.split(" ")[0] ?? "";

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        await refetch();
        router.push("/");
    }

    return (
        <nav className="sticky top-0 h-16 bg-[var(--stone)] border-b-[2px] border-[var(--ink)] z-50 px-12 transition-all">
            <div className="max-w-[1140px] mx-auto h-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo/Architeq%20Logo.png" alt="Architeq" className="w-8 h-8 object-contain" />
                    <span className="font-bold text-[var(--ink)] text-2xl uppercase tracking-wider">Architeq</span>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <a href="#" className="font-bold text-[var(--ink)] hover:underline hover:decoration-[2px] hover:underline-offset-4 transition-all uppercase text-[13px] tracking-[0.08em]">Product</a>
                    <a href="#" className="font-bold text-[var(--ink)] hover:underline hover:decoration-[2px] hover:underline-offset-4 transition-all uppercase text-[13px] tracking-[0.08em]">How it works</a>
                    <a href="#" className="font-bold text-[var(--ink)] hover:underline hover:decoration-[2px] hover:underline-offset-4 transition-all uppercase text-[13px] tracking-[0.08em]">Use cases</a>
                    <a href="#" className="font-bold text-[var(--ink)] hover:underline hover:decoration-[2px] hover:underline-offset-4 transition-all uppercase text-[13px] tracking-[0.08em]">Pricing</a>
                </div>
                <div className="flex items-center gap-4">
                    {status === "authenticated" && firstName && (
                        <span className="hidden md:inline-flex items-center px-4 py-2 bg-[var(--green)] border-[2px] border-[var(--ink)] text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[3px_3px_0px_var(--ink)]">
                            Hi, {firstName}
                        </span>
                    )}
                    {status === "authenticated" ? (
                        <button
                            onClick={handleLogout}
                            className="bg-[var(--purple)] text-white border-[2px] border-[var(--ink)] shadow-[3px_3px_0px_var(--ink)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-[#586495] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_var(--ink)] transition-all"
                        >
                            Log out
                        </button>
                    ) : (
                        <button
                            onClick={onLoginClick}
                            className="bg-[var(--accent)] text-white border-[2px] border-[var(--ink)] shadow-[3px_3px_0px_var(--ink)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_var(--ink)] transition-all"
                        >
                            Log in
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
