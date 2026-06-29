"use client";

import Link from "next/link";
import { MockNode } from "./MockNode";

export default function HeroSection() {
    return (
        <section 
            className="relative w-full flex items-center py-[80px] min-h-[calc(100vh-64px)] bg-[var(--cream)]"
            style={{ 
                backgroundImage: 'linear-gradient(to right, var(--stone) 1px, transparent 1px), linear-gradient(to bottom, var(--stone) 1px, transparent 1px)',
                backgroundSize: '40px 40px' 
            }}
        >
            <div className="section-inner flex flex-col lg:flex-row items-center w-full gap-[64px]">
                <div className="w-full lg:w-[55%] flex flex-col items-start reveal" style={{ transitionDelay: '100ms' }}>
                    <span className="mb-8 eyebrow-badge bg-[var(--green)] text-white">
                        AI Architecture Platform
                    </span>
                    <h1 className="text-[clamp(40px,5vw,68px)] font-black leading-[1.05] mb-8 text-[var(--ink)]">
                        Design your system <span className="bg-[var(--accent)] text-white px-2 py-0 inline-block">before</span> you build it
                    </h1>
                    <p className="text-[16px] text-[var(--ink-soft)] max-w-[480px] border-l-[3px] border-[var(--accent)] pl-4 leading-[1.65]">
                        Turn ideas into visual, build-ready architecture without writing a single line of boilerplate.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
                        <Link href="/canvas" className="w-full sm:w-auto">
                            <button className="btn-primary w-full">
                                Generate Architecture <span className="ml-2 font-black">→</span>
                            </button>
                        </Link>
                        <button className="btn-secondary w-full sm:w-auto">
                            View Demo
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-[32px] mt-10 text-[12px] text-[var(--ink-soft)] font-bold uppercase tracking-[0.1em]">
                        <span>500+ teams</span>
                        <span className="text-[var(--accent)]">&middot;</span>
                        <span>10k+ systems</span>
                        <span className="text-[var(--accent)]">&middot;</span>
                        <span>Real-time collab</span>
                    </div>
                </div>

                <div className="w-full lg:w-[45%] flex justify-center lg:justify-end reveal" style={{ transitionDelay: '300ms' }}>
                    <div className="relative w-full max-w-[480px] h-[400px] lg:h-[500px] bg-[var(--white)] border-[2px] border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] overflow-hidden" style={{ backgroundImage: 'radial-gradient(#C8C4BC 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
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
                `}
                            </style>
                            <path d="M-10 24 C 50 24, 50 50, 50 50" fill="none" stroke="var(--ink)" strokeWidth="0.8" className="edge-anim" />
                            <path d="M50 50 C 50 50, 83 40, 83 40" fill="none" stroke="var(--ink)" strokeWidth="0.8" className="edge-anim" />
                            <path d="M50 50 C 50 50, 83 80, 83 80" fill="none" stroke="var(--ink)" strokeWidth="0.8" className="edge-anim" />
                            <path d="M50 50 C 50 80, 50 80, 50 80" fill="none" stroke="var(--ink)" strokeWidth="0.8" className="edge-anim" />
                        </svg>

                        <MockNode label="Auth" type="core" color="#7b6fa8" top="24%" left="20%" priority="3" scale={0.7} />
                        <MockNode label="API Gateway" type="integration" color="#5e8f9e" top="50%" left="50%" priority="2" scale={0.8} />
                        <MockNode label="Payment" type="service" color="#6a9f7c" top="40%" left="83%" scale={0.7} />
                        <MockNode label="Dashboard" type="frontend" color="#b89550" top="80%" left="83%" priority="1" scale={0.7} />
                        <MockNode label="DB" type="database" color="#5d7ea8" top="80%" left="50%" scale={0.7} />
                    </div>
                </div>
            </div>
        </section>
    );
}
