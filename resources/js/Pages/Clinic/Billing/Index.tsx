import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, 
    FileText, Download, ExternalLink, Calendar,
    TrendingUp, AlertCircle, CheckCircle2, Search,
    Filter, DollarSign, Clock, Building2
} from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

interface Invoice {
    id: number;
    invoice_number: string;
    total: number;
    status: 'sent' | 'paid' | 'overdue' | 'cancelled';
    due_date: string;
    lab: { name: string };
    order?: { id: number };
}

interface Transaction {
    id: number;
    amount: number;
    type: 'credit' | 'debit';
    category: string;
    description: string;
    created_at: string;
    status: string;
    lab?: { name: string };
}

interface Props extends PageProps {
    invoices: Invoice[];
    transactions: Transaction[];
    stats: {
        total_spent: number;
        outstanding: number;
        last_month_growth: number;
    };
}

export default function Index({ auth, invoices, transactions, stats }: Props) {
    const { t } = useTranslation();

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'overdue': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'sent': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <ClinicLayout>
            <Head title={t('Billing & Finances')} />
            
            <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--txt-1)' }}>{t('Financial Center')}</h2>
                    <p className="text-sm font-bold opacity-50 uppercase tracking-widest">{t('Track your cash payments and outstanding invoices')}</p>
                </div>

                {/* Grid Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Account Balance */}
                    <div className="card p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)' }}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-10 blur-[60px] -mr-16 -mt-16" />
                        <div className="relative z-10 flex flex-col gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-200">
                                <DollarSign size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200/60">{t('Account Balance')}</span>
                                <h3 className="text-3xl font-black text-white mt-1">{formatCurrency(2450.00)}</h3>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                                <CheckCircle2 size={14} /> {t('Cash payment system')}
                            </div>
                        </div>
                    </div>

                    {/* Total Spent */}
                    <div className="card p-6 flex flex-col gap-4" style={{ background: 'var(--bg-raised)' }}>
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                            <ArrowUpRight size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--txt-4)' }}>{t('Total Spent')}</span>
                            <h3 className="text-3xl font-black mt-1" style={{ color: 'var(--txt-1)' }}>{formatCurrency(stats.total_spent)}</h3>
                        </div>
                        <div className="text-xs font-bold" style={{ color: 'var(--txt-3)' }}>
                            {t('Across')} {transactions.length} {t('transactions')}
                        </div>
                    </div>

                    {/* Outstanding */}
                    <div className="card p-6 flex flex-col gap-4" style={{ background: 'var(--bg-raised)' }}>
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                            <Clock size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--txt-4)' }}>{t('Outstanding')}</span>
                            <h3 className="text-3xl font-black mt-1" style={{ color: 'var(--txt-1)' }}>{formatCurrency(stats.outstanding)}</h3>
                        </div>
                        <div className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                            <AlertCircle size={14} /> {invoices.filter(i => i.status === 'sent').length} {t('Pending invoices')}
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Invoices List */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--txt-1)' }}>
                                <FileText size={20} className="text-indigo-500" /> {t('Recent Invoices')}
                            </h3>
                            <button className="text-xs font-bold text-indigo-500 hover:underline">{t('View All')}</button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {invoices.length > 0 ? invoices.map((invoice) => (
                                <div key={invoice.id} className="card p-4 flex items-center justify-between group hover:border-indigo-500/50 transition-all" style={{ background: 'var(--bg-raised)' }}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <div className="font-bold flex items-center gap-2" style={{ color: 'var(--txt-1)' }}>
                                                {invoice.invoice_number}
                                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${getStatusStyle(invoice.status)}`}>
                                                    {t(invoice.status)}
                                                </span>
                                            </div>
                                            <div className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--txt-3)' }}>
                                                {invoice.lab.name} • {invoice.due_date}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="font-black text-sm" style={{ color: 'var(--txt-1)' }}>{formatCurrency(invoice.total)}</div>
                                            <div className="text-[10px] font-bold opacity-50 uppercase tracking-tighter" style={{ color: 'var(--txt-2)' }}>{t('Total Amount')}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={route('clinic.billing.invoice.show', invoice.id)} className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 transition-all">
                                                <ExternalLink size={16} />
                                            </Link>
                                            <button className="p-2 rounded-lg bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 transition-all" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-12 text-center opacity-30 grayscale border-2 border-dashed rounded-3xl" style={{ borderColor: 'var(--border)' }}>
                                    <FileText size={48} className="mx-auto mb-4" />
                                    <p className="text-sm font-bold">{t('No invoices available yet')}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* History / Transactions */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--txt-1)' }}>
                            <CreditCard size={20} className="text-indigo-500" /> {t('Cash Record')}
                        </h3>
                        
                        <div className="card divide-y overflow-hidden" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                            {transactions.length > 0 ? transactions.map((tx) => (
                                <div key={tx.id} className="p-4 hover:bg-white/5 transition-all flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                            {tx.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                        </div>
                                        <div>
                                            <div className="text-[13px] font-bold leading-none" style={{ color: 'var(--txt-1)' }}>{tx.description}</div>
                                            <div className="text-[10px] font-medium mt-1 truncate max-w-[120px]" style={{ color: 'var(--txt-3)' }}>
                                                {tx.lab?.name || tx.category}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className={`text-[13px] font-black ${tx.type === 'credit' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </div>
                                        <div className="text-[10px] font-bold opacity-30 uppercase tracking-tighter" style={{ color: 'var(--txt-2)' }}>{new Date(tx.created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-12 text-center opacity-30 grayscale">
                                    <p className="text-xs font-bold">{t('No cash transactions recorded')}</p>
                                </div>
                            )}
                        </div>

                        {/* Cash Payment Info */}
                        <div className="card p-6 border-dashed" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--txt-1)' }}>{t('Payment Instructions')}</h4>
                            <div className="flex items-center gap-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                    <DollarSign size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-bold" style={{ color: 'var(--txt-1)' }}>{t('Manual Cash Payments')}</div>
                                    <div className="text-[10px] opacity-60 font-medium" style={{ color: 'var(--txt-3)' }}>{t('All payments are handled offline via cash. Transactions are recorded manually.')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ClinicLayout>
    );
}
