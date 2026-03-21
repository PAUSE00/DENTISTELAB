import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import ChatBox from '@/Components/ChatBox';
import StatusBadge from '@/Components/StatusBadge';
import { useState, useEffect } from 'react';
import {
 FileText, ArrowLeft, Printer, FileDown, AlertCircle,
 Box, X, Calendar, Building2, MessageSquare, History, Zap, Copy
} from 'lucide-react';
import Odontogram from '@/Components/Odontogram';
import Modal from '@/Components/Modal';
import ThreeDViewer from '@/Components/ThreeDViewer';
import useTranslation from '@/Hooks/useTranslation';

// Shared sub-components
import OrderSteps from '@/Components/Orders/OrderSteps';
import OrderTimeline from '@/Components/Orders/OrderTimeline';
import OrderAttachments from '@/Components/Orders/OrderAttachments';
import OrderPaymentSection from '@/Components/Orders/OrderPaymentSection';
import { Order } from '@/types/order';

interface Props extends PageProps {
 order: Order;
}

const AVATAR_COLORS = ['#4f6272', '#5c5f7a', '#4a6a5c', '#6b5060', '#4d6b6b'];
function avatarColor(s: string) {
 let h = 0; for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
 return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

const btnBase: React.CSSProperties = {
 display: 'inline-flex', alignItems: 'center', gap: '6px',
 padding: '6px 14px', borderRadius: '8px', fontSize: '11.5px',
 fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
 background: 'var(--surface)', border: '1px solid var(--border)',
 color: 'var(--txt-1)', whiteSpace: 'nowrap',
};

export default function Show({ auth, order }: Props) {
 const { t } = useTranslation();
 const [processing, setProcessing] = useState(false);
 const [sidebarTab, setSidebarTab] = useState<'timeline' | 'chat'>('timeline');

 const initials = `${order.patient.first_name[0] || '?'}${order.patient.last_name[0] || '?'}`;
 const avatarBg = avatarColor(initials);
 const teethNumbers = Array.isArray(order.teeth) ? order.teeth.map(Number) : Object.keys(order.teeth || {}).map(Number);

 useEffect(() => {
 if (window.Echo) {
 window.Echo.private(`orders.${order.id}`)
 .listen('.order.updated', () => { router.reload({ only: ['order'] }); });
 }
 return () => { if (window.Echo) window.Echo.leave(`orders.${order.id}`); };
 }, [order.id]);

 const fmtDate = (d: string) =>
 new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

 const handleDuplicate = () => {
 router.post(route('clinic.orders.duplicate', order.id));
 };

 const handleCancel = () => {
 if (!confirm(t('Are you sure you want to cancel this order?'))) return;
 setProcessing(true);
 router.patch(route('clinic.orders.cancel', order.id), {}, {
 onFinish: () => setProcessing(false)
 });
 };

 const customHeader = (
 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
 <Link href={route('clinic.orders.index')}
 style={{
 width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
 borderRadius: '8px', transition: 'all 0.15s',
 background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--txt-2)'
 }}
 onMouseEnter={e => { e.currentTarget.style.color = 'var(--txt-accent)'; e.currentTarget.style.borderColor = 'var(--teal-20)'; e.currentTarget.style.background = 'var(--teal-10)'; }}
 onMouseLeave={e => { e.currentTarget.style.color = 'var(--txt-2)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-raised)'; }}>
 <ArrowLeft size={16} />
 </Link>
 <h1 className="text-[17px] font-bold" style={{ color: 'var(--txt-1)', margin: 0, letterSpacing: '-0.02em' }}>
 {t('Order')} #{order.id}
 </h1>
 <StatusBadge status={order.status} />
 </div>
 );

 return (
 <ClinicLayout fullBleed header={customHeader}>
 <Head title={`${t('Order')} #${order.id}`} />

 <div className="flex flex-col lg:flex-row h-full overflow-hidden w-full" style={{ background: 'var(--bg)' }}>
 
 {/* ── MAIN SCROLL AREA ── */}
 <div className="flex-1 layout-main overflow-y-auto no-scrollbar px-4 sm:px-6 lg:px-8 py-6">
 <div className="max-w-[1300px] mx-auto flex flex-col gap-6">

 {/* Rejection Banner */}
 {order.status === 'rejected' && (
 <div className="rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
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
 <button onClick={handleDuplicate} className="btn-ghost text-[12px]">
 <Copy size={13} /> {t('Edit & Resubmit')}
 </button>
 </div>
 </div>
 )}
 
 {/* 1. TOP CARD (Info & Steps) */}
 <div className="rounded-xl overflow-hidden shadow-sm flex flex-col" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
 <div className="flex flex-wrap items-center justify-between p-4 sm:p-5 border-b gap-4" style={{ borderColor: 'var(--border)' }}>
 <div className="flex flex-wrap items-center gap-3">
 {[
 { 
 icon: <Calendar size={13} />, label: t('Due Date'), 
 value: `${fmtDate(order.due_date)} ${order.is_overdue ? `(${t('OVERDUE')})` : ''}`, 
 iconBg: order.is_overdue ? 'rgba(248,113,113,0.1)' : 'var(--teal-10)', 
 iconColor: order.is_overdue ? '#f87171' : 'var(--txt-accent)' 
 },
 { icon: <span className="text-[11px] font-bold text-white">{initials}</span>, label: t('Patient'), value: `${order.patient.first_name} ${order.patient.last_name}`, iconBg: avatarBg, iconColor: 'white', round: true },
 { icon: <Building2 size={13} />, label: t('Laboratory'), value: order.lab?.name || '—', iconBg: 'rgba(129,140,248,0.1)', iconColor: '#818cf8' },
 ].map((item, i) => (
 <div key={i} className="flex items-center gap-3 px-3 py-1.5 rounded-lg border" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
 <div className="flex items-center justify-center shrink-0 w-8 h-8"
 style={{ borderRadius: item.round ? '50%' : '8px', background: item.iconBg, color: item.iconColor }}>
 {item.icon}
 </div>
 <div className="flex flex-col">
 <p className="text-[9px] font-bold uppercase tracking-wider m-0 leading-tight" style={{ color: 'var(--txt-3)' }}>{item.label}</p>
 <p className="text-[12px] font-bold m-0 leading-tight mt-0.5 truncate max-w-[140px]" style={{ color: 'var(--txt-1)' }}>{item.value}</p>
 </div>
 </div>
 ))}
 {order.priority === 'urgent' && (
 <div className="px-3 py-1.5 rounded-md border text-[11px] font-bold tracking-wide uppercase"
 style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316', borderColor: 'rgba(249,115,22,0.2)' }}>
 {t('Urgent')}
 </div>
 )}
 </div>
 <div className="flex items-center gap-2">
 {order.status === 'new' && (
 <Link href={route('clinic.orders.edit', order.id)} style={btnBase}
 onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--bg-raised)'; }}
 onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}>
 <FileText size={14} /> {t('Edit Order')}
 </Link>
 )}
 <button style={btnBase} onClick={handleDuplicate}
 onMouseEnter={e => { (e.currentTarget as any).style.borderColor = 'var(--border-strong)'; (e.currentTarget as any).style.background = 'var(--bg-raised)'; }}
 onMouseLeave={e => { (e.currentTarget as any).style.borderColor = 'var(--border)'; (e.currentTarget as any).style.background = 'var(--surface)'; }}>
 <Copy size={14} /> {t('Duplicate')}
 </button>
 <button style={btnBase} onClick={() => window.print()}
 onMouseEnter={e => { (e.currentTarget as any).style.borderColor = 'var(--border-strong)'; (e.currentTarget as any).style.background = 'var(--bg-raised)'; }}
 onMouseLeave={e => { (e.currentTarget as any).style.borderColor = 'var(--border)'; (e.currentTarget as any).style.background = 'var(--surface)'; }}>
 <Printer size={14} /> {t('Print')}
 </button>
 </div>
 </div>
 <div className="p-8 lg:px-12 w-full overflow-x-auto no-scrollbar">
 <OrderSteps status={order.status} createdAt={order.created_at} dueDate={order.due_date} history={order.history} />
 </div>
 </div>

 {/* 2. TWO COLS FOR BODY */}
 <div className="grid grid-cols-1 xl:grid-cols-[11fr_7fr] gap-6 pb-12">
 
 {/* LEFT: CLINICAL SPECS */}
 <div className="flex flex-col gap-3">
 <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] ml-1" style={{ color: 'var(--txt-3)' }}>
 {t('Clinical Specifications')}
 </h2>
 <div className="rounded-xl shadow-sm border p-6 flex flex-col h-full" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
 
 {/* Odontogram Frame */}
 <div className="rounded-xl p-8 mb-6 flex flex-col items-center justify-center border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
 <h3 className="text-[10px] font-bold uppercase tracking-[0.1em] self-start" style={{ color: 'var(--txt-3)' }}>
 {t('Odontogram')}
 </h3>
 <div className="mt-4 mb-4">
 <Odontogram 
 selectedTeeth={teethNumbers} 
 toothTreatments={!Array.isArray(order.teeth) ? ((order.teeth || {}) as Record<number, string>) : {}}
 readOnly={true} 
 />
 </div>
 {teethNumbers.length > 0 && (
 <p className="text-center text-[12px] mt-6" style={{ color: 'var(--txt-3)' }}>
 {t('Selected Teeth')}: <br/>
 <span className="font-bold text-[14px]" style={{ color: 'var(--txt-accent)' }}>
 {Array.isArray(order.teeth) 
 ? [...teethNumbers].sort((a, b) => a - b).join(', ') 
 : Object.entries(order.teeth || {}).map(([k, v]) => `${k} (${v})`).join(', ')}
 </span>
 </p>
 )}
 </div>
 
 {/* Info Rows */}
 <div className="grid grid-cols-2 gap-4 mb-5">
 <div className="p-3 border rounded-lg bg-[var(--bg)]" style={{ borderColor: 'var(--border)' }}>
 <p className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--txt-3)' }}>{t('Service Type')}</p>
 <p className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>{order.service?.name || '—'}</p>
 </div>
 <div className="p-3 border rounded-lg bg-[var(--bg)]" style={{ borderColor: 'var(--border)' }}>
 <p className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: 'var(--txt-3)' }}>{t('Material & Shade')}</p>
 <p className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>
 {order.material} {order.shade ? `· ${order.shade}` : ''}
 </p>
 </div>
 </div>

 {/* Instructions */}
 <div className="p-4 border rounded-lg bg-[var(--bg)] flex-1" style={{ borderColor: 'var(--border)' }}>
 <div className="flex items-center gap-2 mb-2">
 <AlertCircle size={12} color="var(--txt-3)" />
 <p className="text-[10px] uppercase font-bold tracking-wider m-0" style={{ color: 'var(--txt-3)' }}>{t('Special Instructions')}</p>
 </div>
 <p className="text-[12.5px] leading-relaxed m-0" style={{ color: order.instructions ? 'var(--txt-2)' : 'var(--txt-3)', fontStyle: order.instructions ? 'normal' : 'italic' }}>
 {order.instructions || t('No specific instructions provided.')}
 </p>
 </div>

 </div>
 </div>
 
 {/* RIGHT: FILES & QUICK ACTIONS */}
 <div className="flex flex-col gap-6">
 
 {/* New: Payment Section */}
 <div className="rounded-xl shadow-sm border p-6 flex flex-col" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
 <OrderPaymentSection order={order} canRecord={false} />
 </div>

 <div className="flex flex-col gap-3">
 <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] ml-1" style={{ color: 'var(--txt-3)' }}>
 {t('Files & Attachments')}
 </h2>
 <div className="rounded-xl shadow-sm border p-6 flex flex-col h-full" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
 <OrderAttachments
 orderId={order.id}
 files={order.files}
 uploadRoute={route('clinic.orders.upload', order.id)}
 deleteRoute={(orderId, fileId) => route('clinic.orders.delete-file', [orderId, fileId])}
 />
 </div>
 </div>

 {/* QUICK ACTIONS (Clinic side) */}
 <div className="rounded-xl shadow-sm border mt-2 flex flex-col" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
 <div className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-[0.08em] p-4 border-b" style={{ borderColor: 'var(--border)', color: 'var(--txt-1)' }}>
 <Zap size={14} style={{ color: 'var(--txt-3)' }} /> {t('Quick Actions')}
 </div>
 <div className="p-5 flex flex-col gap-3">
 <button onClick={() => window.open(route('orders.invoice', order.id), '_blank')}
 className="w-full flex justify-center items-center gap-2 py-2.5 rounded-lg text-[12.5px] font-bold transition-colors border"
 style={{ background: 'var(--teal-10)', borderColor: 'var(--teal-20)', color: 'var(--txt-accent)' }}>
 <FileDown size={14} /> {t('Download Invoice PDF')}
 </button>

 {!['completed', 'cancelled', 'rejected'].includes(order.status) && (
 <button onClick={handleCancel} disabled={processing}
 className="w-full flex justify-center items-center gap-2 py-2.5 rounded-lg text-[12.5px] font-bold transition-opacity disabled:opacity-40 border"
 style={{ background: 'rgba(248,113,113,0.05)', borderColor: 'rgba(248,113,113,0.2)', color: '#f87171' }}>
 <X size={14} /> {t('Cancel Order')}
 </button>
 )}
 </div>
 </div>
 </div>

 </div>
 </div>
 </div>

 {/* ── RIGHT FIXED SIDEBAR (ONLY DESKTOP) ── */}
 <div className="hidden lg:flex flex-col w-[340px] shrink-0 h-full border-l" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
 {/* Tabs */}
 <div className="flex border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
 <button onClick={() => setSidebarTab('timeline')} className="flex-1 py-4 text-[10.5px] font-bold uppercase tracking-[0.08em] flex items-center justify-center gap-2 transition-colors relative" style={{ color: sidebarTab === 'timeline' ? 'var(--txt-accent)' : 'var(--txt-3)' }}>
 <History size={14} /> {t('Timeline')}
 {sidebarTab === 'timeline' && <span className="absolute bottom-0 left-0 w-full h-[2px] transition-all" style={{ background: 'var(--txt-accent)' }} />}
 </button>
 <button onClick={() => setSidebarTab('chat')} className="flex-1 py-4 text-[10.5px] font-bold uppercase tracking-[0.08em] flex items-center justify-center gap-2 transition-colors relative" style={{ color: sidebarTab === 'chat' ? 'var(--txt-accent)' : 'var(--txt-3)' }}>
 <MessageSquare size={14} /> {t('Chat')}
 {sidebarTab === 'chat' && <span className="absolute bottom-0 left-0 w-full h-[2px] transition-all" style={{ background: 'var(--txt-accent)' }} />}
 </button>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-hidden relative">
 {sidebarTab === 'timeline' && (
 <div className="absolute inset-0 overflow-y-auto p-5 no-scrollbar bg-[var(--surface)]">
 <OrderTimeline history={order.history} />
 </div>
 )}
 {sidebarTab === 'chat' && (
 <div className="absolute inset-0 flex flex-col">
 <ChatBox orderId={order.id} compact={false} className="h-full" />
 </div>
 )}
 </div>
 </div>

 {/* Mobile Tab Fallback (shows at bottom instead of right sidebar) */}
 <div className="lg:hidden flex flex-col h-[500px] border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
 <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
 <button onClick={() => setSidebarTab('timeline')} className="flex-1 py-4 text-[11px] font-bold uppercase tracking-[0.08em] flex items-center justify-center gap-2 transition-colors relative" style={{ color: sidebarTab === 'timeline' ? 'var(--txt-accent)' : 'var(--txt-3)' }}>
 <History size={13} /> {t('Timeline')}
 {sidebarTab === 'timeline' && <span className="absolute bottom-0 left-0 w-full h-[2px]" style={{ background: 'var(--txt-accent)' }} />}
 </button>
 <button onClick={() => setSidebarTab('chat')} className="flex-1 py-4 text-[11px] font-bold uppercase tracking-[0.08em] flex items-center justify-center gap-2 transition-colors relative" style={{ color: sidebarTab === 'chat' ? 'var(--txt-accent)' : 'var(--txt-3)' }}>
 <MessageSquare size={13} /> {t('Chat')}
 {sidebarTab === 'chat' && <span className="absolute bottom-0 left-0 w-full h-[2px]" style={{ background: 'var(--txt-accent)' }} />}
 </button>
 </div>
 {sidebarTab === 'timeline' && (
 <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
 <OrderTimeline history={order.history} />
 </div>
 )}
 {sidebarTab === 'chat' && (
 <div className="flex-1 flex flex-col">
 <ChatBox orderId={order.id} compact={false} className="h-full" />
 </div>
 )}
 </div>

 </div>
 </ClinicLayout>
 );
}

