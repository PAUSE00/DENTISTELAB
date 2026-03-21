import React, { useState } from 'react';
import { 
 DollarSign, Clock, CheckCircle2, AlertCircle, 
 Plus, History, Wallet, Calendar, User, FileText, X
} from 'lucide-react';
import { useForm } from '@inertiajs/react';
import useTranslation from '@/Hooks/useTranslation';
import Modal from '@/Components/Modal';
import { Order, OrderPayment } from '@/types/order';

interface Props {
 order: Order;
 canRecord?: boolean;
}

export default function OrderPaymentSection({ order, canRecord = false }: Props) {
 const { t } = useTranslation();
 const [showModal, setShowModal] = useState(false);

 const { data, setData, post, processing, reset, errors } = useForm({
 amount: order.remaining_balance || 0,
 paid_at: new Date().toISOString().split('T')[0],
 notes: '',
 });

 const formatCurrency = (val: number) => 
 new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(val);

 const submit = (e: React.FormEvent) => {
 e.preventDefault();
 post(route('lab.orders.payments.store', order.id), {
 preserveScroll: true,
 onSuccess: () => {
 setShowModal(false);
 reset();
 },
 });
 };

 const progress = Math.min(((order.paid_amount || 0) / (order.price || 1)) * 100, 100);

 return (
 <div className="flex flex-col gap-4">
 {/* Header / Summary */}
 <div className="flex items-center justify-between">
 <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--txt-1)' }}>
 <Wallet size={16} className="text-emerald-500" /> {t('Payment Tracking')}
 </h3>
 {canRecord && !order.is_fully_paid && (
 <button 
 onClick={() => setShowModal(true)}
 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
 style={{ background: 'var(--teal-10)', color: 'var(--txt-accent)', border: '1px solid var(--teal-20)' }}
 >
 <Plus size={14} /> {t('Record Cash')}
 </button>
 )}
 </div>

 {/* Payment Progress Card */}
 <div className="p-6 rounded-2xl border flex flex-col gap-6 shadow-sm relative overflow-hidden" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
 {/* Subtle gradient flash */}
 {progress === 100 && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-10 blur-[50px] pointer-events-none" />}
 
 {/* Balance Split */}
 <div className="grid grid-cols-2 gap-4 relative z-10">
 <div className="flex flex-col gap-1.5">
 <span className="text-[10px] uppercase font-bold tracking-[0.2em] m-0" style={{ color: 'var(--txt-4)' }}>{t('Paid Amount')}</span>
 <span className="text-xl font-black text-emerald-500">{formatCurrency(order.paid_amount || 0)}</span>
 </div>
 <div className="flex flex-col gap-1.5 text-right">
 <span className="text-[10px] uppercase font-bold tracking-[0.2em] m-0" style={{ color: 'var(--txt-4)' }}>{t('Remaining')}</span>
 <span className="text-xl font-black" style={{ color: order.remaining_balance > 0 ? 'var(--rose-500)' : 'var(--txt-1)' }}>
 {formatCurrency(order.remaining_balance || 0)}
 </span>
 </div>
 </div>

 {/* Progress Bar */}
 <div className="w-full h-2.5 rounded-full overflow-hidden relative z-10" style={{ background: 'rgba(255,255,255,0.05)' }}>
 <div 
 className="h-full rounded-full transition-all duration-1000 ease-out"
 style={{ 
 width: `${progress}%`,
 background: progress === 100 
 ? 'linear-gradient(90deg, #059669, #34d399)' 
 : 'linear-gradient(90deg, #d97706, #fbbf24)',
 boxShadow: progress === 100 ? '0 0 10px rgba(52, 211, 153, 0.4)' : 'none'
 }}
 />
 </div>

 {/* Totals & Status */}
 <div className="flex items-center justify-between pt-4 border-t relative z-10" style={{ borderColor: 'var(--border)' }}>
 <div className="flex flex-col">
 <span className="text-[9px] uppercase tracking-widest font-bold opacity-50 mb-0.5">{t('Order Total')}</span>
 <span className="text-[14px] font-black" style={{ color: 'var(--txt-1)' }}>{formatCurrency(order.price || 0)}</span>
 </div>
 <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border shadow-sm ${
 order.payment_status === 'paid' 
 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
 : order.payment_status === 'partial'
 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
 : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
 }`}>
 {order.payment_status === 'paid' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
 {t(order.payment_status)}
 </div>
 </div>
 </div>

 {/* Recent Payments History */}
 {order.payments && order.payments.length > 0 && (
 <div className="flex flex-col gap-3 mt-4">
 <span className="text-[10px] uppercase font-bold tracking-[0.2em] ml-1" style={{ color: 'var(--txt-4)' }}>{t('Payment History')}</span>
 <div className="flex flex-col gap-2.5">
 {order.payments.map((p) => (
 <div key={p.id} className="p-4 rounded-xl border flex items-center justify-between transition-all hover:bg-white/5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
 <Wallet size={16} />
 </div>
 <div className="flex flex-col gap-0.5">
 <div className="text-[13px] font-black leading-none" style={{ color: 'var(--txt-1)' }}>{formatCurrency(p.amount)}</div>
 <div className="text-[10px] font-bold uppercase tracking-widest opacity-40" style={{ color: 'var(--txt-3)' }}>
 {new Date(p.paid_at).toLocaleDateString()}
 </div>
 </div>
 </div>
 <div className="flex items-center gap-3">
 {p.notes && (
 <div className="group relative">
 <div className="p-2 rounded-lg bg-black/20 text-white/40 hover:text-white transition-colors cursor-help">
 <FileText size={14} />
 </div>
 <div className="absolute bottom-full right-0 mb-2 w-48 p-3 rounded-xl border shadow-xl text-[11px] opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
 {p.notes}
 </div>
 </div>
 )}
 <div className="px-2 py-1 rounded bg-black/20 text-[9px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--txt-3)' }}>
 {p.recorded_by?.name || t('Lab')}
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}


 {/* Record Payment Modal */}
 <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="md">
 <form onSubmit={submit} className="p-6 flex flex-col gap-6" style={{ background: 'var(--bg-raised)' }}>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <Wallet size={18} className="text-emerald-500" />
 <h3 className="text-lg font-bold" style={{ color: 'var(--txt-1)' }}>{t('Record Cash Payment')}</h3>
 </div>
 <button type="button" onClick={() => setShowModal(false)} style={{ color: 'var(--txt-3)' }}>
 <X size={20} />
 </button>
 </div>

 <div className="flex flex-col gap-4">
 <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
 <div className="flex flex-col">
 <span className="text-[10px] uppercase font-bold opacity-50">{t('Remaining Balance')}</span>
 <span className="text-lg font-black" style={{ color: 'var(--txt-1)' }}>{formatCurrency(order.remaining_balance)}</span>
 </div>
 <div className="flex flex-col text-right">
 <span className="text-[10px] uppercase font-bold opacity-50">{t('Reference')}</span>
 <span className="text-[13px] font-bold" style={{ color: 'var(--txt-3)' }}>Order #{order.id}</span>
 </div>
 </div>

 <div>
 <label className="text-[11px] font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--txt-3)' }}>{t('Amount to Record (MAD)')}</label>
 <div className="relative">
 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">Dh</div>
 <input 
 type="number" 
 step="0.01"
 value={data.amount}
 onChange={e => setData('amount', e.target.value as any)}
 className="app-input w-full !pl-10"
 placeholder="0.00"
 />
 </div>
 {errors.amount && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tight">{errors.amount}</p>}
 </div>

 <div>
 <label className="text-[11px] font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--txt-3)' }}>{t('Payment Date')}</label>
 <input 
 type="date" 
 value={data.paid_at}
 onChange={e => setData('paid_at', e.target.value)}
 className="app-input w-full"
 />
 </div>

 <div>
 <label className="text-[11px] font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--txt-3)' }}>{t('Internal Notes')}</label>
 <textarea 
 value={data.notes}
 onChange={e => setData('notes', e.target.value)}
 className="app-input w-full resize-none h-20"
 placeholder={t('Enter any details about this cash transaction...')}
 />
 </div>
 </div>

 <div className="flex gap-3">
 <button 
 type="button" 
 onClick={() => setShowModal(false)}
 className="btn-ghost flex-1 justify-center py-2.5"
 >
 {t('Cancel')}
 </button>
 <button 
 type="submit" 
 disabled={processing}
 className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl transition-all disabled:opacity-50"
 >
 {processing ? t('Processing...') : t('Save Payment')}
 </button>
 </div>
 </form>
 </Modal>
 </div>
 );
}
