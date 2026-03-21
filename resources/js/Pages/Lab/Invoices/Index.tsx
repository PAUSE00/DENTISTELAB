import LabLayout from '@/Layouts/LabLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { FileText, Plus, Search, ExternalLink, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface Invoice {
 id: number;
 invoice_number: string;
 total_amount: number;
 status: 'draft' | 'sent' | 'paid' | 'cancelled';
 due_date: string | null;
 created_at: string;
 clinic: {
 name: string;
 };
}

interface Props extends PageProps {
 invoices: {
 data: Invoice[];
 links: any[];
 };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
 draft: { label: 'Draft', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', dot: '#94a3b8' },
 sent: { label: 'Sent', color: '#60ddc6', bg: 'rgba(96,221,198,0.1)', dot: '#60ddc6' },
 paid: { label: 'Paid', color: '#34d399', bg: 'rgba(52,211,153,0.1)', dot: '#34d399' },
 cancelled: { label: 'Cancelled', color: '#f87171', bg: 'rgba(248,113,113,0.1)', dot: '#f87171' },
};

const fmtDate = (d: string) =>
 new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

const fmtCurrency = (v: number) =>
 new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(v);

export default function Index({ auth, invoices }: Props) {
 const { t } = useTranslation();

 return (
 <LabLayout>
 <Head title={t('Invoices')} />

 <div className="flex flex-col gap-5">
 {/* Header Section */}
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-[20px] font-semibold tracking-tight" style={{ color: 'var(--txt-1)' }}>
 {t('Billing & Invoices')}
 </h2>
 <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--txt-2)' }}>
 {t('Manage clinic billing, track payments and generate statements.')}
 </p>
 </div>
 <Link
 href={route('lab.invoices.create')}
 className="btn-primary text-[12.5px] py-2 px-4 flex items-center gap-2"
 style={{ background: 'var(--txt-accent)', color: '#000' }}
 >
 <Plus size={16} />
 {t('Generate Invoice')}
 </Link>
 </div>

 {/* Table Section */}
 <div className="card overflow-hidden" style={{ border: '1px solid #312e81', background: 'transparent' }}>
 <div className="table-responsive hide-scrollbar">
 <table className="w-full text-left">
 <thead>
 <tr style={{ borderBottom: '1px solid #312e81', background: 'rgba(15,23,42,0.1)' }}>
 <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest">{t('Invoice #')}</th>
 <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest">{t('Clinic')}</th>
 <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest">{t('Amount')}</th>
 <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest">{t('Status')}</th>
 <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest">{t('Due Date')}</th>
 <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-right">{t('Actions')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[#312e81]">
 {invoices.data.length === 0 ? (
 <tr>
 <td colSpan={6} className="px-6 py-12 text-center text-[13px]">
 {t('No invoices generated yet.')}
 </td>
 </tr>
 ) : (
 invoices.data.map((invoice) => {
 const status = STATUS_CONFIG[invoice.status];
 return (
 <tr key={invoice.id} className="hover:bg-[rgba(15,23,42,0.1)] transition-colors group">
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>
 <FileText size={14} />
 </div>
 <span className="text-[13px] font-semibold" style={{ color: 'var(--txt-accent)' }}>
 {invoice.invoice_number}
 </span>
 </div>
 </td>
 <td className="px-6 py-4 text-[13px] font-medium" style={{ color: 'var(--txt-1)' }}>
 {invoice.clinic.name}
 </td>
 <td className="px-6 py-4 text-[13px] font-bold" style={{ color: 'var(--txt-1)' }}>
 {fmtCurrency(invoice.total_amount)}
 </td>
 <td className="px-6 py-4">
 <span className="status-pill" style={{ background: status.bg, color: status.color, fontSize: '10px' }}>
 <span className="dot" style={{ background: status.dot }} />
 {t(status.label)}
 </span>
 </td>
 <td className="px-6 py-4 text-[12.5px]" style={{ color: 'var(--txt-3)' }}>
 {invoice.due_date ? fmtDate(invoice.due_date) : '—'}
 </td>
 <td className="px-6 py-4 text-right">
 <Link
 href={route('lab.invoices.show', invoice.id)}
 className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[var(--surface)] transition-all hover:text-white"
 >
 <ExternalLink size={14} />
 </Link>
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 </LabLayout>
 );
}
