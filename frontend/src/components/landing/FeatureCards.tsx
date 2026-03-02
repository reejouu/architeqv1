"use client";

export default function FeatureCards() {
    return (
        <section className="relative w-full max-w-[1280px] mx-auto px-6 lg:px-20 py-[120px]">
            <div className="flex flex-col mb-16 reveal">
                <h2 className="text-4xl lg:text-[48px] font-black mb-4 leading-tight text-[#f3f3f2]">Everything your team needs</h2>
                <p className="text-xl font-bold text-[#bfb3ca] border-l-4 border-accentPurple pl-4">Visual. Intelligent. Collaborative.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1 - AI Architecture Intelligence */}
                <div className="brutal-card flex flex-col items-start reveal" style={{ transitionDelay: '0ms' }}>
                    <div className="h-20 w-full mb-6 relative">
                        <svg viewBox="0 0 100 100" className="w-12 h-12 absolute left-0 top-0 text-[#2c336c] overflow-visible drop-shadow-[4px_4px_0_#c78caf]">
                            <path d="M50 20 C20 20, 20 60, 50 80 C80 60, 80 20, 50 20 Z" fill="#bfb3ca" stroke="currentColor" strokeWidth="4" />
                            <circle cx="50" cy="50" r="8" fill="#c78caf" stroke="currentColor" strokeWidth="3" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-black text-[#2c336c] mb-2">AI Architecture Intelligence</h3>
                    <p className="text-base font-medium text-[#2c336c]/80">Describe your system. Get a complete graph.</p>
                </div>

                {/* Card 2 - Interactive Graph Canvas */}
                <div className="brutal-card flex flex-col items-start reveal" style={{ transitionDelay: '100ms' }}>
                    <div className="h-20 w-full mb-6 relative">
                        <div className="relative w-12 h-12 flex items-center justify-center border-[3px] border-[#2c336c] bg-[#bfb3ca] shadow-[4px_4px_0_0_#2c336c] rounded-full">
                            <div className="absolute w-[6px] h-[6px] bg-[#2c336c] rounded-full"></div>
                        </div>
                    </div>
                    <h3 className="text-xl font-black text-[#2c336c] mb-2">Interactive Graph Canvas</h3>
                    <p className="text-base font-medium text-[#2c336c]/80">Drag, connect, and reshape your architecture.</p>
                </div>

                {/* Card 3 - Dependency Mapping */}
                <div className="brutal-card flex flex-col items-start reveal" style={{ transitionDelay: '200ms' }}>
                    <div className="h-20 w-full mb-6 relative flex items-center">
                        <div className="w-6 h-6 border-[3px] border-[#2c336c] bg-[#10B981] shadow-[2px_2px_0_0_#2c336c] z-10"></div>
                        <div className="w-16 h-[4px] bg-[#2c336c] relative overflow-hidden">
                        </div>
                        <div className="w-6 h-6 border-[3px] border-[#2c336c] bg-[#EF4444] shadow-[2px_2px_0_0_#2c336c] z-10"></div>
                    </div>
                    <h3 className="text-xl font-black text-[#2c336c] mb-2">Dependency Mapping</h3>
                    <p className="text-base font-medium text-[#2c336c]/80">See what breaks when something changes.</p>
                </div>

                {/* Card 4 - Ownership Assignment */}
                <div className="brutal-card flex flex-col items-start reveal lg:col-start-1 lg:ml-[170px]" style={{ transitionDelay: '300ms' }}>
                    <div className="h-20 w-full mb-6 relative">
                        <div className="flex -space-x-4">
                            <div className="w-12 h-12 rounded-full border-[3px] border-[#2c336c] bg-accentMagenta flex items-center justify-center font-bold text-[#2c336c] z-20">EN</div>
                            <div className="w-12 h-12 rounded-full border-[3px] border-[#2c336c] bg-accentBlue flex items-center justify-center font-bold text-[#ddb9ac] z-10">SA</div>
                            <div className="w-12 h-12 rounded-full border-[3px] border-[#2c336c] bg-accentPurple flex items-center justify-center font-bold text-[#2c336c]">DE</div>
                        </div>
                    </div>
                    <h3 className="text-xl font-black text-[#2c336c] mb-2">Ownership Assignment</h3>
                    <p className="text-base font-medium text-[#2c336c]/80">Every module has an owner. Always.</p>
                </div>

                {/* Card 5 - Real-time Collaboration */}
                <div className="brutal-card flex flex-col items-start reveal lg:col-start-2 lg:ml-[170px]" style={{ transitionDelay: '400ms' }}>
                    <div className="h-20 w-full mb-6 relative">
                        <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#2c336c] drop-shadow-[4px_4px_0_#636798]" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M3 3l7 18 2-7 7-2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-black text-[#2c336c] mb-2">Real-time Collaboration</h3>
                    <p className="text-base font-medium text-[#2c336c]/80">Your team, live on the same canvas.</p>
                </div>
            </div>
        </section>
    );
}
