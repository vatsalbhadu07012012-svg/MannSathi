import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { mentalHealthApi } from "../services/api";

const questions = [
    { id: "energyRest", label: "Do you feel tired even after getting enough rest?", category: "Energy", positive: false },
    { id: "troubleSleep", label: "Do you have trouble falling asleep?", category: "Sleep", positive: false },
    { id: "wakeRefreshed", label: "Do you wake up feeling refreshed?", category: "Sleep", positive: true },
    { id: "sleepRegularly", label: "Do you sleep for at least 7–8 hours regularly?", category: "Sleep", positive: true },
    { id: "sadDown", label: "Do you often feel sad or down?", category: "Mood", positive: false },
    { id: "moodChanges", label: "Do you experience sudden mood changes?", category: "Emotional Regulation", positive: false },
    { id: "feelHappy", label: "Do you feel happy most days?", category: "Mood", positive: true },
    { id: "feelHopeful", label: "Do you feel hopeful about your future?", category: "Future Concerns", positive: true },
    { id: "enjoySocial", label: "Do you enjoy spending time with friends and family?", category: "Social Wellbeing", positive: true },
    { id: "lostInterest", label: "Have you lost interest in activities you used to enjoy?", category: "Motivation", positive: false },
    { id: "motivatedTasks", label: "Do you feel motivated to complete your daily tasks?", category: "Motivation", positive: true },
    { id: "difficultStart", label: "Do you find it difficult to start new tasks?", category: "Concentration", positive: false },
    { id: "overwhelmed", label: "Do you feel overwhelmed by your daily responsibilities?", category: "Stress", positive: false },
    { id: "studyWorkStress", label: "Do you feel stressed because of studies or work?", category: "Stress", positive: false },
    { id: "difficultRelax", label: "Do you find it difficult to relax?", category: "Stress", positive: false },
    { id: "pressureExpectations", label: "Do you feel pressure to meet expectations?", category: "Stress", positive: false },
    { id: "hardConcentrate", label: "Do you find it difficult to concentrate?", category: "Concentration", positive: false },
    { id: "nervousRestless", label: "Do you feel nervous or restless often?", category: "Anxiety", positive: false },
    { id: "lifeWorth", label: "Do you feel that life is not worth living?", category: "Sensitive", positive: false },
    { id: "selfHarm", label: "Have you had thoughts of hurting yourself?", category: "Sensitive", positive: false },
];

const scoreLabels = {
    stressScore: "Stress",
    anxietyScore: "Anxiety",
    moodScore: "Mood",
    sleepScore: "Sleep",
    energyScore: "Energy",
    emotionalBalanceScore: "Emotional Regulation",
    socialScore: "Social Wellbeing",
    concentrationScore: "Concentration",
    selfEsteemScore: "Self-Esteem",
    dailyWellnessScore: "Daily Wellness",
};

const scaleLabels = ["Never", "Rarely", "Sometimes", "Often", "Always"];

