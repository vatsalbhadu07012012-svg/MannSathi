/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const pushToast = (message, type = "info") => {
        const id = Date.now();
        setToasts((current) => [...current, { id, message, type }]);
        setTimeout(() => {
            setToasts((current) => current.filter((toast) => toast.id !== id));
        }, 3200);
    };

    const value = useMemo(() => ({ toasts, pushToast }), [toasts]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`rounded-2xl border px-4 py-3 text-sm shadow-2xl backdrop-blur ${toast.type === "error" ? "border-rose-400/40 bg-rose-500/15 text-rose-700 dark:text-rose-100" : "border-cyan-400/30 bg-white/90 text-slate-800 dark:bg-slate-900/80 dark:text-slate-100"}`}>
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
