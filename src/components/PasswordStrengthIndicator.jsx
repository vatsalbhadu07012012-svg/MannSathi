import { motion, AnimatePresence } from "framer-motion";
import { evaluatePasswordStrength } from "../utils/passwordValidator";

const PasswordStrengthIndicator = ({ password, isVisible, onAnimationComplete }) => {
    const { score, label, colorClass, textClass, checks, description, isStrongEnough } = evaluatePasswordStrength(password);
    const segments = Array.from({ length: 4 }, (_, index) => index < score);

    return (
        <AnimatePresence mode="wait">
            {isVisible ? (
                <motion.div initial={{ opacity: 0, y: 6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: 0.24, ease: "easeOut" }} onAnimationComplete={onAnimationComplete} className="mt-2 rounded-2xl border border-white/50 bg-white/70 p-3 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/70" aria-live="polite" role="status">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Password strength</span>
                        <span className={`text-sm font-semibold ${textClass}`}>{label}</span>
                    </div>

                    <div className="mt-2 flex gap-2" role="progressbar" aria-valuemin="0" aria-valuemax="4" aria-valuenow={score} aria-label={`Password strength: ${label}`}>
                        {segments.map((filled, index) => (
                            <motion.div
                                key={index}
                                initial={false}
                                animate={{
                                    opacity: filled ? 1 : 0.55,
                                    scaleX: filled ? 1 : 0.96,
                                }}
                                transition={{ duration: 0.2 }}
                                className={`h-2 flex-1 rounded-full ${filled ? colorClass : "bg-slate-300 dark:bg-slate-700"}`}
                            />
                        ))}
                    </div>

                    <p className={`mt-2 text-sm ${textClass}`}>{description}</p>

                    <ul className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                        {checks.map((check) => (
                            <li key={check.label} className="flex items-center gap-2">
                                <span className={check.passed ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}>{check.passed ? "✓" : "✕"}</span>
                                <span>{check.label}</span>
                            </li>
                        ))}
                    </ul>

                    {!isStrongEnough && password ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Please create a stronger password. Use at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.</p> : null}
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};

export default PasswordStrengthIndicator;
