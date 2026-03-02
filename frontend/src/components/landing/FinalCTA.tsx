"use client";

import Link from "next/link";

export default function FinalCTA() {
    return (
        <section className="relative w-full min-h-[500px] flex items-center justify-center py-32 text-center reveal overflow-hidden border-t-[4px] border-[#2c336c] bg-transparent">

            <div className="relative z-10 px-6 max-w-[800px] mx-auto bg-[#bf979e] border-[4px] border-[#2c336c] p-12 shadow-[12px_12px_0_0_#2c336c]">
                <h2 className="text-5xl lg:text-[64px] font-black leading-tight text-[#f3f3f2] mb-12">
                    Build systems with <i className="text-[#2c336c] not-italic">clarity</i> from day one
                </h2>
                <Link href="/canvas">
                    <button className="pill-primary h-14 px-8 text-[18px] mx-auto mb-6">
                        Start with your idea <span className="ml-2 font-black">→</span>
                    </button>
                </Link>
                <div className="text-[14px] font-bold text-[#f3f3f2] flex items-center justify-center gap-3 mt-4">
                    <span className="border-b-[2px] border-[#f3f3f2]/30">No credit card required</span>
                    <span className="text-[#2c336c] font-black">&middot;</span>
                    <span className="border-b-[2px] border-[#f3f3f2]/30">Setup in 2 minutes</span>
                </div>
            </div>
        </section>
    );
}
