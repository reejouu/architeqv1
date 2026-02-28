"use client";

export default function Navbar() {
    return (
        <nav className="sticky top-0 h-16 bg-[rgba(10,10,15,0.85)] mix-blend-normal backdrop-blur-md border-b border-[rgba(139,92,246,0.1)] z-50 flex items-center justify-between px-6 lg:px-20">
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-[1.5px] border-accentPurple rounded flex items-center justify-center shadow-[0_0_8px_rgba(139,92,246,0.4)]">
                    <div className="w-1.5 h-1.5 bg-accentPurple rounded-full"></div>
                </div>
                <span className="font-semibold text-lg text-white">Architeq</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
                <a href="#" className="text-sm text-textSecondary hover:text-white transition-colors">Product</a>
                <a href="#" className="text-sm text-textSecondary hover:text-white transition-colors">How it works</a>
                <a href="#" className="text-sm text-textSecondary hover:text-white transition-colors">Use cases</a>
                <a href="#" className="text-sm text-textSecondary hover:text-white transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
                <a href="#" className="hidden md:block text-sm text-textSecondary hover:text-white transition-colors">Log in</a>
                <button className="h-9 px-4 rounded-full bg-gradient-primary text-sm font-medium text-white hover:opacity-90 transition-opacity">
                    Get started
                </button>
            </div>
        </nav>
    );
}
