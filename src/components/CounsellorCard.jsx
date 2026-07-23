import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const consultationIcons = {
    Phone: "📞",
    Chat: "💬",
    Video: "🎥",
};

const availabilityStyles = {
    Available: {
        label: "Available Today",
        badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
        dot: "bg-emerald-500",
    },
    Unavailable: {
        label: "Currently Busy",
        badge: "bg-rose-500/10 text-rose-700 dark:text-rose-200",
        dot: "bg-rose-500",
    },
};

const CounsellorCard = ({ counsellor, selected = false, onSelect }) => {
    const [showFullBio, setShowFullBio] = useState(false);
    const [imageSrc, setImageSrc] = useState(() => counsellor?.photoUrl || "/images/default-counsellor.svg");
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const { _id, id, fullName, name: aliasName, qualification, specialization = [], experienceYears, languages = [], consultationFee, isFree, sessionDuration, availability = "Unavailable", nextAvailable, consultationTypes = [], verified, bio, photoUrl } = counsellor;

    const name = fullName || aliasName || "Counsellor Name";
    const experience = experienceYears;
    const feeLabel = isFree ? "FREE Consultation" : consultationFee ? `₹${consultationFee} / Session` : "₹799 / Session";
    const availabilityText = Array.isArray(availability) ? availability.join(" ") : availability;
    const isAvailable = availabilityText?.toLowerCase().includes("available") || availabilityText?.toLowerCase().includes("today") || availabilityText?.toLowerCase().includes("tomorrow");
    const availabilityLabel = isAvailable ? availabilityText : availabilityStyles.Unavailable.label;
    const availabilityDot = isAvailable ? availabilityStyles.Available.dot : availabilityStyles.Unavailable.dot;
    const summaryBio = bio?.length > 128 ? `${bio.slice(0, 128)}…` : bio;

    useEffect(() => {
        setImageSrc(photoUrl || "/images/default-counsellor.svg");
        setIsImageLoaded(false);
    }, [photoUrl]);

    const optimizedImage = useMemo(() => {
        if (!photoUrl) {
            return "/images/default-counsellor.svg";
        }

        if (photoUrl.startsWith("http")) {
            return `${photoUrl}?tr=w-300,h-300,fo-auto,q-auto`;
        }

        return photoUrl;
    }, [photoUrl]);

    const handleImageError = () => {
        setImageSrc("/images/default-counsellor.svg");
        setIsImageLoaded(true);
    };

    const handleBookAppointment = () => {
        if (typeof onSelect === "function") {
            onSelect();
        }
    };

    return (
        <motion.article layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.25, ease: "easeOut" }} className={`group relative overflow-hidden rounded-4xl border border-white/10 bg-white/70 shadow-[0_24px_120px_rgba(56,189,248,0.12)] backdrop-blur-xl transition duration-300 hover:shadow-[0_30px_120px_rgba(56,189,248,0.18)] dark:border-slate-700/50 dark:bg-slate-950/65 dark:shadow-[0_30px_120px_rgba(56,189,248,0.08)] ${selected ? "ring-2 ring-cyan-400/60" : ""}`} aria-label={`Counsellor card for ${name}`}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-r from-violet-400/20 via-cyan-300/10 to-emerald-400/10 blur-3xl opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="absolute inset-0 rounded-4xl ring-1 ring-white/10" />

            <div className="relative overflow-hidden rounded-4xl border border-slate-200/20 bg-slate-950/5 p-5 shadow-inner shadow-slate-900/5 backdrop-blur-xl dark:bg-slate-950/70 dark:border-slate-700/60">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="relative h-20 w-20 overflow-hidden rounded-3xl border border-white/20 bg-slate-100 shadow-xl shadow-slate-200/40 ring-1 ring-white/10 dark:border-slate-700/70 dark:bg-slate-900">
                            {!isImageLoaded && <div className="absolute inset-0 animate-pulse bg-slate-200/80 dark:bg-slate-800/80" />}
                            <img
                                src={imageSrc || optimizedImage}
                                alt={name ? `${name} profile photo` : "Counsellor photo"}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover transition duration-300"
                                onLoad={() => setIsImageLoaded(true)}
                                onError={handleImageError}
                            />
                            <span className="absolute bottom-2 left-2 inline-flex items-center gap-2 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-slate-100 backdrop-blur-sm"></span>
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="truncate text-2xl font-semibold text-slate-950 dark:text-white">{name || "Counsellor Name"}</h2>
                                {isFree && <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-200">FREE Consultation</span>}
                            </div>
                            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">{qualification || "Mental Health Specialist"}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {verified && (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200">
                                        <span aria-hidden="true">✔️</span>
                                        Verified
                                    </span>
                                )}
                                <button type="button" onClick={onSelect} className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 transition duration-200 hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-100">
                                    <span aria-hidden="true">⭐</span>
                                    Follow
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 text-right">
                        <div className="rounded-3xl bg-linear-to-br from-violet-500/10 via-cyan-500/10 to-emerald-400/10 px-3 py-2 text-xs uppercase tracking-[0.24em] text-slate-800 dark:text-slate-100">{experience ? `${experience}+ Years` : "Experienced"}</div>
                        <div className="rounded-3xl bg-slate-100/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/40 dark:bg-slate-900/70 dark:text-slate-100">{languages.length ? languages.join(" • ") : "Language not set"}</div>
                    </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-1">
                    <div className="space-y-2 rounded-3xl border border-slate-200/70 bg-white/90 p-4 text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-100">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Specialization</p>
                        <div className="flex flex-wrap gap-2">
                            {specialization.length ? (
                                specialization.slice(0, 4).map((item) => (
                                    <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                                        {item}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-slate-500 dark:text-slate-400">Not available</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-[28px] border border-slate-200/70 bg-slate-50/70 p-5 text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">About</p>
                    <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{showFullBio ? bio : summaryBio || "A compassionate counsellor focusing on wellbeing, resilience, and calm support."}</p>
                    {bio && bio.length > 128 && (
                        <button type="button" className="mt-3 text-sm font-semibold text-cyan-600 transition hover:text-cyan-700 dark:text-cyan-300" onClick={() => setShowFullBio((current) => !current)} aria-expanded={showFullBio}>
                            {showFullBio ? "Show less" : "Read more"}
                        </button>
                    )}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/80">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Next available</p>
                        <p className="mt-2 text-sm text-slate-900 dark:text-white">{nextAvailable || availabilityText || "Not scheduled"}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/80">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Session details</p>
                        <p className="mt-2 text-sm text-slate-900 dark:text-white">{sessionDuration ? `${sessionDuration} Minutes` : "45 Minutes"}</p>
                        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                            <span aria-hidden="true">🟢</span>
                            {isFree ? "FREE Consultation" : feeLabel}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {consultationTypes.length ? (
                                consultationTypes.map((type) => (
                                    <span key={type} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 dark:bg-slate-900/70 dark:text-slate-200">
                                        <span>{consultationIcons[type] || "💬"}</span>
                                        {type}
                                    </span>
                                ))
                            ) : (
                                <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">No consultation types</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button type="button" onClick={handleBookAppointment} className="w-full rounded-full bg-linear-to-r from-violet-600 via-cyan-500 to-emerald-400 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(56,189,248,0.25)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/30" aria-label={`Book a free appointment with ${name}`}>
                        <span aria-hidden="true">📅</span>
                        Book Free Appointment
                    </button>
                </div>
            </div>
        </motion.article>
    );
};

export default CounsellorCard;
