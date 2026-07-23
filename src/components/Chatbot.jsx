import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { chatApi } from "../services/api";

const CHAT_STORAGE_KEY = "mansathi_chat_session";

const getStoredSession = () => {
    if (typeof window === "undefined") return null;
    try {
        const stored = window.sessionStorage.getItem(CHAT_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const persistSession = (messages) => {
    if (typeof window === "undefined") return;
    try {
        window.sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
        // Ignore storage errors.
    }
};

const clearStoredSession = () => {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(CHAT_STORAGE_KEY);
    window.localStorage.removeItem(CHAT_STORAGE_KEY);
};

const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const Chatbot = () => {
    const navigate = useNavigate();
    const { pushToast } = useToast();
    const [messages, setMessages] = useState([]);
    const [draft, setDraft] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isClearing, setIsClearing] = useState(false);
    const endRef = useRef(null);

    useEffect(() => {
        const loadHistory = async () => {
            const storedSession = getStoredSession();
            if (Array.isArray(storedSession) && storedSession.length) {
                setMessages(storedSession);
                return;
            }

            const chats = await chatApi.history();
            const latest = Array.isArray(chats) && chats.length ? chats[0] : null;
            if (latest?.messages?.length) {
                const normalizedMessages = latest.messages.map((message) => ({
                    role: message.role,
                    content: message.content,
                    timestamp: message.createdAt,
                }));
                setMessages(normalizedMessages);
                persistSession(normalizedMessages);
            } else {
                clearStoredSession();
            }
        };

        void loadHistory();
    }, []);

    useEffect(() => {
        persistSession(messages);
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const filteredMessages = useMemo(() => {
        if (!searchQuery.trim()) return messages;
        return messages.filter((message) => message.content.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [messages, searchQuery]);

    const handleSend = async (event) => {
        event.preventDefault();
        const trimmed = draft.trim();
        if (!trimmed) return;

        const userMessage = { role: "user", content: trimmed, timestamp: new Date().toISOString() };
        setMessages((current) => [...current, userMessage]);
        setDraft("");
        setLoading(true);

        try {
            const response = await chatApi.send({ message: trimmed });
            setMessages((current) => [...current, { role: "assistant", content: response.reply, timestamp: new Date().toISOString() }]);
        } catch {
            pushToast("The assistant could not respond right now.", "error");
        } finally {
            setLoading(false);
        }
    };

    const clearChat = async () => {
        if (isClearing) return;
        setIsClearing(true);

        try {
            const response = await chatApi.clear();
            if (response?.success) {
                setMessages([]);
                clearStoredSession();
                setDraft("");
                setSearchQuery("");
                pushToast("Chat history cleared successfully.", "success");
            } else {
                pushToast("We could not clear the chat history right now.", "error");
            }
        } catch {
            pushToast("We could not clear the chat history right now.", "error");
        } finally {
            setIsClearing(false);
        }
    };

    const copyMessage = async (content) => {
        try {
            await navigator.clipboard.writeText(content);
            pushToast("Message copied.", "success");
        } catch {
            pushToast("Copy failed.", "error");
        }
    };

    return (
        <div className="min-h-screen page-shell px-4 py-6 text-body transition-colors duration-200 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-4">
                <div className="flex items-center justify-between rounded-3xl border border-slate-200/70 bg-white/80 px-4 py-4 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/30">
                    <div>
                        <p className="text-sm text-cyan-600 dark:text-cyan-200">ManSathi AI companion</p>
                        <h1 className="text-2xl font-semibold">Your supportive conversation space</h1>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => navigate(-1)} className="rounded-full border border-slate-300/70 bg-white/90 px-3 py-2 text-sm text-slate-700 transition hover:scale-105 dark:border-white/10 dark:bg-white/10 dark:text-white">
                            Back
                        </button>
                        <button type="button" onClick={clearChat} disabled={isClearing} className="rounded-full border border-rose-300/70 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 dark:border-rose-400/20 dark:text-rose-200">
                            {isClearing ? "Clearing..." : "Clear chat"}
                        </button>
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-3 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-cyan-950/30">
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search conversation" className="w-full rounded-full border border-slate-300/70 bg-white/90 px-4 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white sm:max-w-xs" />
                        <div className="text-sm text-slate-500 dark:text-slate-400">{messages.length} messages</div>
                    </div>

                    <div className="flex h-[60vh] flex-col gap-3 overflow-y-auto rounded-3xl bg-slate-50/80 p-3 dark:bg-slate-950/40">
                        {filteredMessages.length === 0 ? (
                            <div className="flex h-full items-center justify-center rounded-[20px] border border-dashed border-slate-300/70 p-6 text-center text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">Start a conversation and I’ll support you with calm guidance, grounding suggestions, and reflection prompts.</div>
                        ) : (
                            filteredMessages.map((message, index) => (
                                <motion.div key={`${message.role}-${index}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`max-w-[90%] rounded-[20px] border px-4 py-3 ${message.role === "user" ? "ml-auto border-cyan-500/20 bg-cyan-500/10 text-slate-900 dark:text-white" : "border-slate-200/70 bg-white/90 text-slate-800 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100"}`}>
                                    <div className="whitespace-pre-wrap text-sm leading-7">{message.content}</div>
                                    <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                                        <span>{formatTime(message.timestamp)}</span>
                                        {message.role === "assistant" && (
                                            <button type="button" onClick={() => copyMessage(message.content)} className="rounded-full px-2 py-1 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                                                Copy
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                        {loading && (
                            <div className="max-w-[90%] rounded-[20px] border border-slate-200/70 bg-white/90 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-500" />
                                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-500 [animation-delay:120ms]" />
                                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:240ms]" />
                                </div>
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>

                    <form onSubmit={handleSend} className="mt-3 flex flex-col gap-3 rounded-[20px] border border-slate-200/70 bg-white/90 p-3 dark:border-white/10 dark:bg-slate-950/60 sm:flex-row">
                        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows="2" placeholder="Share how you’re feeling..." className="min-h-24 flex-1 rounded-2xl border border-slate-300/70 bg-white/90 px-3 py-3 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-slate-900/80 dark:text-white" />
                        <div className="flex flex-col gap-2 sm:w-36">
                            <button type="submit" className="rounded-full bg-linear-to-r from-violet-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:scale-105">
                                Send
                            </button>
                            <button type="button" onClick={() => navigate("/checkup")} className="rounded-full border border-slate-300/70 bg-white/90 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-white">
                                Checkup
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
