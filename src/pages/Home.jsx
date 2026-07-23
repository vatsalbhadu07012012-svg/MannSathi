import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import MentalScoreCard from "../components/MentalScoreCard";
import QuoteCard from "../components/QuoteCard";
import DailyPlan from "../components/DailyPlan";
import Footer from "../components/Footer";
import WellnessDashboard from "../components/WellnessDashboard";
import { mentalHealthApi } from "../services/api";

const heroFeatures = [
    {
        icon: "🔒",
        label: "Private & Secure Support",
        description: "Encrypted conversations with trusted wellbeing guidance.",
    },
    {
        icon: "💚",
        label: "Guided Daily Care",
        description: "Personalized routines and mindful check-ins.",
    },
];

const Home = () => {
    const location = useLocation();
    const [scoreData, setScoreData] = useState(null);
    const titleText = location.pathname === "/about" ? "A calm, human-centered wellness companion" : "Your mental wellbeing, guided with clarity and compassion.";

    useEffect(() => {
        const loadScore = async () => {
            const data = await mentalHealthApi.score();
            setScoreData(data);
        };

        loadScore();
    }, []);

    return (
        <div className="min-h-screen page-shell overflow-x-hidden text-body transition-colors duration-200">
            <Navbar />

            <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10 lg:gap-14 lg:px-8 lg:py-12">
                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="relative isolate overflow-hidden rounded-[40px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_40px_120px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_40px_120px_rgba(8,15,42,0.35)] sm:p-8 lg:p-10">
                    <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
                    <div className="pointer-events-none absolute right-0 top-16 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
                    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] xl:grid-cols-[1.1fr_0.9fr] items-center">
                        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="space-y-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-100">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-200">✨</span>
                                Calm support for your everyday rhythm
                            </div>

                            <div className="space-y-6">
                                <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">{titleText}</h1>
                                <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">Talk freely with a caring AI companion, track your emotional wellbeing, and build stronger habits with daily guidance designed for real life.</p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link to="/chat" className="group inline-flex w-full items-center justify-center rounded-full bg-linear-to-r from-violet-500 via-cyan-500 to-emerald-400 px-6 py-4 text-sm font-semibold text-white shadow-[0_25px_90px_rgba(56,189,248,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_100px_rgba(56,189,248,0.28)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/30 sm:w-auto">
                                    Start Chat
                                </Link>
                                <Link to="/checkup" className="group inline-flex w-full items-center justify-center rounded-full border border-slate-300/70 bg-white/90 px-6 py-4 text-sm font-semibold text-slate-700 transition duration-300 hover:border-cyan-300/30 hover:bg-cyan-500/10 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/20 dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:text-white sm:w-auto">
                                    Mental Health Checkup
                                </Link>
                                <Link to="/counsellors" className="group inline-flex w-full items-center justify-center rounded-full border border-slate-300/70 bg-white/90 px-6 py-4 text-sm font-semibold text-slate-700 transition duration-300 hover:border-cyan-300/30 hover:bg-cyan-500/10 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/20 dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:text-white sm:w-auto">
                                    Call Counsellor
                                </Link>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {heroFeatures.map(({ icon, label, description }) => (
                                    <div key={label} className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_60px_rgba(8,15,42,0.25)]">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-700 dark:text-cyan-200">{icon}</div>
                                            <div>
                                                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{label}</h3>
                                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <div className="grid gap-6 lg:gap-7">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative overflow-hidden rounded-4xl border border-slate-200/80 bg-white/80 p-4 shadow-[0_30px_70px_rgba(15,23,42,0.10)] dark:border-white/10 dark:bg-slate-900/75 dark:shadow-[0_30px_70px_rgba(8,15,42,0.35)]">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.22),transparent_35%)]" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_40%)]" />
                                <div className="relative overflow-hidden rounded-[28px]">
                                    <img src="https://i0.wp.com/www.newdelhitimes.com/wp-content/uploads/2020/01/meditation-ge631d341f_1280.jpg?fit=1280%2C815&ssl=1" alt="Mindfulness and calm mental wellbeing illustration" loading="lazy" className="h-90 w-full object-cover object-center sm:h-105" />
                                    <div className="absolute inset-0 bg-slate-950/30" />
                                    <div className="absolute left-5 top-5 rounded-3xl border border-white/15 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 backdrop-blur">Inspiring calm, anytime.</div>
                                    <div className="absolute right-5 bottom-5 rounded-full bg-linear-to-r from-violet-500/40 via-cyan-400/30 to-emerald-400/20 p-3 shadow-[0_20px_60px_rgba(56,189,248,0.25)]">
                                        <div className="h-3 w-24 rounded-full bg-white/20" />
                                    </div>
                                </div>
                            </motion.div>

                            <div className="mt-2 lg:mt-4">
                                <MentalScoreCard />
                            </div>
                        </div>
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="isolate grid gap-6 rounded-[36px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_30px_90px_rgba(8,15,42,0.35)] sm:p-8 lg:grid-cols-3 lg:gap-8 lg:p-8">
                    <div className="lg:col-span-2">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300/80">Mission</p>
                        <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">A kinder mental health experience for every day.</h2>
                        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">ManSathi brings calm, clarity, and practical support to your daily routine through secure AI conversations and wellness tracking designed to help you feel more grounded.</p>
                    </div>
                    <div className="grid gap-4">
                        <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_60px_rgba(8,15,42,0.18)]">
                            <p className="text-sm text-cyan-700 dark:text-cyan-200">Holistic guidance</p>
                            <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">Balance mood, habits, and wellbeing with every check-in.</p>
                        </div>
                        <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_60px_rgba(8,15,42,0.18)]">
                            <p className="text-sm text-cyan-700 dark:text-cyan-200">Secure support</p>
                            <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">Your self-care journey stays private and protected.</p>
                        </div>
                    </div>
                </motion.section>

                <WellnessDashboard scoreData={scoreData || { score: 82, status: "Good", lastAssessment: "Today" }} />

                <section className="grid gap-6 lg:grid-cols-2">
                    <QuoteCard />
                    <DailyPlan />
                </section>

                <Footer />
            </main>
        </div>
    );
};

export default Home;
