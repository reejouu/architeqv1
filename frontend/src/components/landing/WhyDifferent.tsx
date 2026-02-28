"use client";

export default function WhyDifferent() {
    return (
        <section className="relative w-full max-w-[1280px] mx-auto px-6 lg:px-20 py-[120px]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">

                <div className="flex flex-col items-center reveal w-full md:w-1/3" style={{ transitionDelay: '0ms' }}>
                    <div className="w-20 h-20 rounded-full border-2 border-[rgba(59,130,246,0.4)] flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)] mb-6 animate-[blob_7s_infinite]">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <h3 className="text-[20px] font-semibold text-white mb-2 text-center">AI that understands systems</h3>
                    <p className="text-sm text-textSecondary text-center">Not just boxes and lines.</p>
                </div>

                <div className="flex flex-col items-center reveal w-full md:w-1/3" style={{ transitionDelay: '200ms' }}>
                    <div className="w-20 h-20 rounded-full border-2 border-[rgba(139,92,246,0.4)] flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.15)] mb-6 animate-[blob_7s_infinite]" style={{ animationDelay: '1s' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5">
                            <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                            <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                            <line x1="6" y1="6" x2="6.01" y2="6" />
                            <line x1="6" y1="18" x2="6.01" y2="18" />
                        </svg>
                    </div>
                    <h3 className="text-[20px] font-semibold text-white mb-2 text-center">Unified planning &amp; ownership</h3>
                    <p className="text-sm text-textSecondary text-center">One canvas. One source of truth.</p>
                </div>

                <div className="flex flex-col items-center reveal w-full md:w-1/3" style={{ transitionDelay: '400ms' }}>
                    <div className="w-20 h-20 rounded-full border-2 border-[rgba(217,70,239,0.4)] flex items-center justify-center shadow-[0_0_30px_rgba(217,70,239,0.15)] mb-6 animate-[blob_7s_infinite]" style={{ animationDelay: '2s' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D946EF" strokeWidth="1.5">
                            <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                    </div>
                    <h3 className="text-[20px] font-semibold text-white mb-2 text-center">Build-ready architecture output</h3>
                    <p className="text-sm text-textSecondary text-center">Export. Share. Start building.</p>
                </div>

            </div>
        </section>
    );
}
