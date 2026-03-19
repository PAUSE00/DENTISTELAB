import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    ArrowLeft, Printer, Download, Mail, 
    CheckCircle2, AlertCircle, Building2, 
    MapPin, Phone, Globe, DollarSign, Package
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface Invoice {
    id: number;
    invoice_number: string;
    amount: number;
    tax: number;
    total: number;
    status: 'sent' | 'paid' | 'overdue' | 'cancelled';
    due_date: string;
    created_at: string;
    lab: { 
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
    };
    order?: {
        id: number;
        patient?: { first_name: string; last_name: string };
        service?: { name: string; price: number };
    };
}

interface Props extends PageProps {
    invoice: Invoice;
}

export default function InvoiceShow({ auth, invoice }: Props) {
    const { t } = useTranslation();

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(val);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-emerald-500 text-white';
            case 'overdue': return 'bg-rose-500 text-white';
            case 'sent': return 'bg-amber-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <ClinicLayout>
            <Head title={`${t('Invoice')} ${invoice.invoice_number}`} />
            
            <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
                
                {/* Actions Header */}
                <div className="flex items-center justify-between no-print">
                    <div className="flex items-center gap-4">
                        <Link href={route('clinic.billing.index')} className="p-2.5 rounded-xl border hover:bg-white/5 transition-all outline-none" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold" style={{ color: 'var(--txt-1)' }}>{t('Invoice')} {invoice.invoice_number}</h2>
                            <p className="text-xs font-bold opacity-50 uppercase tracking-widest">{t('Issued on')} {new Date(invoice.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 rounded-xl border text-sm font-bold transition-all hover:bg-white/5" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)', color: 'var(--txt-2)' }}>
                            <Printer size={16} /> {t('Print')}
                        </button>
                        <button className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30">
                            <Download size={16} /> {t('Download PDF')}
                        </button>
                    </div>
                </div>

                {/* The Invoice Document */}
                <div className="card overflow-hidden shadow-2xl" style={{ background: 'var(--bg-raised)', border: 'none' }}>
                    
                    {/* Status Ribbon */}
                    <div className={`py-2 text-center text-[10px] font-black uppercase tracking-[0.3em] ${getStatusStyle(invoice.status)}`}>
                        {t(invoice.status)}
                    </div>

                    <div className="p-10 lg:p-16 flex flex-col gap-16">
                        
                        {/* Branding & Info */}
                        <div className="flex flex-col md:flex-row justify-between gap-10">
                            <div className="flex flex-col gap-6 max-w-sm">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black">
                                    {invoice.lab.name[0]}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight" style={{ color: 'var(--txt-1)' }}>{invoice.lab.name}</h3>
                                    <div className="mt-2 space-y-1 text-sm font-medium" style={{ color: 'var(--txt-3)' }}>
                                        <p className="flex items-center gap-2"><MapPin size={14} className="opacity-50" /> {invoice.lab.address}, {invoice.lab.city}</p>
                                        <p className="flex items-center gap-2"><Phone size={14} className="opacity-50" /> {invoice.lab.phone}</p>
                                        <p className="flex items-center gap-2"><Mail size={14} className="opacity-50" /> {invoice.lab.email}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-right flex flex-col gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: 'var(--txt-2)' }}>{t('Bill To')}</span>
                                    <h4 className="text-xl font-bold" style={{ color: 'var(--txt-1)' }}>{auth.user.clinic?.name}</h4>
                                    <p className="text-sm font-medium opacity-60" style={{ color: 'var(--txt-2)' }}>{auth.user.clinic?.city || 'Partner Clinic'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                                    <div className="flex flex-col gap-1 items-end">
                                        <span className="text-[9px] font-black uppercase opacity-40">{t('Invoice No.')}</span>
                                        <span className="font-bold" style={{ color: 'var(--txt-1)' }}>{invoice.invoice_number}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 items-end">
                                        <span className="text-[9px] font-black uppercase opacity-40">{t('Due Date')}</span>
                                        <span className="font-bold" style={{ color: 'var(--txt-1)' }}>{new Date(invoice.due_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Details Table */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: 'var(--txt-1)' }}>
                                <Package size={16} className="text-indigo-500" /> {t('Billed Items')}
                            </h4>
                            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                                <table className="w-full text-left">
                                    <thead style={{ background: 'var(--surface)' }}>
                                        <tr className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>
                                            <th className="px-6 py-4">{t('Description')}</th>
                                            <th className="px-6 py-4 text-center">{t('Quantity')}</th>
                                            <th className="px-6 py-4 text-right">{t('Unit Price')}</th>
                                            <th className="px-6 py-4 text-right">{t('Total')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                                        <tr style={{ color: 'var(--txt-1)' }}>
                                            <td className="px-6 py-8">
                                                <div className="font-bold">{invoice.order?.service?.name || t('Lab Services')}</div>
                                                <div className="text-xs font-medium mt-1 opacity-50">
                                                    {invoice.order ? (
                                                        <>{t('Patient')}: {invoice.order.patient?.first_name} {invoice.order.patient?.last_name} • {t('Order ID')}: #{invoice.order.id}</>
                                                    ) : (
                                                        <>{t('General Invoice')} • {invoice.invoice_number}</>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-8 text-center font-bold">1</td>
                                            <td className="px-6 py-8 text-right font-black">{formatCurrency(invoice.order?.service?.price || invoice.amount)}</td>
                                            <td className="px-6 py-8 text-right font-black">{formatCurrency(invoice.order?.service?.price || invoice.amount)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Summary Totals */}
                        <div className="flex flex-col md:flex-row justify-between gap-10 items-start">
                            <div className="max-w-xs flex flex-col gap-4 p-6 rounded-2xl" style={{ background: 'var(--surface)' }}>
                                <div className="flex items-center gap-3 text-emerald-500">
                                    <CheckCircle2 size={18} />
                                    <h5 className="text-[12px] font-black uppercase tracking-widest">{t('Payment Instructions')}</h5>
                                </div>
                                <p className="text-[11px] leading-relaxed opacity-60" style={{ color: 'var(--txt-3)' }}>
                                    {invoice.status === 'paid' 
                                        ? t('This invoice has been settled in cash. Thank you for your partnership.')
                                        : t('Please settle this invoice in cash with the laboratory representative. All payments are recorded manually in the system.')}
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 min-w-[240px]">
                                <div className="flex justify-between items-center text-sm font-bold" style={{ color: 'var(--txt-3)' }}>
                                    <span>{t('Subtotal')}</span>
                                    <span style={{ color: 'var(--txt-1)' }}>{formatCurrency(invoice.amount)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold" style={{ color: 'var(--txt-3)' }}>
                                    <span>{t('Tax')} (0%)</span>
                                    <span style={{ color: 'var(--txt-1)' }}>$0.00</span>
                                </div>
                                <div className="h-px w-full my-2" style={{ background: 'var(--border)' }} />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--txt-1)' }}>{t('Grand Total')}</span>
                                    <span className="text-3xl font-black" style={{ color: '#60ddc6' }}>{formatCurrency(invoice.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Notes */}
                        <div className="pt-10 border-t flex flex-col md:flex-row justify-between text-[10px] font-bold uppercase tracking-widest opacity-40 text-center md:text-left gap-4" style={{ borderColor: 'var(--border)' }}>
                            <p>© {new Date().getFullYear()} DENTALELAB NETWORK • {t('SECURE ELECTRONIC INVOICE')}</p>
                            <p>{t('Thank you for your business!')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </ClinicLayout>
    );
}
