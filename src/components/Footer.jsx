const Footer = () => {
    return (
        <footer className="rounded-[28px] border border-slate-200/70 bg-white/80 px-6 py-6 text-sm text-slate-600 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:shadow-cyan-950/20">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="font-semibold text-slate-900 dark:text-white">ManSathi</p>
                    <p className="text-slate-500 dark:text-slate-400">A calm companion for everyday wellbeing.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <a href="/about" className="transition hover:text-cyan-600 dark:hover:text-cyan-300">
                        About
                    </a>
                    <a href="/contact" className="transition hover:text-cyan-600 dark:hover:text-cyan-300">
                        Contact
                    </a>
                    <a href="/chat" className="transition hover:text-cyan-600 dark:hover:text-cyan-300">
                        Chat
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
