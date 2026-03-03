import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useState } from 'react';
import { Users, UserPlus, Mail, Phone, Trash2, Shield, X, AlertTriangle } from 'lucide-react';

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
        post(route('clinic.team.store'), {
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
            router.delete(route('clinic.team.destroy', userToDelete.id), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    return (
        <ClinicLayout>
            <Head title="Team Management" />

            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Team Management</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage clinic staff and access</p>
                    </div>
                    <button
                        onClick={openInviteModal}
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 transition-transform duration-300 font-medium text-sm gap-2"
                    >
                        <UserPlus className="w-5 h-5" />
                        <span>Invite Member</span>
                    </button>
                </div>

                <div className="glass-card rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-slate-700/50 flex items-center justify-between bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-500">
                                <Users className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white tracking-tight">Clinic Team Members</h3>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/80 dark:bg-slate-800/80 text-gray-500 dark:text-gray-400 uppercase tracking-widest text-[11px] font-extrabold border-b border-gray-100 dark:border-slate-700/50 backdrop-blur-md">
                                <tr>
                                    <th className="px-6 py-5 rounded-tl-xl">Name</th>
                                    <th className="px-6 py-5">Contact</th>
                                    <th className="px-6 py-5">Role</th>
                                    <th className="px-6 py-5">Joined</th>
                                    <th className="px-6 py-5 text-right rounded-tr-xl">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                {members.length > 0 ? (
                                    members.map((member) => (
                                        <tr key={member.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors group">
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 shadow-primary-500/20 shadow-sm flex items-center justify-center text-white font-bold tracking-tighter">
                                                        {member.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="font-bold text-gray-900 dark:text-white tracking-tight text-base">{member.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="flex flex-col gap-1 text-sm font-medium">
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <Mail className="w-3.5 h-3.5 text-orange-500" /> {member.email}
                                                    </div>
                                                    {member.phone && (
                                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                                                            <Phone className="w-3.5 h-3.5 text-emerald-500" /> {member.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[11px] font-bold tracking-widest uppercase bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/20 backdrop-blur-sm">
                                                    <Shield className="w-3.5 h-3.5" />
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {new Date(member.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => confirmUserDeletion(member)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-700 rounded-xl hover:shadow-sm transition-all opacity-0 group-hover:opacity-100 md:-translate-x-2 group-hover:translate-x-0"
                                                    title="Remove Member"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                                                    <Users className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No team members yet</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mb-4">
                                                    Invite your assistants or other doctors to join your clinic.
                                                </p>
                                                <button
                                                    onClick={openInviteModal}
                                                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                                                >
                                                    <UserPlus className="w-4 h-4" />
                                                    Invite Member
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
            <Modal show={isInviteModalOpen} onClose={closeInviteModal}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Invite Team Member
                        </h2>
                        <button onClick={closeInviteModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={submitInvite} className="space-y-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">
                            The invited member will receive an email with their login credentials. Default password will be set to: <strong>password123</strong>
                        </div>

                        <div>
                            <InputLabel htmlFor="name" value="Full Name" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                isFocused
                                placeholder="e.g. Dr. Sarah Smith"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email Address" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                placeholder="sarah@example.com"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="phone" value="Phone Number (Optional)" />
                            <TextInput
                                id="phone"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="+1 (555) 000-0000"
                            />
                            <InputError message={errors.phone} className="mt-2" />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <SecondaryButton onClick={closeInviteModal}>Cancel</SecondaryButton>
                            <PrimaryButton disabled={processing} className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Send Invitation
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full shrink-0">
                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Remove Team Member?
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                Are you sure you want to remove <strong>{userToDelete?.name}</strong>? They will lose access immediately.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                        <DangerButton onClick={deleteUser} className="flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Remove Member
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </ClinicLayout>
    );
}
