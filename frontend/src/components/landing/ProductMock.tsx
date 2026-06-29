"use client";

import { MockNode } from "./MockNode";

export default function ProductMock() {
    return (
        <section className="relative w-full bg-[var(--purple)] py-[80px] border-t-[2px] border-[var(--ink)] flex flex-col items-center">
            <div className="section-inner w-full flex flex-col items-center">
                <span className="mb-12 reveal eyebrow-badge bg-[var(--stone)] text-[var(--ink)]">
                    See it in action
                </span>

                <div className="relative w-full h-[600px] border-[2px] border-[var(--ink)] bg-[var(--white)] overflow-hidden flex reveal shadow-[8px_8px_0px_var(--ink)]" style={{ transitionDelay: '200ms', backgroundImage: 'radial-gradient(#C8C4BC 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    {/* Main Canvas Area */}
                    <div className="w-full md:w-[65%] h-full relative p-8">
                        <MockNode label="App Client" type="frontend" color="#b89550" top="90px" left="25%" status="Draft" />
                        <MockNode label="GraphQL Layer" type="core" color="#7b6fa8" top="230px" left="50%" status="Active" />
                        <MockNode label="Stripe Sync" type="integration" color="#5e8f9e" top="370px" left="25%" />
                        <MockNode label="User DB" type="database" color="#5d7ea8" top="370px" left="75%" />
                        <MockNode label="Admin Queue" type="queue" color="#a87090" top="510px" left="50%" />

                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                            <line x1="25%" y1="110px" x2="50%" y2="250px" stroke="var(--ink)" strokeWidth="2" strokeDasharray="6 6" />
                            <line x1="50%" y1="250px" x2="75%" y2="390px" stroke="var(--ink)" strokeWidth="2" strokeDasharray="6 6" />
                            <line x1="50%" y1="250px" x2="25%" y2="390px" stroke="var(--ink)" strokeWidth="2" strokeDasharray="6 6" />
                            <line x1="75%" y1="390px" x2="50%" y2="530px" stroke="var(--ink)" strokeWidth="2" strokeDasharray="6 6" />
                            <line x1="25%" y1="390px" x2="50%" y2="530px" stroke="var(--ink)" strokeWidth="2" strokeDasharray="6 6" />
                        </svg>

                        <div className="absolute top-[80px] left-[70%] -translate-x-1/2 bg-[var(--white)] border-[1.5px] border-dashed border-[var(--ink)] text-[10px] tracking-[0.1em] font-bold uppercase text-[var(--ink)] px-[10px] py-[4px] flex items-center justify-center animate-pulse z-20 transform rotate-2">
                            Modules
                        </div>
                    </div>

                    {/* Right Inspector Panel */}
                    <div className="hidden md:block w-[35%] h-full bg-[var(--stone)] border-l-[3px] border-[var(--ink)] p-[24px] z-10 box-border">
                        <h4 className="text-[10px] font-bold uppercase text-[var(--ink)] tracking-[0.15em] mb-4 border-b-[1px] border-[rgba(30,26,56,0.2)] pb-[8px]">Node Inspector</h4>

                        <div className="mb-6 p-5 bg-[var(--white)] border-[2px] border-[var(--ink)] shadow-[4px_4px_0_0_var(--ink)]">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 bg-[var(--purple)] flex items-center justify-center border-[2px] border-[var(--ink)] text-white font-bold text-xl">A</div>
                                <h3 className="text-xl font-bold text-[var(--ink)] tracking-tight">API Gateway</h3>
                            </div>
                            <p className="whitespace-nowrap overflow-hidden text-ellipsis text-[11px] font-normal text-[var(--ink-soft)] mt-2 uppercase tracking-[0.12em]">Type: Service · Last edited 2m ago</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h5 className="text-[10px] font-bold text-[var(--ink)] uppercase tracking-[0.15em] mb-[16px] border-b-[1px] border-[rgba(30,26,56,0.2)] pb-[8px]">Dependencies</h5>
                                <ul className="text-[14px] font-medium space-y-3 mt-3 text-[var(--ink)]">
                                    <li className="flex items-center gap-2 text-[12px]">← Requires: <span className="bg-[var(--purple)] px-[10px] py-[3px] border-[1.5px] border-[var(--ink)] inline-block uppercase text-[10px] font-bold text-white shadow-[2px_2px_0_0_var(--ink)]">Auth Core</span></li>
                                    <li className="flex items-center gap-2 text-[12px]">→ Provides: <span className="bg-[var(--purple)] px-[10px] py-[3px] border-[1.5px] border-[var(--ink)] inline-block uppercase text-[10px] font-bold text-white shadow-[2px_2px_0_0_var(--ink)]">GraphQL Layer</span></li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="text-[10px] font-bold text-[var(--ink)] uppercase tracking-[0.15em] mb-[16px] border-b-[1px] border-[rgba(30,26,56,0.2)] pb-[8px]">Ownership</h5>
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="w-10 h-10 bg-[var(--accent)] border-[2px] border-[var(--ink)] flex items-center justify-center text-sm font-bold text-white shadow-[2px_2px_0_0_var(--ink)]">PK</div>
                                    <div className="text-[13px] font-bold text-[var(--ink)] uppercase tracking-[0.12em]">Priya Kumar<br /><span className="text-[11px] font-normal text-[var(--ink-soft)]">Backend Lead</span></div>
                                </div>
                            </div>

                            <div>
                                <h5 className="text-[10px] font-bold text-[var(--ink)] uppercase tracking-[0.15em] mb-[16px] border-b-[1px] border-[rgba(30,26,56,0.2)] pb-[8px]">Tech Stack</h5>
                                <div className="flex gap-4 mt-4">
                                    <span className="text-[10px] font-bold border-[2px] border-[var(--ink)] bg-[var(--white)] px-3 py-1.5 text-[var(--ink)] shadow-[2px_2px_0_0_var(--ink)] uppercase tracking-[0.12em]">Node.js</span>
                                    <span className="text-[10px] font-bold border-[2px] border-[var(--ink)] bg-[var(--white)] px-3 py-1.5 text-[var(--ink)] shadow-[2px_2px_0_0_var(--ink)] uppercase tracking-[0.12em]">Express</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
