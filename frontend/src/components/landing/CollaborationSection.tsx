"use client";

export default function CollaborationSection() {
    return (
        <section className="relative w-full py-[80px] bg-[var(--stone)] border-t-[2px] border-[var(--ink)]">
            <div className="section-inner flex flex-col lg:flex-row items-center gap-[64px]">
                
                {/* Left Column (Text) */}
                <div className="w-full lg:w-[50%] reveal" style={{ transitionDelay: '0ms' }}>
                    <span className="mb-8 eyebrow-badge bg-[var(--accent)] text-white">
                        COMMENTS
                    </span>
                    <h2 className="text-4xl lg:text-[56px] font-black mb-6 leading-[1.05] text-[var(--ink)]">
                        Plan systems together in real time
                    </h2>
                    <p className="text-[16px] font-normal text-[var(--ink-soft)] mb-10 border-l-[3px] border-[var(--accent)] pl-4 leading-[1.65]">
                        Your whole team on one canvas. Leave comments, assign ownership, and resolve architecture decisions without leaving the tool.
                    </p>
                    <a href="#" className="btn-primary inline-flex !w-auto">Start collaborating <span className="ml-2 font-black">→</span></a>
                </div>

                {/* Right Column (Visual) */}
                <div className="w-full lg:w-[50%] bg-[var(--cream)] border-[2px] border-[var(--ink)] shadow-[8px_8px_0_0_var(--ink)] p-[40px] flex flex-col gap-[24px] reveal" style={{ transitionDelay: '200ms' }}>
                    
                    {/* Conversation Item 1 */}
                    <div className="flex gap-[16px] items-start w-full">
                        <div className="w-[32px] h-[32px] shrink-0 border-[2px] border-[var(--ink)] bg-[var(--purple)] text-white font-bold text-[12px] flex items-center justify-center uppercase shadow-[2px_2px_0_0_var(--ink)]">
                            PK
                        </div>
                        <div className="bg-[var(--white)] border-[2px] border-[var(--ink)] rounded-none shadow-[4px_4px_0_0_var(--ink)] p-[16px] text-[13px] font-bold text-[var(--ink)] flex-1">
                            Should we decouple the Auth service before scaling this?
                        </div>
                    </div>

                    {/* Conversation Item 2 */}
                    <div className="flex gap-[16px] items-start w-full pl-[24px]">
                        <div className="w-[32px] h-[32px] shrink-0 border-[2px] border-[var(--ink)] bg-[var(--accent)] text-white font-bold text-[12px] flex items-center justify-center uppercase shadow-[2px_2px_0_0_var(--ink)]">
                            MR
                        </div>
                        <div className="bg-[var(--white)] border-[2px] border-[var(--ink)] rounded-none shadow-[4px_4px_0_0_var(--ink)] p-[16px] text-[13px] font-bold text-[var(--ink)] flex-1">
                            Yes, let's extract it into a separate Lambda and add a Redis cache in front of it.
                        </div>
                    </div>

                    {/* Conversation Item 3 */}
                    <div className="flex gap-[16px] items-start w-full">
                        <div className="w-[32px] h-[32px] shrink-0 border-[2px] border-[var(--ink)] bg-[var(--green)] text-white font-bold text-[12px] flex items-center justify-center uppercase shadow-[2px_2px_0_0_var(--ink)]">
                            SJ
                        </div>
                        <div className="bg-[var(--white)] border-[2px] border-[var(--ink)] rounded-none shadow-[4px_4px_0_0_var(--ink)] p-[16px] text-[13px] font-bold text-[var(--ink)] flex-1">
                            Done. I've updated the canvas map to reflect the new Auth Lambda node.
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
