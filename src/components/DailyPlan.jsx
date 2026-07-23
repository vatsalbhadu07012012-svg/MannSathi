import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { dailyPlanApi } from "../services/api";

const DailyPlan = () => {
    const [plan, setPlan] = useState([]);
    const [loading, setLoading] = useState(true);
    const { pushToast } = useToast();

    useEffect(() => {
        const loadPlan = async () => {
            setLoading(true);
            try {
                const data = await dailyPlanApi.get();
                setPlan(data);
            } catch {
                pushToast("The daily plan could not be loaded right now.", "error");
            } finally {
                setLoading(false);
            }
        };

        loadPlan();
    }, [pushToast]);

    const completion = Math.round((plan.filter((item) => item.completed).length / plan.length) * 100) || 0;

    const toggleTask = async (item) => {
        const updated = plan.map((entry) => (entry.id === item.id ? { ...entry, completed: !entry.completed } : entry));
        setPlan(updated);

        try {
            await dailyPlanApi.update(item.id, { completed: !item.completed });
        } catch {
            pushToast("The plan update did not go through. Please try again.", "error");
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/30 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Today&apos;s Plan</p>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Daily Focus</h3>
                </div>
                <div className="text-sm text-cyan-700 dark:text-cyan-200">{completion}% done</div>
            </div>

            <div className="mt-4 h-2 rounded-full bg-slate-200/70 dark:bg-white/10">
                <div className="h-2 rounded-full bg-linear-to-r from-violet-500 to-emerald-400" style={{ width: `${completion}%` }} />
            </div>

            {loading ? (
                <div className="mt-6 space-y-3">
                    <div className="h-10 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-white/10" />
                    <div className="h-10 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-white/10" />
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {plan.map((item) => (
                        <motion.div layout key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/80 px-3 py-3 dark:border-white/10 dark:bg-slate-950/40">
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{item.time}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{item.title}</p>
                            </div>
                            <input type="checkbox" checked={item.completed} onChange={() => toggleTask(item)} className="h-5 w-5 rounded border-slate-300 bg-transparent accent-cyan-500 dark:border-white/20 dark:accent-cyan-400" />
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default DailyPlan;
