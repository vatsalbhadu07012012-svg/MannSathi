import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const features = [
    { title: "AI Chat Support", description: "Talk through your feelings with a calm, private companion that responds with empathy.", to: "/chat", aria: "Go to AI Chat support" },
    { title: "Mental Health Assessment", description: "Check in with thoughtful prompts and track your wellbeing over time.", to: "/checkup", aria: "Go to the mental health assessment page" },
    { title: "Mood Tracking", description: "Capture your daily mood and spot trends that matter to your wellbeing.", to: "/mood", aria: "Go to mood tracking" },
    { title: "Privacy & Security", description: "Your data stays protected with secure sessions and thoughtful design.", to: "/privacy", aria: "Go to the privacy and security policy" },
    { title: "Progress Tracking", description: "Follow your growth through simple insights and consistent daily care.", to: "/progress", aria: "Go to progress tracking dashboard" },
    { title: "24/7 Availability", description: "A steady source of support whenever you need a gentle reminder to breathe.", to: "/support", aria: "Go to support and emergency resources" },
];

const steps = [
    { title: "Sign In", description: "Create your secure account and enter a calm space designed for support." },
    { title: "Take Assessment", description: "Answer a few simple prompts to understand your current wellbeing." },
    { title: "Chat with AI", description: "Talk to your assistant and receive supportive, judgment-free guidance." },
    { title: "Track Progress", description: "Review your progress and build healthier rituals every day." },
];

const reasons = [
    { title: "Secure", description: "Private sessions and encrypted handling for your peace of mind." },
    { title: "Fast", description: "Quick check-ins and responsive support when you need it most." },
    { title: "Personalized", description: "Adaptive guidance that respects your own pace and preferences." },
    { title: "AI Powered", description: "Thoughtful AI assistance shaped for everyday emotional wellbeing." },
];

const faqs = [
    { question: "Is ManSathi a replacement for therapy?", answer: "No. ManSathi is designed as a supportive companion and wellness assistant, while professional help remains important for serious concerns." },
    { question: "How is my data handled?", answer: "We prioritize privacy, use secure sessions, and keep your experience designed around trust and safety." },
    { question: "Can I use it daily?", answer: "Absolutely. Many people use it for check-ins, motivation, and reflective support every day." },
    { question: "Do I need to create an account?", answer: "Yes, an account helps you keep your progress and personal insights organized." },
];

const About = () => {
    return (
        <div className="min-h-screen page-shell text-body transition-colors duration-200">
            <Navbar />
            <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid items-center gap-8 rounded-[36px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_80px_rgba(1,4,24,0.45)] lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
                    <div className="space-y-6">
                        <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100">About ManSathi</div>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">A gentle, intelligent space for mental wellbeing.</h1>
                            <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">ManSathi brings together compassionate AI support, guided self-assessment, and consistent reflection to help you feel more grounded every day.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link to="/chat" className="rounded-full bg-linear-to-r from-violet-600 to-cyan-500 px-5 py-3 font-semibold text-white transition duration-200 hover:scale-105">
                                Start Chat
                            </Link>
                            <Link to="/checkup" className="rounded-full border border-slate-300/70 bg-white/90 px-5 py-3 font-semibold text-slate-700 transition duration-200 hover:scale-105 dark:border-white/15 dark:bg-white/10 dark:text-slate-100">
                                Take Assessment
                            </Link>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-[30px] border border-slate-200/70 bg-linear-to-br from-violet-500/20 via-cyan-500/10 to-emerald-400/20 p-8 dark:border-white/10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_40%)]" />
                        <div className="relative rounded-3xl border border-white/10 bg-slate-950/55 p-6 backdrop-blur">
                            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Our mission</p>
                            <p className="mt-3 text-xl text-slate-100">To make mental wellness support feel approachable, personal, and dependable.</p>
                        </div>
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="rounded-4xl border border-slate-200/70 bg-white/80 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/30 lg:p-8">
                    <div className="mb-6 max-w-2xl">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Mission</p>
                        <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Support that meets you where you are.</h2>
                        <p className="mt-3 text-slate-600 dark:text-slate-300">ManSathi helps people pause, reflect, and build better routines through empathetic conversation and guided self-care.</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {features.map((feature) => (
                            <Link
                                key={feature.title}
                                to={feature.to}
                                aria-label={feature.aria}
                                className="group rounded-3xl border border-slate-200/70 bg-slate-50/80 p-5 transition duration-300 will-change-transform hover:-translate-y-1 hover:scale-[1.02] hover:border-cyan-400 hover:bg-white/90 hover:shadow-[0_24px_60px_rgba(56,189,248,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 dark:border-white/10 dark:bg-slate-950/45 dark:hover:border-cyan-500 dark:hover:bg-slate-900/80 dark:hover:shadow-[0_24px_60px_rgba(56,189,248,0.14)] dark:focus-visible:ring-cyan-500"
                            >
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-slate-900 transition-colors duration-200 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300">{feature.title}</h3>
                                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{feature.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }} className="rounded-4xl border border-slate-200/70 bg-white/80 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/30 lg:p-8">
                    <div className="mb-6">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">How It Works</p>
                        <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">From your first step to steady progress.</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {steps.map((step, index) => (
                            <div key={step.title} className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/45">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-cyan-400 text-sm font-semibold text-white">0{index + 1}</div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.11 }} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-4xl border border-slate-200/70 bg-white/80 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/30 lg:p-8">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Why Choose Us</p>
                        <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">A thoughtful experience for everyday care.</h2>
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {reasons.map((reason) => (
                                <div key={reason.title} className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/45">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{reason.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{reason.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-4xl border border-slate-200/70 bg-white/80 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/30 lg:p-8">
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">FAQ</p>
                        <div className="mt-4 space-y-3">
                            {faqs.map((item) => (
                                <details key={item.question} className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/40">
                                    <summary className="cursor-pointer text-sm font-medium text-slate-800 dark:text-slate-100">{item.question}</summary>
                                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.14 }} className="rounded-4xl border border-slate-200/70 bg-linear-to-r from-violet-600/20 to-cyan-500/20 p-8 text-center shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:shadow-cyan-950/30">
                    <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Start Your Mental Wellness Journey</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-300">A calmer day starts with one small step. Begin your conversation or take a check-in now.</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Link to="/chat" className="rounded-full bg-white px-5 py-3 font-semibold text-slate-900 transition hover:scale-105">
                            Chat with AI
                        </Link>
                        <Link to="/checkup" className="rounded-full border border-slate-300/70 bg-slate-950/40 px-5 py-3 font-semibold text-white transition hover:scale-105 dark:border-white/20 dark:bg-slate-950/40">
                            Mental Health Assessment
                        </Link>
                    </div>
                </motion.section>

                <Footer />
            </main>
        </div>
    );
};

export default About;
