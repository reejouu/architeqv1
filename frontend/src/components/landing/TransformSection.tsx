"use client";

export default function TransformSection() {
    return (
        <section className="relative w-full py-[80px] bg-[var(--purple)] flex flex-col items-center border-t-[2px] border-b-[2px] border-[var(--ink)]">
            <div className="section-inner flex flex-col items-center w-full">
                <div className="w-full max-w-[900px] flex flex-col items-center">
                    <span className="mb-16 reveal eyebrow-badge bg-[var(--stone)] text-[var(--ink)]">
                        From idea to system map
                    </span>
                    
                    <div className="relative w-full flex flex-col items-center justify-center reveal" style={{ transitionDelay: '200ms' }}>
                        {/* Prompt Card */}
                        <div className="text-2xl md:text-4xl lg:text-[40px] font-black text-[var(--ink)] bg-[var(--white)] border-[2px] border-[var(--ink)] px-[48px] py-[40px] shadow-[8px_8px_0_0_var(--ink)] text-center w-full max-w-[700px] z-10 leading-[1.05]">
                            <span className="opacity-50 font-bold text-[13px] block mb-2 text-left tracking-[0.08em] uppercase">Prompt</span>
                            "Build a SaaS for booking doctors"<span className="animate-pulse">|</span>
                        </div>
                        
                        {/* Dashed Connector */}
                        <div className="h-20 border-l-[2px] border-[var(--ink)] border-dashed -mt-2 z-0 relative">
                            {/* Arrowhead */}
                            <div className="absolute -bottom-2 -left-[7px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[var(--ink)]"></div>
                        </div>
                        
                        {/* 3-Step Flow */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
                            {/* Step 1 */}
                            <div className="bg-[var(--white)] border-[2px] border-[var(--ink)] shadow-[4px_4px_0_0_var(--ink)] p-[24px] pt-[28px] relative transition-all duration-200 hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_var(--ink)]">
                                <div className="absolute -top-3 -left-3 bg-[var(--green)] text-white w-[28px] h-[28px] border-[2px] border-[var(--ink)] flex items-center justify-center font-black text-[13px] shadow-[2px_2px_0px_var(--ink)] z-10">1</div>
                                <h3 className="mb-2">Describe</h3>
                                <p className="text-[14px] text-[var(--ink-soft)] font-normal leading-[1.65]">Type your product idea or requirements in plain English.</p>
                            </div>
                            {/* Step 2 */}
                            <div className="bg-[var(--white)] border-[2px] border-[var(--ink)] shadow-[4px_4px_0_0_var(--ink)] p-[24px] pt-[28px] relative transition-all duration-200 hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_var(--ink)]">
                                <div className="absolute -top-3 -left-3 bg-[var(--green)] text-white w-[28px] h-[28px] border-[2px] border-[var(--ink)] flex items-center justify-center font-black text-[13px] shadow-[2px_2px_0px_var(--ink)] z-10">2</div>
                                <h3 className="mb-2">AI Maps</h3>
                                <p className="text-[14px] text-[var(--ink-soft)] font-normal leading-[1.65]">Architeq instantly generates a complete system architecture.</p>
                            </div>
                            {/* Step 3 */}
                            <div className="bg-[var(--white)] border-[2px] border-[var(--ink)] shadow-[4px_4px_0_0_var(--ink)] p-[24px] pt-[28px] relative transition-all duration-200 hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_var(--ink)]">
                                <div className="absolute -top-3 -left-3 bg-[var(--green)] text-white w-[28px] h-[28px] border-[2px] border-[var(--ink)] flex items-center justify-center font-black text-[13px] shadow-[2px_2px_0px_var(--ink)] z-10">3</div>
                                <h3 className="mb-2">Edit & Export</h3>
                                <p className="text-[14px] text-[var(--ink-soft)] font-normal leading-[1.65]">Refine components in the canvas and export build-ready plans.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
