"use client";

export default function WhyDifferent() {
    return (
        <section className="relative w-full border-t-[2px] border-[var(--ink)] bg-[var(--cream)] py-[80px] overflow-hidden">
            <div className="section-inner">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    
                    {/* Col 1 */}
                    <div className="flex flex-col items-start reveal w-full md:border-r-[2px] md:border-[var(--ink)] px-[48px] py-[40px]" style={{ transitionDelay: '0ms' }}>
                        <div className="w-[48px] h-[48px] border-[2px] border-[var(--ink)] bg-[var(--purple)] flex items-center justify-center shadow-[3px_3px_0_0_var(--ink)] mb-8 hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[4px_4px_0_0_var(--ink)] transition-all">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </div>
                        <h3 className="mb-3">AI that understands systems</h3>
                        <p className="text-[14px] font-normal text-[var(--ink-soft)] leading-[1.6]">Not just boxes and lines. Context-aware generation.</p>
                    </div>

                    {/* Col 2 */}
                    <div className="flex flex-col items-start reveal w-full md:border-r-[2px] md:border-[var(--ink)] px-[48px] py-[40px]" style={{ transitionDelay: '200ms' }}>
                        <div className="w-[48px] h-[48px] border-[2px] border-[var(--ink)] bg-[var(--purple)] flex items-center justify-center shadow-[3px_3px_0_0_var(--ink)] mb-8 hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[4px_4px_0_0_var(--ink)] transition-all">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                <rect x="2" y="2" width="20" height="8" />
                                <rect x="2" y="14" width="20" height="8" />
                                <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="2" />
                                <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="2" />
                            </svg>
                        </div>
                        <h3 className="mb-3">Unified planning & ownership</h3>
                        <p className="text-[14px] font-normal text-[var(--ink-soft)] leading-[1.6]">One canvas. One source of truth for the team.</p>
                    </div>

                    {/* Col 3 */}
                    <div className="flex flex-col items-start reveal w-full px-[48px] py-[40px]" style={{ transitionDelay: '400ms' }}>
                        <div className="w-[48px] h-[48px] border-[2px] border-[var(--ink)] bg-[var(--purple)] flex items-center justify-center shadow-[3px_3px_0_0_var(--ink)] mb-8 hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[4px_4px_0_0_var(--ink)] transition-all">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                <path d="M12 5v14M5 12l7 7 7-7" />
                            </svg>
                        </div>
                        <h3 className="mb-3">Build-ready output</h3>
                        <p className="text-[14px] font-normal text-[var(--ink-soft)] leading-[1.6]">Export. Share. Start building immediately.</p>
                    </div>

                </div>
            </div>
        </section>
    );
}
