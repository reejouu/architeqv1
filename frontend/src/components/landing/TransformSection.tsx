"use client";

export default function TransformSection() {
    return (
        <section className="relative w-full py-[120px] bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:40px_40px] flex flex-col items-center border-t border-[rgba(139,92,246,0.1)]">
            <span className="eyebrow-label mb-16 reveal">From idea to system map</span>
            <div className="relative w-full max-w-[800px] h-[400px] flex items-center justify-center reveal" style={{ transitionDelay: '200ms' }}>
                <div className="text-2xl lg:text-[28px] font-medium text-white mb-20">
                    Build a SaaS for booking doctors<span className="animate-pulse">|</span>
                </div>
            </div>
        </section>
    );
}
