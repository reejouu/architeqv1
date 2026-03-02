"use client";

import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative min-h-[calc(100vh-64px)] flex items-center max-w-[1280px] mx-auto px-6 lg:px-20 py-20 lg:py-0">
            <div className="flex flex-col lg:flex-row items-center w-full gap-16">
                <div className="w-full lg:w-1/2 flex flex-col items-start reveal" style={{ transitionDelay: '100ms' }}>
                    <span className="eyebrow-label mb-6 text-[#2c336c]">AI Architecture Platform</span>
                    <h1 className="text-5xl lg:text-[72px] font-black leading-[1.05] tracking-tight mb-6 text-[#f3f3f2] outline-none">
                        Design your system <i className="text-gradient not-italic">before</i> you build it
                    </h1>
                    <p className="text-xl font-bold text-[#bfb3ca] max-w-[420px] mb-10 border-l-4 border-accentPurple pl-4">
                        Turn ideas into visual, build-ready architecture
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        <Link href="/canvas">
                            <button className="pill-primary">
                                Generate Architecture <span className="ml-2">→</span>
                            </button>
                        </Link>
                        <button className="pill-ghost">
                            View Demo
                        </button>
                    </div>
                    <div className="flex items-center gap-3 text-[13px] text-[#bfb3ca] font-bold">
                        <span>500+ teams</span>
                        <span>&middot;</span>
                        <span>10k+ systems generated</span>
                        <span>&middot;</span>
                        <span>Real-time collab</span>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex justify-center lg:justify-end reveal" style={{ transitionDelay: '300ms' }}>
                    <div className="relative w-full max-w-[600px] h-[400px] lg:h-[500px] bg-[#bf979e] border-4 border-[#2c336c] shadow-[12px_12px_0px_0px_#2c336c] animate-[floating_4s_ease-in-out_infinite] overflow-hidden">

                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 overflow-hidden">
                            <style>
                                {`
                  .edge-anim {
                    stroke-dasharray: 2 2;
                    animation: dash 20s linear infinite;
                  }
                  @keyframes dash {
                    to { stroke-dashoffset: -100; }
                  }
                  @keyframes floating {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                  }
                `}
                            </style>
                            <path d="M-10 24 C 50 24, 50 50, 50 50" fill="none" stroke="#2c336c" strokeWidth="0.8" className="edge-anim" />
                            <path d="M50 50 C 50 50, 83 40, 83 40" fill="none" stroke="#2c336c" strokeWidth="0.8" className="edge-anim" />
                            <path d="M50 50 C 50 50, 83 80, 83 80" fill="none" stroke="#2c336c" strokeWidth="0.8" className="edge-anim" />
                            <path d="M50 50 C 50 80, 50 80, 50 80" fill="none" stroke="#2c336c" strokeWidth="0.8" className="edge-anim" />
                        </svg>

                        <div className="absolute top-[24%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-[90px] h-[32px] md:w-[96px] md:h-[36px] bg-[#c78caf] rounded-full border-[3px] border-[#2c336c] flex items-center justify-center text-[11px] md:text-[13px] font-bold text-[#2c336c] shadow-[4px_4px_0_0_#2c336c] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#2c336c] transition-all cursor-pointer">
                            Auth
                            <div className="absolute -top-3 -right-3 w-6 h-6 border-[3px] border-[#2c336c] bg-[#10B981] rounded-full flex justify-center items-center text-[10px] font-black shadow-[2px_2px_0_0_#2c336c] text-[#2c336c]" title="P3">P3</div>
                        </div>

                        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[100px] h-[32px] md:w-[110px] md:h-[36px] bg-[#f3f3f2] rounded-full border-[3px] border-[#2c336c] flex items-center justify-center text-[11px] md:text-[13px] font-bold text-[#2c336c] shadow-[4px_4px_0_0_#2c336c] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#2c336c] transition-all cursor-pointer">
                            API Gateway
                            <div className="absolute -top-3 -right-3 w-6 h-6 border-[3px] border-[#2c336c] rounded-full bg-[#F59E0B] flex justify-center items-center text-[10px] font-black shadow-[2px_2px_0_0_#2c336c] text-[#2c336c]" title="P2">P2</div>
                        </div>

                        <div className="absolute top-[40%] left-[83%] -translate-x-1/2 -translate-y-1/2 w-[90px] h-[32px] md:w-[96px] md:h-[36px] bg-[#ddb9ac] rounded-full border-[3px] border-[#2c336c] flex items-center justify-center text-[11px] md:text-[13px] font-bold text-[#2c336c] shadow-[4px_4px_0_0_#2c336c] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#2c336c] transition-all cursor-pointer">
                            Payment
                        </div>

                        <div className="absolute top-[80%] left-[83%] -translate-x-1/2 -translate-y-1/2 w-[90px] h-[32px] md:w-[96px] md:h-[36px] bg-[#bfb3ca] rounded-full border-[3px] border-[#2c336c] flex items-center justify-center text-[11px] md:text-[13px] font-bold text-[#2c336c] shadow-[4px_4px_0_0_#2c336c] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#2c336c] transition-all cursor-pointer">
                            Dashboard
                            <div className="absolute -top-3 -right-3 w-6 h-6 border-[3px] border-[#2c336c] rounded-full bg-[#EF4444] flex justify-center items-center text-[10px] font-black shadow-[2px_2px_0_0_#2c336c] text-white" title="P1">P1</div>
                        </div>

                        <div className="absolute top-[80%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[90px] h-[32px] md:w-[96px] md:h-[36px] bg-[#ddb9ac] rounded-full border-[3px] border-[#2c336c] flex items-center justify-center text-[11px] md:text-[13px] font-bold text-[#2c336c] shadow-[4px_4px_0_0_#2c336c] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#2c336c] transition-all cursor-pointer">
                            DB
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
