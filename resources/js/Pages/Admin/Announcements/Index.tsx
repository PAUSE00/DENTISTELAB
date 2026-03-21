import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { BellRing, Megaphone, Power, Calendar, Settings2, Plus, AlertCircle, Info, CheckCircle, Flame } from 'lucide-react';
import { useState } from 'react';
import useTranslation from '@/Hooks/useTranslation';

interface Announcement {
    id: number;
    title: string;
    message: string;
    type: string;
    is_active: boolean;
    created_at: string;
}

export default function Announcements({ announcements }: PageProps<{ announcements: Announcement[] }>) {
    const { t } = useTranslation();
    const [isCreating, setIsCreating] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        title: '', message: '', type: 'info', is_active: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.announcements.store'), {
            onSuccess: () => { reset(); setIsCreating(false); }
        });
    };

    const getTypeDetails = (type: string) => {
        switch(type) {
            case 'error': return { icon: Flame, color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.25)' };
            case 'warning': return { icon: AlertCircle, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)' };
            case 'success': return { icon: CheckCircle, color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' };
            default: return { icon: Info, color: '#38bdf8', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.25)' };
        }
    };

    return (
        <AdminLayout header={t('Platform Broadcasts')}>
            <Head title={t('Announcements')} />

            <div className="animate-fade-in space-y-6 pb-12">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>
                            {t('Network Alerts')}
                        </p>
                        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--txt-1)' }}>
                            {t('Global')} <span style={{ color: 'var(--accent)' }}>{t('Broadcasts')}</span>
                        </h2>
                    </div>
                    <button 
                        onClick={() => setIsCreating(!isCreating)} 
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all hover:opacity-90"
                        style={{ background: '#34d399', color: '#0d1f1a', boxShadow: '0 4px 16px rgba(52,211,153,0.3)' }}
                    >
                        {isCreating ? <Settings2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {isCreating ? t('Cancel Creation') : t('New Broadcast')}
                    </button>
                </div>

                {/* Create Form */}
                {isCreating && (
                    <form onSubmit={handleSubmit} className="rounded-2xl border animate-fade-in" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                        <div className="p-6 md:p-8 space-y-6">
                            
                            <div className="flex items-center gap-2.5">
                                <div className="w-4 h-px" style={{ background: 'var(--accent)' }} />
                                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>{t('Broadcast Details')}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Headline')}</label>
                                    <div className="relative">
                                        <Megaphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                                        <input 
                                            type="text" 
                                            required 
                                            value={data.title} 
                                            onChange={e=>setData('title', e.target.value)} 
                                            className="w-full pl-[42px] pr-4 py-2.5 rounded-xl text-[13px] outline-none transition-all" 
                                            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--txt-1)' }}
                                            placeholder="System Maintenance Notice" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Alert Type')}</label>
                                    <div className="relative">
                                        <BellRing className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                                        <select 
                                            value={data.type} 
                                            onChange={e=>setData('type', e.target.value)} 
                                            className="w-full pl-[42px] pr-4 py-2.5 rounded-xl text-[13px] outline-none transition-all appearance-none cursor-pointer"
                                            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--txt-1)' }}
                                        >
                                            <option value="info">Information (Blue)</option>
                                            <option value="warning">Warning Notice (Yellow)</option>
                                            <option value="success">Success / Resolved (Green)</option>
                                            <option value="error">Critical Alert (Red)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Message Payload')}</label>
                                <textarea 
                                    required 
                                    value={data.message} 
                                    onChange={e=>setData('message', e.target.value)} 
                                    className="w-full p-4 rounded-xl text-[13px] outline-none transition-all h-28 resize-none" 
                                    style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--txt-1)' }}
                                    placeholder="Provide detailed information regarding this broadcast..." 
                                />
                            </div>
                        </div>

                        <div className="px-6 md:px-8 py-4 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                            <button 
                                type="button" 
                                onClick={()=>setIsCreating(false)} 
                                className="px-5 py-2.5 text-[12px] font-semibold transition-colors hover:text-[var(--accent)]"
                                style={{ color: 'var(--txt-3)' }}
                            >
                                {t('Cancel')}
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-[13px] transition-all hover:opacity-90 disabled:opacity-50"
                                style={{ background: 'var(--accent)', color: '#0d1f1a', boxShadow: '0 4px 16px var(--accent-20)' }}
                            >
                                <Megaphone className="w-4 h-4 -ml-1" />
                                {t('Publish Broadcast')}
                            </button>
                        </div>
                    </form>
                )}

                {/* Layout Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {announcements.length === 0 && !isCreating && (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center gap-3">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                <Megaphone className="w-6 h-6" style={{ color: 'var(--txt-3)' }} />
                            </div>
                            <p className="font-bold text-[14px]" style={{ color: 'var(--txt-1)' }}>{t('No Active Broadcasts')}</p>
                            <p className="text-[12px]" style={{ color: 'var(--txt-3)' }}>{t('The network is currently quiet.')}</p>
                        </div>
                    )}
                    {announcements.map(a => {
                        const styleConfig = getTypeDetails(a.type);
                        const Icon = styleConfig.icon;
                        
                        return (
                            <div 
                                key={a.id} 
                                className="group rounded-2xl border flex flex-col h-full transition-all hover:-translate-y-0.5" 
                                style={{ 
                                    background: 'var(--bg-raised)', 
                                    borderColor: a.is_active ? styleConfig.color : 'var(--border)',
                                    opacity: a.is_active ? 1 : 0.6,
                                }}
                            >
                                {/* Header */}
                                <div className="p-5 flex items-start justify-between gap-3 border-b" style={{ borderColor: 'var(--border)' }}>
                                    <div 
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                                        style={{ background: styleConfig.bg, borderColor: styleConfig.border, color: styleConfig.color }}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <button 
                                        onClick={() => {
                                            const toggleForm = useForm();
                                            toggleForm.patch(route('admin.announcements.toggle', a.id));
                                        }} 
                                        className="p-2.5 rounded-xl border transition-all"
                                        style={{ 
                                            background: a.is_active ? styleConfig.bg : 'var(--surface)', 
                                            borderColor: a.is_active ? styleConfig.border : 'var(--border)',
                                            color: a.is_active ? styleConfig.color : 'var(--txt-3)'
                                        }}
                                        title={a.is_active ? t('Deactivate') : t('Activate')}
                                    >
                                        <Power className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                
                                {/* Body */}
                                <div className="p-5 flex-1 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border" style={{ background: styleConfig.bg, borderColor: styleConfig.border, color: styleConfig.color }}>
                                            {t(a.type)}
                                        </span>
                                    </div>
                                    <h3 className="text-[15px] font-bold leading-tight" style={{ color: 'var(--txt-1)' }}>{a.title}</h3>
                                    <p className="text-[13px] leading-relaxed mt-1" style={{ color: 'var(--txt-2)' }}>{a.message}</p>
                                </div>

                                {/* Footer */}
                                <div className="p-5 pt-0 mt-auto flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--txt-3)' }} />
                                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>
                                        {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}
