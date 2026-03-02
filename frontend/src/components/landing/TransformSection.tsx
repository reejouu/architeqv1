"use client";

export default function TransformSection() {
    return (
        <section className="relative w-full py-[120px] bg-bgSurface flex flex-col items-center border-t-[4px] border-b-[4px] border-[#2c336c]">
            <span className="eyebrow-label mb-16 reveal border-[#2c336c] text-[#2c336c]">From idea to system map</span>
            <div className="relative w-full max-w-[800px] h-[400px] flex items-center justify-center reveal" style={{ transitionDelay: '200ms' }}>
                <div className="text-3xl lg:text-[40px] font-black text-[#2c336c] mb-20 bg-accentCyan border-[4px] border-[#2c336c] px-6 py-3 shadow-[8px_8px_0_0_#2c336c]">
                    Build a SaaS for booking doctors<span className="animate-pulse">|</span>
                </div>
            </div>
        </section>
    );
}
