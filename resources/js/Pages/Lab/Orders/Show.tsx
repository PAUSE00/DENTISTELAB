import LabLayout from '@/Layouts/LabLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import ChatBox from '@/Components/ChatBox';
import StatusBadge from '@/Components/StatusBadge';
import { useState, useEffect } from 'react';
import { FileText, ArrowLeft, Printer, FileDown, AlertCircle, Box, X } from 'lucide-react';
import Odontogram from '@/Components/Odontogram';
import Modal from '@/Components/Modal';
import ThreeDViewer from '@/Components/ThreeDViewer';
import useTranslation from '@/Hooks/useTranslation';
import { MessageSquare } from 'lucide-react';
import OrderSteps from '@/Components/Orders/OrderSteps';
import OrderTimeline from '@/Components/Orders/OrderTimeline';
import OrderAttachments from '@/Components/Orders/OrderAttachments';
import OrderInfoCards from '@/Components/Orders/OrderInfoCards';
import OrderNotes from '@/Components/Orders/OrderNotes';
import OrderActions from '@/Components/Orders/OrderActions';
import { OrderFile, AllowedTransition, OrderHistoryEntry, OrderNote } from '@/types/order';

interface Order {
    id: number; status: string; priority: string; due_date: string; created_at: string;
    teeth: number[]; shade: string; material: string; instructions: string | null;
    patient: { id: number; first_name: string; last_name: string };
    clinic: { id: number; name: string };
    service: { id: number; name: string };
    files: OrderFile[]; history: OrderHistoryEntry[]; notes: OrderNote[];
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
                .listen('.order.updated', () => { router.reload({ only: ['order', 'allowedTransitions'] }); });
        }
        return () => { if (window.Echo) window.Echo.leave(`orders.${order.id}`); };
    }, [order.id]);

    const updateStatus = (newStatus: string) => {
        if (newStatus === 'rejected') { setShowRejectModal(true); return; }
        setProcessing(true);
        router.patch(route('lab.orders.update-status', order.id), { status: newStatus }, {
            preserveScroll: true, onFinish: () => setProcessing(false),
        });
    };

    const submitRejection = () => {
        setProcessing(true);
        router.patch(route('lab.orders.update-status', order.id), {
            status: 'rejected', rejection_reason: rejectionReason,
        }, { preserveScroll: true, onFinish: () => { setProcessing(false); setShowRejectModal(false); setRejectionReason(''); } });
    };

    const teethNumbers = (order.teeth || []).map(Number);

    return (
        <LabLayout>
            <Head title={`${t('Order')} #${order.id}`} />

            <div className="flex flex-col gap-4 pb-10">

                {/* ── Top bar ──────────────────────────────────────────── */}
                <div className="card overflow-hidden">
                    {/* Header row */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 px-4 py-3 border-b"
                        style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-3">
                            <Link href={route('lab.orders.index')}
                                className="p-1.5 rounded-lg transition-colors"
                                style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)', color: 'var(--txt-2)' }}>
                                <ArrowLeft size={14} />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <h1 className="text-[15px] font-semibold" style={{ color: 'var(--txt-1)' }}>
                                        {t('Order')} <span style={{ color: 'var(--txt-accent)' }}>#{order.id}</span>
                                    </h1>
                                    <StatusBadge status={order.status} />
                                </div>
                                <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                                    {t('Created')} {new Date(order.created_at).toLocaleDateString()} · {order.clinic?.name || '—'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <a href={route('orders.job-ticket', order.id)} target="_blank" className="btn-ghost text-[12px]">
                                <FileText size={13} /> {t('Job Ticket')}
                            </a>
                            <button className="btn-ghost text-[12px]" onClick={() => window.print()}>
                                <Printer size={13} /> {t('Print')}
                            </button>
                            <button className="btn-ghost text-[12px]" onClick={() => window.open(route('orders.invoice', order.id), '_blank')}>
                                <FileDown size={13} /> {t('Invoice')}
                            </button>
                        </div>
                    </div>

                    {/* Progress steps */}
                    <div className="px-5 py-4" style={{ background: 'var(--surface)' }}>
                        <OrderSteps status={order.status} createdAt={order.created_at} dueDate={order.due_date} history={order.history} />
                    </div>
                </div>

                {/* Info row */}
                <OrderInfoCards
                    dueDate={order.due_date}
                    patient={order.patient}
                    counterparty={order.clinic}
                    counterpartyLabel={t('Clinic')}
                    service={order.service}
                    priority={order.priority}
                />

                {/* ── Main layout ───────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Left — details */}
                    <div className="lg:col-span-2 flex flex-col gap-4">

                        {/* Clinical specs */}
                        <div className="card p-4">
                            <p className="text-[11px] font-semibold mb-4" style={{ color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                {t('Clinical Specifications')}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Odontogram */}
                                <div>
                                    <p className="text-[11px] mb-2 font-medium" style={{ color: 'var(--txt-3)' }}>{t('Odontogram')}</p>
                                    <div className="rounded-lg p-3 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                        <div className="flex justify-center">
                                            <Odontogram selectedTeeth={teethNumbers} readOnly={true} />
                                        </div>
                                        {teethNumbers.length > 0 && (
                                            <p className="text-center text-[11px] mt-2 pt-2 border-t" style={{ color: 'var(--txt-3)', borderColor: 'var(--border)' }}>
                                                {t('Teeth')}: <span style={{ color: 'var(--txt-accent)' }}>{[...teethNumbers].sort().join(', ')}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Parameters */}
                                <div className="flex flex-col gap-3">
                                    <p className="text-[11px] mb-1 font-medium" style={{ color: 'var(--txt-3)' }}>{t('Restoration Parameters')}</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { label: t('Service'), value: order.service?.name },
                                            { label: t('Material'), value: order.material },
                                            { label: t('Shade'), value: order.shade },
                                        ].map(item => (
                                            <div key={item.label} className="rounded-lg p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                                                <p className="text-[10.5px] mb-1" style={{ color: 'var(--txt-3)' }}>{item.label}</p>
                                                <p className="text-[13px] font-semibold" style={{ color: 'var(--txt-1)' }}>{item.value || '—'}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Instructions */}
                                    <div className="rounded-lg p-3 flex-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <AlertCircle size={11} style={{ color: 'var(--txt-3)' }} />
                                            <p className="text-[10.5px]" style={{ color: 'var(--txt-3)' }}>{t('Instructions')}</p>
                                        </div>
                                        <p className="text-[12.5px] italic leading-relaxed" style={{ color: order.instructions ? 'var(--txt-2)' : 'var(--txt-3)' }}>
                                            {order.instructions || t('No specific instructions provided.')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <OrderAttachments
                            orderId={order.id}
                            files={order.files}
                            uploadRoute={route('lab.orders.upload', order.id)}
                            deleteRoute={(orderId, fileId) => route('lab.orders.delete-file', [orderId, fileId])}
                            onViewStl={(url) => setViewingStl(url)}
                        />

                        <OrderNotes orderId={order.id} notes={order.notes} />
                    </div>

                    {/* Right — sidebar */}
                    <div className="flex flex-col gap-4">
                        <OrderActions
                            allowedTransitions={allowedTransitions}
                            processing={processing}
                            onUpdateStatus={updateStatus}
                        />

                        <OrderTimeline history={order.history} />

                        {/* Chat */}
                        <div className="card overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={13} style={{ color: 'var(--txt-3)' }} />
                                    <p className="text-[12.5px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('Clinic Chat')}</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-[11px]" style={{ color: 'var(--txt-3)' }}>{t('Live')}</span>
                                </div>
                            </div>
                            <ChatBox orderId={order.id} compact className="border-none shadow-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="w-full max-w-md rounded-xl p-5 shadow-2xl"
                        style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-strong)' }}>
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-[15px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('Reject Order')}</h3>
                                <p className="text-[12px] mt-0.5" style={{ color: 'var(--txt-3)' }}>{t('Please provide a reason for rejection')}</p>
                            </div>
                            <button onClick={() => setShowRejectModal(false)} className="p-1" style={{ color: 'var(--txt-3)' }}>
                                <X size={16} />
                            </button>
                        </div>
                        <textarea
                            value={rejectionReason}
                            onChange={e => setRejectionReason(e.target.value)}
                            rows={3}
                            className="app-input resize-none"
                            placeholder={t('Bad impression quality, missing info...')}
                        />
                        <div className="flex gap-2 mt-3">
                            <button onClick={() => setShowRejectModal(false)} className="btn-ghost flex-1 justify-center">
                                {t('Cancel')}
                            </button>
                            <button
                                onClick={submitRejection}
                                disabled={!rejectionReason.trim() || processing}
                                className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-opacity disabled:opacity-40"
                                style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}>
                                {t('Confirm Rejection')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3D Viewer */}
            <Modal show={!!viewingStl} onClose={() => setViewingStl(null)} maxWidth="2xl">
                <div className="p-5" style={{ background: 'var(--bg-raised)' }}>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <Box size={15} style={{ color: 'var(--txt-accent)' }} />
                            <h3 className="text-[14px] font-semibold" style={{ color: 'var(--txt-1)' }}>{t('3D Model Viewer')}</h3>
                        </div>
                        <button onClick={() => setViewingStl(null)} className="p-1 rounded transition-colors" style={{ color: 'var(--txt-3)' }}>
                            <X size={16} />
                        </button>
                    </div>
                    <div className="h-[60vh] w-full rounded-lg overflow-hidden border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                        {viewingStl && <ThreeDViewer url={viewingStl} color="#e8d2ac" />}
                    </div>
                </div>
            </Modal>
        </LabLayout>
    );
}
