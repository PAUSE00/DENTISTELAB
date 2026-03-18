import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import ChatBox from '@/Components/ChatBox';
import StatusBadge from '@/Components/StatusBadge';
import { useState, useEffect } from 'react';
import { FileText, Calendar, AlertCircle, ClipboardCheck, Box, X, ArrowLeft, Printer, Copy, Download } from 'lucide-react';
import Odontogram from '@/Components/Odontogram';
import Modal from '@/Components/Modal';
import ThreeDViewer from '@/Components/ThreeDViewer';
import useTranslation from '@/Hooks/useTranslation';
import { Building } from 'lucide-react';

// Shared sub-components
import OrderSteps from '@/Components/Orders/OrderSteps';
import OrderTimeline from '@/Components/Orders/OrderTimeline';
import OrderAttachments from '@/Components/Orders/OrderAttachments';
import { OrderFile, OrderHistoryEntry } from '@/types/order';

interface Order {
    id: number;
    status: string;
    priority: string;
    due_date: string;
    is_overdue: boolean;
    days_remaining: number;
    created_at: string;
    teeth: number[];
    shade: string;
    material: string;
    instructions: string | null;
    rejection_reason: string | null;
    patient: { id: number; first_name: string; last_name: string };
    lab: { id: number; name: string; email?: string };
    service: { id: number; name: string };
    files: OrderFile[];
    history: OrderHistoryEntry[];
}

interface Props extends PageProps {
    order: Order;
}

