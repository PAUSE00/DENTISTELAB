import LabLayout from '@/Layouts/LabLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { UserPlus, Mail, Trash2, Clock, Building2, Search, X, Send } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';
import useTranslation from '@/Hooks/useTranslation';

interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    city?: string;
    pivot: { created_at: string };
}

interface Invitation {
    id: number;
    email: string;
    expires_at: string;
    created_at: string;
}

interface Props extends PageProps {
    clients: Client[];
    invitations: Invitation[];
}

export default function ClientsIndex({ auth, clients, invitations }: Props) {
    const { t } = useTranslation();
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [search, setSearch] = useState('');
    const [revokeTarget, setRevokeTarget] = useState<{ id: number; name: string } | null>(null);
    const [cancelTarget, setCancelTarget] = useState<number | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('lab.clients.invite'), {
            onSuccess: () => {
                reset();
                setShowInviteModal(false);
            },
        });
    };

    const handleRevoke = () => {
        if (revokeTarget) {
            router.delete(route('lab.clients.revoke', revokeTarget.id), {
                onFinish: () => setRevokeTarget(null),
            });
        }
    };

    const handleCancelInvitation = () => {
        if (cancelTarget) {
            router.delete(route('lab.invitations.cancel', cancelTarget), {
                onFinish: () => setCancelTarget(null),
            });
        }
    };

    return (
        <LabLayout>
            <Head title={t('Clients')} />
            <div className="animate-fade-in animate-delay-100 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="animate-fade-in animate-delay-100">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            {t('Client Management')}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {clients.length} {t('connected clinics')}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-0.5 animate-fade-in animate-delay-100"
                    >
                        <UserPlus className="w-4 h-4" />
                        {t('Invite Clinic')}
                    </button>
                </div>

                {/* Search */}
                <div className="relative max-w-md animate-fade-in animate-delay-200">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('Search clinics...')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                </div>

                {/* Pending Invitations */}
                {invitations.length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 animate-fade-in animate-delay-200">
                        <h3 className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-3">
                            <Clock className="w-4 h-4" />
                            {t('Pending Invitations')} ({invitations.length})
                        </h3>
                        <div className="space-y-2">
                            {invitations.map(inv => (
                                <div key={inv.id} className="flex items-center justify-between glass-card rounded-xl px-4 py-3 border border-amber-100 dark:border-amber-800/50">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-amber-600" />
                                        <span className="text-sm font-medium">{inv.email}</span>
                                        <span className="text-xs text-gray-400">
                                            {t('Expires on')} {new Date(inv.expires_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setCancelTarget(inv.id)}
                                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Connected Clients Grid */}
                {filteredClients.length === 0 ? (
                    <div className="glass-card rounded-2xl p-12 text-center animate-fade-in animate-delay-300">
                        <Building2 className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('No connected clinics')}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('Invite partner clinics to get started.')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in animate-delay-300">
                        {filteredClients.map(client => (
                            <div key={client.id} className="glass-card rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-start justify-between mb-4 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-dental-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-300">
                                        {client.name.charAt(0).toUpperCase()}
                                    </div>
                                    <button
                                        onClick={() => setRevokeTarget({ id: client.id, name: client.name })}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{client.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{client.email}</p>
                                    {client.phone && <p className="text-xs text-gray-500 dark:text-gray-400">{client.phone}</p>}
                                    {client.city && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{client.city}</p>}
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700 relative z-10 transition-colors group-hover:border-primary-100 dark:group-hover:border-primary-900/30">
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500">{t('Connected since')} {new Date(client.pivot.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Invite Modal */}
                {showInviteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-100 dark:border-slate-700 animate-scale-in" onClick={e => e.stopPropagation()}>
                            <h3 className="text-lg font-bold mb-4">{t('Invite Clinic')}</h3>
                            <form onSubmit={handleInvite}>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('Clinic Email Address')}</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="cabinet@example.com"
                                    className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setShowInviteModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                        {t('Cancel')}
                                    </button>
                                    <button type="submit" disabled={processing} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50">
                                        <Send className="w-4 h-4" />
                                        {t('Send')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Revoke Confirm Modal */}
                <ConfirmModal
                    isOpen={!!revokeTarget}
                    onClose={() => setRevokeTarget(null)}
                    onConfirm={handleRevoke}
                    title="Révoquer l'accès"
                    message={`Êtes-vous sûr de vouloir révoquer l'accès de "${revokeTarget?.name}" ? Ce cabinet ne pourra plus envoyer de commandes.`}
                    confirmText="Révoquer"
                    variant="danger"
                />

                {/* Cancel Invitation Confirm Modal */}
                <ConfirmModal
                    isOpen={!!cancelTarget}
                    onClose={() => setCancelTarget(null)}
                    onConfirm={handleCancelInvitation}
                    title="Annuler l'invitation"
                    message="Êtes-vous sûr de vouloir annuler cette invitation ? Le lien ne sera plus valide."
                    confirmText="Annuler l'invitation"
                    variant="warning"
                />
            </div>
        </LabLayout>
    );
}
