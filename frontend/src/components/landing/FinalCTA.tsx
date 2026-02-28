"use client";

export default function FinalCTA() {
    return (
        <section className="relative w-full min-h-[500px] flex items-center justify-center py-32 text-center reveal overflow-hidden border-t border-[rgba(139,92,246,0.1)]">
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes breatheGlow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
      `}} />
            <div className="absolute inset-0 bg-gradient-glow pointer-events-none animate-[breatheGlow_4s_infinite_ease-in-out]" />

            <div className="relative z-10 px-6 max-w-[800px] mx-auto">
                <h2 className="text-5xl lg:text-[64px] font-bold leading-tight text-white mb-12">
                    Build systems with <i className="text-gradient not-italic">clarity</i> from day one
                </h2>
                <button className="pill-primary h-14 px-8 text-[18px] mx-auto mb-6 font-semibold">
                    Start with your idea <span className="ml-2">→</span>
                </button>
                <div className="text-[13px] text-textMuted flex items-center justify-center gap-2">
                    <span>No credit card required</span>
                    <span>&middot;</span>
                    <span>Setup in 2 minutes</span>
                </div>
            </div>
        </section>
    );
}