export default function Show({ auth, order }: Props) {
    const { t } = useTranslation();
    const [processing, setProcessing] = useState(false);
    const [viewingStl, setViewingStl] = useState<string | null>(null);

    useEffect(() => {
        if (window.Echo) {
            window.Echo.private(`orders.${order.id}`)
                .listen('.order.updated', () => {
                    router.reload({ only: ['order'] });
                });
        }
        return () => {
            if (window.Echo) window.Echo.leave(`orders.${order.id}`);
        };
    }, [order.id]);

    return (
        <ClinicLayout>
            <Head title={`Order #${order.id}`} />

            <div className="max-w-7xl mx-auto animate-fade-in pb-10 sm:px-6 lg:px-8">
                {/* Rejection Banner */}
                {order.status === 'rejected' && (
                    <div className="rounded-xl p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.25)' }}>
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171' }}>
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[14px] leading-tight" style={{ color: '#f87171' }}>{t('Order Rejected')}</h3>
                                <p className="text-[12px] mt-1 mb-2" style={{ color: 'var(--txt-3)' }}>{t('The laboratory rejected this order with the following reason:')}</p>
                                <div className="px-4 py-3 rounded-xl text-[12px]" style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)', color: 'var(--txt-2)' }}>
                                    "{order.rejection_reason || t('No reason provided.')}"
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => router.post(route('clinic.orders.duplicate', order.id))} className="btn-ghost text-[12px]">
                                <Copy size={13} /> {t('Edit & Resubmit')}
                            </button>
                            <button onClick={() => router.patch(route('clinic.orders.cancel', order.id))} disabled={processing}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold disabled:opacity-50"
                                style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
                                <X size={13} /> {t('Cancel')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Header & Stepper Card */}
                <div className="card overflow-hidden mb-6" style={{ background: 'var(--bg-raised)' }}>
                    <div className="px-5 py-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-3">
                            <Link href={route('clinic.orders.index')}
                                className="p-1.5 rounded-lg transition-colors"
                                style={{ border: '1px solid var(--border-strong)', color: 'var(--txt-3)' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                <ArrowLeft size={14} />
                            </Link>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-[16px] font-bold" style={{ color: 'var(--txt-1)' }}>{t('Order')} #{order.id}</h1>
                                    <StatusBadge status={order.status} />
                                </div>
                                <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                                    {t('Created on')} {new Date(order.created_at).toLocaleDateString()} · {t('Lab')}: <span style={{ color: 'var(--txt-2)' }}>{order.lab.name}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {order.status === 'new' && (
                                <Link href={route('clinic.orders.edit', order.id)} className="btn-ghost text-[12px] !py-1.5">
                                    <ClipboardCheck size={12} /> {t('Edit Order')}
                                </Link>
                            )}
                            <button onClick={() => router.post(route('clinic.orders.duplicate', order.id))} className="btn-ghost text-[12px] !py-1.5">
                                <Copy size={12} /> {t('Duplicate')}
                            </button>
                            <button className="btn-ghost text-[12px] !py-1.5">
                                <Printer size={12} /> {t('Print')}
                            </button>
                            <button onClick={() => window.open(route('orders.invoice', order.id), '_blank')} className="btn-ghost text-[12px] !py-1.5">
                                <Download size={12} /> PDF
                            </button>
                        </div>
                    </div>
                    <div className="px-6 py-5" style={{ background: 'rgba(255,255,255,0.01)' }}>
                        <OrderSteps status={order.status} createdAt={order.created_at} dueDate={order.due_date} history={order.history} />
                    </div>
                </div>

                {/* Info Cards Row — Clinic-specific (has overdue + lab email info) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Due Date Card */}
                    <div className="card p-4" style={{ background: 'var(--bg-raised)' }}>
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-[10.5px] font-semibold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Due Date')}</p>
                                <p className="text-[15px] font-bold leading-tight" style={{ color: 'var(--txt-1)' }}>
                                    {new Date(order.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                                <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md mt-1 inline-block"
                                    style={order.is_overdue
                                        ? { background: 'rgba(248,113,113,0.1)', color: '#f87171' }
                                        : { background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                                    {order.is_overdue ? t('OVERDUE') : `${order.days_remaining}d ${t('remaining')}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Patient Card */}
                    <div className="card p-4" style={{ background: 'var(--bg-raised)' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[13px] text-white shrink-0"
                                style={{ background: 'linear-gradient(135deg, #818cf8, #6638b4)' }}>
                                {order.patient.first_name[0]}{order.patient.last_name[0]}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10.5px] font-semibold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Patient')}</p>
                                <p className="font-bold text-[14px] truncate leading-tight" style={{ color: 'var(--txt-1)' }}>{order.patient.first_name} {order.patient.last_name}</p>
                                <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--txt-3)' }}>ID #{order.patient.id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Lab Info Card */}
                    <div className="card p-4" style={{ background: 'var(--bg-raised)' }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: 'rgba(129,140,248,0.1)', color: '#818cf8' }}>
                                <Building size={18} />
                            </div>
                            <div>
                                <p className="text-[10.5px] font-semibold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Laboratory')}</p>
                                <p className="font-bold text-[13px] truncate" style={{ color: 'var(--txt-1)' }}>{order.lab.name}</p>
                            </div>
                        </div>
                        <div className="border-t pt-3 flex flex-col gap-2" style={{ borderColor: 'var(--border)' }}>
                            {order.lab.email && (
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px]" style={{ color: 'var(--txt-3)' }}>{t('Email')}</span>
                                    <span className="text-[11px] font-semibold" style={{ color: '#60ddc6' }}>{order.lab.email}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-[11px]" style={{ color: 'var(--txt-3)' }}>{t('Priority')}</span>
                                <span className="text-[11px] font-semibold flex items-center gap-1" style={{ color: 'var(--txt-2)' }}>
                                    <Box size={11} /> {t('Standard')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Left Column - Main Details (2/3) */}
                    <div className="lg:col-span-2 flex flex-col gap-5">
                        {/* Clinical Specifications */}
                        <div className="card p-5" style={{ background: 'var(--bg-raised)' }}>
                            <h3 className="text-[11px] font-semibold flex items-center gap-2 mb-5 uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>
                                <ClipboardCheck size={13} style={{ color: '#60ddc6' }} /> {t('Clinical Specifications')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="w-full">
                                    <h4 className="text-[10.5px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--txt-3)' }}>{t('Interactive Odontogram')}</h4>
                                    <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                                        <div className="w-full flex justify-center">
                                            <Odontogram selectedTeeth={(order.teeth || []).map(Number)} readOnly={true} />
                                        </div>
                                        <div className="text-center mt-2 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                                            <p className="text-[11.5px]" style={{ color: 'var(--txt-3)' }}>
                                                {t('Selected')}: <span className="font-bold" style={{ color: '#60ddc6' }}>
                                                    {order.teeth?.length > 0 ? [...order.teeth].sort().join(', ') : t('None')}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <h4 className="text-[10.5px] font-semibold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Restoration Parameters')}</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                                            <span className="text-[10px] block uppercase tracking-wide mb-1.5 font-semibold" style={{ color: 'var(--txt-3)' }}>{t('Service Type')}</span>
                                            <span className="font-semibold text-[12.5px]" style={{ color: 'var(--txt-1)' }}>{order.service.name}</span>
                                        </div>
                                        <div className="p-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                                            <span className="text-[10px] block uppercase tracking-wide mb-1.5 font-semibold" style={{ color: 'var(--txt-3)' }}>{t('Material & Shade')}</span>
                                            <span className="font-semibold text-[12.5px]" style={{ color: 'var(--txt-1)' }}>{order.material} / {order.shade}</span>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl flex-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)', minHeight: 100 }}>
                                        <span className="text-[10px] block uppercase tracking-wide mb-2 font-semibold flex items-center gap-1" style={{ color: 'var(--txt-3)' }}>
                                            <AlertCircle size={11} /> {t('Special Instructions')}
                                        </span>
                                        <p className="text-[12px] italic leading-relaxed" style={{ color: 'var(--txt-2)' }}>
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
                            uploadRoute={route('clinic.orders.upload', order.id)}
                            deleteRoute={(orderId, fileId) => route('clinic.orders.delete-file', [orderId, fileId])}
                            onViewStl={(url) => setViewingStl(url)}
                        />
                    </div>

                    {/* Right Column - Sidebar (1/3) */}
                    <div className="flex flex-col gap-5">
                        {/* Order Timeline */}
                        <OrderTimeline history={order.history} />

                        {/* Chat */}
                        <div className="card overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
                            <div className="px-4 py-3 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                                <h3 className="font-semibold text-[12px] uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>
                                    {t('Live Order Chat')}
                                </h3>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
                                    style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                                    <span className="text-[10px] font-bold" style={{ color: '#34d399' }}>{t('Online')}</span>
                                </div>
                            </div>
                            <ChatBox orderId={order.id} compact className="border-none shadow-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3D STL Viewer Modal */}
            <Modal show={!!viewingStl} onClose={() => setViewingStl(null)} maxWidth="2xl">
                <div className="p-5" style={{ background: 'var(--bg-raised)' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-[14px] flex items-center gap-2" style={{ color: 'var(--txt-1)' }}>
                            <Box size={15} style={{ color: '#60ddc6' }} /> {t('3D Model Viewer')}
                        </h3>
                        <button onClick={() => setViewingStl(null)} style={{ color: 'var(--txt-3)' }}>
                            <X size={16} />
                        </button>
                    </div>
                    <div className="h-[60vh] min-h-[500px] w-full rounded-xl overflow-hidden"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)' }}>
                        {viewingStl && <ThreeDViewer url={viewingStl} color="#e8d2ac" />}
                    </div>
                </div>
            </Modal>
        </ClinicLayout>
    );
}
