import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen page-shell text-body transition-colors duration-200">
            <Navbar />
            <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-[36px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_80px_rgba(1,4,24,0.45)] lg:p-10">
                    <div className="flex flex-col gap-5">
                        <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100">Privacy Policy</div>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-semibold sm:text-5xl">Your privacy and security matter.</h1>
                            <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">ManSathi is designed to protect your personal wellbeing data with clear controls, safe storage, and respectful handling.</p>
                        </div>
                        <button type="button" onClick={() => navigate(-1)} className="w-fit rounded-full border border-slate-300/70 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:scale-105 dark:border-white/10 dark:bg-white/10 dark:text-white">
                            Back to About
                        </button>
                    </div>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Data protection</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">We keep your wellbeing entries private and only use them to improve your experience within ManSathi.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Encryption</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Sensitive data is protected with encryption in transit and at rest wherever possible.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Secure authentication</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Your account access is safeguarded by secure sign-in flows and session protection.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">User privacy</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">We never sell your data, and your interactions remain confidential within the ManSathi service.</p>
                    </div>
                    <div className="lg:col-span-2 rounded-3xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-white/10 dark:bg-slate-950/45">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Cookie usage</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Cookies and local storage help keep you signed in and remember your preferences, while sensitive details stay secure.</p>
                    </div>
                </motion.section>

                <Footer />
            </main>
        </div>
    );
};

export default PrivacyPolicy;
