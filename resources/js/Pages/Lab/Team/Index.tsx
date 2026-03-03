import LabLayout from '@/Layouts/LabLayout';
import { Head, useForm, router } from '@inertiajs/react'; // Added router
import { PageProps } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useState } from 'react';
import { Users, UserPlus, Mail, Phone, Trash2, Shield } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    created_at: string;
}

interface Props extends PageProps {
    members: User[];
}

export default function Index({ auth, members }: Props) {
    const { t } = useTranslation();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
    });

    const openInviteModal = () => {
        setIsInviteModalOpen(true);
    };

    const closeInviteModal = () => {
        setIsInviteModalOpen(false);
        reset();
    };

    const submitInvite = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('lab.team.store'), {
            onSuccess: () => closeInviteModal(),
        });
    };

    const confirmUserDeletion = (user: User) => {
        setUserToDelete(user);
        setConfirmingUserDeletion(true);
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        setUserToDelete(null);
    };

    const deleteUser = () => {
        if (userToDelete) {
            // Use router.delete instead of form.delete to avoid conflict with the invite form
            router.delete(route('lab.team.destroy', userToDelete.id), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    return (
        <LabLayout>
            <Head title={t('Team Management')} />

            <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in animate-delay-100">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            {t('My Team')}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t('Manage technicians and members of your laboratory')}
                        </p>
                    </div>
                    <button onClick={openInviteModal} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 transition-transform duration-300 font-medium text-sm">
                        <UserPlus className="w-4 h-4" />
                        {t('Invite Member')}
                    </button>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden animate-fade-in animate-delay-200">
                    <div className="p-6 border-b border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-900/30 backdrop-blur-sm">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary-500" /> {t('Team Members')}
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead className="bg-gray-50/80 dark:bg-slate-900/80 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs font-bold border-b border-gray-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-5">{t('Member')}</th>
                                    <th className="px-6 py-5">{t('Contact')}</th>
                                    <th className="px-6 py-5">{t('Role')}</th>
                                    <th className="px-6 py-5 text-center">{t('Joined At')}</th>
                                    <th className="px-6 py-5 text-center">{t('Actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                {members.length > 0 ? (
                                    members.map((member) => (
                                        <tr key={member.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="px-6 py-5 font-bold text-gray-900 dark:text-white text-base">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
                                                        {member.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    {member.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1.5 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-800 dark:text-gray-300">
                                                        <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" /> {member.email}
                                                    </div>
                                                    {member.phone && (
                                                        <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
                                                            <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" /> {member.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {member.role === 'lab_owner' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] text-xs font-semibold border border-indigo-500/50 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10">
                                                        <Shield className="w-3.5 h-3.5" />
                                                        {t('Owner')}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] text-xs font-semibold border border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10">
                                                        <Shield className="w-3.5 h-3.5" />
                                                        {t('Technician')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-gray-700 dark:text-gray-300 text-center text-sm font-semibold">
                                                {new Date(member.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <button
                                                    onClick={() => confirmUserDeletion(member)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors group-hover:text-gray-500"
                                                    title={t('Remove Member')}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400 italic">
                                            {t('No members found. Invite your first technician!')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            <Modal show={isInviteModalOpen} onClose={closeInviteModal}>
                <form onSubmit={submitInvite} className="p-6">
                    <h2 className="text-lg font-medium text-text dark:text-text mb-4">
                        {t('Invite New Team Member')}
                    </h2>
                    <p className="text-sm text-sub mb-6">
                        {t('They will receive an email with their login credentials. Default password will be set to: ')}<strong>password123</strong>
                    </p>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value={t('Full Name')} />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                isFocused
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value={t('Email')} />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="phone" value={`${t('Phone')} (${t('Optional')})`} />
                            <TextInput
                                id="phone"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            <InputError message={errors.phone} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeInviteModal}>{t('Cancel')}</SecondaryButton>
                        <PrimaryButton disabled={processing}>{t('Send Invitation')}</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <div className="p-6 text-gray-800 dark:text-white">
                    <h2 className="text-lg font-bold mb-4">
                        {t('Remove Team Member?')}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
                        {t('Are you sure you want to remove')} <strong>{userToDelete?.name}</strong> {t('from your team? They will no longer have access to the dashboard.')}
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>{t('Cancel')}</SecondaryButton>
                        <DangerButton onClick={deleteUser}>
                            {t('Remove Member')}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </LabLayout>
    );
}
