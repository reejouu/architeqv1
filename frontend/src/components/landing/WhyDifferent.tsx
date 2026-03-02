"use client";

export default function WhyDifferent() {
    return (
        <section className="relative w-full max-w-[1280px] mx-auto px-6 lg:px-20 py-[120px]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">

                <div className="flex flex-col items-center reveal w-full md:w-1/3" style={{ transitionDelay: '0ms' }}>
                    <div className="w-20 h-20 border-[4px] border-[#2c336c] bg-accentCyan flex items-center justify-center shadow-[6px_6px_0_0_#2c336c] mb-8 hover:-translate-y-1 transition-transform">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2c336c" strokeWidth="3">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <h3 className="text-[20px] font-black text-[#f3f3f2] mb-2 text-center">AI that understands systems</h3>
                    <p className="text-sm font-bold text-[#bfb3ca] text-center">Not just boxes and lines.</p>
                </div>

                <div className="flex flex-col items-center reveal w-full md:w-1/3" style={{ transitionDelay: '200ms' }}>
                    <div className="w-20 h-20 border-[4px] border-[#2c336c] bg-accentMagenta flex items-center justify-center shadow-[6px_6px_0_0_#2c336c] mb-8 hover:-translate-y-1 transition-transform" style={{ animationDelay: '1s' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2c336c" strokeWidth="3">
                            <rect x="2" y="2" width="20" height="8" />
                            <rect x="2" y="14" width="20" height="8" />
                            <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="4" />
                            <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="4" />
                        </svg>
                    </div>
                    <h3 className="text-[20px] font-black text-[#f3f3f2] mb-2 text-center">Unified planning &amp; ownership</h3>
                    <p className="text-sm font-bold text-[#bfb3ca] text-center">One canvas. One source of truth.</p>
                </div>

                <div className="flex flex-col items-center reveal w-full md:w-1/3" style={{ transitionDelay: '400ms' }}>
                    <div className="w-20 h-20 border-[4px] border-[#2c336c] bg-accentPurple flex items-center justify-center shadow-[6px_6px_0_0_#2c336c] mb-8 hover:-translate-y-1 transition-transform" style={{ animationDelay: '2s' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2c336c" strokeWidth="3">
                            <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                    </div>
                    <h3 className="text-[20px] font-black text-[#f3f3f2] mb-2 text-center">Build-ready architecture output</h3>
                    <p className="text-sm font-bold text-[#bfb3ca] text-center">Export. Share. Start building.</p>
                </div>

            </div>
        </section>
    );
}
