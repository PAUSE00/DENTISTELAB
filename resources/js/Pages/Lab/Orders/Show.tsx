import LabLayout from '@/Layouts/LabLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import ChatBox from '@/Components/ChatBox';
import StatusBadge from '@/Components/StatusBadge';
import { useState, useEffect } from 'react';
import { FileText, ArrowLeft, Printer, FileDown, ClipboardCheck, AlertCircle, Box, X } from 'lucide-react';
import Odontogram from '@/Components/Odontogram';
import Modal from '@/Components/Modal';
import ThreeDViewer from '@/Components/ThreeDViewer';
import useTranslation from '@/Hooks/useTranslation';
import { User } from 'lucide-react';

// Shared sub-components
import OrderSteps from '@/Components/Orders/OrderSteps';
import OrderTimeline from '@/Components/Orders/OrderTimeline';
import OrderAttachments from '@/Components/Orders/OrderAttachments';
import OrderInfoCards from '@/Components/Orders/OrderInfoCards';
import OrderNotes from '@/Components/Orders/OrderNotes';
import OrderActions from '@/Components/Orders/OrderActions';
import { OrderFile, AllowedTransition, OrderHistoryEntry, OrderNote } from '@/types/order';

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
    patient: { id: number; first_name: string; last_name: string };
    clinic: { id: number; name: string };
    service: { id: number; name: string };
    files: OrderFile[];
    history: OrderHistoryEntry[];
    notes: OrderNote[];
}

interface Props extends PageProps {
    order: Order;
    allowedTransitions: AllowedTransition[];
}

export default function Show({ auth, order, allowedTransitions }: Props) {
    const { t } = useTranslation();
    const [processing, setProcessing] = useState(false);
    const [viewingStl, setViewingStl] = useState<string | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        if (window.Echo) {
            window.Echo.private(`orders.${order.id}`)
                .listen('.order.updated', () => {
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
        router.patch(route('lab.orders.update-status', order.id), { status: newStatus }, {
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
                                <FileText className="w-3.5 h-3.5" /> {t('Job Ticket')}
                            </a>
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-xs font-semibold shadow-sm">
                                <Printer className="w-3.5 h-3.5" /> {t('Print')}
                            </button>
                            <button onClick={() => window.open(route('orders.invoice', order.id), '_blank')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-xs font-semibold shadow-sm">
                                <FileDown className="w-3.5 h-3.5" /> {t('Invoice')} (PDF)
                            </button>
                        </div>
                    </div>
                    <div className="px-8 py-6 bg-gray-50/50 dark:bg-slate-900/30">
                        <OrderSteps status={order.status} createdAt={order.created_at} dueDate={order.due_date} history={order.history} />
                    </div>
                </div>

                {/* Info Cards Row */}
                <OrderInfoCards
                    dueDate={order.due_date}
                    patient={order.patient}
                    counterparty={order.clinic}
                    counterpartyLabel={t('Clinic')}
                    service={order.service}
                    priority={order.priority}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Details (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Clinical Specifications */}
                        <div className="glass-card rounded-2xl p-6 animate-fade-in animate-delay-300 hover:shadow-lg transition-shadow">
                            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-2 mb-6 uppercase tracking-wider">
                                <ClipboardCheck className="w-4 h-4 text-primary-500" /> {t('Clinical Specifications')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="w-full">
                                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">{t('Interactive Odontogram')}</h4>
                                    <div className="bg-white dark:bg-slate-900 shadow-inner p-4 rounded-xl border border-gray-100 dark:border-slate-800 w-full">
                                        <div className="w-full flex justify-center">
                                            <Odontogram selectedTeeth={teethNumbers} readOnly={true} />
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
                        <OrderAttachments
                            orderId={order.id}
                            files={order.files}
                            uploadRoute={route('lab.orders.upload', order.id)}
                            deleteRoute={(orderId, fileId) => route('lab.orders.delete-file', [orderId, fileId])}
                            onViewStl={(url) => setViewingStl(url)}
                        />

                        {/* Internal Notes */}
                        <OrderNotes orderId={order.id} notes={order.notes} />
                    </div>

                    {/* Right Column - Sidebar (1/3) */}
                    <div className="space-y-6">
                        {/* Order Actions */}
                        <OrderActions
                            allowedTransitions={allowedTransitions}
                            processing={processing}
                            onUpdateStatus={updateStatus}
                        />

                        {/* Order Timeline */}
                        <OrderTimeline history={order.history} />

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
            {showRejectModal && (
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
            )}

            {/* 3D STL Viewer Modal */}
            <Modal show={!!viewingStl} onClose={() => setViewingStl(null)} maxWidth="2xl">
                <div className="p-6 bg-white dark:bg-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Box className="w-5 h-5 text-primary-500" /> {t('3D Model Viewer')}
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
        </LabLayout>
    );
}
