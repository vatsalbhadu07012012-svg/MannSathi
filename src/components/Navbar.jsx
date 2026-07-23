import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/counsellors", label: "Counsellors" },
    { href: "/chat", label: "AI Chat" },
    { href: "/checkup", label: "Checkup" },
    { href: "/health-tracker", label: "Health Tracker" },
];

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/login");
    };

    return (
        <motion.nav initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35 }} className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-slate-950/75 dark:shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link to="/home" className="flex items-center gap-3 text-lg font-semibold text-slate-900 transition-colors duration-300 dark:text-white">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-violet-500 via-cyan-500 to-emerald-400 text-lg font-bold text-white shadow-[0_15px_40px_rgba(56,189,248,0.24)]">M</div>
                    <span>MannSathi</span>
                </Link>

                <div className="hidden items-center gap-6 text-sm md:flex">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.href || (link.href === "/home" && location.pathname === "/");
                        return (
                            <Link key={link.href} to={link.href} className={`relative transition duration-200 ${isActive ? "text-cyan-700 dark:text-cyan-200" : "text-slate-700 hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300"}`}>
                                <span className="relative z-10">{link.label}</span>
                                {isActive && <span className="absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-cyan-500" />}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button type="button" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} className="rounded-full border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-900 transition duration-200 hover:border-cyan-300/30 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/20 dark:border-white/10 dark:bg-white/10 dark:text-white">
                        {theme === "dark" ? "☀️" : "🌙"}
                    </button>
                    {user ? (
                        <>
                            <div className="hidden rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-700 sm:block dark:text-cyan-100">Hi, {user.userName || "there"}</div>
                            <button onClick={handleLogout} className="hidden rounded-full border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-900 transition duration-200 hover:border-cyan-300/30 hover:text-cyan-700 sm:block dark:border-white/10 dark:bg-white/10 dark:text-white">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="rounded-full border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-900 transition duration-200 hover:border-cyan-300/30 hover:text-cyan-700 dark:border-white/10 dark:bg-white/10 dark:text-white">
                            Login
                        </Link>
                    )}
                    <button type="button" onClick={() => setMenuOpen((current) => !current)} aria-label="Toggle navigation menu" className="rounded-full border border-slate-300/70 bg-white/90 p-2 text-slate-900 transition duration-200 hover:border-cyan-300/30 hover:text-cyan-700 md:hidden dark:border-white/10 dark:bg-white/10 dark:text-white">
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="border-t border-slate-200/80 bg-white/90 px-4 py-4 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-950/80 dark:text-white md:hidden">
                    <div className="flex flex-col gap-3">
                        {navLinks.map((link) => (
                            <Link key={link.href} to={link.href} onClick={() => setMenuOpen(false)} className="rounded-2xl px-3 py-2 transition duration-200 hover:bg-slate-100 hover:text-cyan-700 dark:hover:bg-white/5 dark:hover:text-cyan-200">
                                {link.label}
                            </Link>
                        ))}
                        {user ? (
                            <button onClick={handleLogout} className="rounded-2xl px-3 py-2 text-left text-cyan-700 transition duration-200 hover:bg-slate-100 dark:text-cyan-200 dark:hover:bg-white/5">
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-2xl px-3 py-2 transition duration-200 hover:bg-slate-100 hover:text-cyan-700 dark:hover:bg-white/5 dark:hover:text-cyan-200">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </motion.nav>
    );
};

export default Navbar;
