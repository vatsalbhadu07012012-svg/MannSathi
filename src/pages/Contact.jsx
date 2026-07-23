import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "../context/ToastContext";
import axios from "axios";

const Contact = () => {
    const [formData, setFormData] = useState({ fullName: "", email: "", subject: "", message: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { pushToast } = useToast();

    const validate = (values) => {
        const nextErrors = {};
        if (!values.fullName.trim()) nextErrors.fullName = "Full name is required.";
        if (!values.email.trim()) nextErrors.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = "Please enter a valid email.";
        if (!values.subject.trim()) nextErrors.subject = "Subject is required.";
        if (!values.message.trim()) nextErrors.message = "Message is required.";
        return nextErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = validate(formData);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setLoading(true);
        try {
            await axios.post("https://mannsathi-backend.onrender.com:3000/api/contact", formData, { withCredentials: true });
            setSubmitted(true);
            setFormData({ fullName: "", email: "", subject: "", message: "" });
            pushToast("Thanks for reaching out. We will be in touch soon.", "success");
        } catch {
            pushToast("We could not send your message right now. Please try again later.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen page-shell text-body transition-colors duration-200">
            <Navbar />
            <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="grid gap-8 rounded-[36px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_80px_rgba(1,4,24,0.45)] lg:grid-cols-[1fr_0.9fr] lg:p-10">
                    <div className="space-y-5">
                        <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100">Contact Us</div>
                        <div>
                            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">We’re here to support your questions.</h1>
                            <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">Reach out for support, feedback, or partnership ideas. We’ll get back to you soon.</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/45">
                            <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Contact info</p>
                            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                <li>✉️ mannsathihelp@mannsathi.com</li>
                                <li>📞 +91 95998 68947</li>
                                <li>📍 Sector-9, Dwarka, New Delhi, 110077</li>
                                <li>🕒 Mon–Fri · 9:00 AM to 7:00 PM</li>
                            </ul>
                        </div>
                    </div>

                    <motion.form initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} onSubmit={handleSubmit} className="rounded-[28px] border border-slate-200/70 bg-slate-50/80 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/45">
                        <div className="grid gap-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-100">Full Name</label>
                                <input value={formData.fullName} onChange={(event) => setFormData({ ...formData, fullName: event.target.value })} className="w-full rounded-2xl border border-slate-300/70 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder="Your name" />
                                {errors.fullName && <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{errors.fullName}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-100">Email</label>
                                <input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className="w-full rounded-2xl border border-slate-300/70 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder="you@example.com" />
                                {errors.email && <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-100">Subject</label>
                                <input value={formData.subject} onChange={(event) => setFormData({ ...formData, subject: event.target.value })} className="w-full rounded-2xl border border-slate-300/70 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder="How can we help?" />
                                {errors.subject && <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{errors.subject}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-100">Message</label>
                                <textarea rows="5" value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} className="w-full rounded-2xl border border-slate-300/70 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder="Tell us more..." />
                                {errors.message && <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{errors.message}</p>}
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="mt-5 rounded-full bg-linear-to-r from-violet-600 to-cyan-500 px-5 py-3 font-semibold text-white transition hover:scale-105 disabled:opacity-70">
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                        {submitted && <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-300">Thanks! Your message has been received.</p>}
                    </motion.form>
                </motion.section>

                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="rounded-4xl border border-slate-200/70 bg-white/80 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/30 lg:p-8">
                    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">FAQ</p>
                            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Common Questions</h2>
                            <div className="mt-4 space-y-3">
                                <details className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/40">
                                    <summary className="cursor-pointer text-sm font-medium text-slate-800 dark:text-slate-100">How quickly do you respond?</summary>
                                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">We aim to respond within one business day for general inquiries.</p>
                                </details>
                                <details className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-950/40">
                                    <summary className="cursor-pointer text-sm font-medium text-slate-800 dark:text-slate-100">Do you offer collaborations?</summary>
                                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Yes — we’re open to partnerships, wellness initiatives, and community projects.</p>
                                </details>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-slate-950/45">
                            <div className="flex h-60 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500/20 to-cyan-500/20 text-sm text-slate-600 dark:text-slate-300">
                                <a href="https://www.google.com/maps/place/R+D+Rajpal+public+school/@28.5791392,77.061791,16.43z/data=!4m6!3m5!1s0x390d1b1bcacf6cf9:0x35180bef3bcf2e01!8m2!3d28.5789131!4d77.0648181!16zL20vMDltY3dx?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDcxNS4wIKXMDSoASAFQAw%3D%3D">
                                    <img className="h-55 w-120 rounded-xl overflow-x-hidden" src="schoolmap.png"></img>
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <Footer />
            </main>
        </div>
    );
};

export default Contact;
