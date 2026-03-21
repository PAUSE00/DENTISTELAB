import { useEffect, useState, useRef, ReactNode } from 'react';

interface ToastProps {
 message: string;
 type?: 'success' | 'error' | 'warning' | 'info';
 duration?: number;
 onClose: () => void;
}

const typeStyles: Record<string, { bg: string; icon: string }> = {
 success: { bg: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200', icon: '✓' },
 error: { bg: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200', icon: '✕' },
 warning: { bg: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200', icon: '⚠' },
 info: { bg: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200', icon: 'ℹ' },
};

function Toast({ message, type = 'success', duration = 4000, onClose }: ToastProps) {
 const [isVisible, setIsVisible] = useState(false);
 const [isExiting, setIsExiting] = useState(false);
 const timerRef = useRef<ReturnType<typeof setTimeout>>();

 useEffect(() => {
 setIsVisible(true);
 timerRef.current = setTimeout(() => {
 setIsExiting(true);
 setTimeout(onClose, 300);
 }, duration);
 return () => {
 if (timerRef.current) clearTimeout(timerRef.current);
 };
 }, [duration, onClose]);

 const style = typeStyles[type];

 return (
 <div
 className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm max-w-sm transition-all duration-300 ${style.bg} ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
 }`}
 >
 <span className="text-lg font-bold">{style.icon}</span>
 <p className="text-sm font-medium flex-1">{message}</p>
 <button onClick={() => { setIsExiting(true); setTimeout(onClose, 300); }} className="opacity-50 hover:opacity-100 transition-opacity text-lg">
 ×
 </button>
 </div>
 );
}

// Toast Container that manages multiple toasts
interface ToastData {
 id: string;
 message: string;
 type: 'success' | 'error' | 'warning' | 'info';
}

export function ToastContainer({ toasts, removeToast }: { toasts: ToastData[]; removeToast: (id: string) => void }) {
 return (
 <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
 {toasts.map(toast => (
 <Toast
 key={toast.id}
 message={toast.message}
 type={toast.type}
 onClose={() => removeToast(toast.id)}
 />
 ))}
 </div>
 );
}

// Hook for managing toasts
export function useToast() {
 const [toasts, setToasts] = useState<ToastData[]>([]);

 const addToast = (message: string, type: ToastData['type'] = 'success') => {
 const id = Date.now().toString() + Math.random().toString(36).slice(2);
 setToasts(prev => [...prev, { id, message, type }]);
 };

 const removeToast = (id: string) => {
 setToasts(prev => prev.filter(t => t.id !== id));
 };

 return { toasts, addToast, removeToast };
}

export default Toast;
