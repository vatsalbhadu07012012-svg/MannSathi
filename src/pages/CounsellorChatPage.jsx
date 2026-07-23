import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";
import { MessageBubble, getMessageOwnership } from "../components/ChatComponents";
import socketService from "../services/socketService";
import axios from "axios";

const API = axios.create({ baseURL: "https://mannsathi-backend.onrender.com:3000/api", withCredentials: true });

const CounsellorChatPage = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const { pushToast } = useToast();

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [room, setRoom] = useState(null);
    const [appointment, setAppointment] = useState(null);
    const [online, setOnline] = useState(true);
    const [typing, setTyping] = useState(false);
    const [sending, setSending] = useState(false);

    const socketRef = useRef(null);
    const bottomRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (!appointmentId) return;

        const loadChat = async () => {
            try {
                const response = await API.get(`/counsellor-chat/${appointmentId}`);
                if (response?.data?.success) {
                    setRoom(response.data.room);
                    setAppointment(response.data.appointment);
                    setMessages(response.data.messages || []);
                }
            } catch (error) {
                pushToast("Unable to load this chat right now.", "error");
                navigate("/counsellors");
            }
        };

        loadChat();
    }, [appointmentId, navigate, pushToast]);

    useEffect(() => {
        if (!user || !appointmentId) return;

        const token = localStorage.getItem("mansathi_token") || localStorage.getItem("mansathi_counsellor_token");
        const socket = socketService.init(token);
        socketRef.current = socket;

        const onConnect = () => {
            setOnline(true);
            socketService.emit("join-room", { appointmentId });
        };

        const onDisconnect = () => setOnline(false);

        const onRoomJoined = ({ roomId }) => setRoom((cur) => ({ ...cur, roomId }));

        const onHistory = (history) => setMessages(history || []);

        const onNewMessage = (message) => {
            setMessages((cur) => {
                const exists = cur.some((m) => m._id === message._id || (m.tempId && message.tempId && m.tempId === message.tempId));
                if (exists) return cur;
                return [...cur, message];
            });
        };

        const onMessageSent = ({ tempId, message }) => {
            setMessages((cur) => cur.map((m) => (m.tempId === tempId ? message : m)));
            setSending(false);
        };

        const onSendError = ({ tempId, error }) => {
            setMessages((cur) => cur.map((m) => (m.tempId === tempId ? { ...m, failed: true } : m)));
            setSending(false);
            pushToast(error || "Unable to send message.", "error");
        };

        const onTyping = ({ isTyping: t }) => setTyping(t);

        socketService.on("connect", onConnect);
        socketService.on("disconnect", onDisconnect);
        socketService.on("room-joined", onRoomJoined);
        socketService.on("history", onHistory);
        socketService.on("new-message", onNewMessage);
        socketService.on("message-sent", onMessageSent);
        socketService.on("send-message-error", onSendError);
        socketService.on("typing", onTyping);

        return () => {
            socketService.off("connect", onConnect);
            socketService.off("disconnect", onDisconnect);
            socketService.off("room-joined", onRoomJoined);
            socketService.off("history", onHistory);
            socketService.off("new-message", onNewMessage);
            socketService.off("message-sent", onMessageSent);
            socketService.off("send-message-error", onSendError);
            socketService.off("typing", onTyping);
        };
    }, [appointmentId, user, pushToast]);

    useEffect(() => {
        requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        });
    }, [messages, typing]);

    const handleSend = (event) => {
        event.preventDefault();
        const trimmed = text.trim();
        const currentUserId = user?._id || user?.id || null;
        if (!trimmed || !socketRef.current || !appointmentId || !currentUserId) return;

        const tempId = `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const optimisticMessage = {
            tempId,
            appointmentId,
            roomId: room?.roomId || `room-${appointmentId}`,
            senderId: currentUserId,
            senderType: "user",
            receiverId: appointment?.counsellor?._id || appointment?.counsellor?.id || null,
            message: trimmed,
            messageType: "text",
            delivered: false,
            seen: false,
            isOptimistic: true,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setText("");
        setSending(true);

        socketService.emit("send-message", { appointmentId, message: trimmed, tempId });
    };

    const handleInputChange = (e) => {
        setText(e.target.value);
        socketService.emit("typing", { appointmentId, isTyping: true });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => socketService.emit("typing", { appointmentId, isTyping: false }), 1200);
    };

    const statusLabel = useMemo(() => {
        if (appointment?.status === "Completed") return "Completed";
        return appointment?.status || "Active";
    }, [appointment]);

    if (loading && !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
                <div className="rounded-3xl border border-slate-200/70 bg-white/80 px-6 py-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">Loading your chat session…</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <Navbar />
            <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8">
                <section className="overflow-hidden rounded-4xl border border-white/10 bg-white/10 backdrop-blur-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Private counselling chat</p>
                            <h1 className="text-2xl font-semibold">{appointment?.counsellor ? "Booked counsellor chat" : "Your counselling room"}</h1>
                        </div>
                        <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">{online ? "🟢 Online" : "⚪ Offline"}</div>
                    </div>

                    <div className="grid gap-0 lg:grid-cols-[0.95fr_0.4fr]">
                        <div className="flex min-h-140 flex-col bg-slate-50/80 dark:bg-slate-950/50">
                            <div className="flex items-center gap-4 border-b border-white/10 px-6 py-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-cyan-400 font-semibold text-white">{appointment?.counsellor?.fullName?.charAt(0) || "C"}</div>
                                <div>
                                    <p className="font-semibold">{appointment?.counsellor?.fullName || "Your counsellor"}</p>
                                    <p className="text-sm text-slate-400">{appointment?.counsellor?.qualification || "Qualified counsellor"}</p>
                                </div>
                            </div>

                            <div className="flex-1 space-y-1 overflow-y-auto px-4 py-4" role="log" aria-live="polite">
                                {messages.map((message, index) => {
                                    const currentUserId = user?._id || user?.id || null;
                                    const isMyMessage = getMessageOwnership(message, currentUserId);
                                    const isConsecutive = index > 0 && messages[index - 1]?.senderId && message.senderId && String(messages[index - 1].senderId) === String(message.senderId);

                                    return <MessageBubble key={message._id || message.tempId || `${message.createdAt}-${index}`} message={message} isMyMessage={isMyMessage} senderName={appointment?.counsellor?.fullName || "Counsellor"} senderAvatar={appointment?.counsellor?.profileImage || appointment?.counsellor?.avatar} showAvatar={!isMyMessage && !isConsecutive} isConsecutive={isConsecutive} />;
                                })}
                                {typing && <div className="py-2 text-sm text-slate-400">Your counsellor is typing...</div>}
                                <div ref={bottomRef} />
                            </div>

                            <form onSubmit={handleSend} className="border-t border-white/10 p-4">
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <input value={text} onChange={handleInputChange} placeholder={appointment?.status === "Completed" ? "This counselling session has ended." : "Type your message..."} disabled={appointment?.status === "Completed"} className="flex-1 rounded-full border border-slate-300/70 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-900/80 dark:text-white" />
                                    <button type="submit" disabled={appointment?.status === "Completed" || sending} className="rounded-full bg-linear-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                                        Send
                                    </button>
                                </div>
                            </form>
                        </div>

                        <aside className="border-t border-slate-200/70 bg-white/90 p-6 lg:border-l lg:border-t-0 dark:border-white/10 dark:bg-slate-900/50">
                            <div className="space-y-4">
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Appointment</p>
                                    <p className="mt-2 font-semibold text-white">{statusLabel}</p>
                                    <p className="mt-2 text-sm text-slate-400">{appointment?.date ? new Date(appointment.date).toLocaleString() : "Scheduled"}</p>
                                    <p className="mt-2 text-sm text-slate-400">{appointment?.timeSlot || "Session time"}</p>
                                </div>
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Appointment details</p>
                                    <p className="mt-2 text-sm text-slate-300">Reason: {appointment?.reason || "General support"}</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CounsellorChatPage;
