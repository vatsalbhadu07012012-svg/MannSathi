import { motion } from "framer-motion";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const WellnessDashboard = ({ scoreData }) => {
    const status = scoreData?.status || "Good";
    const trend = useMemo(() => {
        const base = scoreData?.score || 78;
        return [Math.max(40, base - 10), Math.max(42, base - 8), Math.max(50, base - 4), Math.max(55, base - 2), base, Math.max(60, base + 3), Math.max(70, base + 5)];
    }, [scoreData]);

    return (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
            <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/30 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm text-cyan-600 dark:text-cyan-200">Dashboard</p>
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Today’s wellbeing snapshot</h2>
                    </div>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-200">{status}</span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[20px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/40">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Overall score</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{scoreData?.score || 78}/100</p>
                    </div>
                    <div className="rounded-[20px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/40">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Last checkup</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{scoreData?.lastAssessment || "Just now"}</p>
                    </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/checkup" className="rounded-full bg-linear-to-r from-violet-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105">
                        Quick Checkup
                    </Link>
                    <Link to="/chat" className="rounded-full border border-slate-300/70 bg-white/90 px-4 py-2 text-sm text-slate-700 transition hover:scale-105 dark:border-white/10 dark:bg-white/10 dark:text-white">
                        Open AI Chat
                    </Link>
                </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/30 sm:p-7">
                <p className="text-sm text-cyan-600 dark:text-cyan-200">Daily tip</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">A mindful pause helps reset your focus.</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Try one slow breath, one stretch, and one glass of water before your next task.</p>
                <div className="mt-4 rounded-[20px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/40">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Weekly progress</p>
                    <div className="mt-3 flex items-end gap-2">
                        {trend.map((value, index) => (
                            <motion.div key={index} initial={{ height: 0 }} animate={{ height: `${Math.max(16, value)}px` }} transition={{ duration: 0.3, delay: index * 0.06 }} className="flex-1 rounded-t-xl bg-linear-to-t from-violet-500 to-cyan-400" />
                        ))}
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default WellnessDashboard;
