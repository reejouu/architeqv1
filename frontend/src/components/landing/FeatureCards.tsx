"use client";

export default function FeatureCards() {
    return (
        <section className="relative w-full max-w-[1280px] mx-auto px-6 lg:px-20 py-[120px]">
            <div className="flex flex-col mb-16 reveal">
                <h2 className="text-4xl lg:text-[48px] font-semibold mb-4 leading-tight">Everything your team needs</h2>
                <p className="text-xl text-textSecondary">Visual. Intelligent. Collaborative.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1 - AI Architecture Intelligence */}
                <div className="glass-card flex flex-col items-start reveal" style={{ transitionDelay: '0ms' }}>
                    <div className="h-20 w-full mb-6 relative">
                        <svg viewBox="0 0 100 100" className="w-10 h-10 absolute left-0 top-0 text-accentPurple overflow-visible">
                            <path d="M50 20 C20 20, 20 60, 50 80 C80 60, 80 20, 50 20 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                            <circle cx="50" cy="50" r="4" fill="currentColor" className="animate-ping" />
                        </svg>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">AI Architecture Intelligence</h3>
                    <p className="text-sm text-textSecondary">Describe your system. Get a complete graph.</p>
                </div>

                {/* Card 2 - Interactive Graph Canvas */}
                <div className="glass-card flex flex-col items-start reveal" style={{ transitionDelay: '100ms' }}>
                    <div className="h-20 w-full mb-6 relative">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute w-[3px] h-[3px] bg-white rounded-full"></div>
                            <div className="absolute w-full h-full animate-[spin_3s_linear_infinite] border border-[rgba(255,255,255,0.1)] rounded-full flex items-start justify-center text-accentBlue">
                                <div className="w-[6px] h-[6px] bg-accentBlue rounded-full -mt-[3px]"></div>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">Interactive Graph Canvas</h3>
                    <p className="text-sm text-textMuted">Drag, connect, and reshape your architecture.</p>
                </div>

                {/* Card 3 - Dependency Mapping */}
                <div className="glass-card flex flex-col items-start reveal" style={{ transitionDelay: '200ms' }}>
                    <div className="h-20 w-full mb-6 relative flex items-center">
                        <div className="w-3 h-3 border border-accentCyan rounded-sm bg-bgBase z-10"></div>
                        <div className="w-16 h-[1.5px] bg-[rgba(34,211,238,0.3)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 h-full w-4 bg-accentCyan animate-[slideRight_2s_infinite]"></div>
                        </div>
                        <div className="w-3 h-3 border border-white rounded-sm bg-bgBase z-10"></div>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">Dependency Mapping</h3>
                    <p className="text-sm text-textMuted">See what breaks when something changes.</p>
                </div>

                {/* Card 4 - Ownership Assignment */}
                <div className="glass-card flex flex-col items-start reveal lg:col-start-1 lg:ml-[170px]" style={{ transitionDelay: '300ms' }}>
                    <div className="h-20 w-full mb-6 relative">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-accentMagenta border-2 border-bgBase z-20"></div>
                            <div className="w-8 h-8 rounded-full bg-accentBlue border-2 border-bgBase z-10 scale-90"></div>
                            <div className="w-8 h-8 rounded-full bg-accentPurple border-2 border-bgBase scale-75"></div>
                        </div>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">Ownership Assignment</h3>
                    <p className="text-sm text-textMuted">Every module has an owner. Always.</p>
                </div>

                {/* Card 5 - Real-time Collaboration */}
                <div className="glass-card flex flex-col items-start reveal lg:col-start-2 lg:ml-[170px]" style={{ transitionDelay: '400ms' }}>
                    <div className="h-20 w-full mb-6 relative">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-accentPurple animate-pulse" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 3l7 18 2-7 7-2z" />
                        </svg>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">Real-time Collaboration</h3>
                    <p className="text-sm text-textMuted">Your team, live on the same canvas.</p>
                </div>
            </div>
        </section>
    );
}
