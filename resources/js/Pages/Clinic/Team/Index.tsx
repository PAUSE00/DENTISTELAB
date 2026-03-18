import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import Modal from '@/Components/Modal';
import { useState } from 'react';
import { Users, UserPlus, Mail, Phone, Trash2, Shield, X, AlertTriangle } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface User {
    id: number; name: string; email: string; phone: string; role: string; created_at: string;
}
interface Props extends PageProps { members: User[] }

export default function Index({ auth, members }: Props) {
    const { t } = useTranslation();
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [toDelete, setToDelete] = useState<User | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({ name: '', email: '', phone: '' });

    const submitInvite = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('clinic.team.store'), { onSuccess: () => { setIsInviteOpen(false); reset(); } });
    };

    const deleteUser = () => {
        if (!toDelete) return;
        router.delete(route('clinic.team.destroy', toDelete.id), { onSuccess: () => setToDelete(null) });
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <ClinicLayout>
            <Head title={t('Team')} />
            <div className="flex flex-col gap-5 pb-10">

                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399' }}>
                            <Users size={18} />
                        </div>
                        <div>
                            <h1 className="text-[17px] font-bold tracking-tight" style={{ color: 'var(--txt-1)' }}>
                                {t('Team Management')}
                            </h1>
                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                                {members.length} {t('clinic staff members')}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setIsInviteOpen(true)} className="btn-primary">
                        <UserPlus size={13} /> {t('Invite Member')}
                    </button>
                </div>

                {/* Table */}
                <div className="card overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
                    <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-[12px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('Clinic Team Members')}</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>{t('Name')}</th>
                                    <th>{t('Contact')}</th>
                                    <th>{t('Role')}</th>
                                    <th className="hidden md:table-cell">{t('Joined')}</th>
                                    <th className="w-12" />
                                </tr>
                            </thead>
                            <tbody>
                                {members.length > 0 ? (
                                    members.map(member => (
                                        <tr key={member.id}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                                                        style={{ background: 'linear-gradient(135deg, #60ddc6, #6638b4)' }}>
                                                        {getInitials(member.name)}
                                                    </div>
                                                    <span className="font-semibold text-[13px]" style={{ color: 'var(--txt-1)' }}>{member.name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--txt-2)' }}>
                                                        <Mail size={11} style={{ color: '#f59e0b' }} /> {member.email}
                                                    </div>
                                                    {member.phone && (
                                                        <div className="flex items-center gap-1.5 text-[12px]" style={{ color: 'var(--txt-3)' }}>
                                                            <Phone size={11} style={{ color: '#34d399' }} /> {member.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="status-pill" style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', borderColor: 'rgba(52,211,153,0.2)' }}>
                                                    <Shield size={10} />
                                                    {t(member.role)}
                                                </span>
                                            </td>
                                            <td className="hidden md:table-cell">
                                                <span className="text-[12px]" style={{ color: 'var(--txt-3)' }}>
                                                    {new Date(member.created_at).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                {member.id !== auth.user.id && (
                                                    <button onClick={() => setToDelete(member)}
                                                        className="w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all"
                                                        style={{ color: 'var(--txt-3)' }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; e.currentTarget.style.color = '#f87171'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--txt-3)'; }}>
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-16">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface)' }}>
                                                    <Users size={24} style={{ color: 'var(--txt-3)' }} />
                                                </div>
                                                <p className="font-semibold text-[13px]" style={{ color: 'var(--txt-1)' }}>{t('No team members yet')}</p>
                                                <p className="text-[11.5px]" style={{ color: 'var(--txt-3)' }}>{t('Invite your assistants or other doctors.')}</p>
                                                <button onClick={() => setIsInviteOpen(true)} className="btn-primary mt-1">
                                                    <UserPlus size={13} /> {t('Invite Member')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            <Modal show={isInviteOpen} onClose={() => { setIsInviteOpen(false); reset(); }}>
                <div className="p-6" style={{ background: 'var(--bg-raised)' }}>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-[15px] font-bold" style={{ color: 'var(--txt-1)' }}>{t('Invite Team Member')}</h2>
                        <button onClick={() => setIsInviteOpen(false)} style={{ color: 'var(--txt-3)' }}><X size={15} /></button>
                    </div>

                    <div className="mb-5 px-4 py-3 rounded-xl text-[12px]"
                        style={{ background: 'rgba(96,221,198,0.06)', border: '1px solid rgba(96,221,198,0.2)', color: '#60ddc6' }}>
                        {t('The invited member will receive an email with their login credentials.')}
                    </div>

                    <form onSubmit={submitInvite} className="flex flex-col gap-4">
                        {[
                            { key: 'name',  label: t('Full Name'),             type: 'text',  placeholder: 'Dr. Sarah Smith' },
                            { key: 'email', label: t('Email Address'),          type: 'email', placeholder: 'sarah@example.com' },
                            { key: 'phone', label: t('Phone (Optional)'),       type: 'text',  placeholder: '+212 6xx xxx xxx' },
                        ].map(({ key, label, type, placeholder }) => (
                            <div key={key}>
                                <label className="text-[11px] font-semibold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--txt-3)' }}>{label}</label>
                                <input
                                    type={type}
                                    className="app-input"
                                    value={(data as any)[key]}
                                    onChange={e => setData(key as any, e.target.value)}
                                    placeholder={placeholder}
                                    required={key !== 'phone'}
                                />
                                {(errors as any)[key] && <p className="text-[11px] mt-1" style={{ color: '#f87171' }}>{(errors as any)[key]}</p>}
                            </div>
                        ))}
                        <div className="flex justify-end gap-2 mt-2">
                            <button type="button" onClick={() => setIsInviteOpen(false)} className="btn-ghost">{t('Cancel')}</button>
                            <button type="submit" disabled={processing} className="btn-primary">
                                <Mail size={13} /> {processing ? t('Sending...') : t('Send Invitation')}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <Modal show={!!toDelete} onClose={() => setToDelete(null)}>
                <div className="p-6" style={{ background: 'var(--bg-raised)' }}>
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171' }}>
                            <AlertTriangle size={18} />
                        </div>
                        <div>
                            <h2 className="text-[15px] font-bold" style={{ color: 'var(--txt-1)' }}>{t('Remove Team Member?')}</h2>
                            <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                                {t('This will revoke access for')} <strong style={{ color: 'var(--txt-2)' }}>{toDelete?.name}</strong>.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setToDelete(null)} className="btn-ghost">{t('Cancel')}</button>
                        <button onClick={deleteUser}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold"
                            style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
                            <Trash2 size={13} /> {t('Remove Member')}
                        </button>
                    </div>
                </div>
            </Modal>
        </ClinicLayout>
    );
}
