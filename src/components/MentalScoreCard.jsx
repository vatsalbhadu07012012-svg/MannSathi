import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { mentalHealthApi } from "../services/api";

const MentalScoreCard = () => {
    const [scoreData, setScoreData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        const loadScore = async () => {
            setLoading(true);
            const data = await mentalHealthApi.score();
            setScoreData(data);
            setLoading(false);
        };

        loadScore();
    }, []);

    useEffect(() => {
        if (!scoreData) {
            return;
        }

        let frameId = 0;
        const target = scoreData.score || 0;
        const duration = 900;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedScore(Math.round(target * eased));

            if (progress < 1) {
                frameId = window.requestAnimationFrame(tick);
            }
        };

        frameId = window.requestAnimationFrame(tick);
        return () => window.cancelAnimationFrame(frameId);
    }, [scoreData]);

    if (loading || !scoreData) {
        return (
            <div className="rounded-[32px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 dark:shadow-[0_30px_80px_rgba(8,15,42,0.35)]">
                <div className="h-48 animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-900/70" />
            </div>
        );
    }

    const progressValue = scoreData.progress ?? scoreData.score ?? 0;
    const strokeDashoffset = 264 - (264 * Math.min(progressValue, 100)) / 100;
    const statusTone = scoreData.status?.toLowerCase() === "excellent" ? "from-emerald-400 to-cyan-300" : scoreData.status?.toLowerCase() === "poor" ? "from-rose-400 to-pink-300" : "from-violet-500 to-cyan-400";

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 dark:shadow-[0_30px_80px_rgba(8,15,42,0.35)]">
            <div className="pointer-events-none absolute -right-10 top-6 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-8 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300/80">Mental health score</p>
                    <h3 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{animatedScore} / 100</h3>
                </div>
                <span className={`rounded-full bg-gradient-to-r ${statusTone} px-4 py-2 text-sm font-semibold text-white/90 shadow-[0_10px_30px_rgba(56,189,248,0.18)]`}>{scoreData.status || "Good"}</span>
            </div>

            <div className="grid gap-5 lg:grid-cols-[150px_1fr]">
                <div className="relative flex items-center justify-center rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-4 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.15)] dark:border-white/10 dark:bg-slate-900/70 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                    <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90">
                        <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
                        <motion.circle cx="50" cy="50" r="42" stroke="url(#progressGradient)" strokeWidth="10" strokeLinecap="round" fill="none" strokeDasharray={264} initial={{ strokeDashoffset: 264 }} animate={{ strokeDashoffset }} transition={{ duration: 0.7 }} />
                        <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#A855F7" />
                                <stop offset="100%" stopColor="#22D3EE" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="absolute text-2xl font-semibold text-slate-900 dark:text-white">{progressValue}%</span>
                </div>

                <div className="space-y-5">
                    <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900/70 dark:shadow-[0_20px_50px_rgba(8,15,42,0.18)]">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Weekly progress</p>
                        <div className="mt-4 flex items-end gap-3">
                            {scoreData.weekly?.map((value, index) => (
                                <motion.div key={index} initial={{ height: 0 }} animate={{ height: `${Math.max(20, value)}px` }} transition={{ duration: 0.35, delay: index * 0.05 }} className="flex-1 rounded-t-2xl bg-gradient-to-t from-violet-500 to-cyan-400" />
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900/70 dark:shadow-[0_20px_50px_rgba(8,15,42,0.18)]">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Mood trend</p>
                            <span className="rounded-full bg-slate-200/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:bg-white/5 dark:text-slate-300">{scoreData.moodTrend?.slice(-3).join(" → ") || "Stable"}</span>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            Today&apos;s mood: <span className="font-semibold text-slate-900 dark:text-white">{scoreData.todayMood || "Calm"}</span>
                        </p>
                        <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-500">Last assessment: {scoreData.lastAssessment}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MentalScoreCard;
