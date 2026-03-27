import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    BellRing, Megaphone, Power, Calendar, Plus, AlertCircle,
    Info, CheckCircle, Flame, Trash2, X, ChevronRight, Radio,
    Building2, FlaskConical, Globe
} from 'lucide-react';
import { useState } from 'react';
import useTranslation from '@/Hooks/useTranslation';

interface Announcement {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    target: 'all' | 'lab' | 'clinic';
    is_active: boolean;
    expires_at: string | null;
    created_at: string;
}

const typeConfig = {
    info:    { icon: Info,        color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  border: 'rgba(56,189,248,0.3)',  label: 'Information' },
    warning: { icon: AlertCircle, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)',  label: 'Warning'     },
    success: { icon: CheckCircle, color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)',  label: 'Success'     },
    error:   { icon: Flame,       color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.3)',   label: 'Critical'    },
};

const targetConfig = {
    all:    { icon: Globe,        color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', label: 'Tous'     },
    lab:    { icon: FlaskConical, color: '#34d399', bg: 'rgba(52,211,153,0.12)',  label: 'Labs'     },
    clinic: { icon: Building2,    color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  label: 'Cliniques'},
};

function AnnouncementCard({ a, onToggle, onDelete }: {
    a: Announcement;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}) {
    const { t } = useTranslation();
    const cfg    = typeConfig[a.type]   ?? typeConfig.info;
    const tgtCfg = targetConfig[a.target] ?? targetConfig.all;
    const Icon    = cfg.icon;
    const TgtIcon = tgtCfg.icon;

    return (
        <div
            className="group rounded-2xl border flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
                background:   'var(--bg-raised)',
                borderColor:  a.is_active ? cfg.color : 'var(--border)',
                opacity:      a.is_active ? 1 : 0.55,
            }}
        >
            {/* Top bar */}
            <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                >
                    <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                        style={{ background: cfg.bg, color: cfg.color }}>
                        {t(cfg.label)}
                    </span>
                    {/* Target badge */}
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                        style={{ background: tgtCfg.bg, color: tgtCfg.color }}>
                        <TgtIcon className="w-2.5 h-2.5" />
                        {t(tgtCfg.label)}
                    </span>
                </div>
                {/* Toggle */}
                <button onClick={() => onToggle(a.id)} title={a.is_active ? t('Deactivate') : t('Activate')}
                    className="p-2 rounded-lg border transition-all"
                    style={{
                        background:   a.is_active ? cfg.bg      : 'var(--surface)',
                        borderColor:  a.is_active ? cfg.border  : 'var(--border)',
                        color:        a.is_active ? cfg.color   : 'var(--txt-3)',
                    }}>
                    <Power className="w-3.5 h-3.5" />
                </button>
                {/* Delete */}
                <button onClick={() => onDelete(a.id)} title={t('Delete')}
                    className="p-2 rounded-lg border transition-all hover:border-red-400 hover:text-red-400"
                    style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--txt-3)' }}>
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 flex flex-col gap-2">
                <h3 className="text-[15px] font-bold leading-snug" style={{ color: 'var(--txt-1)' }}>
                    {a.title}
                </h3>
                <p className="text-[13px] leading-relaxed flex-1" style={{ color: 'var(--txt-2)' }}>
                    {a.message}
                </p>
            </div>

            {/* Footer */}
            <div className="px-5 pb-4 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--txt-3)' }} />
                <span className="text-[11px] font-medium" style={{ color: 'var(--txt-3)' }}>
                    {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                {a.expires_at && (
                    <>
                        <ChevronRight className="w-3 h-3" style={{ color: 'var(--txt-3)' }} />
                        <span className="text-[11px] font-medium" style={{ color: 'var(--txt-3)' }}>
                            {t('Expires')} {new Date(a.expires_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    </>
                )}
                {a.is_active && (
                    <span className="ml-auto flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: cfg.color }} />
                            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: cfg.color }} />
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: cfg.color }}>{t('Live')}</span>
                    </span>
                )}
            </div>
        </div>
    );
}

