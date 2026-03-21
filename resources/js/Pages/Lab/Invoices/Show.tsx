import LabLayout from '@/Layouts/LabLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, Printer, Download, CheckCircle, CreditCard, Clock, XCircle, FileText, Calendar, Landmark } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface Order {
 id: number;
 patient: { first_name: string; last_name: string };
 service: { name: string };
 price: number;
 created_at: string;
}

interface Invoice {
 id: number;
 invoice_number: string;
 total_amount: number;
 status: 'draft' | 'sent' | 'paid' | 'cancelled';
 due_date: string | null;
 created_at: string;
 notes: string | null;
 clinic: {
 name: string;
 address: string;
 phone: string;
 };
 orders: Order[];
}

interface Props extends PageProps {
 invoice: Invoice;
}

const fmtDate = (d: string) =>
 new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

const fmtCurrency = (v: number) =>
 new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(v);

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string; icon: any }> = {
 draft: { label: 'Draft', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', dot: '#94a3b8', icon: Clock },
 sent: { label: 'Sent', color: '#60ddc6', bg: 'rgba(96,221,198,0.1)', dot: '#60ddc6', icon: FileText },
 paid: { label: 'Paid', color: '#34d399', bg: 'rgba(52,211,153,0.1)', dot: '#34d399', icon: CheckCircle },
 cancelled: { label: 'Cancelled', color: '#f87171', bg: 'rgba(248,113,113,0.1)', dot: '#f87171', icon: XCircle },
};

export default function Show({ auth, invoice }: Props) {
 const { t } = useTranslation();
 const status = STATUS_CONFIG[invoice.status];

 const updateStatus = (newStatus: string) => {
 if (confirm(t('Are you sure you want to change status?'))) {
 router.patch(route('lab.invoices.update-status', invoice.id), { status: newStatus });
 }
 };

 const handlePrint = () => {
 window.print();
 };

 return (
 <LabLayout>
 <Head title={`${t('Invoice')} ${invoice.invoice_number}`} />

 <link rel="stylesheet" href="/css/print.css" media="print" />
 <style dangerouslySetInnerHTML={{ __html: `
 @media print {
 .no-print { display: none !important; }
 .print-only { display: block !important; }
 body { background: white !important; color: black !important; }
 .invoice-card { border: none !important; background: white !important; padding: 0 !important; margin: 0 !important; color: black !important; width: 100% !important; }
 .text-white { color: black !important; }
 . { color: #666 !important; }
 .border-[#312e81] { border-color: #eee !important; }
 .bg-\\[rgba\\(15\\,23\\,42\\,0\\.1\\)\\] { background: #f9f9f9 !important; }
 }
 ` }} />

 <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-12">
 {/* Actions Header (No Print) */}
 <div className="flex items-center justify-between no-print">
 <div className="flex items-center gap-4">
 <Link href={route('lab.invoices.index')} className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors ">
 <ArrowLeft size={18} />
 </Link>
 <div>
 <h2 className="text-[20px] font-semibold tracking-tight text-white">{invoice.invoice_number}</h2>
 <p className="text-[12.5px] mt-0.5 ">{t('Details and status management.')}</p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <button onClick={handlePrint} className="btn-ghost px-4 py-2 text-[12.5px] border border-[#312e81] rounded-lg flex items-center gap-2">
 <Printer size={16} />
 {t('Print')}
 </button>
 {invoice.status !== 'paid' && (
 <button
 onClick={() => updateStatus('paid')}
 className="btn-primary px-4 py-2 text-[12.5px] rounded-lg flex items-center gap-2"
 style={{ background: '#34d399', color: '#000' }}
 >
 <CheckCircle size={16} />
 {t('Mark as Paid')}
 </button>
 )}
 </div>
 </div>

 {/* INVOICE CARD */}
 <div className="card invoice-card overflow-hidden flex flex-col" style={{ border: '1px solid #312e81', background: 'transparent' }}>
 {/* Invoice Body Header */}
 <div className="p-8 border-b border-[#312e81] flex justify-between items-start">
 <div className="space-y-4">
 <div className="flex items-center gap-2">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--txt-accent)', color: '#000' }}>
 <FileText size={20} />
 </div>
 <h1 className="text-2xl font-black uppercase tracking-tight text-white">INVOICE</h1>
 </div>
 <div className="space-y-1">
 <p className="text-sm font-bold text-white">{auth.user.lab?.name || 'ProDent Lab'}</p>
 <p className="text-[12px] ">Laboratory Portal</p>
 </div>
 </div>

 <div className="text-right flex flex-col items-end gap-3">
 <span className="status-pill px-4 py-1.5" style={{ background: status.bg, color: status.color, fontSize: '11px', fontWeight: 'bold' }}>
 <status.icon size={13} className="mr-2" />
 {t(status.label)}
 </span>
 <div className="space-y-1 mt-2">
 <p className="text-[11px] font-black uppercase tracking-widest ">{t('Invoice Number')}</p>
 <p className="text-[16px] font-bold text-white">{invoice.invoice_number}</p>
 </div>
 </div>
 </div>

 <div className="p-8 grid grid-cols-2 gap-8">
 <div>
 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-3">{t('Invoice To')}</p>
 <h3 className="text-[18px] font-bold text-white mb-1">{invoice.clinic.name}</h3>
 <div className="text-[13px] space-y-1">
 <p>{invoice.clinic.address || '—'}</p>
 <p>{invoice.clinic.phone || '—'}</p>
 </div>
 </div>
 <div className="flex justify-end gap-12 text-right">
 <div className="space-y-4 text-right">
 <div>
 <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">{t('Date Issued')}</p>
 <p className="text-[13.5px] font-semibold text-white">{fmtDate(invoice.created_at)}</p>
 </div>
 <div>
 <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">{t('Due Date')}</p>
 <p className="text-[13.5px] font-semibold text-white">{invoice.due_date ? fmtDate(invoice.due_date) : '—'}</p>
 </div>
 </div>
 </div>
 </div>

 {/* ITEMS TABLE */}
 <div className="flex-1 px-8 pb-8">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-[#312e81]">
 <th className="py-4 text-[11px] font-black uppercase tracking-widest ">{t('Order Details')}</th>
 <th className="py-4 text-[11px] font-black uppercase tracking-widest ">{t('Service')}</th>
 <th className="py-4 text-[11px] font-black uppercase tracking-widest text-right">{t('Amount')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[#312e81]/50">
 {invoice.orders.map((order) => (
 <tr key={order.id}>
 <td className="py-4">
 <p className="text-[13px] font-bold text-white">#{order.id} - {order.patient.first_name} {order.patient.last_name}</p>
 <p className="text-[11px] mt-0.5">{fmtDate(order.created_at)}</p>
 </td>
 <td className="py-4 text-[13px] ">
 {order.service.name}
 </td>
 <td className="py-4 text-[14px] font-bold text-white text-right">
 {fmtCurrency(order.price)}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* FOOTER TOTALS */}
 <div className="bg-[rgba(15,23,42,0.1)] p-8 flex justify-between items-start border-t border-[#312e81]">
 <div className="max-w-xs">
 <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">{t('Notes')}</p>
 <p className="text-[12px] italic">
 {invoice.notes || t('Thank you for your business!')}
 </p>
 </div>
 <div className="text-right space-y-3">
 <div className="flex justify-end gap-12 items-center">
 <span className="text-[12px] font-bold uppercase tracking-widest">{t('Subtotal')}</span>
 <span className="text-[14px] font-bold text-white">{fmtCurrency(invoice.total_amount)}</span>
 </div>
 <div className="flex justify-end gap-12 items-center pt-3 border-t border-[#312e81]">
 <span className="text-[14px] font-black text-indigo-400 uppercase tracking-[0.2em]">{t('Total Amount')}</span>
 <span className="text-[24px] font-black" style={{ color: 'var(--txt-accent)' }}>{fmtCurrency(invoice.total_amount)}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Extra Actions */}
 <div className="no-print flex justify-end gap-3 mt-4">
 {invoice.status === 'sent' && (
 <button
 onClick={() => updateStatus('cancelled')}
 className="btn-ghost px-4 py-2 text-[12.5px] border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2"
 >
 <XCircle size={16} />
 {t('Cancel Invoice')}
 </button>
 )}
 </div>
 </div>
 </LabLayout>
 );
}
