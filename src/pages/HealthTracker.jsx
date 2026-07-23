import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { healthTrackerApi } from "../services/api";
import { useToast } from "../context/ToastContext";

const initialForm = {
    date: new Date().toISOString().slice(0, 10),
    steps: "",
    heartRate: "",
    sleepHours: "",
    exerciseMinutes: "",
    waterIntake: "",
    weight: "",
    mood: "Good",
    energyLevel: 7,
    mealQuality: "Balanced",
    notes: "",
};

const moodOptions = ["Excellent", "Good", "Neutral", "Stressed", "Sad"];
const mealOptions = ["Healthy", "Balanced", "Average", "Unhealthy"];

const formatDate = (value) => {
    if (!value) return "—";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
};

const HealthTracker = () => {
    const [form, setForm] = useState(initialForm);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [range, setRange] = useState("7d");
    const [insights, setInsights] = useState([]);
    const [validationError, setValidationError] = useState("");
    const { pushToast } = useToast();

    const loadEntries = async () => {
        setLoading(true);
        const data = await healthTrackerApi.list();
        setEntries(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => {
        loadEntries();
    }, []);

    const summary = useMemo(() => {
        if (!entries.length) {
            return {
                latest: null,
                avgScore: 0,
                avgSteps: 0,
                avgSleep: 0,
                latestScore: 0,
            };
        }
        const latest = entries[0];
        const avgScore = Math.round(entries.reduce((sum, item) => sum + (item.healthScore || 0), 0) / entries.length);
        const avgSteps = Math.round(entries.reduce((sum, item) => sum + (item.steps || 0), 0) / entries.length);
        const avgSleep = (entries.reduce((sum, item) => sum + (item.sleepHours || 0), 0) / entries.length).toFixed(1);
        return { latest, avgScore, avgSteps, avgSleep, latestScore: latest.healthScore || 0 };
    }, [entries]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidationError("");

        const payload = {
            ...form,
            steps: Number(form.steps),
            heartRate: Number(form.heartRate),
            sleepHours: Number(form.sleepHours),
            exerciseMinutes: Number(form.exerciseMinutes),
            waterIntake: Number(form.waterIntake),
            weight: Number(form.weight),
            energyLevel: Number(form.energyLevel),
        };

        if ([payload.steps, payload.heartRate, payload.sleepHours, payload.exerciseMinutes, payload.waterIntake, payload.weight].some((value) => Number.isNaN(value))) {
            setValidationError("Please enter valid numeric values for your health metrics.");
            return;
        }

        if (payload.steps < 0 || payload.steps > 100000) {
            setValidationError("Steps must stay between 0 and 100,000.");
            return;
        }
        if (payload.heartRate < 30 || payload.heartRate > 220) {
            setValidationError("Heart rate must stay between 30 and 220 BPM.");
            return;
        }
        if (payload.sleepHours < 0 || payload.sleepHours > 24) {
            setValidationError("Sleep hours must stay between 0 and 24.");
            return;
        }
        if (payload.exerciseMinutes < 0 || payload.exerciseMinutes > 300) {
            setValidationError("Exercise minutes must stay between 0 and 300.");
            return;
        }
        if (payload.waterIntake < 0 || payload.waterIntake > 10) {
            setValidationError("Water intake must stay between 0 and 10 litres.");
            return;
        }
        if (payload.weight < 20 || payload.weight > 300) {
            setValidationError("Weight must stay between 20 and 300 kg.");
            return;
        }

        setSubmitting(true);
        const response = await healthTrackerApi.save(payload, selectedEntry?._id);
        if (response?.success) {
            pushToast("Today's health data was saved securely.", "success");
            setInsights(response.insights || []);
            setForm(initialForm);
            setSelectedEntry(null);
            await loadEntries();
        } else {
            pushToast(response?.message || "Unable to save your health data.", "error");
        }
        setSubmitting(false);
    };

    const handleEdit = (entry) => {
        setSelectedEntry(entry);
        setForm({
            date: entry.date,
            steps: entry.steps,
            heartRate: entry.heartRate,
            sleepHours: entry.sleepHours,
            exerciseMinutes: entry.exerciseMinutes,
            waterIntake: entry.waterIntake,
            weight: entry.weight,
            mood: entry.mood,
            energyLevel: entry.energyLevel,
            mealQuality: entry.mealQuality,
            notes: entry.notes,
        });
    };

    const handleDelete = async (entryId) => {
        const response = await healthTrackerApi.delete(entryId);
        if (response?.success) {
            pushToast("Entry removed.", "success");
            await loadEntries();
        } else {
            pushToast(response?.message || "Unable to delete entry.", "error");
        }
    };

    const latestEntries = entries.slice(0, 6);
    const visibleEntries = [...entries].slice(0, range === "7d" ? 7 : range === "30d" ? 30 : 90).reverse();
    const metricCards = [
        { label: "Steps", value: summary.latest ? summary.latest.steps : 0, unit: "steps" },
        { label: "Heart rate", value: summary.latest ? summary.latest.heartRate : 0, unit: "bpm" },
        { label: "Sleep", value: summary.latest ? summary.latest.sleepHours : 0, unit: "h" },
        { label: "Water", value: summary.latest ? summary.latest.waterIntake : 0, unit: "L" },
    ];

    return (
        <div className="min-h-screen page-shell text-body transition-colors duration-200">
            <Navbar />
            <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-[36px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_80px_rgba(1,4,24,0.45)] lg:p-10">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-4">
                            <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100">❤️ Health Tracker</div>
                            <div>
                                <h1 className="text-4xl font-semibold sm:text-5xl">Log your wellness habits and see your momentum grow.</h1>
                                <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-300">Track your steps, recovery, hydration, movement, mood, and notes in one calm and secure dashboard.</p>
                            </div>
                        </div>
                        <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100">{summary.latest ? `Latest score: ${summary.latest.healthScore || 0}/100` : "Start by recording today’s health snapshot."}</div>
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <form onSubmit={handleSubmit} className="rounded-4xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:p-8">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Daily health form</p>
                                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Save today’s wellness snapshot</h2>
                            </div>
                            <div className="rounded-full border border-slate-300/70 px-3 py-1 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">{selectedEntry ? "Editing entry" : "New entry"}</div>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                Date
                                <input type="date" name="date" value={form.date} onChange={handleChange} className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:text-white" required />
                            </label>
                            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                Steps walked
                                <input type="number" name="steps" min="0" max="100000" value={form.steps} onChange={handleChange} className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:text-white" placeholder="8450" required />
                            </label>
                            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                Resting heart rate (BPM)
                                <input type="number" name="heartRate" min="30" max="220" value={form.heartRate} onChange={handleChange} className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:text-white" placeholder="72" required />
                            </label>
                            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                Sleep duration (hours)
                                <input type="number" step="0.1" name="sleepHours" min="0" max="24" value={form.sleepHours} onChange={handleChange} className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:text-white" placeholder="7.5" required />
                            </label>
                            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                Exercise duration (minutes)
                                <input type="number" name="exerciseMinutes" min="0" max="300" value={form.exerciseMinutes} onChange={handleChange} className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:text-white" placeholder="45" required />
                            </label>
                            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                Water intake (litres)
                                <input type="number" step="0.1" name="waterIntake" min="0" max="10" value={form.waterIntake} onChange={handleChange} className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:text-white" placeholder="2.5" required />
                            </label>
                            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                Weight (kg)
                                <input type="number" name="weight" min="20" max="300" value={form.weight} onChange={handleChange} className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:text-white" placeholder="68" required />
                            </label>
                            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                Mood
                                <select name="mood" value={form.mood} onChange={handleChange} className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:text-white">
                                    {moodOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 md:col-span-2">
                                Energy level
                                <input type="range" name="energyLevel" min="1" max="10" value={form.energyLevel} onChange={handleChange} className="accent-cyan-500" />
                                <span className="text-sm text-slate-500 dark:text-slate-400">Selected: {form.energyLevel}/10</span>
                            </label>
                            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                                Meals
                                <select name="mealQuality" value={form.mealQuality} onChange={handleChange} className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:text-white">
                                    {mealOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 md:col-span-2">
                                Notes
                                <textarea name="notes" value={form.notes} onChange={handleChange} rows="3" className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:text-white" placeholder="Felt energetic today and completed my workout." />
                            </label>
                        </div>

                        {validationError ? <p className="mt-4 rounded-2xl border border-rose-300/60 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">{validationError}</p> : null}

                        <button type="submit" disabled={submitting} className="mt-6 rounded-full bg-linear-to-r from-violet-600 to-cyan-500 px-5 py-3 font-semibold text-white transition hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70">
                            {submitting ? "Saving..." : selectedEntry ? "Update Health Data" : "Save Today's Health Data"}
                        </button>
                    </form>

                    <div className="flex flex-col gap-6">
                        <div className="rounded-4xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Health score</p>
                                    <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{summary.latest ? `${summary.latest.healthScore || 0} / 100` : "—"}</h2>
                                </div>
                                <div className="rounded-2xl bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{summary.latest ? (summary.latest.healthScore >= 90 ? "Excellent" : summary.latest.healthScore >= 75 ? "Great" : summary.latest.healthScore >= 60 ? "Good" : "Needs care") : "Ready"}</div>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">This score blends movement, recovery, hydration, heart rate, and energy. It is meant to support reflection rather than diagnose or replace professional medical advice.</p>
                        </div>

                        <div className="rounded-4xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Today's snapshot</p>
                                    <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Quick wellness overview</h2>
                                </div>
                            </div>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-slate-950/45">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Steps</p>
                                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{summary.latest ? summary.latest.steps : 0}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-slate-950/45">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Heart rate</p>
                                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{summary.latest ? `${summary.latest.heartRate} bpm` : "—"}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-slate-950/45">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Sleep</p>
                                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{summary.latest ? `${summary.latest.sleepHours}h` : "—"}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-slate-950/45">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Exercise</p>
                                    <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{summary.latest ? `${summary.latest.exerciseMinutes}m` : "—"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-4xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Weekly progress</p>
                                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Your progress at a glance</h2>
                            </div>
                            <div className="flex gap-2 rounded-full border border-slate-300/70 p-1 dark:border-white/10">
                                {["7d", "30d", "90d"].map((option) => (
                                    <button key={option} type="button" onClick={() => setRange(option)} className={`rounded-full px-3 py-1.5 text-sm ${range === option ? "bg-cyan-500 text-white" : "text-slate-600 dark:text-slate-300"}`}>
                                        {option === "7d" ? "Last 7 days" : option === "30d" ? "Last 30 days" : "Last 3 months"}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-slate-950/45">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Average steps</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{summary.avgSteps}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-slate-950/45">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Average sleep</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{summary.avgSleep}h</p>
                            </div>
                        </div>
                        <div className="mt-6 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-slate-950/45">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Recent trend</p>
                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                                {metricCards.map((metric) => (
                                    <div key={metric.label} className="rounded-2xl border border-slate-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-slate-900/60">
                                        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                                            <span>{metric.label}</span>
                                            <span>
                                                {metric.value}
                                                {metric.unit}
                                            </span>
                                        </div>
                                        <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                                            <div className="h-2 rounded-full bg-linear-to-r from-violet-600 to-cyan-500" style={{ width: `${Math.min(100, (metric.value / (metric.label === "Steps" ? 12000 : metric.label === "Heart rate" ? 90 : metric.label === "Sleep" ? 8 : 3)) * 100)}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex items-end gap-2">
                                {visibleEntries.map((entry, index) => (
                                    <div key={entry._id || `${entry.date}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                                        <div className="w-full rounded-t-2xl bg-linear-to-t from-violet-600 to-cyan-500" style={{ height: `${Math.max(24, ((entry.healthScore || 0) / 100) * 120)}px` }} />
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{entry.date.slice(-2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-4xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:p-8">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">AI insights</p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Supportive ideas for today</h2>
                        {loading ? (
                            <div className="mt-5 space-y-3">
                                <div className="h-12 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-white/10" />
                                <div className="h-12 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-white/10" />
                            </div>
                        ) : insights.length > 0 ? (
                            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {insights.map((item) => (
                                    <li key={item} className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 dark:border-white/10 dark:bg-slate-950/45">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">Save a record to receive personalized guidance and recovery suggestions.</p>
                        )}
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }} className="rounded-4xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:p-8">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">History</p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Previous entries</h2>
                        </div>
                    </div>
                    {loading ? (
                        <div className="mt-6 space-y-3">
                            <div className="h-12 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-white/10" />
                            <div className="h-12 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-white/10" />
                            <div className="h-12 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-white/10" />
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="mt-6 rounded-2xl border border-dashed border-slate-300/70 p-8 text-center text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">No entries yet. Save your first health snapshot to start building your history.</div>
                    ) : (
                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-white/10">
                                <thead>
                                    <tr className="text-slate-500 dark:text-slate-400">
                                        <th className="px-3 py-3 font-medium">Date</th>
                                        <th className="px-3 py-3 font-medium">Steps</th>
                                        <th className="px-3 py-3 font-medium">BPM</th>
                                        <th className="px-3 py-3 font-medium">Sleep</th>
                                        <th className="px-3 py-3 font-medium">Exercise</th>
                                        <th className="px-3 py-3 font-medium">Water</th>
                                        <th className="px-3 py-3 font-medium">Mood</th>
                                        <th className="px-3 py-3 font-medium">Score</th>
                                        <th className="px-3 py-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                                    {latestEntries.map((entry) => (
                                        <tr key={entry._id} className="text-slate-700 dark:text-slate-200">
                                            <td className="px-3 py-3">{formatDate(entry.date)}</td>
                                            <td className="px-3 py-3">{entry.steps}</td>
                                            <td className="px-3 py-3">{entry.heartRate}</td>
                                            <td className="px-3 py-3">{entry.sleepHours}</td>
                                            <td className="px-3 py-3">{entry.exerciseMinutes}</td>
                                            <td className="px-3 py-3">{entry.waterIntake}</td>
                                            <td className="px-3 py-3">{entry.mood}</td>
                                            <td className="px-3 py-3">{entry.healthScore}</td>
                                            <td className="px-3 py-3">
                                                <div className="flex flex-wrap gap-2">
                                                    <button type="button" onClick={() => handleEdit(entry)} className="rounded-full border border-slate-300/70 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200">
                                                        Edit
                                                    </button>
                                                    <button type="button" onClick={() => handleDelete(entry._id)} className="rounded-full border border-rose-300/60 px-3 py-1 text-xs font-semibold text-rose-700 dark:border-rose-400/30 dark:text-rose-200">
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.section>

                <Footer />
            </main>
        </div>
    );
};

export default HealthTracker;
