"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";

export default function ProfilePage() {
    const { data: session, status, update } = useSession();
    const [name, setName] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        } else if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session, status, router]);

    const handleSave = async () => {
        if (name.trim()) {
            await update({ name: name.trim() });
            router.push("/");
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#fdfdfd] text-[#2c336c] font-sans flex items-center justify-center">
                <p className="font-bold uppercase tracking-widest animate-pulse">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfdfd] text-[#2c336c] font-sans">
            <Navbar />
            <main className="max-w-md mx-auto mt-20 p-6 bg-white border-4 border-[#2c336c] shadow-[8px_8px_0px_#2c336c] rounded-lg">
                <h1 className="text-2xl font-extrabold uppercase tracking-wider mb-6">Profile Settings</h1>
                <div className="mb-6">
                    <label className="block text-sm font-bold uppercase tracking-wider mb-2">Username</label>
                    <input 
                        className="w-full h-12 px-4 border-2 border-borderBase font-bold rounded bg-[#f4f5f9] focus:outline-none focus:border-accentPurple focus:ring-2 focus:ring-accentPurple transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>
                <button 
                    onClick={handleSave}
                    className="w-full h-12 bg-accentPurple text-white font-bold uppercase tracking-wider border-2 border-[#2c336c] shadow-[4px_4px_0px_#2c336c] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all rounded"
                >
                    Save & Return
                </button>
            </main>
        </div>
    );
}
