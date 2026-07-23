import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { getInitialQuote, getNextQuote, getStoredQuote, persistQuote } from "../utils/quotes";

const QuoteCard = () => {
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const historyRef = useRef([]);

    const selectQuote = useCallback(
        (force = false) => {
            setLoading(true);
            setIsRefreshing(true);

            const next = force ? getNextQuote(quote, historyRef.current) : getNextQuote(quote, historyRef.current);
            historyRef.current = next.history;
            setQuote(next.quote);
            persistQuote(next.quote);

            window.setTimeout(() => {
                setLoading(false);
                setIsRefreshing(false);
            }, 280);
        },
        [quote],
    );

    useEffect(() => {
        const storedQuote = getStoredQuote();
        const initialQuote = storedQuote ?? getInitialQuote();
        if (initialQuote) {
            historyRef.current = [];
            setQuote(initialQuote);
            persistQuote(initialQuote);
        }
        setLoading(false);
    }, []);

    const handleRefresh = () => {
        if (isRefreshing) return;
        selectQuote(true);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/30 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Daily Motivation</p>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Today&apos;s Motivation</h3>
                </div>
                <button type="button" onClick={handleRefresh} disabled={isRefreshing} className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-700 transition duration-200 hover:scale-105 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)] active:scale-95 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-70">
                    <span className={`inline-flex items-center gap-2 ${isRefreshing ? "animate-spin" : ""}`}>↻ Refresh</span>
                </button>
            </div>

            {loading ? (
                <div className="mt-6 h-20 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-white/10" />
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div key={quote?.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="mt-6 space-y-3">
                        <p className="text-lg italic text-slate-700 dark:text-slate-100">“{quote?.quote}”</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">— {quote?.author || "Unknown"}</p>
                    </motion.div>
                </AnimatePresence>
            )}
        </motion.div>
    );
};

export default QuoteCard;
