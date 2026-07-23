import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketService from "../services/socketService";
import Navbar from "../components/Navbar";
import { MessageBubble } from "../components/ChatComponents";
import axios from "axios";

const API = axios.create({ baseURL: "https://mannsathi-backend.onrender.com:3000/api", withCredentials: true });

// Utility function to decode JWT
const decodeJWT = (token) => {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const decoded = JSON.parse(atob(parts[1]));
        return decoded;
    } catch (error) {
        console.error("JWT decode error:", error);
        return null;
    }
};

const CounsellorPortal = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loginState, setLoginState] = useState({ email: "", password: "" });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [counsellorId, setCounsellorId] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatText, setChatText] = useState("");
    const [online, setOnline] = useState(true);
    const socketRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("mansathi_counsellor_token");
        if (token) {
            const decoded = decodeJWT(token);
            if (decoded?.id) {
                setCounsellorId(decoded.id);
            }
            setIsLoggedIn(true);
            fetchAppointments();
            initSocket(token);
        }
    }, []);

    useEffect(() => {
        if (selectedAppointment && isLoggedIn && socketRef.current) {
            loadChatHistory();
            socketRef.current.emit("join-room", { appointmentId: selectedAppointment._id });
        }
    }, [selectedAppointment, isLoggedIn]);

    useEffect(() => {
        return () => {
            if (socketRef.current && socketRef.current._managedHandlers) {
                const h = socketRef.current._managedHandlers;
                socketService.off("connect", h.onConnect);
                socketService.off("disconnect", h.onDisconnect);
                socketService.off("history", h.onHistory);
                socketService.off("new-message", h.onNewMessage);
            }
        };
    }, []);

    useEffect(() => {
        requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        });
    }, [chatMessages]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await API.get("/counsellor-portal/appointments");
            if (response?.data?.success) {
                setAppointments(response.data.data || []);
            }
        } catch {
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const loadChatHistory = async () => {
        try {
            const response = await API.get(`/counsellor-portal/chats/${selectedAppointment._id}`);
            if (response?.data?.success) {
                setChatMessages(response.data.messages || []);
            }
        } catch {
            setChatMessages([]);
        }
    };

    const initSocket = (token) => {
        if (socketRef.current?.connected) {
            return;
        }

        const socket = socketService.init(token);
        socketRef.current = socket;

        const onConnect = () => setOnline(true);
        const onDisconnect = () => setOnline(false);
        const onHistory = (history) => setChatMessages(history || []);
        const onNewMessage = (message) => {
            setChatMessages((current) => {
                const exists = current.some((m) => m._id === message._id);
                return exists ? current : [...current, message];
            });
        };

        socketService.on("connect", onConnect);
        socketService.on("disconnect", onDisconnect);
        socketService.on("history", onHistory);
        socketService.on("new-message", onNewMessage);

        // store handlers for cleanup if needed
        socketRef.current._managedHandlers = { onConnect, onDisconnect, onHistory, onNewMessage };
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await API.post("/counsellor-portal/login", loginState);
            if (response?.data?.success) {
                const token = response.data.token;
                localStorage.setItem("mansathi_counsellor_token", token);
                const decoded = decodeJWT(token);
                if (decoded?.id) {
                    setCounsellorId(decoded.id);
                }
                setIsLoggedIn(true);
                fetchAppointments();
            }
        } catch {
            alert("Unable to log in as counsellor.");
        }
    };

    const handleLogout = async () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        await API.post("/counsellor-portal/logout");
        localStorage.removeItem("mansathi_counsellor_token");
        setIsLoggedIn(false);
        setAppointments([]);
        setSelectedAppointment(null);
    };

    const handleSendMessage = (event) => {
        event.preventDefault();
        const trimmed = chatText.trim();
        if (!trimmed || !socketRef.current || !selectedAppointment) {
            return;
        }

        socketRef.current.emit("send-message", { appointmentId: selectedAppointment._id, message: trimmed });
        setChatText("");
    };

    const handleCompleteAppointment = async () => {
        try {
            await API.post(`/counsellor-portal/appointments/${selectedAppointment._id}/complete`);
            setSelectedAppointment((current) => ({ ...current, status: "Completed" }));
            fetchAppointments();
            alert("Appointment marked as completed.");
        } catch {
            alert("Unable to complete appointment.");
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
                <Navbar />
                <main className="mx-auto flex max-w-3xl flex-col justify-center px-4 py-16">
                    <div className="rounded-[36px] border border-slate-200/80 bg-white/85 p-8 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Counsellor portal</h1>
                        <p className="mt-3 text-slate-600 dark:text-slate-400">Secure access for counsellors to manage appointments and chat conversations.</p>
                        <form onSubmit={handleLogin} className="mt-8 space-y-4">
                            <input value={loginState.email} onChange={(event) => setLoginState((current) => ({ ...current, email: event.target.value }))} placeholder="Email" className="w-full rounded-full border border-slate-300/70 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 dark:border-white/10 dark:bg-slate-900/80 dark:text-white" />
                            <input value={loginState.password} onChange={(event) => setLoginState((current) => ({ ...current, password: event.target.value }))} placeholder="Password" type="password" className="w-full rounded-full border border-slate-300/70 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 dark:border-white/10 dark:bg-slate-900/80 dark:text-white" />
                            <button type="submit" className="w-full rounded-full bg-linear-to-r from-violet-600 to-cyan-500 px-5 py-3 font-semibold text-white">
                                Sign in
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        );
    }

    if (selectedAppointment) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
                <Navbar />
                <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <button onClick={() => setSelectedAppointment(null)} className="rounded-full border border-slate-300/70 bg-white/90 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/10">
                            ← Back to appointments
                        </button>
                        <button onClick={handleLogout} className="rounded-full border border-slate-300/70 bg-white/90 px-4 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-white">
                            Logout
                        </button>
                    </div>

                    <section className="overflow-hidden rounded-4xl border border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
                        <div className="grid gap-0 lg:grid-cols-[1fr_0.35fr]">
                            <div className="flex min-h-140 flex-col bg-slate-50/80 dark:bg-slate-950/50">
                                <div className="border-b border-slate-200/80 px-6 py-4 dark:border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm uppercase tracking-[0.3em] text-cyan-700 dark:text-cyan-200">Chat with patient</p>
                                            <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{selectedAppointment?.user?.userName || "Patient"}</p>
                                        </div>
                                        <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-700 dark:text-emerald-200">{online ? "🟢 Online" : "⚪ Offline"}</div>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-1 overflow-y-auto px-4 py-4" role="log" aria-live="polite">
                                    {chatMessages.map((message, index) => {
                                        const isMyMessage = message.senderId && counsellorId ? String(message.senderId) === String(counsellorId) : false;
                                        const isConsecutive = index > 0 && chatMessages[index - 1]?.senderId && message.senderId && String(chatMessages[index - 1].senderId) === String(message.senderId);

                                        return <MessageBubble key={message._id || `${message.createdAt}-${message.message}-${index}`} message={message} isMyMessage={isMyMessage} senderName={selectedAppointment?.user?.userName || "Patient"} senderAvatar={selectedAppointment?.user?.profileImage || selectedAppointment?.user?.avatar} showAvatar={!isMyMessage && !isConsecutive} isConsecutive={isConsecutive} />;
                                    })}
                                    <div ref={bottomRef} />
                                </div>

                                <form onSubmit={handleSendMessage} className="border-t border-slate-200/80 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/50">
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <input value={chatText} onChange={(event) => setChatText(event.target.value)} placeholder={selectedAppointment?.status === "Completed" ? "This session has ended." : "Type your response..."} disabled={selectedAppointment?.status === "Completed"} className="flex-1 rounded-full border border-slate-300/70 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-900/80 dark:text-white" />
                                        <button type="submit" disabled={selectedAppointment?.status === "Completed"} className="rounded-full bg-linear-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                                            Send
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <aside className="border-t border-slate-200/80 bg-white/90 p-6 lg:border-l lg:border-t-0 dark:border-white/10 dark:bg-slate-900/50">
                                <div className="space-y-4">
                                    <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
                                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-700 dark:text-cyan-200">Appointment Status</p>
                                        <p className="mt-2 font-semibold text-slate-900 dark:text-white">{selectedAppointment?.status}</p>
                                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{new Date(selectedAppointment?.date).toLocaleString()}</p>
                                    </div>
                                    <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
                                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-700 dark:text-cyan-200">Session Details</p>
                                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Time: {selectedAppointment?.timeSlot || "Session time"}</p>
                                        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">Reason: {selectedAppointment?.reason || "General support"}</p>
                                    </div>
                                    {selectedAppointment?.status !== "Completed" && (
                                        <button onClick={handleCompleteAppointment} className="mt-6 w-full rounded-full bg-linear-to-r from-emerald-600 to-teal-500 px-4 py-3 text-sm font-semibold text-white hover:opacity-90">
                                            ✓ Mark as Completed
                                        </button>
                                    )}
                                </div>
                            </aside>
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-700 dark:text-cyan-200">Counsellor dashboard</p>
                        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Your appointments and chats</h1>
                    </div>
                    <button onClick={handleLogout} className="rounded-full border border-slate-300/70 bg-white/90 px-4 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-white">
                        Logout
                    </button>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-[28px] border border-slate-200/80 bg-white/85 p-5 text-slate-900 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white">Total appointments: {appointments.length}</div>
                    <div className="rounded-[28px] border border-slate-200/80 bg-white/85 p-5 text-slate-900 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white">Active chats: {appointments.filter((item) => item.status === "Confirmed" || item.status === "Pending").length}</div>
                    <div className="rounded-[28px] border border-slate-200/80 bg-white/85 p-5 text-slate-900 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white">Completed: {appointments.filter((item) => item.status === "Completed").length}</div>
                </div>

                <div className="mt-8 overflow-hidden rounded-4xl border border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
                    {loading ? (
                        <div className="p-8 text-slate-500 dark:text-slate-400">Loading...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-200">
                                <thead className="bg-slate-100/90 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                                    <tr>
                                        <th className="px-4 py-3">Patient</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Reason</th>
                                        <th className="px-4 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr key={appointment._id} className="border-t border-slate-200/80 hover:bg-slate-50/80 dark:border-white/10 dark:hover:bg-white/5">
                                            <td className="px-4 py-3">{appointment?.user?.userName || "Patient"}</td>
                                            <td className="px-4 py-3">{new Date(appointment.date).toLocaleString()}</td>
                                            <td className="px-4 py-3">{appointment.status}</td>
                                            <td className="px-4 py-3">{appointment.reason || "General support"}</td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => setSelectedAppointment(appointment)} className="rounded-full bg-linear-to-r from-cyan-500 to-blue-500 px-3 py-1 text-xs font-semibold text-white hover:opacity-90">
                                                    💬 Open Chat
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CounsellorPortal;
