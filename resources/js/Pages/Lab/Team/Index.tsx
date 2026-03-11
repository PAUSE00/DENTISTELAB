import LabLayout from '@/Layouts/LabLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import Modal from '@/Components/Modal';
import { useState } from 'react';
import {
    Users, UserPlus, Mail, Phone, Trash2,
    Shield, Crown, AlertTriangle, X,
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

/* ═══════════════════════════════════════════════════
   Types
═══════════════════════════════════════════════════ */
interface User {
    id: number; name: string; email: string;
    phone: string; role: string; created_at: string;
}
interface Props extends PageProps { members: User[]; }

/* ═══════════════════════════════════════════════════
   Avatar
═══════════════════════════════════════════════════ */
const AVATAR_GRADIENTS = [
    'linear-gradient(135deg,#60ddc6,#34d399)',
    'linear-gradient(135deg,#818cf8,#6366f1)',
    'linear-gradient(135deg,#c084fc,#a855f7)',
    'linear-gradient(135deg,#f59e0b,#d97706)',
    'linear-gradient(135deg,#60ddc6,#818cf8)',
];
function Avatar({ name, size = 36, idx = 0 }: { name: string; size?: number; idx?: number }) {
    return (
        <div className="rounded-full flex items-center justify-center shrink-0 font-black text-white"
            style={{
                width: size, height: size, fontSize: size * 0.33,
                background: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length],
            }}>
            {name.slice(0, 2).toUpperCase()}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   Role badge
═══════════════════════════════════════════════════ */
function RoleBadge({ role }: { role: string }) {
    const { t } = useTranslation();
    const isOwner = role === 'lab_owner';
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border"
            style={isOwner
                ? { background: 'rgba(192,132,252,0.1)', borderColor: 'rgba(192,132,252,0.35)', color: '#c084fc' }
                : { background: 'rgba(96,221,198,0.1)', borderColor: 'rgba(96,221,198,0.3)', color: '#60ddc6' }}>
            {isOwner ? <Crown size={11} /> : <Shield size={11} />}
            {isOwner ? t('Owner') : t('Technician')}
        </span>
    );
}

/* ═══════════════════════════════════════════════════
   Field component  
═══════════════════════════════════════════════════ */
function Field({ label, error, children }: {
    label: string; error?: string; children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold" style={{ color: 'var(--txt-2)' }}>{label}</label>
            {children}
            {error && (
                <p className="text-[11px]" style={{ color: '#f87171' }}>{error}</p>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   Main page
═══════════════════════════════════════════════════ */
export default function Index({ auth, members }: Props) {
    const { t } = useTranslation();
    const [inviteOpen, setInviteOpen]   = useState(false);
    const [deleteUser, setDeleteUser]   = useState<User | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', phone: '',
    });

    const submitInvite = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('lab.team.store'), {
            onSuccess: () => { setInviteOpen(false); reset(); },
        });
    };

    const confirmDelete = (u: User) => setDeleteUser(u);
    const closeDelete   = () => setDeleteUser(null);
    const doDelete      = () => {
        if (!deleteUser) return;
        router.delete(route('lab.team.destroy', deleteUser.id), {
            preserveScroll: true,
            onSuccess: closeDelete,
        });
    };

    const isOwner = auth.user.role === 'lab_owner';

    return (
        <LabLayout>
            <Head title={t('Team Management')} />

            <div className="flex flex-col gap-6">

                {/* ── Header ──────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[22px] font-black" style={{ color: 'var(--txt-1)' }}>
                            {t('My Team')}
                        </h1>
                        <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                            {t('Manage technicians and members of your laboratory')}
                        </p>
                    </div>
                    {isOwner && (
                        <button onClick={() => setInviteOpen(true)} className="btn-primary">
                            <UserPlus size={14} />
                            {t('Invite Member')}
                        </button>
                    )}
                </div>

                {/* ── Stats strip ─────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                        { label: t('Total Members'), value: members.length, color: '#60ddc6', icon: <Users size={15} /> },
                        { label: t('Owners'), value: members.filter(m => m.role === 'lab_owner').length, color: '#c084fc', icon: <Crown size={15} /> },
                        { label: t('Technicians'), value: members.filter(m => m.role !== 'lab_owner').length, color: '#818cf8', icon: <Shield size={15} /> },
                    ].map((s, i) => (
                        <div key={i} className="card p-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: `${s.color}15`, color: s.color }}>
                                {s.icon}
                            </div>
                            <div>
                                <p className="text-[20px] font-black leading-none" style={{ color: 'var(--txt-1)' }}>{s.value}</p>
                                <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Member table ────────────────────────── */}
                <div className="card overflow-hidden">
                    {/* Table header */}
                    <div className="px-5 py-4 border-b flex items-center gap-2"
                        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                        <Users size={14} style={{ color: 'var(--txt-accent)' }} />
                        <p className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>
                            {t('Team Members')}
                        </p>
                        <span className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: 'var(--teal-10)', color: 'var(--txt-accent)' }}>
                            {members.length}
                        </span>
                    </div>

                    {members.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        {[t('Member'), t('Contact'), t('Role'), t('Joined'), ''].map((h, i) => (
                                            <th key={i} className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-wider"
                                                style={{ color: 'var(--txt-3)', background: 'var(--surface)' }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member, idx) => (
                                        <tr key={member.id} className="group border-b last:border-0 transition-colors"
                                            style={{ borderColor: 'var(--border)' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = '')}>

                                            {/* Avatar + Name */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={member.name} idx={idx} />
                                                    <div>
                                                        <p className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>
                                                            {member.name}
                                                        </p>
                                                        {member.id === auth.user.id && (
                                                            <span className="text-[10px] font-semibold" style={{ color: 'var(--txt-accent)' }}>
                                                                ({t('You')})
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact */}
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail size={12} style={{ color: 'var(--txt-3)' }} />
                                                        <span className="text-[12px]" style={{ color: 'var(--txt-2)' }}>
                                                            {member.email}
                                                        </span>
                                                    </div>
                                                    {member.phone && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Phone size={12} style={{ color: 'var(--txt-3)' }} />
                                                            <span className="text-[12px]" style={{ color: 'var(--txt-3)' }}>
                                                                {member.phone}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="px-5 py-4">
                                                <RoleBadge role={member.role} />
                                            </td>

                                            {/* Joined */}
                                            <td className="px-5 py-4">
                                                <span className="text-[12px]" style={{ color: 'var(--txt-3)' }}>
                                                    {new Date(member.created_at).toLocaleDateString(undefined, {
                                                        year: 'numeric', month: 'short', day: 'numeric',
                                                    })}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4 text-right">
                                                {isOwner && member.id !== auth.user.id && (
                                                    <button
                                                        onClick={() => confirmDelete(member)}
                                                        title={t('Remove member')}
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                                                        style={{ color: 'var(--txt-3)' }}
                                                        onMouseEnter={e => {
                                                            (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.12)';
                                                            (e.currentTarget as HTMLElement).style.color = '#f87171';
                                                        }}
                                                        onMouseLeave={e => {
                                                            (e.currentTarget as HTMLElement).style.background = '';
                                                            (e.currentTarget as HTMLElement).style.color = 'var(--txt-3)';
                                                        }}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                style={{ background: 'var(--surface)', color: 'var(--txt-3)' }}>
                                <Users size={28} />
                            </div>
                            <div className="text-center">
                                <p className="text-[14px] font-semibold" style={{ color: 'var(--txt-2)' }}>
                                    {t('No team members yet')}
                                </p>
                                <p className="text-[12px] mt-1" style={{ color: 'var(--txt-3)' }}>
                                    {t('Invite your first technician to get started')}
                                </p>
                            </div>
                            {isOwner && (
                                <button onClick={() => setInviteOpen(true)} className="btn-primary mt-2">
                                    <UserPlus size={14} />
                                    {t('Invite Member')}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ══ Invite Modal ══════════════════════════════ */}
            <Modal show={inviteOpen} onClose={() => { setInviteOpen(false); reset(); }}>
                <div className="p-6">
                    {/* Modal header */}
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{ background: 'var(--teal-10)', color: 'var(--txt-accent)' }}>
                                <UserPlus size={16} />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold" style={{ color: 'var(--txt-1)' }}>
                                    {t('Invite New Member')}
                                </h2>
                                <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
                                    {t('They will receive login credentials by email')}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => { setInviteOpen(false); reset(); }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ color: 'var(--txt-3)', background: 'var(--surface)' }}>
                            <X size={14} />
                        </button>
                    </div>

                    {/* Default password notice */}
                    <div className="flex items-start gap-2 p-3 rounded-xl mb-5"
                        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                        <AlertTriangle size={13} style={{ color: '#f59e0b', marginTop: 1, flexShrink: 0 }} />
                        <p className="text-[11.5px]" style={{ color: '#f59e0b' }}>
                            {t('Default password will be set to:')}{' '}
                            <strong className="font-bold text-white">password123</strong>
                            {' — '}{t('member should change it on first login')}
                        </p>
                    </div>

                    <form onSubmit={submitInvite} className="flex flex-col gap-4">
                        <Field label={t('Full Name')} error={errors.name}>
                            <input autoFocus type="text" className="app-input"
                                placeholder={t('e.g. Ahmed Benali')}
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required />
                        </Field>
                        <Field label={t('Email Address')} error={errors.email}>
                            <input type="email" className="app-input"
                                placeholder="ahmed@clinic.ma"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                required />
                        </Field>
                        <Field label={`${t('Phone')} (${t('Optional')})`} error={errors.phone}>
                            <input type="text" className="app-input"
                                placeholder="+212 6XX XXX XXX"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)} />
                        </Field>

                        <div className="flex items-center justify-end gap-2 mt-2 pt-4 border-t"
                            style={{ borderColor: 'var(--border)' }}>
                            <button type="button" className="btn-ghost"
                                onClick={() => { setInviteOpen(false); reset(); }}>
                                {t('Cancel')}
                            </button>
                            <button type="submit" className="btn-primary"
                                disabled={processing}
                                style={processing ? { opacity: 0.65 } : {}}>
                                <UserPlus size={13} />
                                {processing ? t('Sending…') : t('Send Invitation')}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* ══ Delete Confirmation Modal ═════════════════ */}
            <Modal show={!!deleteUser} onClose={closeDelete}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171' }}>
                            <Trash2 size={18} />
                        </div>
                        <div>
                            <h2 className="text-[15px] font-bold" style={{ color: 'var(--txt-1)' }}>
                                {t('Remove Team Member?')}
                            </h2>
                            <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
                                {t('This action cannot be undone')}
                            </p>
                        </div>
                    </div>
                    <p className="text-[13px] leading-relaxed" style={{ color: 'var(--txt-2)' }}>
                        {t('Are you sure you want to remove')}{' '}
                        <strong style={{ color: 'var(--txt-1)' }}>{deleteUser?.name}</strong>{' '}
                        {t('from your team? They will no longer have access to the dashboard.')}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t"
                        style={{ borderColor: 'var(--border)' }}>
                        <button className="btn-ghost" onClick={closeDelete}>{t('Cancel')}</button>
                        <button onClick={doDelete}
                            className="btn-primary"
                            style={{ background: '#f87171', boxShadow: '0 0 0 0 transparent' }}>
                            <Trash2 size={13} />
                            {t('Remove Member')}
                        </button>
                    </div>
                </div>
            </Modal>

        </LabLayout>
    );
}
