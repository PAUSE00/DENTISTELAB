import LabLayout from '@/Layouts/LabLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import ChatBox from '@/Components/ChatBox';
import StatusBadge from '@/Components/StatusBadge';
import { useState, useRef, useEffect } from 'react';
import {
    FileText, Calendar, AlertCircle, CheckCircle2, Clock, User, Building, Activity, Download, Paperclip, ArrowLeft, Printer, Check,
    ClipboardCheck,
    Flag,
    Box,
    X,
    Truck,
    Package,
    Upload,
    Copy,
    FileDown,
    Eye,
    Trash2
} from 'lucide-react';
import Odontogram from '@/Components/Odontogram';
import Modal from '@/Components/Modal';
import ConfirmModal from '@/Components/ConfirmModal';
import ThreeDViewer from '@/Components/ThreeDViewer';
import useTranslation from '@/Hooks/useTranslation';
import { toast } from 'react-hot-toast';

interface OrderFile {
    id: number;
    name: string;
    path: string;
    size: number;
    type: string;
}

interface AllowedTransition {
    value: string;
    label: string;
}

interface Order {
    id: number;
    status: string;
    priority: string;
    due_date: string;
    created_at: string;
    teeth: number[];
    shade: string;
    material: string;
    instructions: string | null;
    patient: {
        id: number;
        first_name: string;
        last_name: string;
    };
    clinic: {
        id: number;
        name: string;
    };
    service: {
        id: number;
        name: string;
    };
    files: OrderFile[];
    history: {
        id: number;
        status: string;
        created_at: string;
        user?: {
            id: number;
            name: string;
        };
    }[];
}

interface Props extends PageProps {
    order: Order;
    allowedTransitions: AllowedTransition[];
}

