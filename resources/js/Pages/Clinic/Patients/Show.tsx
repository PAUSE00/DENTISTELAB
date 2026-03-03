import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps, Patient } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { ChevronLeft, Edit, FileText, Calendar, Phone, Mail, Clock } from 'lucide-react';

interface Props extends PageProps {
    patient: Patient;
}

export default function Show({ auth, patient }: Props) {
    return (
        <ClinicLayout>
            <Head title={`Patient: ${patient.first_name} ${patient.last_name}`} />

            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('clinic.patients.index')}
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/80 text-gray-500 dark:text-gray-400 transition-all shadow-sm hover:shadow"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Patient Profile</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                {patient.first_name} {patient.last_name}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href={route('clinic.patients.edit', patient.id)}>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 transition-transform duration-300 font-medium text-sm">
                                <Edit className="w-4 h-4" />
                                Edit Patient
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Patient Info Card */}
                    <div className="glass-card rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden lg:col-span-1 h-fit">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 shadow-primary-500/30 shadow-md flex items-center justify-center text-white text-3xl font-black border-4 border-white dark:border-slate-800 mb-4 tracking-tighter">
                                    {patient.first_name[0]}{patient.last_name[0]}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{patient.first_name} {patient.last_name}</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Patient ID: #{patient.id}</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                                <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-500">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Birth</div>
                                    <div className="font-medium">{patient.dob}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300 mt-4">
                                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</div>
                                    <div className="font-medium">{patient.phone}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300 mt-4">
                                <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</div>
                                    <div className="font-medium">{patient.email || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                        {patient.medical_notes && (
                            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/10 border-t border-yellow-100 dark:border-yellow-900/20">
                                <span className="flex items-center gap-2 text-sm font-semibold text-yellow-800 dark:text-yellow-500 mb-2">
                                    <FileText className="w-4 h-4" /> Medical Notes
                                </span>
                                <p className="text-sm text-yellow-800/80 dark:text-yellow-400/80 whitespace-pre-wrap">
                                    {patient.medical_notes}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Order History Placeholder (Main Content) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-card rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-slate-700/50 flex justify-between items-center bg-white/40 dark:bg-slate-800/40">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order History</h3>
                                {/* Determine if we want a 'Create Order' button here later */}
                            </div>

                            <div className="p-8">
                                <div className="text-center py-12 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400">
                                        <Clock className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No orders found</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
                                        This patient hasn't placed any orders yet.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ClinicLayout>
    );
}
