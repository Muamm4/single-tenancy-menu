import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

type ToastType = 'success' | 'error';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_DURATION = 4000;

const ToastItem: React.FC<{
    toast: Toast;
    onClose: (id: number) => void;
}> = ({ toast, onClose }) => {
    const [exiting, setExiting] = useState(false);
    const startTime = useRef(Date.now());
    const [remaining, setRemaining] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime.current;
            setRemaining(Math.max(0, 1 - elapsed / TOAST_DURATION));
        }, 16);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(() => onClose(toast.id), 300);
        }, TOAST_DURATION);
        return () => clearTimeout(timer);
    }, [toast.id, onClose]);

    const handleDismiss = () => {
        setExiting(true);
        setTimeout(() => onClose(toast.id), 300);
    };

    const isSuccess = toast.type === 'success';

    return (
        <div className={exiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}>
            <div
                className="flex flex-col rounded-xl shadow-lg bg-white border border-gray-200 overflow-hidden"
                role="alert"
            >
                <div className="relative flex items-start gap-3 p-4 pr-10 pb-3">
                    <div className="shrink-0 mt-0.5">
                        {isSuccess ? (
                            <CheckCircle size={20} className="text-green-500" />
                        ) : (
                            <AlertCircle size={20} className="text-destructive" />
                        )}
                    </div>

                    <p className="text-sm font-medium leading-snug text-gray-800">{toast.message}</p>

                    <button
                        onClick={handleDismiss}
                        className="absolute top-3 right-3 p-0.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Fechar"
                    >
                        <X size={14} />
                    </button>
                </div>

                <div className="h-1.5 bg-gray-100">
                    <div
                        className={`h-full ${isSuccess ? 'bg-green-600' : 'bg-destructive'}`}
                        style={{ width: `${remaining * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-3 right-4 z-50 flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto w-80 max-w-[calc(100vw-2rem)]">
                        <ToastItem toast={toast} onClose={removeToast} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
