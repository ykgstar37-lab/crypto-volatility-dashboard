import { useState, useEffect } from 'react';

const ICONS = {
    alert: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    ),
    success: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    info: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

const COLORS = {
    alert: { bg: 'bg-amber-500/15', border: 'border-amber-500/30', icon: 'text-amber-500', bar: 'bg-amber-500' },
    success: { bg: 'bg-green-500/15', border: 'border-green-500/30', icon: 'text-green-500', bar: 'bg-green-500' },
    info: { bg: 'bg-blue-500/15', border: 'border-blue-500/30', icon: 'text-blue-500', bar: 'bg-blue-500' },
};

function ToastItem({ toast, onDismiss }) {
    const [exiting, setExiting] = useState(false);
    const [progress, setProgress] = useState(100);
    const duration = toast.duration || 5000;
    const c = COLORS[toast.type] || COLORS.info;

    useEffect(() => {
        const start = Date.now();
        const tick = setInterval(() => {
            const elapsed = Date.now() - start;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);
            if (remaining <= 0) clearInterval(tick);
        }, 30);
        return () => clearInterval(tick);
    }, [duration]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(() => onDismiss(toast.id), 300);
        }, duration);
        return () => clearTimeout(timer);
    }, [toast.id, duration, onDismiss]);

    const handleDismiss = () => {
        setExiting(true);
        setTimeout(() => onDismiss(toast.id), 300);
    };

    return (
        <div className={`relative overflow-hidden rounded-xl border backdrop-blur-xl shadow-lg transition-all duration-300 ${c.bg} ${c.border} ${
            exiting ? 'opacity-0 translate-x-12 scale-95' : 'opacity-100 translate-x-0 scale-100'
        }`}
            style={{ animation: exiting ? '' : 'slideIn 0.3s ease-out' }}>
            <div className="flex items-start gap-3 p-4 pr-10">
                <div className={`mt-0.5 shrink-0 ${c.icon}`}>{ICONS[toast.type] || ICONS.info}</div>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">{toast.title}</p>
                    {toast.message && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{toast.message}</p>}
                </div>
            </div>
            <button onClick={handleDismiss}
                className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/5 transition">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            {/* Progress bar */}
            <div className="h-[2px] w-full bg-black/5">
                <div className={`h-full ${c.bar} transition-all duration-100 ease-linear`} style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}

export default function ToastContainer({ toasts, onDismiss }) {
    if (!toasts.length) return null;

    return (
        <div className="fixed top-20 right-6 z-50 flex flex-col gap-2 w-80">
            {toasts.map(t => (
                <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
            ))}
            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(40px) scale(0.95); }
                    to { opacity: 1; transform: translateX(0) scale(1); }
                }
            `}</style>
        </div>
    );
}
