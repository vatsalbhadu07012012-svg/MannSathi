import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ProgressDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen page-shell text-body transition-colors duration-200">
            <Navbar />
            <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-[36px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_80px_rgba(1,4,24,0.45)] lg:p-10">
                    <div className="flex flex-col gap-5">
                        <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100">Progress Tracking</div>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-semibold sm:text-5xl">Track your growth and steady progress.</h1>
                            <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">Review your assessment history, mood trends, and insights designed to help you stay motivated and mindful.</p>
                        </div>
                        <button type="button" onClick={() => navigate(-1)} className="w-fit rounded-full border border-slate-300/70 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:scale-105 dark:border-white/10 dark:bg-white/10 dark:text-white">
                            Back to About
                        </button>
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Score history</p>
                        <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Mental health scores</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Review past assessments and observe how your wellbeing shifts over time.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Weekly progress</p>
                        <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Healthy habits</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">See how small steps add up, with weekly insights to keep your self-care on track.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Monthly charts</p>
                        <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">Visual insights</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Understand long-term patterns with clear charts and progress summaries.</p>
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }} className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Insights</h2>
                    <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">Based on your recent activity, you can build more balanced routines, celebrate steady improvement, and address difficult moments before they grow.</p>
                </motion.section>

                <Footer />
            </main>
        </div>
    );
};

export default ProgressDashboard;
