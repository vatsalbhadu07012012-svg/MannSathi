import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MoodTracking = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen page-shell text-body transition-colors duration-200">
            <Navbar />
            <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-[36px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_80px_rgba(1,4,24,0.45)] lg:p-10">
                    <div className="flex flex-col gap-5">
                        <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100">Mood Tracking</div>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-semibold sm:text-5xl">See your mood journey at a glance.</h1>
                            <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">Track your daily mood entries, review trends, and spot patterns that help you understand your emotional wellbeing over time.</p>
                        </div>
                        <button type="button" onClick={() => navigate(-1)} className="w-fit rounded-full border border-slate-300/70 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:scale-105 dark:border-white/10 dark:bg-white/10 dark:text-white">
                            Back to About
                        </button>
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Daily Mood</p>
                        <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Log your feelings</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Add quick daily entries and reflect on the emotions that shaped your day.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Trend Insights</p>
                        <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Spot important patterns</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">View mood shifts over days, weeks, and months to recognize what supports your balance.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Reflection</p>
                        <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Build mindful routines</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Use mood history to notice what helps you feel calmer, more energized, and more grounded.</p>
                    </div>
                </motion.section>

                <Footer />
            </main>
        </div>
    );
};

export default MoodTracking;
