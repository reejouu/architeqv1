"use client";

export default function ProductMock() {
    return (
        <section className="relative w-full overflow-hidden bg-bgBase border-t-[4px] border-b-[4px] border-[#2c336c] py-20 flex flex-col items-center">
            <span className="eyebrow-label mb-8 reveal">See it in action</span>

            <div className="relative w-full max-w-[1280px] h-[600px] border-[4px] border-[#2c336c] bg-[#bf979e] overflow-hidden flex reveal shadow-[12px_12px_0_0_#2c336c]" style={{ transitionDelay: '200ms' }}>
                {/* Main Canvas Area */}
                <div className="w-full md:w-[65%] h-[400px] md:h-full relative p-8">
                    

                    {/* Mock Graph Elements aligned with percentages */}
                    <div className="absolute top-[15%] left-[20%] -translate-x-1/2 -translate-y-1/2 node-element border-nodeApi bg-[#bfb3ca] text-[10px] md:text-sm z-10 whitespace-nowrap">App Client</div>
                    <div className="absolute top-[35%] left-[45%] -translate-x-1/2 -translate-y-1/2 node-element border-nodePurple bg-[#ddb9ac] text-[#2c336c] text-[10px] md:text-sm z-10 whitespace-nowrap">GraphQL Layer</div>
                    <div className="absolute top-[55%] left-[75%] -translate-x-1/2 -translate-y-1/2 node-element border-nodeDb bg-[#c78caf] text-[10px] md:text-sm z-10 whitespace-nowrap">User DB</div>
                    <div className="absolute top-[65%] left-[25%] -translate-x-1/2 -translate-y-1/2 node-element border-nodePayment bg-[#bf979e] text-[10px] md:text-sm z-10 whitespace-nowrap">Stripe Sync</div>
                    <div className="absolute top-[80%] left-[55%] -translate-x-1/2 -translate-y-1/2 node-element border-nodeDashboard bg-[#bfb3ca] text-[10px] md:text-sm z-10 whitespace-nowrap">Admin Queue</div>

                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                        <line x1="20%" y1="15%" x2="45%" y2="35%" stroke="#2c336c" strokeWidth="3" strokeDasharray="6 6" />
                        <line x1="45%" y1="35%" x2="75%" y2="55%" stroke="#2c336c" strokeWidth="3" strokeDasharray="6 6" />
                        <line x1="45%" y1="35%" x2="25%" y2="65%" stroke="#2c336c" strokeWidth="3" strokeDasharray="6 6" />
                        <line x1="45%" y1="35%" x2="55%" y2="80%" stroke="#2c336c" strokeWidth="3" strokeDasharray="6 6" />
                    </svg>

                    <div className="absolute top-[20%] left-[20%] text-[#2c336c] opacity-50">
                        
                    </div>

                    <div className="absolute top-[10%] left-[70%] -translate-x-1/2 bg-accentPurple border-[3px] border-[#2c336c] text-[10px] md:text-xs font-bold text-[#2c336c] px-3 py-1 flex items-center justify-center animate-pulse shadow-[2px_2px_0_0_#2c336c] z-20">
                        Modules
                    </div>
                    <div className="absolute top-[80%] left-[15%] -translate-x-1/2 bg-[#ddb9ac] border-[3px] border-[#2c336c] text-[10px] md:text-xs font-bold text-[#2c336c] px-3 py-1 shadow-[2px_2px_0_0_#2c336c] z-20 whitespace-nowrap">
                        Dependencies
                    </div>
                </div>

                {/* Right Inspector Panel */}
                <div className="hidden md:block w-[35%] h-full bg-[#bfb3ca] border-l-[4px] border-[#2c336c] p-6 z-10 box-border">
                    <h4 className="text-[14px] font-black uppercase text-[#2c336c] tracking-wider mb-6 border-b-[3px] border-[#2c336c] pb-2">Node Inspector</h4>

                    <div className="mb-8 p-4 bg-accentCyan border-[3px] border-[#2c336c] shadow-[4px_4px_0_0_#2c336c]">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-accentBlue flex items-center justify-center border-[3px] border-[#2c336c] text-[#ddb9ac] font-black text-lg">A</div>
                            <h3 className="text-xl font-black text-[#2c336c]">API Gateway</h3>
                        </div>
                        <p className="text-sm font-bold text-[#2c336c]/80 mt-2">Type: Service · Last edited 2m ago</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h5 className="text-[12px] font-black text-[#2c336c] uppercase tracking-wider mb-2 border-b-[3px] border-[#2c336c] pb-1">Dependencies</h5>
                            <ul className="text-sm font-bold space-y-2 mt-2 text-[#2c336c]/80">
                                <li className="flex items-center gap-2">← Requires: <span className="text-[#2c336c] bg-accentPurple px-1 border-2 border-[#2c336c] inline-block">Auth Core</span></li>
                                <li className="flex items-center gap-2">→ Provides: <span className="text-[#2c336c] bg-[#ddb9ac] px-1 border-2 border-[#2c336c] inline-block">GraphQL Layer</span></li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="text-[12px] font-black text-[#2c336c] uppercase tracking-wider mb-2 border-b-[3px] border-[#2c336c] pb-1">Ownership</h5>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="w-10 h-10 bg-accentMagenta border-[3px] border-[#2c336c] flex items-center justify-center text-sm font-black text-[#2c336c] shadow-[2px_2px_0_0_#2c336c]">PK</div>
                                <div className="text-sm font-bold text-[#2c336c]">Priya Kumar<br /><span className="text-xs text-[#2c336c]/80">Backend Lead</span></div>
                            </div>
                        </div>

                        <div>
                            <h5 className="text-[12px] font-black text-[#2c336c] uppercase tracking-wider mb-2 border-b-[3px] border-[#2c336c] pb-1">Tech Stack</h5>
                            <div className="flex gap-3 mt-4">
                                <span className="text-xs font-bold border-[3px] border-[#2c336c] bg-accentCyan px-3 py-1 text-[#2c336c] shadow-[2px_2px_0_0_#2c336c]">Node.js</span>
                                <span className="text-xs font-bold border-[3px] border-[#2c336c] bg-[#ddb9ac] px-3 py-1 text-[#2c336c] shadow-[2px_2px_0_0_#2c336c]">Express</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