export default function Announcements({ announcements }: PageProps<{ announcements: Announcement[] }>) {
    const { t } = useTranslation();
    const [isCreating, setIsCreating] = useState(false);
    const [filterTarget, setFilterTarget] = useState<'all' | 'lab' | 'clinic' | '_all_'>('_all_');

    const { data, setData, post, processing, reset, errors } = useForm({
        title:      '',
        message:    '',
        type:       'info' as 'info' | 'warning' | 'success' | 'error',
        target:     'all' as 'all' | 'lab' | 'clinic',
        is_active:  true,
        expires_at: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.announcements.store'), {
            onSuccess: () => { reset(); setIsCreating(false); }
        });
    };

    const handleToggle = (id: number) => {
        router.patch(route('admin.announcements.toggle', id), {}, { preserveScroll: true });
    };

    const handleDelete = (id: number) => {
        if (!confirm(t('Delete this announcement?'))) return;
        router.delete(route('admin.announcements.destroy', id), { preserveScroll: true });
    };

    const filtered = filterTarget === '_all_'
        ? announcements
        : announcements.filter(a => a.target === filterTarget);

    const active   = filtered.filter(a =>  a.is_active);
    const inactive = filtered.filter(a => !a.is_active);

    const segmentButtons: { key: '_all_' | 'all' | 'lab' | 'clinic'; label: string; icon: any }[] = [
        { key: '_all_', label: 'Tous',      icon: Radio      },
        { key: 'all',   label: 'Tous (Global)', icon: Globe  },
        { key: 'lab',   label: 'Labs',      icon: FlaskConical },
        { key: 'clinic',label: 'Cliniques', icon: Building2  },
    ];

    return (
        <AdminLayout header={t('Platform Broadcasts')}>
            <Head title={t('Announcements')} />

            <div className="animate-fade-in space-y-7 pb-12">

                {/* ── Header ─────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all hover:opacity-90 active:scale-95"
                        style={{
                            background:  isCreating ? 'var(--surface)' : 'var(--accent)',
                            color:       isCreating ? 'var(--txt-1)'   : '#fff',
                            border:      '1.5px solid var(--border)',
                            boxShadow:   isCreating ? 'none'           : '0 4px 20px var(--accent-20)',
                        }}
                    >
                        {isCreating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {isCreating ? t('Cancel') : t('New Broadcast')}
                    </button>
                </div>

                {/* ── Stats ──────────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(['all', 'info', 'warning', 'error'] as const).map(type => {
                        const count = type === 'all'
                            ? announcements.filter(a =>  a.is_active).length
                            : announcements.filter(a =>  a.is_active && a.type === type).length;
                        const cfg = type === 'all'
                            ? { color: 'var(--accent)', bg: 'var(--accent-10)', label: 'Live Now', icon: Radio }
                            : typeConfig[type];
                        const Icon = cfg.icon;
                        return (
                            <div key={type} className="rounded-xl p-4 flex items-center gap-3"
                                style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                                    <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                                </div>
                                <div>
                                    <p className="text-[20px] font-black leading-none" style={{ color: 'var(--txt-1)' }}>{count}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: 'var(--txt-3)' }}>
                                        {t(type === 'all' ? 'Live Now' : typeConfig[type].label)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Segment Filter ──────────────────────── */}
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>
                        {t('Segments Cibles')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {segmentButtons.map(({ key, label, icon: Icon }) => {
                            const isActive = filterTarget === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setFilterTarget(key)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold transition-all"
                                    style={{
                                        background:  isActive ? 'var(--accent)' : 'var(--surface)',
                                        color:       isActive ? '#fff'          : 'var(--txt-2)',
                                        border:      `1.5px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                                        boxShadow:   isActive ? '0 4px 14px var(--accent-20)' : 'none',
                                    }}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {t(label)}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Create Form ────────────────────────── */}
                {isCreating && (
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-2xl border animate-fade-in overflow-hidden"
                        style={{ background: 'var(--bg-raised)', borderColor: 'var(--accent)', boxShadow: '0 0 0 1px var(--accent-20)' }}
                    >
                        {/* Form header */}
                        <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)', background: 'var(--accent-10)' }}>
                            <BellRing className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                            <p className="text-[12px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                                {t('New Broadcast')}
                            </p>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Title */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>
                                        {t('Headline')} *
                                    </label>
                                    <div className="relative">
                                        <Megaphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--txt-3)' }} />
                                        <input
                                            type="text" required
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            className="w-full pl-11 pr-4 py-2.5 rounded-xl text-[13px] outline-none transition-all"
                                            style={{ background: 'var(--surface)', border: `1.5px solid ${errors.title ? '#f43f5e' : 'var(--border)'}`, color: 'var(--txt-1)' }}
                                            placeholder={t('e.g. Scheduled Maintenance')}
                                        />
                                    </div>
                                    {errors.title && <p className="text-[11px] text-red-400">{errors.title}</p>}
                                </div>

                                {/* Type */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>
                                        {t('Alert Type')} *
                                    </label>
                                    <div className="relative">
                                        <BellRing className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--txt-3)' }} />
                                        <select
                                            value={data.type}
                                            onChange={e => setData('type', e.target.value as typeof data.type)}
                                            className="w-full pl-11 pr-4 py-2.5 rounded-xl text-[13px] outline-none appearance-none cursor-pointer transition-all"
                                            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--txt-1)' }}
                                        >
                                            <option value="info">ℹ️  Information</option>
                                            <option value="warning">⚠️  Warning</option>
                                            <option value="success">✅  Success / Resolved</option>
                                            <option value="error">🔥  Critical Alert</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>
                                    {t('Message')} *
                                </label>
                                <textarea
                                    required
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    className="w-full p-4 rounded-xl text-[13px] outline-none transition-all h-28 resize-none"
                                    style={{ background: 'var(--surface)', border: `1.5px solid ${errors.message ? '#f43f5e' : 'var(--border)'}`, color: 'var(--txt-1)' }}
                                    placeholder={t('Describe the broadcast in detail...')}
                                />
                                {errors.message && <p className="text-[11px] text-red-400">{errors.message}</p>}
                            </div>

                            {/* Target Segment — pill selector */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>
                                    {t('Segment Cible')} *
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {(
                                        [
                                            { val: 'all',    label: 'Tous',      icon: Globe,        color: '#a78bfa' },
                                            { val: 'lab',    label: 'Labs',      icon: FlaskConical, color: '#34d399' },
                                            { val: 'clinic', label: 'Cliniques', icon: Building2,    color: '#38bdf8' },
                                        ] as const
                                    ).map(({ val, label, icon: Icon, color }) => {
                                        const active = data.target === val;
                                        return (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setData('target', val)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-full text-[12.5px] font-bold transition-all"
                                                style={{
                                                    background:  active ? color              : 'var(--surface)',
                                                    color:       active ? '#fff'             : 'var(--txt-2)',
                                                    border:      `1.5px solid ${active ? color : 'var(--border)'}`,
                                                    boxShadow:   active ? `0 4px 14px ${color}55` : 'none',
                                                }}
                                            >
                                                <Icon className="w-3.5 h-3.5" />
                                                {t(label)}
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.target && <p className="text-[11px] text-red-400">{errors.target}</p>}
                            </div>

                            {/* Expires at + active toggle */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>
                                        {t('Expires At')} ({t('optional')})
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.expires_at}
                                        onChange={e => setData('expires_at', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none transition-all"
                                        style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--txt-1)' }}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>
                                        {t('Visibility')}
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_active', !data.is_active)}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border font-semibold text-[13px] transition-all"
                                        style={{
                                            background:  data.is_active ? 'rgba(52,211,153,0.1)' : 'var(--surface)',
                                            borderColor: data.is_active ? 'rgba(52,211,153,0.4)' : 'var(--border)',
                                            color:       data.is_active ? '#34d399'              : 'var(--txt-2)',
                                        }}
                                    >
                                        <Power className="w-4 h-4" />
                                        {data.is_active ? t('Publish immediately') : t('Save as draft')}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t flex justify-end gap-3"
                            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                            <button type="button" onClick={() => { reset(); setIsCreating(false); }}
                                className="px-5 py-2.5 text-[12px] font-semibold rounded-lg transition-colors hover:text-[var(--accent)]"
                                style={{ color: 'var(--txt-3)' }}>
                                {t('Cancel')}
                            </button>
                            <button type="submit" disabled={processing}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-[13px] transition-all hover:opacity-90 disabled:opacity-50 active:scale-95"
                                style={{ background: 'var(--accent)', boxShadow: '0 4px 16px var(--accent-20)' }}>
                                <Megaphone className="w-4 h-4" />
                                {processing ? t('Publishing...') : t('Publish Broadcast')}
                            </button>
                        </div>
                    </form>
                )}

                {/* ── Active Announcements ───────────────── */}
                {active.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                            </span>
                            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>
                                {t('Active')} — {active.length}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {active.map(a => (
                                <AnnouncementCard key={a.id} a={a} onToggle={handleToggle} onDelete={handleDelete} />
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Inactive Announcements ─────────────── */}
                {inactive.length > 0 && (
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>
                            {t('Inactive / Drafts')} — {inactive.length}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {inactive.map(a => (
                                <AnnouncementCard key={a.id} a={a} onToggle={handleToggle} onDelete={handleDelete} />
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Empty State ────────────────────────── */}
                {announcements.length === 0 && !isCreating && (
                    <div className="py-24 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed"
                        style={{ borderColor: 'var(--border)' }}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-10)' }}>
                            <Megaphone className="w-7 h-7" style={{ color: 'var(--accent)' }} />
                        </div>
                        <p className="font-bold text-[15px]" style={{ color: 'var(--txt-1)' }}>{t('No Broadcasts Yet')}</p>
                        <p className="text-[13px]" style={{ color: 'var(--txt-3)' }}>{t('Create your first system-wide broadcast to get started.')}</p>
                        <button onClick={() => setIsCreating(true)}
                            className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all hover:opacity-90"
                            style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 20px var(--accent-20)' }}>
                            <Plus className="w-4 h-4" />
                            {t('New Broadcast')}
                        </button>
                    </div>
                )}

                {filtered.length === 0 && announcements.length > 0 && (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed"
                        style={{ borderColor: 'var(--border)' }}>
                        <p className="font-bold text-[14px]" style={{ color: 'var(--txt-1)' }}>{t('No announcements for this segment')}</p>
                        <button onClick={() => setFilterTarget('_all_')}
                            className="text-[12px] font-semibold transition-colors hover:text-[var(--accent)]"
                            style={{ color: 'var(--txt-3)' }}>
                            {t('Show all segments')}
                        </button>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
}
