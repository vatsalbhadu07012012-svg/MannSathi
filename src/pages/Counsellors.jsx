import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CounsellorCard from "../components/CounsellorCard";
import { counsellorApi } from "../services/api";

const Counsellors = () => {
    const [counsellors, setCounsellors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCounsellor, setSelectedCounsellor] = useState(null);
    const [note, setNote] = useState("");
    const [requesting, setRequesting] = useState(false);
    const navigate = useNavigate();
    const { pushToast } = useToast();

    useEffect(() => {
        const loadCounsellors = async () => {
            setLoading(true);
            try {
                const list = await counsellorApi.list();
                setCounsellors(Array.isArray(list) ? list : []);
            } catch {
                pushToast("Could not load counsellors right now.", "error");
            } finally {
                setLoading(false);
            }
        };

        loadCounsellors();
    }, [pushToast]);

    const handleRequestCall = async () => {
        if (!selectedCounsellor) {
            pushToast("Select a counsellor first.", "error");
            return;
        }

        setRequesting(true);
        try {
            const response = await counsellorApi.bookAppointment({
                counsellorId: selectedCounsellor._id,
                date: new Date().toISOString(),
                timeSlot: "Today • 4:30 PM",
                reason: note || "Free counselling support request",
            });

            console.log(response)

            if (response?.success && response?.data?.appointment?._id) {
                pushToast("Your private chat room is ready.", "success");
                setSelectedCounsellor(null);
                setNote("");
                navigate(`/counsellor-chat/${response.data.appointment._id}`);
                return;
            }

            pushToast(response?.message || "Unable to book your appointment right now.", "error");
        } catch {
            pushToast("Unable to request a call at this time.", "error");
        } finally {
            setRequesting(false);
        }
    };

    return (
        <div className="min-h-screen page-shell text-body transition-colors duration-200">
            <Navbar />
            <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-[36px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_80px_rgba(1,4,24,0.45)] lg:p-10">
                    <div className="space-y-5">
                        <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100">Professional Support</div>
                        <h1 className="text-4xl font-semibold sm:text-5xl">Call a counsellor when you want compassionate support.</h1>
                        <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">Browse trusted counsellors, review availability, and request a phone call for support when it matters most.</p>
                        <div className="flex flex-wrap gap-3">
                            <Link to="/chat" className="rounded-full bg-linear-to-r from-violet-600 to-cyan-500 px-5 py-3 font-semibold text-white transition duration-200 hover:scale-105">
                                Start AI chat
                            </Link>
                            <Link to="/checkup" className="rounded-full border border-slate-300/70 bg-white/90 px-5 py-3 font-semibold text-slate-700 transition duration-200 hover:scale-105 dark:border-white/15 dark:bg-white/10 dark:text-slate-100">
                                Take assessment
                            </Link>
                        </div>
                    </div>
                </motion.section>

                <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
                    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-4 rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_80px_rgba(1,4,24,0.45)]">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-200">Available counsellors</p>
                                <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Find calm, qualified support.</h2>
                            </div>
                            <span className="rounded-full bg-slate-100/70 px-4 py-2 text-sm font-semibold text-slate-900 dark:bg-slate-900/70 dark:text-white">{loading ? "Loading..." : `${counsellors.length} available`}</span>
                        </div>

                        <div className="grid gap-4">{loading ? Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-32 animate-pulse rounded-[28px] bg-slate-200/60 dark:bg-white/10" />) : counsellors.length === 0 ? <div className="rounded-[28px] border border-slate-200/70 bg-slate-50/80 p-6 text-slate-700 dark:border-white/10 dark:bg-slate-950/45 dark:text-slate-200">No counsellors are available right now. Please try again later.</div> : counsellors.map((counsellor) => <CounsellorCard key={counsellor._id || counsellor.id} counsellor={counsellor} selected={selectedCounsellor?._id === counsellor._id || selectedCounsellor?.id === counsellor.id} onSelect={() => setSelectedCounsellor(counsellor)} />)}</div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="rounded-[32px] border border-slate-200/70 bg-slate-50/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/45 dark:shadow-[0_30px_80px_rgba(1,4,24,0.45)]">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-200">Request a call</p>
                                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Book your first session</h2>
                            </div>
                            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Choose a counsellor, add a short note, and we’ll notify them of your request.</p>

                            {selectedCounsellor ? (
                                <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-900/80">
                                    <p className="text-sm uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Selected counsellor</p>
                                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{selectedCounsellor.fullName || selectedCounsellor.name || "Counsellor"}</p>
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        {(selectedCounsellor.isFree || selectedCounsellor.consultationFee === 0) && <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-200">FREE Consultation</span>}
                                        <span className="text-sm text-slate-600 dark:text-slate-300">{Array.isArray(selectedCounsellor.specialization) ? selectedCounsellor.specialization.join(" • ") : selectedCounsellor.specialization}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-3xl border border-dashed border-slate-300/70 bg-slate-100/80 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">Select a counsellor card to prepare your request.</div>
                            )}

                            <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">
                                Note for your counsellor
                                <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} className="mt-3 w-full rounded-3xl border border-slate-300/70 bg-white/90 p-4 text-sm text-slate-900 outline-none transition dark:border-white/10 dark:bg-slate-950/80 dark:text-white" placeholder="Share why you’d like a call, or what matters most to you." />
                            </label>

                            <button type="button" disabled={!selectedCounsellor || requesting} onClick={handleRequestCall} className="w-full rounded-full bg-linear-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70">
                                {requesting ? "Requesting..." : "Request counsellor call"}
                            </button>
                        </div>
                    </motion.div>
                </section>

                <Footer />
            </main>
        </div>
    );
};

export default Counsellors;
