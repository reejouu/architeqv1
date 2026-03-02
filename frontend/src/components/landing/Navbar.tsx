"use client";

import Link from "next/link";

export default function Navbar() {
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
                <a href="#" className="hidden md:block font-bold text-[#2c336c] hover:text-accentPurple transition-colors uppercase text-sm tracking-wider">Log in</a>
                <Link href="/canvas">
                    <button className="pill-primary h-12">
                        Build Free
                    </button>
                </Link>
            </div>
        </nav>
    );
}
