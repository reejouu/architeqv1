"use client";

import Link from "next/link";

export default function FinalCTA() {
    return (
        <section className="relative w-full flex items-center justify-center py-[100px] bg-[var(--purple)] border-t-[2px] border-[var(--ink)] text-center overflow-hidden">
            <div className="section-inner z-10 w-full flex flex-col items-center">
                <div className="w-full max-w-[700px] mx-auto bg-[var(--white)] border-[2px] border-[var(--ink)] px-[48px] py-[64px] flex flex-col items-center text-center shadow-[8px_8px_0_0_var(--ink)]">
                    <h2 className="text-[48px] font-black leading-[1.05] text-[var(--ink)] mb-6">
                        Build systems with <span className="bg-[var(--accent)] text-white px-2 py-0 inline-block">clarity</span> from day one
                    </h2>
                    <p className="text-[16px] text-[var(--ink-soft)] max-w-[500px] mx-auto leading-[1.65]">
                        Join hundreds of engineering teams shipping better architecture without the boilerplate.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-[16px] mt-[32px] w-full">
                        <Link href="/canvas" className="w-full sm:w-auto">
                            <button className="btn-primary w-full text-[13px] px-8">
                                START BUILDING FOR FREE <span className="ml-2 font-black">→</span>
                            </button>
                        </Link>
                        <button className="btn-secondary w-full sm:w-auto text-[13px] px-8">
                            CONTACT SALES
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
