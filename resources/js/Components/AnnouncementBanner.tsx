import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { X, Info, AlertCircle, CheckCircle, Flame, ChevronRight } from 'lucide-react';

interface Announcement {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    target: 'all' | 'lab' | 'clinic';
    expires_at: string | null;
    created_at: string;
}

const typeConfig = {
    info:    { icon: Info,        color: '#38bdf8', bg: 'rgba(56,189,248,0.10)',  border: 'rgba(56,189,248,0.25)'  },
    warning: { icon: AlertCircle, color: '#fbbf24', bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.25)'  },
    success: { icon: CheckCircle, color: '#34d399', bg: 'rgba(52,211,153,0.10)', border: 'rgba(52,211,153,0.25)'  },
    error:   { icon: Flame,       color: '#f43f5e', bg: 'rgba(244,63,94,0.10)',  border: 'rgba(244,63,94,0.25)'   },
};

export default function AnnouncementBanner() {
    const { announcements } = usePage().props as any;
    const [dismissed, setDismissed] = useState<number[]>([]);

    if (!announcements || announcements.length === 0) return null;

    const visible = (announcements as Announcement[]).filter(a => !dismissed.includes(a.id));
    if (visible.length === 0) return null;

    return (
        <div className="flex flex-col gap-1.5 px-4 pt-2">
            {visible.map(a => {
                const cfg = typeConfig[a.type] ?? typeConfig.info;
                const Icon = cfg.icon;

                return (
                    <div
                        key={a.id}
                        className="flex items-start gap-3 px-4 py-2.5 rounded-xl text-[12.5px] font-medium leading-snug animate-fade-in"
                        style={{
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                            color: cfg.color,
                        }}
                    >
                        <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <span className="font-bold">{a.title}</span>
                            {a.message && (
                                <>
                                    <ChevronRight className="inline w-3 h-3 mx-1 opacity-60" />
                                    <span className="opacity-80">{a.message}</span>
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => setDismissed(prev => [...prev, a.id])}
                            className="shrink-0 p-0.5 rounded opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
