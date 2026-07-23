import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Support = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen page-shell text-body transition-colors duration-200">
            <Navbar />
            <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-[36px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_80px_rgba(1,4,24,0.45)] lg:p-10">
                    <div className="flex flex-col gap-5">
                        <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100">Support</div>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-semibold sm:text-5xl">Support whenever you need it most.</h1>
                            <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">Discover how ManSathi stays available, plus resources for urgent care, safety, and wellbeing.</p>
                        </div>
                        <button type="button" onClick={() => navigate(-1)} className="w-fit rounded-full border border-slate-300/70 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:scale-105 dark:border-white/10 dark:bg-white/10 dark:text-white">
                            Back to About
                        </button>
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">AI availability</p>
                        <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Always here to listen</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">The AI companion is available 24/7 to support your check-ins, reflections, and next steps.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Emergency resources</p>
                        <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">If you need urgent help</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">If you are in crisis, please contact local emergency services or a trusted support network immediately.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Crisis disclaimer</p>
                        <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Not a substitute for therapy</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">ManSathi offers supportive guidance, but it is not a replacement for professional mental health care.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Contact information</p>
                        <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Reach out anytime</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                            For questions or help, email us at <span className="text-cyan-600 hover:text-cyan-500 dark:text-cyan-300">mannsathihelp@mannsathi.com</span>.
                        </p>
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }} className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                    <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">Is the AI available any time?</p>
                            <p className="mt-2">Yes. The chatbot is designed to be available around the clock for conversational support.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">What should I do in a crisis?</p>
                            <p className="mt-2">If you are in danger or need urgent medical help, please contact your local emergency number right away.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">Can I share this with someone else?</p>
                            <p className="mt-2">Yes, share ManSathi as a wellness companion, but always encourage professional care for serious concerns.</p>
                        </div>
                    </div>
                </motion.section>

                <Footer />
            </main>
        </div>
    );
};

export default Support;
