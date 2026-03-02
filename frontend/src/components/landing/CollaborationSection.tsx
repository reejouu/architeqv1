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
                <div className="w-full lg:w-[55%] h-[400px] lg:h-[500px] relative border-[4px] border-[#2c336c] bg-[#c78caf] overflow-hidden shadow-[12px_12px_0_0_#2c336c] reveal">
                    <div className="absolute top-4 left-4 bg-accentCyan border-[3px] border-[#2c336c] px-3 py-1 flex items-center gap-2 z-20 shadow-[4px_4px_0_0_#2c336c] font-bold">
                        <div className="w-3 h-3 border-2 border-[#2c336c] bg-[#10B981]" />
                        <span className="text-xs text-[#2c336c] uppercase tracking-widest">3 editors</span>
                    </div>

                    <div className="absolute inset-0 p-12">
                        <div className="absolute top-[30%] left-[20%] w-[110px] h-[40px] bg-[#bfb3ca] border-[3px] border-[#2c336c] flex items-center justify-center text-xs font-bold text-[#2c336c] shadow-[4px_4px_0_0_#2c336c]">Auth Service</div>
                        <div className="absolute top-[60%] left-[60%] w-[110px] h-[40px] bg-[#ddb9ac] border-[3px] border-[#2c336c] flex items-center justify-center text-xs font-bold text-[#2c336c] shadow-[4px_4px_0_0_#2c336c]">User DB</div>
                        <div className="absolute top-[50%] left-[40%] text-[#2c336c] transition-colors duration-500">
                            {/* Cursor 1 */}
                            <div className="absolute animate-[moveCursor1_6s_ease-in-out_infinite]">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="#636798" stroke="#2c336c" strokeWidth="2"><path d="M3 3l7 18 2-7 7-2z" /></svg>
                                <div className="absolute top-6 left-6 border-2 border-[#2c336c] bg-accentCyan text-[#2c336c] text-[10px] font-black px-1.5 py-0.5 shadow-[2px_2px_0_0_#2c336c]">Priya</div>
                            </div>
                        </div>
                        <div className="absolute top-[20%] left-[70%] text-[#2c336c]">
                            {/* Cursor 2 */}
                            <div className="absolute animate-[moveCursor2_5s_ease-in-out_infinite]">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="#c78caf" stroke="#2c336c" strokeWidth="2"><path d="M3 3l7 18 2-7 7-2z" /></svg>
                                <div className="absolute top-6 left-6 border-2 border-[#2c336c] bg-[#bf979e] text-[#2c336c] text-[10px] px-1.5 py-0.5 font-black shadow-[2px_2px_0_0_#2c336c]">Marcus</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-[45%] reveal" style={{ transitionDelay: '200ms' }}>
                    <h2 className="text-4xl lg:text-[48px] font-black mb-6 leading-tight text-[#f3f3f2]">Plan systems together in real time</h2>
                    <p className="text-xl font-bold text-[#bfb3ca] mb-8 border-l-4 border-accentPurple pl-4">Your whole team on one canvas. No sync needed.</p>
                    <a href="#" className="inline-block bg-[#ddb9ac] text-[#2c336c] font-bold py-3 px-6 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#2c336c] transition-all border-2 border-[#2c336c]">Start collaborating →</a>
                </div>
            </div>
        </section>
    );
}
