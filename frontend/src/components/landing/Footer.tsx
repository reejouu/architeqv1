"use client";

export default function Footer() {
    return (
        <footer className="w-full bg-[#bf979e] border-t-[4px] border-[#2c336c] pt-20 pb-8 px-6 lg:px-20">
            <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-1 border-r-[3px] border-[#2c336c] pr-8 hidden md:block">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-accentPurple border-[3px] border-[#2c336c] flex items-center justify-center shadow-[2px_2px_0px_#2c336c]">
                            <div className="w-2.5 h-2.5 bg-[#2c336c] rounded-full"></div>
                        </div>
                        <span className="font-extrabold text-[#2c336c] text-xl uppercase tracking-wider">Architeq</span>
                    </div>
                    <p className="text-[14px] font-bold text-[#2c336c]/80 mb-6 max-w-[200px]">The AI architecture platform for forward-thinking engineering teams.</p>
                    <div className="flex items-center gap-4 text-[#2c336c]">
                        <a href="#" className="hover:text-accentPurple hover:-translate-y-1 transition-all">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                            </svg>
                        </a>
                        <a href="#" className="hover:text-accentPurple hover:-translate-y-1 transition-all">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="col-span-1">
                    <h4 className="text-[#2c336c] text-sm font-black uppercase tracking-wider mb-4 border-b-[3px] border-[#2c336c] pb-2 inline-block">Product</h4>
                    <ul className="space-y-3 text-[14px] font-bold text-[#2c336c]/80">
                        <li><a href="#" className="hover:text-accentPurple transition-colors">Features</a></li>
                        <li><a href="#" className="hover:text-accentPurple transition-colors">How it works</a></li>
                        <li><a href="#" className="hover:text-accentPurple transition-colors">Pricing</a></li>
                        <li><a href="#" className="hover:text-accentPurple transition-colors">Changelog</a></li>
                    </ul>
                </div>
                <div className="col-span-1">
                    <h4 className="text-[#2c336c] text-sm font-black uppercase tracking-wider mb-4 border-b-[3px] border-[#2c336c] pb-2 inline-block">Company</h4>
                    <ul className="space-y-3 text-[14px] font-bold text-[#2c336c]/80">
                        <li><a href="#" className="hover:text-accentPurple transition-colors">About</a></li>
                        <li><a href="#" className="hover:text-accentPurple transition-colors">Blog</a></li>
                        <li><a href="#" className="hover:text-accentPurple transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-accentPurple transition-colors">Contact</a></li>
                    </ul>
                </div>
                <div className="col-span-1">
                    <h4 className="text-[#2c336c] text-sm font-black uppercase tracking-wider mb-4 border-b-[3px] border-[#2c336c] pb-2 inline-block">Legal</h4>
                    <ul className="space-y-3 text-[14px] font-bold text-[#2c336c]/80">
                        <li><a href="#" className="hover:text-accentPurple transition-colors">Privacy</a></li>
                        <li><a href="#" className="hover:text-accentPurple transition-colors">Terms</a></li>
                        <li><a href="#" className="hover:text-accentPurple transition-colors">Security</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center text-[13px] font-bold text-[#2c336c]/80 border-t-[3px] border-[#2c336c] pt-6">
                <p>© 2026 Architeq, Inc.</p>
                <p>Built for engineering teams</p>
            </div>
        </footer>
    );
}
