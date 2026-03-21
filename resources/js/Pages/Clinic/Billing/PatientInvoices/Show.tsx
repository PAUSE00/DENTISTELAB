import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import ClinicLayout from '@/Layouts/ClinicLayout';
import { 
 FileText, Printer, Download, CreditCard, Plus, X,
 ArrowLeft, History, Coins, Calendar, Info, CheckCircle2,
 CalendarDays, User, Mail, Phone, ExternalLink, Briefcase
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import Modal from '@/Components/Modal';

interface Props {
 invoice: any;
}

export default function ShowPatientInvoice({ invoice }: Props) {
 const { t } = useTranslation();
 const [showPaymentModal, setShowPaymentModal] = useState(false);

 const { data, setData, post, processing, reset, errors } = useForm({
 amount: invoice.total - invoice.paid_amount,
 method: 'cash',
 paid_at: new Date().toISOString().split('T')[0],
 notes: ''
 });

 const submitPayment = (e: React.FormEvent) => {
 e.preventDefault();
 post(route('clinic.patient-invoices.payments.store', invoice.id), {
 onSuccess: () => {
 setShowPaymentModal(false);
 reset();
 }
 });
 };

 const remaining = invoice.total - invoice.paid_amount;
 const progress = Math.min((invoice.paid_amount / invoice.total) * 100, 100);

 const getStatusStyle = (s: string) => {
 switch (s) {
 case 'paid': return { bg: 'var(--teal-10)', color: 'var(--teal)', label: t('Paid') };
 case 'partial': return { bg: 'var(--indigo-10)', color: 'var(--indigo)', label: t('Partial') };
 default: return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: t('Unpaid') };
 }
 };

 const formatCur = (num: number) => 
 new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(num);

 return (
 <ClinicLayout>
 <Head title={`${invoice.invoice_number} - ${invoice.patient.first_name}`} />

 <div className="space-y-6">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="flex items-center gap-4">
 <Link
 href={route('clinic.patient-invoices.index')}
 className="p-2 rounded-xl transition-colors shrink-0"
 style={{ background: 'var(--surface-hover)', color: 'var(--txt-2)' }}
 >
 <ArrowLeft size={20} />
 </Link>
 <div>
 <div className="flex items-center gap-3">
 <h1 className="text-xl font-semibold transition-colors" style={{ color: 'var(--txt-1)' }}>{invoice.invoice_number}</h1>
 <div 
 className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm"
 style={{ backgroundColor: getStatusStyle(invoice.payment_status).bg, color: getStatusStyle(invoice.payment_status).color }}
 >
 {getStatusStyle(invoice.payment_status).label}
 </div>
 </div>
 <p className="text-[13px] mt-1" style={{ color: 'var(--txt-3)' }}>{t('Issued on')} {new Date(invoice.issued_at).toLocaleDateString()}</p>
 </div>
 </div>

 <div className="flex items-center gap-3">
 {invoice.payment_status !== 'paid' && (
 <button
 onClick={() => setShowPaymentModal(true)}
 className="btn-primary flex items-center gap-2 py-2 px-4 shadow-md text-sm"
 >
 <CreditCard size={18} /> {t('Record Payment')}
 </button>
 )}
 <button className="btn-ghost p-2" aria-label="Print">
 <Printer size={18} />
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Main Invoice Card */}
 <div className="lg:col-span-2 space-y-6">
 <div className="card overflow-hidden">
 <div className="p-6 border-b flex justify-between items-start" style={{ borderColor: 'var(--border)', background: 'var(--surface-hover)' }}>
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--txt-2)' }}>
 <User size={18} />
 </div>
 <div>
 <div className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--txt-3)' }}>{t('Bill To')}</div>
 <div className="font-semibold text-lg" style={{ color: 'var(--txt-1)' }}>{invoice.patient.first_name} {invoice.patient.last_name}</div>
 </div>
 </div>
 <div className="space-y-1.5 text-[13px] font-medium ml-13" style={{ color: 'var(--txt-2)' }}>
 <div className="flex items-center gap-2"><Mail size={14} style={{ color: 'var(--txt-3)' }} /> {invoice.patient.email || '-'}</div>
 <div className="flex items-center gap-2"><Phone size={14} style={{ color: 'var(--txt-3)' }} /> {invoice.patient.phone || '-'}</div>
 </div>
 </div>
 <div className="text-right space-y-1">
 <div className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--txt-3)' }}>{t('Invoice Total')}</div>
 <div className="text-3xl font-bold" style={{ color: 'var(--txt-1)' }}>{formatCur(invoice.total)}</div>
 </div>
 </div>

 <div className="p-0 overflow-x-auto">
 <table className="w-full text-left whitespace-nowrap">
 <thead className="text-[11px] uppercase font-semibold tracking-wider border-b" style={{ color: 'var(--txt-3)', borderColor: 'var(--border)', background: 'var(--surface)' }}>
 <tr>
 <th className="px-6 py-4">{t('Description')}</th>
 <th className="px-6 py-4">{t('Qty')}</th>
 <th className="px-6 py-4">{t('Price')}</th>
 <th className="px-6 py-4 text-right">{t('Total')}</th>
 </tr>
 </thead>
 <tbody className="divide-y" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
 {invoice.items.map((item: any) => (
 <tr key={item.id} className="text-[13px] font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5">
 <td className="px-6 py-4 font-semibold" style={{ color: 'var(--txt-1)' }}>{item.description}</td>
 <td className="px-6 py-4" style={{ color: 'var(--txt-2)' }}>{item.quantity}</td>
 <td className="px-6 py-4" style={{ color: 'var(--txt-2)' }}>{formatCur(item.unit_price)}</td>
 <td className="px-6 py-4 text-right font-bold" style={{ color: 'var(--txt-1)' }}>{formatCur(item.total)}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Totals Section */}
 <div className="p-6 border-t flex justify-end" style={{ borderColor: 'var(--border)', background: 'var(--surface-hover)' }}>
 <div className="w-full md:w-64 space-y-3">
 <div className="flex justify-between text-[13px]">
 <span className="font-semibold" style={{ color: 'var(--txt-2)' }}>{t('Subtotal')}</span>
 <span className="font-bold" style={{ color: 'var(--txt-1)' }}>{formatCur(invoice.subtotal)}</span>
 </div>
 <div className="flex justify-between text-[13px]">
 <span className="font-semibold" style={{ color: 'var(--txt-2)' }}>{t('Discount')}</span>
 <span className="font-bold text-rose-500">-{formatCur(invoice.discount)}</span>
 </div>
 <div className="h-px w-full" style={{ background: 'var(--border)' }} />
 <div className="flex justify-between items-end">
 <span className="font-bold tracking-wider uppercase text-[11px]" style={{ color: 'var(--txt-3)' }}>{t('Grand Total')}</span>
 <span className="text-xl font-bold" style={{ color: 'var(--txt-1)' }}>{formatCur(invoice.total)}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Notes Section underneath Main Card */}
 {invoice.notes && (
 <div className="card p-5 space-y-3">
 <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--txt-3)' }}>{t('Notes')}</h3>
 <p className="text-[13px] leading-relaxed italic border-l-2 pl-3 py-0.5" style={{ color: 'var(--txt-2)', borderColor: 'var(--border)' }}>
 "{invoice.notes}"
 </p>
 </div>
 )}

 {/* Recent Payments Section */}
 <div className="card p-5 space-y-4">
 <div className="flex items-center gap-2 mb-2 border-b pb-3" style={{ borderColor: 'var(--border)' }}>
 <History style={{ color: 'var(--txt-accent)' }} size={16} />
 <h2 className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--txt-1)' }}>{t('Payment History')}</h2>
 </div>
 
 <div className="space-y-3">
 {invoice.payments.map((pmt: any) => (
 <div key={pmt.id} className="flex items-center justify-between p-4 rounded-xl border transition-colors hover:shadow-sm" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
 <div className="flex items-center gap-4">
 <div className="p-2.5 rounded-xl border shadow-sm" style={{ background: 'var(--surface-hover)', borderColor: 'var(--border)', color: 'var(--txt-1)' }}>
 <Coins size={18} />
 </div>
 <div>
 <div className="text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>{formatCur(pmt.amount)}</div>
 <div className="text-[11px] font-medium uppercase mt-0.5" style={{ color: 'var(--txt-3)' }}>{pmt.method} · {new Date(pmt.paid_at).toLocaleDateString()}</div>
 </div>
 </div>
 <div className="text-[11px] font-medium italic" style={{ color: 'var(--txt-3)' }}>
 {t('Recorded by')} {pmt.recorder.name}
 </div>
 </div>
 ))}
 {invoice.payments.length === 0 && (
 <div className="text-center py-6 text-[13px] italic font-medium" style={{ color: 'var(--txt-3)' }}>
 {t('No payments recorded yet')}
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Sidebar Stats */}
 <div className="space-y-6">
 <div className="card p-5 space-y-6 lg:sticky lg:top-20">
 <h2 className="text-[12px] font-semibold uppercase tracking-wider border-b pb-3" style={{ color: 'var(--txt-1)', borderColor: 'var(--border)' }}>{t('Collection Status')}</h2>
 
 <div className="space-y-5">
 <div className="space-y-2.5">
 <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--txt-3)' }}>
 <span>{t('Overall Progress')}</span>
 <span>{Math.round(progress)}%</span>
 </div>
 <div className="w-full h-2 rounded-full overflow-hidden border" style={{ background: 'var(--surface-hover)', borderColor: 'var(--border)' }}>
 <div 
 className="h-full transition-all duration-700 ease-out"
 style={{ 
 width: `${progress}%`,
 background: progress === 100 
 ? 'var(--teal)' 
 : 'linear-gradient(90deg, #60ddc6, #6638b4)' 
 }}
 />
 </div>
 </div>

 <div className="grid grid-cols-1 gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
 <div className="p-4 rounded-xl border" style={{ background: 'var(--surface-hover)', borderColor: 'var(--border)' }}>
 <div className="text-[11px] font-semibold uppercase mb-1" style={{ color: 'var(--txt-3)' }}>{t('Total Billed')}</div>
 <div className="text-xl font-bold" style={{ color: 'var(--txt-1)' }}>{formatCur(invoice.total)}</div>
 </div>
 <div className="p-4 rounded-xl border flex justify-between items-center" style={{ background: 'var(--teal-10)', borderColor: 'var(--teal-10)' }}>
 <div>
 <div className="text-[11px] font-semibold uppercase mb-1" style={{ color: 'var(--teal)' }}>{t('Total Paid')}</div>
 <div className="text-xl font-bold" style={{ color: 'var(--teal)' }}>{formatCur(invoice.paid_amount)}</div>
 </div>
 <div className="p-2 rounded-full hidden sm:block" style={{ background: 'var(--surface)' }}>
 <CheckCircle2 size={20} style={{ color: 'var(--teal)' }} />
 </div>
 </div>
 <div className="p-4 rounded-xl border" style={{ background: 'var(--surface-hover)', borderColor: 'var(--border)' }}>
 <div className="text-[11px] font-semibold uppercase mb-1" style={{ color: 'var(--txt-3)' }}>{t('Outstanding')}</div>
 <div className="text-xl font-bold text-rose-500">{formatCur(remaining)}</div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Payment Modal */}
 <Modal show={showPaymentModal} onClose={() => setShowPaymentModal(false)} maxWidth="md">
 <form onSubmit={submitPayment} className="p-6 rounded-2xl space-y-6" style={{ background: 'var(--surface)', color: 'var(--txt-1)' }}>
 <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border)' }}>
 <div className="flex items-center gap-4">
 <div className="p-3 rounded-xl shadow-sm border" style={{ background: 'var(--surface-hover)', borderColor: 'var(--border)', color: 'var(--txt-1)' }}>
 <CreditCard size={20} />
 </div>
 <div>
 <h3 className="text-lg font-bold tracking-tight">{t('Record Payment')}</h3>
 <p className="text-[12px] font-medium uppercase mt-0.5" style={{ color: 'var(--txt-3)' }}>{invoice.invoice_number}</p>
 </div>
 </div>
 <button type="button" onClick={() => setShowPaymentModal(false)} className="opacity-70 flex hover:opacity-100 transition-opacity bg-transparent">
 <X size={20} style={{ color: 'var(--txt-1)' }} />
 </button>
 </div>

 <div className="space-y-5 pt-2">
 <div className="space-y-1.5">
 <label className="text-[11px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Payment Amount')}</label>
 <div className="relative">
 <Coins className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--txt-3)' }} size={16} />
 <input
 type="number"
 value={data.amount}
 onChange={e => setData('amount', parseFloat(e.target.value))}
 className="app-input w-full pl-11 pr-4 py-3.5 font-bold text-lg"
 />
 </div>
 <p className="text-[11px] font-medium uppercase tracking-wider mt-1" style={{ color: 'var(--txt-3)' }}>{t('Outstanding balance')}: {formatCur(remaining)}</p>
 </div>

 <div className="grid grid-cols-2 gap-5">
 <div className="space-y-1.5">
 <label className="text-[11px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Date')}</label>
 <input
 type="date"
 value={data.paid_at}
 onChange={e => setData('paid_at', e.target.value)}
 className="app-input w-full"
 />
 </div>
 <div className="space-y-1.5">
 <label className="text-[11px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Method')}</label>
 <select
 value={data.method}
 onChange={e => setData('method', e.target.value)}
 className="app-input appearance-none w-full"
 >
 <option value="cash">{t('Cash')}</option>
 <option value="card">{t('Credit/Debit')}</option>
 <option value="bank_transfer">{t('Bank Transfer')}</option>
 <option value="insurance">{t('Insurance')}</option>
 <option value="other">{t('Other')}</option>
 </select>
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-[11px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Notes (Internal)')}</label>
 <textarea
 value={data.notes}
 onChange={e => setData('notes', e.target.value)}
 rows={2}
 className="app-input w-full"
 placeholder={t('Transaction reference or specific notes...')}
 />
 </div>
 </div>

 <div className="pt-6">
 <button
 type="submit"
 disabled={processing}
 className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 rounded-xl shadow-md active:scale-[0.98] transition-all disabled:opacity-50 text-[13px]"
 >
 <CheckCircle2 size={16} /> {t('Confirm Payment')}
 </button>
 </div>
 </form>
 </Modal>
 </ClinicLayout>
 );
}
