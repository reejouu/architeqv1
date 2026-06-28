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
        // router.refresh() only re-fetches Server Component data — it doesn't
        // touch this component's own client-side state, so without this the
        // navbar kept showing "logged in" even after the cookie was cleared.
        await refetch();
        router.push("/");
    }

    return (
        <nav className="sticky top-0 h-20 bg-[#bf979e] border-b-[4px] border-borderBase z-50 flex items-center justify-between px-6 lg:px-20 transition-all">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accentPurple border-[3px] border-[#2c336c] flex items-center justify-center shadow-[2px_2px_0px_#2c336c]">
                    <div className="w-2.5 h-2.5 bg-[#2c336c] rounded-full"></div>
                </div>
                <span className="font-extrabold text-[#2c336c] text-xl uppercase tracking-wider">Architeq</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
                <a href="#" className="font-bold text-[#2c336c] hover:text-accentPurple transition-colors uppercase text-sm tracking-wider">Product</a>
                <a href="#" className="font-bold text-[#2c336c] hover:text-accentPurple transition-colors uppercase text-sm tracking-wider">How it works</a>
                <a href="#" className="font-bold text-[#2c336c] hover:text-accentPurple transition-colors uppercase text-sm tracking-wider">Use cases</a>
                <a href="#" className="font-bold text-[#2c336c] hover:text-accentPurple transition-colors uppercase text-sm tracking-wider">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
                {status === "authenticated" && firstName && (
                    <span className="hidden md:inline-flex items-center px-3 py-1 bg-[#ffe8a3] border-[3px] border-[#2c336c] shadow-[3px_3px_0px_#2c336c] text-xs font-bold uppercase tracking-wider text-[#2c336c] rounded-none">
                        Hi, {firstName}
                    </span>
                )}
                {status === "authenticated" ? (
                    <button
                        onClick={handleLogout}
                        className="px-5 py-2 bg-[#f7d9e0] border-[3px] border-[#2c336c] shadow-[4px_4px_0px_#2c336c] text-xs md:text-sm font-extrabold uppercase tracking-widest text-[#2c336c] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#2c336c] transition-all rounded-none"
                    >
                        Log out
                    </button>
                ) : (
                    <button
                        onClick={onLoginClick}
                        className="px-5 py-2 bg-accentPurple border-[3px] border-[#2c336c] shadow-[4px_4px_0px_#2c336c] text-xs md:text-sm font-extrabold uppercase tracking-widest text-[#2c336c] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#2c336c] transition-all rounded-none"
                    >
                        Log in / Sign up
                    </button>
                )}
            </div>
        </nav>
    );
}
