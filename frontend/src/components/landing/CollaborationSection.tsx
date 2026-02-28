"use client";

export default function CollaborationSection() {
    return (
        <section className="relative w-full max-w-[1280px] mx-auto px-6 lg:px-20 py-[120px]">
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes moveCursor1 {
          0%, 100% { transform: translate(0px, 0px); }
          50% { transform: translate(150px, -80px); }
        }
        @keyframes moveCursor2 {
          0%, 100% { transform: translate(0px, 0px); }
          50% { transform: translate(-100px, 120px); }
        }
      `}} />
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="w-full lg:w-[55%] h-[400px] lg:h-[500px] relative border border-[rgba(139,92,246,0.15)] rounded-2xl bg-bgSurface overflow-hidden reveal">
                    <div className="absolute top-4 left-4 bg-bgElevated border border-[rgba(255,255,255,0.05)] rounded-full px-3 py-1 flex items-center gap-2 z-20">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                        <span className="text-xs text-textSecondary">3 people editing</span>
                    </div>

                    <div className="absolute inset-0 p-12">
                        <div className="absolute top-[30%] left-[20%] w-24 h-[36px] bg-[rgba(20,20,40,0.9)] border border-[rgba(139,92,246,0.3)] rounded flex items-center justify-center text-xs text-white">Auth Service</div>
                        <div className="absolute top-[60%] left-[60%] w-24 h-[36px] bg-[rgba(20,20,40,0.9)] border border-[rgba(59,130,246,0.3)] rounded flex items-center justify-center text-xs text-white">User DB</div>
                        <div className="absolute top-[50%] left-[40%] text-white transition-colors duration-500 hover:text-green-400">
                            {/* Cursor 1 */}
                            <div className="absolute animate-[moveCursor1_6s_ease-in-out_infinite]">
                                <svg viewBox="0 0 24 24" width="20" height="20" className="text-accentPurple"><path d="M3 3l7 18 2-7 7-2z" fill="currentColor" /></svg>
                                <div className="absolute top-5 left-5 bg-accentPurple text-white text-[10px] px-1.5 py-0.5 rounded shadow">Priya</div>
                            </div>
                        </div>
                        <div className="absolute top-[20%] left-[70%] text-white">
                            {/* Cursor 2 */}
                            <div className="absolute animate-[moveCursor2_5s_ease-in-out_infinite]">
                                <svg viewBox="0 0 24 24" width="20" height="20" className="text-accentCyan"><path d="M3 3l7 18 2-7 7-2z" fill="currentColor" /></svg>
                                <div className="absolute top-5 left-5 bg-accentCyan text-[#0A0A0F] text-[10px] px-1.5 py-0.5 rounded shadow font-bold">Marcus</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-[45%] reveal" style={{ transitionDelay: '200ms' }}>
                    <h2 className="text-3xl lg:text-[40px] font-semibold mb-6 leading-tight text-white">Plan systems together in real time</h2>
                    <p className="text-lg text-textMuted mb-8">Your whole team on one canvas. No sync needed.</p>
                    <a href="#" className="text-accentPurple font-medium hover:underline text-[15px]">Start collaborating →</a>
                </div>
            </div>
        </section>
    );
}
