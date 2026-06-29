"use client";

export default function FeatureCards() {
    return (
        <section className="relative w-full bg-[var(--cream)] py-[80px] border-b-[2px] border-[var(--ink)]">
            <div className="section-inner">
                <div className="flex flex-col mb-16 reveal items-start text-left">
                    <h2 className="text-4xl lg:text-[56px] font-black mb-6 leading-none text-[var(--ink)]">Everything your team needs</h2>
                    <p className="text-[14px] font-bold text-[var(--ink-soft)] border-l-[3px] border-[var(--accent)] pl-4 uppercase tracking-[0.12em]">Visual. Intelligent. Collaborative.</p>
                </div>

                <div className="flex flex-col gap-[24px]">
                    {/* Top Row: 3 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full">
                        {/* Card 1 - AI Architecture Intelligence */}
                        <div className="brutal-card flex flex-col items-start reveal bg-[var(--purple)] text-white" style={{ transitionDelay: '0ms' }}>
                            <div className="h-10 w-full mb-6 relative">
                                <svg viewBox="0 0 24 24" className="w-[32px] h-[32px] absolute left-0 top-0 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <h3 className="mb-3 text-white">AI Architecture Intelligence</h3>
                            <p className="text-[14px] font-normal text-white opacity-90 leading-[1.6]">Describe your system in plain text. Get a complete, accurate system graph instantly.</p>
                        </div>

                        {/* Card 2 - Interactive Graph Canvas */}
                        <div className="brutal-card flex flex-col items-start reveal bg-[var(--white)] text-[var(--ink)]" style={{ transitionDelay: '100ms' }}>
                            <div className="h-10 w-full mb-6 relative">
                                <svg viewBox="0 0 24 24" className="w-[32px] h-[32px] absolute left-0 top-0 text-[var(--ink)]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
                                    <rect x="3" y="3" width="18" height="18" />
                                    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                                </svg>
                            </div>
                            <h3 className="mb-3 text-[var(--ink)]">Interactive Graph Canvas</h3>
                            <p className="text-[14px] font-normal text-[var(--ink-soft)] leading-[1.6]">Drag, connect, and reshape your architecture directly on an infinite canvas.</p>
                        </div>

                        {/* Card 3 - Dependency Mapping */}
                        <div className="brutal-card flex flex-col items-start reveal bg-[var(--accent)] text-white" style={{ transitionDelay: '200ms' }}>
                            <div className="h-10 w-full mb-6 relative">
                                <svg viewBox="0 0 24 24" className="w-[32px] h-[32px] absolute left-0 top-0 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
                                    <circle cx="18" cy="5" r="3" />
                                    <circle cx="6" cy="12" r="3" />
                                    <circle cx="18" cy="19" r="3" />
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                </svg>
                            </div>
                            <h3 className="mb-3 text-white">Dependency Mapping</h3>
                            <p className="text-[14px] font-normal text-white opacity-90 leading-[1.6]">See exactly what breaks when something changes across your entire stack.</p>
                        </div>
                    </div>

                    {/* Bottom Row: 2 columns, centered */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full max-w-[760px] mx-auto">
                        {/* Card 4 - Ownership Assignment */}
                        <div className="brutal-card flex flex-col items-start reveal bg-[var(--green)] text-white" style={{ transitionDelay: '300ms' }}>
                            <div className="h-10 w-full mb-6 relative">
                                <svg viewBox="0 0 24 24" className="w-[32px] h-[32px] absolute left-0 top-0 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <h3 className="mb-3 text-white">Ownership Assignment</h3>
                            <p className="text-[14px] font-normal text-white opacity-90 leading-[1.6]">Every module has an owner. Assign teams and track responsibility across your architecture.</p>
                        </div>

                        {/* Card 5 - Real-time Collaboration */}
                        <div className="brutal-card flex flex-col items-start reveal bg-[var(--stone)] text-[var(--ink)]" style={{ transitionDelay: '400ms' }}>
                            <div className="h-10 w-full mb-6 relative">
                                <svg viewBox="0 0 24 24" className="w-[32px] h-[32px] absolute left-0 top-0 text-[var(--ink)]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <h3 className="mb-3 text-[var(--ink)]">Real-time Collaboration</h3>
                            <p className="text-[14px] font-normal text-[var(--ink-soft)] leading-[1.6]">Work together with your team. Review and approve changes as a single unit.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