const OrderSteps = ({ status, createdAt, dueDate, history }: { status: string, createdAt: string, dueDate: string, history: Order['history'] }) => {
    const { t } = useTranslation();

    const getStatusDate = (stepId: string) => {
        const entry = history.find(h => h.status === stepId);
        if (entry) {
            return new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        }
        return null;
    };

    const steps = [
        { id: 'new', label: t('New'), icon: Check, date: getStatusDate('new') || new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) },
        { id: 'in_progress', label: t('In Progress'), icon: Activity, date: getStatusDate('in_progress') || t('Pending') },
        { id: 'finished', label: t('Finished'), icon: CheckCircle2, date: getStatusDate('finished') || t('Pending') },
        { id: 'shipped', label: t('Shipped'), icon: Truck, date: getStatusDate('shipped') || t('Pending') },
        { id: 'delivered', label: t('Delivered'), icon: Flag, date: getStatusDate('delivered') || new Date(dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) },
    ];

    const statusOrder = ['new', 'in_progress', 'fitting', 'finished', 'shipped', 'delivered', 'archived'];
    let currentStepIndex = statusOrder.indexOf(status);
    if (currentStepIndex === -1) currentStepIndex = 0;

    // Map to steps array index (accounting for 'fitting' not being a step in UI)
    const stepsIndexMap: Record<string, number> = {
        'new': 0, 'in_progress': 1, 'fitting': 1, 'finished': 2, 'shipped': 3, 'delivered': 4, 'archived': 4, 'rejected': 0
    };
    const activeStepIndex = stepsIndexMap[status] ?? 0;

    return (
        <div className="w-full py-8 overflow-x-auto custom-scrollbar">
            <div className="relative flex justify-between items-start w-full max-w-5xl mx-auto px-4 min-w-[600px]">
                {/* Background Line */}
                <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 dark:bg-slate-700/60 rounded-full -z-10 hidden md:block"></div>
                {/* Progress Line */}
                <div
                    className="absolute top-6 left-0 h-1 bg-emerald-500 rounded-full -z-10 hidden md:block transition-all duration-700 ease-out shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    style={{ width: `${(activeStepIndex / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, index) => {
                    const isCompleted = index <= activeStepIndex;
                    const isCurrent = index === activeStepIndex;
                    const displayDate = isCurrent && index !== 4 ? t('Active') : step.date;

                    return (
                        <div key={step.id} className="relative flex flex-col items-center group w-28">
                            {/* Icon Box */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3.5 transition-all duration-500 z-10 relative
                                ${isCompleted
                                    ? 'bg-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-100'
                                    : 'bg-white dark:bg-[#1e293b] text-gray-400 dark:text-slate-500 border border-gray-200 dark:border-slate-700 shadow-sm'
                                }
                                ${isCurrent ? 'ring-4 ring-emerald-500/20 scale-110' : ''}
                            `}>
                                <step.icon className={`w-6 h-6 ${isCompleted ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                {isCurrent && (
                                    <span className="absolute flex h-full w-full rounded-xl">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-xl bg-emerald-400 opacity-25"></span>
                                    </span>
                                )}
                            </div>

                            {/* Text Container */}
                            <div className="flex flex-col items-center text-center space-y-1.5 min-h-[44px]">
                                <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300
                                    ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-500'}`}>
                                    {step.label}
                                </span>
                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md transition-colors duration-300 whitespace-nowrap
                                    ${isCurrent
                                        ? 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20'
                                        : isCompleted
                                            ? 'text-gray-500 dark:text-slate-400'
                                            : 'text-gray-400 dark:text-slate-600'}`}>
                                    {displayDate}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Button styles for each transition target
const transitionStyles: Record<string, { bg: string; icon: typeof Activity; label: string }> = {
    in_progress: { bg: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20', icon: Activity, label: 'Start Production' },
    fitting: { bg: 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20', icon: Clock, label: 'Send for Fitting' },
    finished: { bg: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20', icon: CheckCircle2, label: 'Mark as Finished' },
    shipped: { bg: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20', icon: Truck, label: 'Mark as Shipped' },
    delivered: { bg: 'bg-green-600 hover:bg-green-700 shadow-green-500/20', icon: Flag, label: 'Mark as Delivered' },
    rejected: { bg: 'bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10', icon: X, label: 'Reject Order' },
    cancelled: { bg: 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700', icon: X, label: 'Cancel Order' },
    archived: { bg: 'bg-gray-600 hover:bg-gray-700 shadow-gray-500/20', icon: Package, label: 'Archive' },
};

export default function Show({ auth, order, allowedTransitions }: Props) {
    const { t } = useTranslation();
    const [processing, setProcessing] = useState(false);
    const [viewingStl, setViewingStl] = useState<string | null>(null);
    const [fileToDelete, setFileToDelete] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDeleteFile = () => {
        if (!fileToDelete) return;
        setProcessing(true);
        router.delete(route('lab.orders.delete-file', [order.id, fileToDelete]), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t('File deleted successfully'));
                setFileToDelete(null);
            },
            onFinish: () => setProcessing(false)
        });
    };

    useEffect(() => {
        if (window.Echo) {
            window.Echo.private(`orders.${order.id}`)
                .listen('.order.updated', (e: any) => {
                    // Refresh the order and allowed transitions data using Inertia
                    router.reload({ only: ['order', 'allowedTransitions'] });
                });
        }
        return () => {
            if (window.Echo) {
                window.Echo.leave(`orders.${order.id}`);
            }
        };
    }, [order.id]);

    const updateStatus = (newStatus: string) => {
        if (newStatus === 'rejected') {
            setShowRejectModal(true);
            return;
        }
        setProcessing(true);
        router.patch(route('lab.orders.update-status', order.id), {
            status: newStatus
        }, {
            preserveScroll: true,
            onFinish: () => setProcessing(false)
        });
    };

    const submitRejection = () => {
        setProcessing(true);
        router.patch(route('lab.orders.update-status', order.id), {
            status: 'rejected',
            rejection_reason: rejectionReason,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setShowRejectModal(false);
                setRejectionReason('');
            }
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setProcessing(true);
        router.post(route('lab.orders.upload', order.id), { file }, {
            preserveScroll: true,
            forceFormData: true,
            onFinish: () => {
                setProcessing(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        });
    };

    // Parse teeth as numbers for reliable comparison
    const teethNumbers = (order.teeth || []).map(Number);

    return (
        <LabLayout>
            <Head title={`${t('Order')} #${order.id}`} />

            <div className="max-w-7xl mx-auto animate-fade-in pb-10 sm:px-6 lg:px-8">
                {/* Header & Stepper Card */}
                <div className="glass-card rounded-2xl mb-6 overflow-hidden animate-fade-in animate-delay-100">
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <Link href={route('lab.orders.index')} className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all shadow-sm">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{t('Order')} #{order.id}</h1>
                                    <StatusBadge status={order.status} />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                                    {t('Created on')} {new Date(order.created_at).toLocaleDateString()} &middot; <span className="text-gray-400">{t('Clinic')}:</span> <span className="text-gray-700 dark:text-gray-300">{order.clinic?.name || 'N/A'}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2.5">
                            <a href={route('orders.job-ticket', order.id)} target="_blank" className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-xs font-semibold shadow-sm">
                                <FileText className="w-3.5 h-3.5" />
                                {t('Job Ticket')}
                            </a>
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-xs font-semibold shadow-sm">
                                <Printer className="w-3.5 h-3.5" />
                                {t('Print')}
                            </button>
                            <button
                                onClick={() => window.open(route('orders.invoice', order.id), '_blank')}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-xs font-semibold shadow-sm"
                            >
                                <FileDown className="w-3.5 h-3.5" />
                                {t('Invoice')} (PDF)
                            </button>
                        </div >
                    </div >
                    <div className="px-8 py-6 bg-gray-50/50 dark:bg-slate-900/30">
                        <OrderSteps status={order.status} createdAt={order.created_at} dueDate={order.due_date} history={order.history} />
                    </div>
                </div >

                {/* Info Cards Row */}
                < div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-fade-in animate-delay-200" >
                    {/* Due Date Card */}
                    < div className="glass-card rounded-2xl p-5 group hover:border-amber-200 dark:hover:border-amber-800/50 hover:-translate-y-1 transition-all" >
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/10 text-amber-500 border border-amber-100 dark:border-amber-800/30 flex items-center justify-center shrink-0 shadow-sm">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('Due Date')}</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                    {new Date(order.due_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div >

                    {/* Patient Card */}
                    < div className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-all" >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 dark:bg-primary-900/10 rounded-bl-full -mr-4 -mt-4 -z-0 pointer-events-none"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-primary-500/20 shrink-0">
                                {order.patient?.first_name?.[0] || '?'}{order.patient?.last_name?.[0] || '?'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t('Patient')}</p>
                                <p className="font-bold text-gray-900 dark:text-white text-lg truncate leading-tight">{order.patient?.first_name || t('Unknown')} {order.patient?.last_name || ''}</p>
                                <p className="text-[10px] text-gray-500 font-mono tracking-tight bg-gray-100 dark:bg-slate-700/50 px-1.5 rounded inline-block mt-1">ID: {order.patient?.id || '?'}</p>
                            </div>
                        </div>
                    </div >

                    {/* Clinic Info Card */}
                    < div className="glass-card rounded-2xl p-5 hover:-translate-y-1 transition-all" >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/10 text-primary-500 border border-primary-100 dark:border-primary-800/30 flex items-center justify-center shrink-0 shadow-sm">
                                <Building className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t('Clinic')}</span>
                                <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{order.clinic?.name || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="space-y-2 border-t border-gray-100 dark:border-slate-700/50 pt-3">
                            <div className="flex justify-between items-center group">
                                <span className="text-[10px] text-gray-500">{t('Service')}</span>
                                <span className="font-bold text-[10px] text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-1.5 py-0.5 rounded">{order.service?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-500">{t('Priority')}</span>
                                <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                    <Box className="w-3 h-3" /> {order.priority === 'urgent' ? `🔴 ${t('Urgent')}` : t('Normal')}
                                </span>
                            </div>
                        </div>
                    </div >
                </div >

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Details (2/3) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Clinical Specifications */}
                        <div className="glass-card rounded-2xl p-6 animate-fade-in animate-delay-300 hover:shadow-lg transition-shadow">
                            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-2 mb-6 uppercase tracking-wider">
                                <ClipboardCheck className="w-4 h-4 text-primary-500" />
                                {t('Clinical Specifications')}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Teeth Grid */}
                                <div className="w-full">
                                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">{t('Interactive Odontogram')}</h4>
                                    <div className="bg-white dark:bg-slate-900 shadow-inner p-4 rounded-xl border border-gray-100 dark:border-slate-800 w-full">
                                        <div className="w-full flex justify-center">
                                            <Odontogram
                                                selectedTeeth={teethNumbers}
                                                readOnly={true}
                                            />
                                        </div>
                                        <div className="text-center mt-2 border-t border-gray-100 dark:border-slate-800 pt-3">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {t('Selected')}: <span className="font-bold text-primary-600 dark:text-primary-400">
                                                    {teethNumbers?.length > 0 ? [...teethNumbers].sort().join(', ') : t('None')}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Parameters */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{t('Restoration Parameters')}</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-gray-100 dark:border-slate-700/50">
                                            <span className="text-[10px] text-gray-400 block uppercase tracking-wide mb-1.5 font-semibold">{t('Service Type')}</span>
                                            <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{order.service?.name || 'N/A'}</span>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-gray-100 dark:border-slate-700/50">
                                            <span className="text-[10px] text-gray-400 block uppercase tracking-wide mb-1.5 font-semibold">{t('Material & Shade')}</span>
                                            <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{order.material} <span className="text-gray-300 mx-1">/</span> {order.shade}</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-slate-900/40 p-4 rounded-xl border border-gray-100 dark:border-slate-700/50 mt-3 h-[120px]">
                                        <span className="text-[10px] text-gray-400 block uppercase tracking-wide mb-2 font-semibold flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> {t('Special Instructions')}
                                        </span>
                                        <p className="text-gray-600 dark:text-gray-300 italic text-xs leading-relaxed">
                                            "{order.instructions || t('No specific instructions provided.')}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attachments */}
                        <div className="glass-card rounded-2xl p-6 animate-fade-in animate-delay-400 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-2 uppercase tracking-wider">
                                    <Paperclip className="w-4 h-4 text-primary-500" />
                                    {t('Attachments')}
                                    <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-0.5 rounded-full ml-1 font-bold">{order.files.length}</span>
                                </h3>
                                <div>
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png,.stl,.dcm,.zip" />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={processing}
                                        className="text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1.5 rounded-lg border border-primary-100 dark:border-primary-800/30 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors flex items-center gap-1.5"
                                    >
                                        <Upload className="w-3 h-3" />
                                        {t('Add')}
                                    </button>
                                </div>
                            </div>

                            {order.files && order.files.length > 0 ? (
                                <div className="space-y-2.5">
                                    {order.files.map(file => (
                                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900/40 rounded-xl border border-gray-100 dark:border-slate-700/50 group hover:border-gray-300 dark:hover:border-slate-600 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-primary-500 dark:text-primary-400 flex items-center justify-center shadow-sm">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{file.name}</p>
                                                    <span className="text-[10px] text-gray-400 font-medium font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {file.name.toLowerCase().endsWith('.stl') && (
                                                    <button onClick={() => setViewingStl(`/storage/${file.path}`)} className="p-2 text-primary-500 hover:text-primary-600 border border-transparent hover:border-primary-200 dark:hover:border-primary-900/50 rounded-lg transition-all hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:shadow-sm" title={t('View 3D Model')}>
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <a href={`/storage/${file.path}`} target="_blank" className="p-2 text-gray-400 hover:text-primary-600 rounded-lg transition-all hover:bg-white dark:hover:bg-slate-800" title={t('Download')}>
                                                    <Download className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => setFileToDelete(file.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 border border-transparent hover:border-red-200 dark:hover:border-red-900/50 rounded-lg transition-all hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-sm"
                                                    title={t('Delete File')}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-xs text-gray-400 italic">{t('No attachments found.')}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Sidebar (1/3) */}
                    <div className="space-y-6">

                        {/* Order Actions — DYNAMIC from allowedTransitions */}
                        <div className="glass-card rounded-2xl p-5 overflow-hidden relative animate-fade-in animate-delay-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50/50 dark:bg-primary-900/10 rounded-bl-full -mr-10 -mt-10 z-0"></div>

                            <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-xs uppercase tracking-wide relative z-10 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-primary-500" /> {t('Actions')}
                            </h3>

                            <div className="space-y-3 relative z-10 mt-4">
                                {allowedTransitions && allowedTransitions.length > 0 ? (
                                    allowedTransitions.map((transition: AllowedTransition) => {
                                        const style = transitionStyles[transition.value] || transitionStyles['in_progress'];
                                        const isOutline = transition.value === 'rejected' || transition.value === 'cancelled';
                                        const Icon = style.icon;

                                        return (
                                            <button
                                                key={transition.value}
                                                onClick={() => updateStatus(transition.value)}
                                                disabled={processing}
                                                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all transform hover:-translate-y-0.5 disabled:opacity-50
                                                    ${isOutline
                                                        ? style.bg
                                                        : `${style.bg} text-white shadow-lg`
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {t(style.label)}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <p className="text-xs text-gray-400 italic text-center py-2">{t('No actions available')}</p>
                                )}
                            </div>
                        </div>

                        {/* Order Timeline / History Log */}
                        <div className="glass-card rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
                            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-2 mb-6 uppercase tracking-wider">
                                <Clock className="w-4 h-4 text-primary-500" />
                                {t('Order Timeline')}
                            </h3>
                            <div className="relative border-l-2 border-gray-200 dark:border-slate-700 ml-3 space-y-6 pb-2">
                                {order.history && order.history.length > 0 ? (
                                    order.history.map((entry, index) => {
                                        const isLast = index === order.history.length - 1;
                                        return (
                                            <div key={entry.id} className="relative pl-6">
                                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${isLast ? 'bg-primary-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-gray-300 dark:bg-slate-600'}`}></div>
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-bold capitalize ${isLast ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                                        {t(entry.status.replace('_', ' '))}
                                                    </span>
                                                    <span className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(entry.created_at).toLocaleString(undefined, {
                                                            month: 'short', day: 'numeric',
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </span>
                                                    {entry.user && (
                                                        <span className="text-[10px] text-gray-400 font-medium mt-1 bg-gray-50 dark:bg-slate-800 px-2 py-0.5 rounded-md inline-block w-fit border border-gray-100 dark:border-slate-700">
                                                            {t('By')}: {entry.user.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="pl-6 text-xs text-gray-400 italic">
                                        {t('No history available.')}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Chat */}
                        <div className="glass-card rounded-2xl overflow-hidden animate-fade-in animate-delay-400">
                            <div className="px-5 py-3 border-b border-gray-100 dark:border-slate-700/50 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/30 backdrop-blur-sm">
                                <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-xs uppercase tracking-wide">
                                    <User className="w-3.5 h-3.5" /> {t('Clinic Chat')}
                                </h3>
                                <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-100 dark:border-green-900/30">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-green-700 dark:text-green-400">{t('Online')}</span>
                                </div>
                            </div>
                            <ChatBox orderId={order.id} compact className="border-none shadow-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Rejection Modal */}
            {
                showRejectModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('Reject Order')}</h3>
                            <p className="text-sm text-gray-500 mb-4">{t('Please provide a reason for rejection')}:</p>
                            <textarea
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                                rows={3}
                                className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 p-3 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                placeholder={t('Bad impression quality, missing info...')}
                            />
                            <div className="flex gap-3 mt-4">
                                <button onClick={() => setShowRejectModal(false)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50">
                                    {t('Cancel')}
                                </button>
                                <button onClick={submitRejection} disabled={!rejectionReason.trim() || processing} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-50">
                                    {t('Confirm Rejection')}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <Modal show={!!viewingStl} onClose={() => setViewingStl(null)} maxWidth="2xl">
                <div className="p-6 bg-white dark:bg-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Box className="w-5 h-5 text-primary-500" />
                            {t('3D Model Viewer')}
                        </h3>
                        <button onClick={() => setViewingStl(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="h-[60vh] min-h-[500px] w-full bg-slate-900 rounded-xl overflow-hidden relative shadow-inner border border-slate-700">
                        {viewingStl && <ThreeDViewer url={viewingStl} color="#e8d2ac" />}
                    </div>
                </div>
            </Modal>

            <ConfirmModal
                isOpen={!!fileToDelete}
                onClose={() => setFileToDelete(null)}
                onConfirm={handleDeleteFile}
                title={t('Delete Attachment')}
                message={t('Are you sure you want to delete this file? This action cannot be undone.')}
                processing={processing}
                variant="danger"
            />
        </LabLayout>
    );
}
