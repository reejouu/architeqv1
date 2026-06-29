"use client";

export default function Footer() {
    return (
        <footer className="w-full bg-[var(--stone)] pt-[64px]">
            <div className="section-inner">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-[64px]">
                    <div className="col-span-1 md:col-span-1 border-r-[2px] border-[var(--ink)] pr-8 hidden md:block">
                        <div className="flex items-center gap-3 mb-6">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo/Architeq%20Logo.png" alt="Architeq" className="w-8 h-8 object-contain" />
                            <span className="font-bold text-[var(--ink)] text-2xl uppercase tracking-wider">Architeq</span>
                        </div>
                        <p className="text-[14px] text-[var(--ink-soft)] mb-6 max-w-[200px] leading-[1.65]">The AI architecture platform for forward-thinking engineering teams.</p>
                        <div className="flex items-center gap-4 text-[var(--ink)]">
                            <a href="#" className="hover:bg-[var(--white)] hover:text-[var(--ink)] p-1 border-[2px] border-transparent hover:border-[var(--ink)] shadow-none hover:shadow-[2px_2px_0_0_var(--ink)] transition-all">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                </svg>
                            </a>
                            <a href="#" className="hover:bg-[var(--white)] hover:text-[var(--ink)] p-1 border-[2px] border-transparent hover:border-[var(--ink)] shadow-none hover:shadow-[2px_2px_0_0_var(--ink)] transition-all">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-[var(--ink)] text-[12px] font-bold uppercase tracking-[0.12em] mb-6 border-b-[2px] border-[var(--ink)] pb-2 inline-block">Product</h4>
                        <ul className="space-y-4 text-[13px] font-bold text-[var(--ink)]">
                            <li><a href="#" className="hover:underline hover:decoration-[2px] hover:underline-offset-4 transition-all">Features</a></li>
                            <li><a href="#" className="hover:underline hover:decoration-[2px] hover:underline-offset-4 transition-all">How it works</a></li>
                            <li><a href="#" className="hover:underline hover:decoration-[2px] hover:underline-offset-4 transition-all">Pricing</a></li>
                            <li><a href="#" className="hover:underline hover:decoration-[2px] hover:underline-offset-4 transition-all">Changelog</a></li>
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-[var(--ink)] text-[12px] font-bold uppercase tracking-[0.12em] mb-6 border-b-[2px] border-[var(--ink)] pb-2 inline-block">Company</h4>
                        <ul className="space-y-4 text-[13px] font-bold text-[var(--ink)]">
                            <li><a href="#" className="hover:underline hover:decoration-[2px] hover:underline-offset-4 transition-all">About</a></li>
                            <li><a href="#" className="hover:underline hover:decoration-[2px] hover:underline-offset-4 transition-all">Blog</a></li>
                            <li><a href="#" className="hover:underline hover:decoration-[2px] hover:underline-offset-4 transition-all">Careers</a></li>
                            <li><a href="#" className="hover:underline hover:decoration-[2px] hover:underline-offset-4 transition-all">Contact</a></li>
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-[var(--ink)] text-[12px] font-bold uppercase tracking-[0.12em] mb-6 border-b-[2px] border-[var(--ink)] pb-2 inline-block">Legal</h4>
                        <ul className="space-y-4 text-[13px] font-bold text-[var(--ink)]">
                            <li><a href="#" className="hover:underline hover:decoration-[2px] hover:underline-offset-4 transition-all">Privacy Policy</a></li>
                            <li><a href="#" className="hover:underline hover:decoration-[2px] hover:underline-offset-4 transition-all">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="py-[24px] border-t-[2px] border-[var(--ink)] text-center md:text-left flex flex-col md:flex-row justify-between items-center text-[12px] font-bold text-[var(--ink-soft)]">
                    <p>© 2026 Architeq Inc. All rights reserved.</p>
                    <div className="mt-4 md:mt-0 flex gap-4 text-[var(--ink)]">
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-none bg-[var(--green)] border-[1px] border-[var(--ink)]"></div> All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
