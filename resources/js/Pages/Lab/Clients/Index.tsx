import LabLayout from '@/Layouts/LabLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { UserPlus, Mail, Trash2, Clock, Building2, Search, X, Send } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';
import useTranslation from '@/Hooks/useTranslation';

interface Client {
 id: number; name: string; email: string; phone: string; city?: string;
 pivot: { created_at: string };
}
interface Invitation { id: number; email: string; expires_at: string; created_at: string; }
interface Props extends PageProps { clients: Client[]; invitations: Invitation[]; }

export default function ClientsIndex({ auth, clients, invitations }: Props) {
 const { t } = useTranslation();
 const [showInviteModal, setShowInviteModal] = useState(false);
 const [search, setSearch] = useState('');
 const [revokeTarget, setRevokeTarget] = useState<{ id: number; name: string } | null>(null);
 const [cancelTarget, setCancelTarget] = useState<number | null>(null);
 const { data, setData, post, processing, errors, reset } = useForm({ email: '' });

 const filtered = clients.filter(c =>
 c.name.toLowerCase().includes(search.toLowerCase()) ||
 c.email.toLowerCase().includes(search.toLowerCase())
 );

 const handleInvite = (e: React.FormEvent) => {
 e.preventDefault();
 post(route('lab.clients.invite'), { onSuccess: () => { reset(); setShowInviteModal(false); } });
 };

 const handleRevoke = () => {
 if (revokeTarget)
 router.delete(route('lab.clients.revoke', revokeTarget.id), { onFinish: () => setRevokeTarget(null) });
 };

 const handleCancelInvitation = () => {
 if (cancelTarget)
 router.delete(route('lab.invitations.cancel', cancelTarget), { onFinish: () => setCancelTarget(null) });
 };

 return (
 <LabLayout>
 <Head title={t('Clients')} />
 <div className="flex flex-col gap-4">

 {/* Header */}
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-[18px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('Client Management')}</h2>
 <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>{clients.length} {t('connected clinics')}</p>
 </div>
 <button onClick={() => setShowInviteModal(true)} className="btn-primary">
 <UserPlus size={13} /> {t('Invite Clinic')}
 </button>
 </div>

 {/* Pending invitations */}
 {invitations.length > 0 && (
 <div className="card p-4 border-l-2" style={{ borderLeftColor: '#f59e0b' }}>
 <div className="flex items-center gap-2 mb-3">
 <Clock size={13} style={{ color: '#f59e0b' }} />
 <p className="text-[12.5px] font-semibold" style={{ color: 'var(--txt-1)' }}>
 {t('Pending Invitations')} <span style={{ color: 'var(--txt-3)' }}>({invitations.length})</span>
 </p>
 </div>
 <div className="flex flex-col gap-2">
 {invitations.map(inv => (
 <div key={inv.id} className="flex items-center justify-between px-3 py-2 rounded-lg"
 style={{ background: 'var(--surface)' }}>
 <div className="flex items-center gap-2.5">
 <Mail size={12} style={{ color: '#f59e0b' }} />
 <span className="text-[12.5px] font-medium" style={{ color: 'var(--txt-2)' }}>{inv.email}</span>
 <span className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
 · {t('expires')} {new Date(inv.expires_at).toLocaleDateString()}
 </span>
 </div>
 <button onClick={() => setCancelTarget(inv.id)} className="p-1 rounded transition-colors"
 style={{ color: 'var(--txt-3)' }}
 onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
 onMouseLeave={e => (e.currentTarget.style.color = 'var(--txt-3)')}>
 <X size={14} />
 </button>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Search */}
 <div className="card p-3">
 <div className="relative max-w-sm">
 <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--txt-3)' }} />
 <input type="text" placeholder={t('Search clinics...')} value={search}
 onChange={e => setSearch(e.target.value)} className="app-input pl-8" />
 </div>
 </div>

 {/* Client cards */}
 {filtered.length === 0 ? (
 <div className="card p-12 text-center" style={{ color: 'var(--txt-3)' }}>
 <Building2 size={32} className="mx-auto mb-3 opacity-40" />
 <p className="text-[13px] font-medium">{t('No connected clinics')}</p>
 <p className="text-[11px] mt-1">{t('Invite partner clinics to get started.')}</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
 {filtered.map(client => (
 <div key={client.id} className="card p-4 group">
 <div className="flex items-start justify-between mb-3">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
 style={{ background: 'linear-gradient(135deg, #60ddc6, #6638b4)' }}>
 {client.name.charAt(0).toUpperCase()}
 </div>
 <div>
 <p className="text-[13.5px] font-semibold" style={{ color: 'var(--txt-1)' }}>{client.name}</p>
 <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>{client.email}</p>
 </div>
 </div>
 <button onClick={() => setRevokeTarget({ id: client.id, name: client.name })}
 className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all"
 style={{ color: 'var(--txt-3)' }}
 onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
 onMouseLeave={e => (e.currentTarget.style.color = 'var(--txt-3)')}>
 <Trash2 size={13} />
 </button>
 </div>
 <div className="flex gap-3 text-[11px] border-t pt-2.5" style={{ borderColor: 'var(--border)', color: 'var(--txt-3)' }}>
 {client.phone && <span>{client.phone}</span>}
 {client.city && <span>{client.city}</span>}
 <span className="ml-auto">{t('Since')} {new Date(client.pivot.created_at).toLocaleDateString()}</span>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* Invite Modal */}
 {showInviteModal && (
 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
 onClick={() => setShowInviteModal(false)}>
 <div className="w-full max-w-md rounded-xl p-5 shadow-2xl"
 style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-strong)' }}
 onClick={e => e.stopPropagation()}>
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-[15px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('Invite Clinic')}</h3>
 <button onClick={() => setShowInviteModal(false)} style={{ color: 'var(--txt-3)' }}><X size={16} /></button>
 </div>
 <form onSubmit={handleInvite}>
 <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--txt-2)' }}>
 {t('Clinic email address')}
 </label>
 <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
 placeholder="clinic@example.com" className="app-input mb-1" />
 {errors.email && <p className="text-[11px] mt-1" style={{ color: '#f87171' }}>{errors.email}</p>}
 <div className="flex gap-2 mt-4">
 <button type="button" onClick={() => setShowInviteModal(false)} className="btn-ghost flex-1 justify-center">
 {t('Cancel')}
 </button>
 <button type="submit" disabled={processing} className="btn-primary flex-1 justify-center disabled:opacity-40">
 <Send size={12} /> {t('Send Invite')}
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>

 <ConfirmModal isOpen={!!revokeTarget} onClose={() => setRevokeTarget(null)} onConfirm={handleRevoke}
 title={t('Revoke Access')}
 message={`${t('Remove')} "${revokeTarget?.name}" ${t('from your network? They will no longer be able to send orders.')}`}
 confirmText={t('Revoke')} variant="danger" />

 <ConfirmModal isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)} onConfirm={handleCancelInvitation}
 title={t('Cancel Invitation')}
 message={t('Cancel this invitation? The invite link will no longer be valid.')}
 confirmText={t('Cancel')} variant="warning" />
 </LabLayout>
 );
}
