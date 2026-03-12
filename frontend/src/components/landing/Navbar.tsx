"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
    const { data: session } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
            <div className="flex items-center gap-6">
                {session ? (
                    <div className="relative hidden md:flex items-center gap-4" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                            className="flex items-center gap-3 font-bold text-[#2c336c] hover:text-accentPurple transition-colors uppercase text-sm tracking-wider focus:outline-none"
                        >
                            <span>Welcome, {session.user?.name}</span>
                            {/* {session.user?.image && (
                                <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full border-[2px] border-[#2c336c]" />
                            )} */}
                        </button>
                        
                        {isDropdownOpen && (
                            <div className="absolute top-12 right-0 w-40 bg-white border-2 border-[#2c336c] shadow-[4px_4px_0px_#2c336c] rounded flex flex-col overflow-hidden z-50">
                                <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="px-4 py-3 font-bold text-[#2c336c] hover:bg-[#f4f5f9] hover:text-accentPurple transition-colors uppercase text-xs tracking-wider border-b-2 border-borderBase flex justify-between items-center">
                                    Rename
                                </Link>
                                <button onClick={() => { setIsDropdownOpen(false); signOut(); }} className="px-4 py-3 font-bold text-left text-red-600 hover:bg-[#ffebee] transition-colors uppercase text-xs tracking-wider">
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={() => signIn('google')} className="hidden md:block font-bold text-[#2c336c] hover:text-accentPurple transition-colors uppercase text-sm tracking-wider">
                        Log in
                    </button>
                )}
                <Link href="/canvas">
                    <button className="pill-primary h-12">
                        Build Free
                    </button>
                </Link>
            </div>
        </nav>
    );
}
