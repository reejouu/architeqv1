"use client";

export default function HeroSection() {
    return (
        <section className="relative min-h-[calc(100vh-64px)] flex items-center max-w-[1280px] mx-auto px-6 lg:px-20 py-20 lg:py-0">
            <div className="flex flex-col lg:flex-row items-center w-full gap-16">
                <div className="w-full lg:w-1/2 flex flex-col items-start reveal" style={{ transitionDelay: '100ms' }}>
                    <span className="eyebrow-label mb-4">AI Architecture Platform</span>
                    <h1 className="text-5xl lg:text-[72px] font-semibold leading-[1.05] tracking-tight mb-6 text-white outline-none">
                        Design your system <i className="text-gradient not-italic">before</i> you build it
                    </h1>
                    <p className="text-xl font-light text-textSecondary max-w-[420px] mb-10">
                        Turn ideas into visual, build-ready architecture
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        <button className="pill-primary">
                            Generate Architecture <span className="ml-2">→</span>
                        </button>
                        <button className="pill-ghost">
                            View Demo
                        </button>
                    </div>
                    <div className="flex items-center gap-3 text-[13px] text-textMuted">
                        <span>500+ teams</span>
                        <span>&middot;</span>
                        <span>10k+ systems generated</span>
                        <span>&middot;</span>
                        <span>Real-time collab</span>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex justify-center lg:justify-end reveal" style={{ transitionDelay: '300ms' }}>
                    <div className="relative w-full max-w-[600px] h-[400px] lg:h-[500px] animate-[floating_4s_ease-in-out_infinite]">
                        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />

                        <svg width="100%" height="100%" viewBox="0 0 600 500" className="overflow-visible">
                            <style>
                                {`
                  .edge-anim {
                    stroke-dasharray: 8 8;
                    animation: dash 20s linear infinite;
                  }
                  @keyframes dash {
                    to { stroke-dashoffset: -400; }
                  }
                  @keyframes floating {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                  }
                `}
                            </style>
                            <path d="M120 120 C 300 120, 300 250, 300 250" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeOpacity="0.6" className="edge-anim" />
                            <path d="M300 250 C 300 250, 500 200, 500 200" fill="none" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.6" className="edge-anim" />
                            <path d="M300 250 C 300 250, 500 400, 500 400" fill="none" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.6" className="edge-anim" />
                            <path d="M300 250 C 300 400, 300 400, 300 400" fill="none" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.6" className="edge-anim" />
                        </svg>

                        {/* HTML Nodes overlay */}
                        <div className="absolute top-[102px] left-[52px] w-[96px] h-[36px] bg-[rgba(20,20,40,0.9)] border-[1.5px] border-nodeAuth rounded-lg flex items-center justify-center text-[13px] font-medium text-[#F4F4F8] shadow-[0_0_12px_rgba(139,92,246,0.3)] hover:scale-105 hover:drop-shadow-[0_0_10px_#8B5CF6] transition-all cursor-pointer">
                            Auth
                            <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-bgBase bg-green-500" />
                        </div>

                        <div className="absolute top-[232px] left-[252px] w-[100px] h-[36px] bg-[rgba(20,20,40,0.9)] border-[1.5px] border-nodeApi rounded-lg flex items-center justify-center text-[13px] font-medium text-[#F4F4F8] shadow-[0_0_12px_rgba(59,130,246,0.3)] hover:scale-105 hover:drop-shadow-[0_0_10px_#3B82F6] transition-all cursor-pointer">
                            API Gateway
                            <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-bgBase bg-yellow-500" />
                        </div>

                        <div className="absolute top-[182px] left-[452px] w-[96px] h-[36px] bg-[rgba(20,20,40,0.9)] border-[1.5px] border-nodePayment rounded-lg flex items-center justify-center text-[13px] font-medium text-[#F4F4F8] shadow-[0_0_12px_rgba(217,70,239,0.3)] hover:scale-105 hover:drop-shadow-[0_0_10px_#D946EF] transition-all cursor-pointer">
                            Payment
                        </div>

                        <div className="absolute top-[382px] left-[452px] w-[96px] h-[36px] bg-[rgba(20,20,40,0.9)] border-[1.5px] border-nodeDashboard rounded-lg flex items-center justify-center text-[13px] font-medium text-[#F4F4F8] shadow-[0_0_12px_rgba(245,158,11,0.3)] hover:scale-105 hover:drop-shadow-[0_0_10px_#F59E0B] transition-all cursor-pointer">
                            Dashboard
                            <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-bgBase bg-purple-500" />
                        </div>

                        <div className="absolute top-[382px] left-[252px] w-[96px] h-[36px] bg-[rgba(20,20,40,0.9)] border-[1.5px] border-nodeDb rounded-lg flex items-center justify-center text-[13px] font-medium text-[#F4F4F8] shadow-[0_0_12px_rgba(34,211,238,0.3)] hover:scale-105 hover:drop-shadow-[0_0_10px_#22D3EE] transition-all cursor-pointer">
                            DB
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
