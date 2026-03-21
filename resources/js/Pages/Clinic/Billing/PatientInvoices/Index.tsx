import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ClinicLayout from '@/Layouts/ClinicLayout';
import { 
 Search, Plus, MoreVertical, Eye, Trash2, 
 FileText, CheckCircle2, AlertCircle, Clock, 
 DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp,
 CreditCard
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface Summary {
 total_billed: number;
 total_paid: number;
 outstanding: number;
}

interface Props {
 invoices: {
 data: any[];
 links: any[];
 };
 filters: any;
 summary: Summary;
}

export default function PatientInvoicesIndex({ invoices, filters, summary }: Props) {
 const { t } = useTranslation();
 const [search, setSearch] = useState(filters.search || '');
 const [status, setStatus] = useState(filters.status || '');

 const handleSearch = (e: React.FormEvent) => {
 e.preventDefault();
 router.get(route('clinic.patient-invoices.index'), { search, status }, { preserveState: true });
 };

 const handleStatusFilter = (newStatus: string) => {
 setStatus(newStatus);
 router.get(route('clinic.patient-invoices.index'), { search, status: newStatus }, { preserveState: true });
 };

 const getStatusStyle = (s: string) => {
 switch (s) {
 case 'paid': return { bg: 'var(--teal-10)', color: 'var(--teal)', icon: CheckCircle2 };
 case 'partial': return { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', icon: Clock };
 default: return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', icon: AlertCircle };
 }
 };

 const formatCurrency = (amt: number) => {
 return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(amt);
 };

 return (
 <ClinicLayout>
 <Head title={t('Patient Billing')} />

 <div className="space-y-6">
 {/* Header Section */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
 <div>
 <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--txt-1)' }}>{t('Patient Billing')}</h1>
 <p className="text-[13px] mt-1" style={{ color: 'var(--txt-3)' }}>{t('Manage patient invoices and revenue tracking')}</p>
 </div>
 <Link
 href={route('clinic.patient-invoices.create')}
 className="btn-primary"
 >
 <Plus size={16} /> {t('New Patient Invoice')}
 </Link>
 </div>

 {/* Special Summary Dashboard */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {/* Revenue Card (Special Gradient) */}
 <div className="relative overflow-hidden rounded-2xl p-6 shadow-md transition-transform hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, var(--teal), #6638b4)' }}>
 <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
 <div className="relative z-10 flex items-center justify-between">
 <div className="p-3 bg-white/20 rounded-xl text-white backdrop-blur-md">
 <TrendingUp size={22} />
 </div>
 <span className="text-white/80 text-[11px] font-bold uppercase tracking-wider">{t('Gross Revenue')}</span>
 </div>
 <div className="relative z-10 mt-5">
 <div className="text-3xl font-black text-white">{formatCurrency(summary.total_billed)}</div>
 <div className="mt-1 flex items-center gap-1.5 text-white/90 text-[12px] font-semibold">
 {t('Total amount billed to patients')}
 </div>
 </div>
 </div>

 {/* Collected Funds Card */}
 <div className="card p-6 relative overflow-hidden group">
 <div className="flex items-center justify-between mb-4">
 <div className="p-3 rounded-xl transition-colors" style={{ background: 'var(--surface-hover)', color: 'var(--txt-1)' }}>
 <CheckCircle2 size={22} className="text-blue-500" />
 </div>
 <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--txt-3)' }}>{t('Received Funds')}</span>
 </div>
 <div>
 <div className="text-3xl font-black" style={{ color: 'var(--txt-1)' }}>{formatCurrency(summary.total_paid)}</div>
 <div className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-blue-500">
 {t('Successfully collected')}
 </div>
 </div>
 </div>

 {/* Outstanding Card */}
 <div className="card p-6 relative overflow-hidden group">
 <div className="flex items-center justify-between mb-4">
 <div className="p-3 rounded-xl transition-colors" style={{ background: 'var(--surface-hover)', color: 'var(--txt-1)' }}>
 <AlertCircle size={22} className="text-rose-500" />
 </div>
 <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--txt-3)' }}>{t('Pending Collection')}</span>
 </div>
 <div>
 <div className="text-3xl font-black" style={{ color: 'var(--txt-1)' }}>{formatCurrency(summary.outstanding)}</div>
 <div className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-rose-500">
 {t('Outstanding balance')}
 </div>
 </div>
 </div>
 </div>

 {/* Filters & Table */}
 <div className="card overflow-hidden">
 <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center justify-between" style={{ borderColor: 'var(--border)' }}>
 <form onSubmit={handleSearch} className="relative w-full md:w-80">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--txt-3)' }} size={16} />
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder={t('Search invoices or patients...')}
 className="app-input pl-9"
 />
 </form>
 <div className="flex items-center gap-2 w-full md:w-auto">
 <select
 value={status}
 onChange={(e) => handleStatusFilter(e.target.value)}
 className="app-input appearance-none w-full md:w-40 text-sm cursor-pointer"
 >
 <option value="">{t('All Statuses')}</option>
 <option value="unpaid">{t('Unpaid')}</option>
 <option value="partial">{t('Partial')}</option>
 <option value="paid">{t('Paid')}</option>
 </select>
 </div>
 </div>

 <div className="table-responsive hide-scrollbar">
 <table className="w-full text-left whitespace-nowrap">
 <thead>
 <tr className="text-[11px] uppercase tracking-wider font-semibold border-b" style={{ color: 'var(--txt-3)', borderColor: 'var(--border)', backgroundColor: 'var(--surface-hover)' }}>
 <th className="px-5 py-3.5 rounded-tl-xl">{t('Invoice #')}</th>
 <th className="px-5 py-3.5">{t('Patient')}</th>
 <th className="px-5 py-3.5">{t('Amount')}</th>
 <th className="px-5 py-3.5">{t('Paid')}</th>
 <th className="px-5 py-3.5">{t('Due Date')}</th>
 <th className="px-5 py-3.5">{t('Status')}</th>
 <th className="px-5 py-3.5 text-right rounded-tr-xl">{t('Actions')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[color:var(--border)]">
 {invoices.data.map((invoice) => {
 const st = getStatusStyle(invoice.payment_status);
 const StatusIcon = st.icon;
 return (
 <tr key={invoice.id} className="transition-colors hover:bg-black/5 light:hover:bg-white/5 group">
 <td className="px-5 py-4">
 <div className="flex items-center gap-3">
 <div className="p-2 rounded-lg" style={{ background: 'var(--surface-hover)', color: 'var(--txt-2)' }}>
 <FileText size={16} />
 </div>
 <span className="font-semibold text-[13px]" style={{ color: 'var(--txt-1)' }}>{invoice.invoice_number}</span>
 </div>
 </td>
 <td className="px-5 py-4">
 <Link href={route('clinic.patients.show', invoice.patient.id)} className="text-[13px] font-semibold hover:underline" style={{ color: 'var(--txt-1)' }}>
 {invoice.patient.first_name} {invoice.patient.last_name}
 </Link>
 </td>
 <td className="px-5 py-4 font-semibold text-[13px]" style={{ color: 'var(--txt-1)' }}>
 {formatCurrency(invoice.total)}
 </td>
 <td className="px-5 py-4">
 <div className="text-[13px] font-semibold" style={{ color: 'var(--txt-2)' }}>
 {formatCurrency(invoice.paid_amount)}
 </div>
 {invoice.payment_status === 'partial' && (
 <div className="w-20 h-1 rounded-full mt-1.5 overflow-hidden" style={{ background: 'var(--surface-hover)' }}>
 <div 
 className="h-full bg-blue-500 rounded-full" 
 style={{ width: `${(invoice.paid_amount/invoice.total)*100}%` }} 
 />
 </div>
 )}
 </td>
 <td className="px-5 py-4 text-[13px]" style={{ color: 'var(--txt-3)' }}>
 {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}
 </td>
 <td className="px-5 py-4">
 <div 
 className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
 style={{ backgroundColor: st.bg, color: st.color }}
 >
 <StatusIcon size={12} />
 {t(invoice.payment_status)}
 </div>
 </td>
 <td className="px-5 py-4 text-right">
 <Link
 href={route('clinic.patient-invoices.show', invoice.id)}
 className="p-2 rounded-lg inline-block transition-colors"
 style={{ color: 'var(--txt-2)' }}
 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
 >
 <Eye size={18} />
 </Link>
 </td>
 </tr>
 );
 })}
 {invoices.data.length === 0 && (
 <tr>
 <td colSpan={7} className="px-5 py-12 text-center text-[13px] italic" style={{ color: 'var(--txt-3)' }}>
 {t('No invoices found')}
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 </ClinicLayout>
 );
}
