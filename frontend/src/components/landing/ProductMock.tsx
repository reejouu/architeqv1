"use client";

export default function ProductMock() {
    return (
        <section className="relative w-full overflow-hidden bg-bgSurface border-t border-b border-[rgba(139,92,246,0.1)] py-20 flex flex-col items-center">
            <span className="eyebrow-label mb-8 reveal">See it in action</span>

            <div className="relative w-full max-w-[1280px] h-[600px] border border-[rgba(139,92,246,0.2)] rounded-2xl bg-bgBase overflow-hidden flex reveal" style={{ transitionDelay: '200ms' }}>
                {/* Main Canvas Area */}
                <div className="w-full md:w-[65%] h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] relative p-8">
                    <div className="absolute top-[20%] left-[20%] text-white opacity-50">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                    </div>

                    {/* Mock Graph Elements */}
                    <div className="absolute top-20 left-32 node-element border-nodeApi">App Client</div>
                    <div className="absolute top-48 left-64 node-element border-nodePurple">GraphQL Layer</div>
                    <div className="absolute top-72 left-[400px] node-element border-nodeDb">User DB</div>
                    <div className="absolute top-80 left-[150px] node-element border-nodePayment">Stripe Sync</div>
                    <div className="absolute top-96 left-[300px] node-element border-nodeDashboard">Admin Queue</div>

                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                        <path d="M210 100 C 230 150, 270 170, 290 200" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M380 200 C 420 230, 440 280, 440 300" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M220 330 C 250 350, 280 370, 310 390" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="2" strokeDasharray="4 4" />
                    </svg>

                    <div className="absolute top-32 left-20 bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.3)] rounded-lg text-xs text-[#C4B5FD] px-3 py-1 animate-pulse">
                        Modules
                    </div>
                    <div className="absolute bottom-32 left-80 bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.3)] rounded-lg text-xs text-[#C4B5FD] px-3 py-1">
                        Dependencies
                    </div>
                </div>

                {/* Right Inspector Panel */}
                <div className="hidden md:block w-[35%] h-full bg-[rgba(20,20,40,0.8)] backdrop-blur-[20px] border-l border-[rgba(139,92,246,0.3)] p-6">
                    <h4 className="text-[12px] uppercase text-textMuted tracking-wider mb-6">Node Inspector</h4>

                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded bg-nodeApi bg-opacity-20 flex items-center justify-center border border-nodeApi text-nodeApi font-bold">A</div>
                            <h3 className="text-xl font-medium text-white">API Gateway</h3>
                        </div>
                        <p className="text-sm text-textMuted">Type: Service · Last edited 2m ago</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h5 className="text-xs text-textMuted uppercase tracking-wider mb-2 border-b border-[rgba(255,255,255,0.05)] pb-1">Dependencies</h5>
                            <ul className="text-sm space-y-2 mt-2 text-[#A1A1AA]">
                                <li className="flex items-center gap-2">← Requires: <span className="text-white">Auth Core</span></li>
                                <li className="flex items-center gap-2">→ Provides: <span className="text-white">GraphQL Layer</span></li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="text-xs text-textMuted uppercase tracking-wider mb-2 border-b border-[rgba(255,255,255,0.05)] pb-1">Ownership</h5>
                            <div className="flex items-center gap-3 mt-3">
                                <div className="w-8 h-8 rounded-full bg-accentPurple flex items-center justify-center text-xs text-white">PK</div>
                                <div className="text-sm text-textSecondary">Priya Kumar<br /><span className="text-xs text-textMuted">Backend Lead</span></div>
                            </div>
                        </div>

                        <div>
                            <h5 className="text-xs text-textMuted uppercase tracking-wider mb-2 border-b border-[rgba(255,255,255,0.05)] pb-1">Tech Stack</h5>
                            <div className="flex gap-2 mt-3">
                                <span className="text-xs border border-[rgba(255,255,255,0.1)] rounded px-2 py-1 text-textSecondary bg-[rgba(255,255,255,0.02)]">Node.js</span>
                                <span className="text-xs border border-[rgba(255,255,255,0.1)] rounded px-2 py-1 text-textSecondary bg-[rgba(255,255,255,0.02)]">Express</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
