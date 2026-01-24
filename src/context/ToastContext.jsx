
import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, ShoppingBag } from "lucide-react";

const ToastContext = createContext({
    showToast: (message, type = "success") => { },
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    // type: 'success' | 'error' | 'info' | 'cart'
    const showToast = useCallback((message, type = "success") => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto dismiss
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, removeToast }) {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        cart: <ShoppingBag className="w-5 h-5 text-primary" />,
    };

    const bgColors = {
        success: "bg-white border-green-100",
        error: "bg-white border-red-100",
        info: "bg-white border-blue-100",
        cart: "bg-white border-primary/20",
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-lg border ${bgColors[toast.type] || bgColors.success} min-w-[300px] backdrop-blur-sm bg-opacity-95`}
        >
            <div className={`p-2 rounded-full ${toast.type === 'cart' ? 'bg-primary/10' : 'bg-secondary/50'}`}>
                {icons[toast.type] || icons.success}
            </div>

            <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800 leading-snug">
                    {toast.message}
                </p>
            </div>

            <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