const MentalHealthCheckup = () => {
    const navigate = useNavigate();
    const { pushToast } = useToast();
    const [step, setStep] = useState(() => {
        if (typeof window === "undefined") return 0;
        try {
            const savedProgress = localStorage.getItem("mansathi_checkup_progress");
            const parsed = savedProgress ? JSON.parse(savedProgress) : null;
            return typeof parsed?.step === "number" ? parsed.step : 0;
        } catch {
            localStorage.removeItem("mansathi_checkup_progress");
            return 0;
        }
    });
    const [answers, setAnswers] = useState(() => {
        if (typeof window === "undefined") return {};
        try {
            const savedProgress = localStorage.getItem("mansathi_checkup_progress");
            const parsed = savedProgress ? JSON.parse(savedProgress) : null;
            return parsed?.answers || {};
        } catch {
            localStorage.removeItem("mansathi_checkup_progress");
            return {};
        }
    });
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (!result) {
            localStorage.setItem("mansathi_checkup_progress", JSON.stringify({ step, answers }));
        }
    }, [step, answers, result]);

    const currentQuestion = questions[step];
    const progress = useMemo(() => ((step + 1) / questions.length) * 100, [step]);

    const updateAnswer = (value) => {
        setAnswers((current) => ({ ...current, [currentQuestion.id]: value }));
    };

    const handleNext = () => {
        const currentValue = answers[currentQuestion.id];
        if (typeof currentValue !== "number") {
            pushToast("Please answer this question before continuing.", "error");
            return;
        }
        if (step < questions.length - 1) {
            setStep((current) => current + 1);
        }
    };

    const handlePrevious = () => {
        if (step > 0) setStep((current) => current - 1);
    };

    const handleSubmit = async () => {
        const currentValue = answers[currentQuestion.id];
        if (typeof currentValue !== "number") {
            pushToast("Please answer this question before finishing.", "error");
            return;
        }

        setSaving(true);
        try {
            const response = await mentalHealthApi.checkup({ answers, questions });
            localStorage.removeItem("mansathi_checkup_progress");
            setResult(response?.data?.score || response?.score || null);
            pushToast(response?.message || "Checkup saved.", "success");
        } catch {
            pushToast("We could not save your checkup right now.", "error");
        } finally {
            setSaving(false);
        }
    };

    const sensitiveNote = (questionId) => {
        if (!["lifeWorth", "selfHarm"].includes(questionId)) return null;
        if (answers[questionId] >= 4) {
            return (
                <div className="mt-6 rounded-3xl border border-rose-200/60 bg-rose-50/80 p-4 text-sm text-rose-700 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-100">
                    <p className="font-semibold">You are not alone.</p>
                    <p className="mt-2">If these feelings are frequent, please consider sharing with a trusted person or a qualified mental health professional. The Call Counsellor feature can help you connect with support.</p>
                    <button type="button" onClick={() => navigate("/counsellors")} className="mt-4 inline-flex rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600">
                        Call Counsellor
                    </button>
                </div>
            );
        }
        return null;
    };

    const strengths = result
        ? Object.entries(result.scores || {})
              .filter(([, value]) => value >= 80)
              .map(([key]) => scoreLabels[key])
              .slice(0, 4)
        : [];
    const attentionAreas = result
        ? Object.entries(result.scores || {})
              .filter(([, value]) => value < 60)
              .map(([key]) => scoreLabels[key])
              .slice(0, 4)
        : [];

    if (result) {
        return (
            <div className="min-h-screen page-shell px-4 py-6 text-body transition-colors duration-200 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-4xl border border-slate-200/70 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/30">
                    <div className="flex flex-col gap-4 rounded-[32px] border border-slate-200/80 bg-slate-50/95 p-6 text-slate-900 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-slate-950/95 dark:text-white dark:shadow-slate-900/10">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-sm uppercase tracking-[0.28em] text-cyan-700 dark:text-cyan-300">Assessment complete</p>
                                <h1 className="mt-2 text-4xl font-semibold">Your results are ready</h1>
                            </div>
                            <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-200">{result.category || result.status}</span>
                        </div>
                        <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                            <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 dark:border-white/10 dark:bg-white/5">
                                <p className="text-sm uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200">Overall Score</p>
                                <p className="mt-3 text-5xl font-semibold text-slate-900 dark:text-white">{result.score || 0}</p>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">This score reflects your wellbeing across stress, mood, sleep, energy, social balance, and daily functioning.</p>
                            </div>
                            <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 dark:border-white/10 dark:bg-white/5">
                                <p className="text-sm uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200">Snapshot</p>
                                <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                    <p>
                                        <span className="font-semibold text-slate-900 dark:text-white">Status:</span> {result.status}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-slate-900 dark:text-white">Category:</span> {result.category}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-slate-900 dark:text-white">Completed:</span> {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
                        <div className="space-y-6">
                            <div className="rounded-[32px] border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/60">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Category scores</h2>
                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    {Object.entries(scoreLabels).map(([key, label]) => (
                                        <div key={key} className="rounded-3xl border border-slate-200/70 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-900/80">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                                            <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{result.scores?.[key] ?? "—"}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="rounded-[32px] border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/60">
                                    <p className="text-sm uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-200">Areas of strength</p>
                                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">{strengths.length ? strengths.map((item) => <li key={item}>{item}</li>) : <li>Healthy balance in several areas.</li>}</ul>
                                </div>
                                <div className="rounded-[32px] border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/60">
                                    <p className="text-sm uppercase tracking-[0.24em] text-rose-600 dark:text-rose-300">May benefit from attention</p>
                                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">{attentionAreas.length ? attentionAreas.map((item) => <li key={item}>{item}</li>) : <li>Well-balanced responses across most categories.</li>}</ul>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-[32px] border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/60">
                                <p className="text-sm uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-200">Personalized insights</p>
                                <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-slate-700 dark:text-slate-300">
                                    {(result.insights || []).slice(0, 4).map((insight, index) => (
                                        <li key={index}>{insight}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="rounded-[32px] border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/60">
                                <p className="text-sm uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-200">Wellness recommendations</p>
                                <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-slate-700 dark:text-slate-300">
                                    {(result.recommendations || []).slice(0, 5).map((recommendation, index) => (
                                        <li key={index}>{recommendation}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button type="button" onClick={() => navigate("/home")} className="rounded-full bg-linear-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:scale-105">
                            Back to home
                        </button>
                        <button type="button" onClick={() => navigate("/counsellors")} className="rounded-full border border-slate-300/70 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:scale-105 dark:border-white/10 dark:bg-white/10 dark:text-white">
                            Call Counsellor
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen page-shell px-4 py-6 text-body transition-colors duration-200 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-4xl border border-slate-200/70 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/30">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm text-cyan-600 dark:text-cyan-200">Mental Health Checkup</p>
                        <h1 className="text-3xl font-semibold">A calm self-check-in</h1>
                    </div>
                    <button type="button" onClick={() => navigate("/home")} className="rounded-full border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-700 transition hover:scale-105 dark:border-white/10 dark:bg-white/10 dark:text-white">
                        Back to home
                    </button>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800/80">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full rounded-full bg-linear-to-r from-violet-600 to-cyan-500" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {step + 1} of {questions.length}
                </p>

                <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/50">
                    <h2 className="text-xl font-semibold">{currentQuestion.label}</h2>
                    <div className="mt-6 grid gap-3 md:grid-cols-5">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button type="button" key={value} onClick={() => updateAnswer(value)} className={`rounded-3xl border px-4 py-4 text-sm font-semibold transition ${answers[currentQuestion.id] === value ? "border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-200" : "border-slate-300/70 bg-white/90 text-slate-700 hover:border-cyan-300 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"}`}>
                                <span className="block text-lg">{value}</span>
                                <span className="mt-2 block text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{scaleLabels[value - 1]}</span>
                            </button>
                        ))}
                    </div>
                    {sensitiveNote(currentQuestion.id)}
                </div>

                <div className="flex flex-wrap justify-between gap-3">
                    <button type="button" onClick={handlePrevious} disabled={step === 0} className="rounded-full border border-slate-300/70 bg-white/90 px-4 py-2 text-sm text-slate-700 transition hover:scale-105 disabled:opacity-50 dark:border-white/10 dark:bg-white/10 dark:text-white">
                        Previous
                    </button>
                    {step < questions.length - 1 ? (
                        <button type="button" onClick={handleNext} className="rounded-full bg-linear-to-r from-violet-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105">
                            Next
                        </button>
                    ) : (
                        <button type="button" onClick={handleSubmit} disabled={saving} className="rounded-full bg-linear-to-r from-violet-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105 disabled:opacity-70">
                            {saving ? "Saving..." : "Submit"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MentalHealthCheckup;
