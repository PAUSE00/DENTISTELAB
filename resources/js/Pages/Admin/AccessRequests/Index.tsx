import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Building2, FlaskConical, Clock, CheckCircle2, XCircle,
    Mail, Phone, User2, MessageSquare, CalendarDays, ChevronRight,
    UserPlus, LayoutGrid, List
} from 'lucide-react';
import { useState } from 'react';
import useTranslation from '@/Hooks/useTranslation';

interface AccessRequest {
    id: number;
    full_name: string;
    company_name: string;
    email: string;
    phone: string | null;
    type: 'clinic' | 'lab';
    message: string | null;
    status: 'pending' | 'approved' | 'rejected';
    reviewed_at: string | null;
    created_at: string;
}

const statusCfg = {
    pending:  { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)',  label: 'Pending',  icon: Clock         },
    approved: { color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)',  label: 'Approved', icon: CheckCircle2  },
    rejected: { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.3)',   label: 'Rejected', icon: XCircle       },
};

const typeCfg = {
    clinic: { icon: Building2,    color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  label: 'Clinique' },
    lab:    { icon: FlaskConical, color: '#34d399', bg: 'rgba(52,211,153,0.12)', label: 'Laboratoire' },
};

function RequestCard({ req }: { req: AccessRequest }) {
    const { t } = useTranslation();
    const st  = statusCfg[req.status];
    const tp  = typeCfg[req.type];
    const StIcon = st.icon;
    const TpIcon = tp.icon;

    const handleApprove = () => {
        // Navigate to create user form pre-filled with this request's data
        router.get(route('admin.users.create'), {
            prefill_name:    req.full_name,
            prefill_email:   req.email,
            prefill_role:    req.type === 'clinic' ? 'dentist' : 'lab_owner',
            prefill_company: req.company_name,
            from_request:    req.id,
        });
    };

    const handleReject = () => {
        if (!confirm(t('Reject this request?'))) return;
        router.post(route('admin.access-requests.reject', req.id), {}, { preserveScroll: true });
    };

    return (
        <div className="rounded-2xl border flex flex-col transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>

            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: tp.bg }}>
                    <TpIcon className="w-4 h-4" style={{ color: tp.color }} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold truncate" style={{ color: 'var(--txt-1)' }}>{req.full_name}</p>
                    <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--txt-3)' }}>{req.company_name}</p>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
                    style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                    <StIcon className="w-3 h-3" />
                    {t(st.label)}
                </span>
            </div>

            {/* Body */}
            <div className="p-5 space-y-3 flex-1">
                <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--txt-3)' }} />
                    <a href={`mailto:${req.email}`} className="text-[12.5px] hover:underline truncate"
                        style={{ color: 'var(--accent)' }}>{req.email}</a>
                </div>
                {req.phone && (
                    <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--txt-3)' }} />
                        <span className="text-[12.5px]" style={{ color: 'var(--txt-2)' }}>{req.phone}</span>
                    </div>
                )}
                {req.message && (
                    <div className="flex items-start gap-2">
                        <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--txt-3)' }} />
                        <p className="text-[12px] leading-relaxed line-clamp-3" style={{ color: 'var(--txt-2)' }}>
                            {req.message}
                        </p>
                    </div>
                )}
                <div className="flex items-center gap-2 pt-1">
                    <CalendarDays className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--txt-3)' }} />
                    <span className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
                        {new Date(req.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            {/* Actions */}
            {req.status === 'pending' && (
                <div className="p-4 border-t flex gap-2" style={{ borderColor: 'var(--border)' }}>
                    <button
                        onClick={handleApprove}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold transition-all hover:opacity-90"
                        style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}
                    >
                        <UserPlus className="w-3.5 h-3.5" />
                        {t('Create Account')}
                    </button>
                    <button
                        onClick={handleReject}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold transition-all hover:opacity-90"
                        style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.25)' }}
                    >
                        <XCircle className="w-3.5 h-3.5" />
                        {t('Reject')}
                    </button>
                </div>
            )}
            {req.status !== 'pending' && (
                <div className="px-5 pb-4 text-[11px] font-medium" style={{ color: 'var(--txt-3)' }}>
                    {req.reviewed_at
                        ? `${t('Reviewed')} ${new Date(req.reviewed_at).toLocaleDateString('fr-FR')}`
                        : ''}
                </div>
            )}
        </div>
    );
}

export default function AccessRequestsIndex({ requests, counts }: PageProps<{
    requests: AccessRequest[];
    counts: { pending: number; approved: number; rejected: number };
}>) {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

    const visible = filter === 'all' ? requests : requests.filter(r => r.status === filter);

    return (
        <AdminLayout header={t('Access Requests')}>
            <Head title={t('Access Requests')} />

            <div className="animate-fade-in space-y-7 pb-12">

                {/* Header */}
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>
                        {t('Onboarding')}
                    </p>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--txt-1)' }}>
                        {t('Panel')} <span style={{ color: 'var(--accent)' }}>{t('Access Requests')}</span>
                    </h2>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {([
                        { key: 'pending',  label: 'Pending',  color: '#fbbf24', icon: Clock        },
                        { key: 'approved', label: 'Approved', color: '#34d399', icon: CheckCircle2 },
                        { key: 'rejected', label: 'Rejected', color: '#f43f5e', icon: XCircle      },
                    ] as const).map(({ key, label, color, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(filter === key ? 'all' : key)}
                            className="rounded-xl p-4 flex items-center gap-3 text-left transition-all hover:opacity-90"
                            style={{
                                background: filter === key ? `rgba(${color.match(/\d+/g)?.slice(0,3).join(',')},0.15)` : 'var(--bg-raised)',
                                border: `1.5px solid ${filter === key ? color : 'var(--border)'}`,
                            }}
                        >
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: `${color}22` }}>
                                <Icon className="w-4 h-4" style={{ color }} />
                            </div>
                            <div>
                                <p className="text-[20px] font-black leading-none" style={{ color: 'var(--txt-1)' }}>
                                    {counts[key]}
                                </p>
                                <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: 'var(--txt-3)' }}>
                                    {t(label)}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {visible.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {visible.map(r => <RequestCard key={r.id} req={r} />)}
                    </div>
                ) : (
                    <div className="py-20 flex flex-col items-center gap-4 rounded-2xl border border-dashed"
                        style={{ borderColor: 'var(--border)' }}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center"
                            style={{ background: 'var(--accent-10)' }}>
                            <User2 className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                        </div>
                        <p className="font-bold text-[14px]" style={{ color: 'var(--txt-1)' }}>{t('No requests')}</p>
                        <p className="text-[12px]" style={{ color: 'var(--txt-3)' }}>
                            {filter === 'all' ? t('No access requests yet.') : t(`No ${filter} requests.`)}
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
