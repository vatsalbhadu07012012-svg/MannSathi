import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FloatingChatButton = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
            {open && <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-3 text-sm text-slate-700 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90 dark:text-slate-100">Need a calm check-in? Open the assistant.</div>}
            <button type="button" onClick={() => navigate("/chat")} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-violet-600 to-cyan-500 text-2xl text-white shadow-lg transition hover:scale-105">
                💬
            </button>
        </div>
    );
};

export default FloatingChatButton;
