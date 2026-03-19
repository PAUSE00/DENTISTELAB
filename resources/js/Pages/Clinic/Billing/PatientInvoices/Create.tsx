import { useState, useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import ClinicLayout from '@/Layouts/ClinicLayout';
import { 
    Plus, Trash2, Save, X, Coins, Calculator, 
    User, Calendar, FileText, ChevronLeft, ArrowRight, ChevronsUpDown
} from 'lucide-react';
import { Combobox } from '@headlessui/react';
import useTranslation from '@/Hooks/useTranslation';

interface Props {
    patients: { id: number; first_name: string; last_name: string }[];
    preselectedPatientId?: number;
}

export default function CreatePatientInvoice({ patients, preselectedPatientId }: Props) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPatients =
        searchQuery === ''
            ? patients
            : patients.filter((patient) => {
                  return `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
              });

    const { data, setData, post, processing, errors } = useForm({
        patient_id: preselectedPatientId || '',
        appointment_id: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        discount: 0,
        notes: '',
        items: [{ description: '', quantity: 1, unit_price: 0 }]
    });

    const subtotal = useMemo(() => {
        return data.items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
    }, [data.items]);

    const total = Math.max(0, subtotal - data.discount);

    const addItem = () => {
        setData('items', [...data.items, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (idx: number) => {
        if (data.items.length === 1) return;
        setData('items', data.items.filter((_, i) => i !== idx));
    };

    const updateItem = (idx: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[idx] = { ...newItems[idx], [field]: value };
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('clinic.patient-invoices.store'));
    };

    const formatCur = (num: number) => 
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(num);

    return (
        <ClinicLayout>
            <Head title={t('Create Patient Invoice')} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href={route('clinic.patient-invoices.index')}
                        className="p-2 rounded-xl transition-colors shrink-0"
                        style={{ background: 'var(--surface-hover)', color: 'var(--txt-2)' }}
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold transition-colors" style={{ color: 'var(--txt-1)' }}>{t('New Invoice')}</h1>
                        <p className="text-[13px] mt-1" style={{ color: 'var(--txt-3)' }}>{t('Create a professional bill for a patient treatment')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Details Card */}
                        <div className="card p-5 space-y-5">
                            <div className="flex items-center gap-2 mb-2 border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                                <FileText style={{ color: 'var(--txt-accent)' }} size={16} />
                                <h2 className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--txt-1)' }}>{t('Invoice Details')}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[11px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Select Patient')}</label>
                                    <Combobox value={data.patient_id as any} onChange={(val: any) => setData('patient_id', val || '')}>
                                        <div className="relative">
                                            <div className="relative w-full cursor-default overflow-hidden">
                                                <Combobox.Input
                                                    className="app-input w-full pr-10 bg-transparent"
                                                    displayValue={(patientId: any) => {
                                                        const p = patients.find((p) => String(p.id) === String(patientId));
                                                        return p ? `${p.first_name} ${p.last_name}` : '';
                                                    }}
                                                    onChange={(event) => setSearchQuery(event.target.value)}
                                                    placeholder={t('Search for a patient...')}
                                                    autoComplete="off"
                                                />
                                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <ChevronsUpDown
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                        style={{ color: 'var(--txt-3)' }}
                                                    />
                                                </Combobox.Button>
                                            </div>
                                            <Combobox.Options 
                                                className="absolute mt-2 max-h-60 w-full overflow-auto rounded-xl py-1 text-sm shadow-xl focus:outline-none z-50 backdrop-blur-xl border transition-all"
                                                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                                {filteredPatients.length === 0 && searchQuery !== '' ? (
                                                    <div className="relative cursor-default select-none py-3 px-4" style={{ color: 'var(--txt-3)' }}>
                                                        {t('Nothing found.')}
                                                    </div>
                                                ) : (
                                                    filteredPatients.map((patient) => (
                                                        <Combobox.Option
                                                            key={patient.id}
                                                            className={({ active }) =>
                                                                `relative cursor-default select-none py-2.5 pl-4 pr-4 transition-colors ${
                                                                    active ? 'bg-emerald-500/10' : ''
                                                                }`
                                                            }
                                                            style={{ color: 'var(--txt-1)' }}
                                                            value={patient.id}
                                                        >
                                                            {({ selected, active }) => (
                                                                <span className={`block truncate ${selected ? 'font-black' : 'font-medium'} ${active ? 'text-emerald-500' : ''}`}>
                                                                    {patient.first_name} {patient.last_name}
                                                                </span>
                                                            )}
                                                        </Combobox.Option>
                                                    ))
                                                )}
                                            </Combobox.Options>
                                        </div>
                                    </Combobox>
                                    {errors.patient_id && <p className="text-rose-500 text-[11px] font-medium mt-1">{errors.patient_id}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Issue Date')}</label>
                                    <input
                                        type="date"
                                        value={data.issue_date}
                                        onChange={(e) => setData('issue_date', e.target.value)}
                                        className="app-input w-[100%] block"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Line Items Card */}
                        <div className="card p-5 space-y-5">
                            <div className="flex items-center justify-between mb-2 border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                                <div className="flex items-center gap-2">
                                    <Calculator style={{ color: 'var(--txt-accent)' }} size={16} />
                                    <h2 className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--txt-1)' }}>{t('Treatment Items')}</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="btn-primary py-1.5 px-3 rounded-lg text-xs"
                                >
                                    <Plus size={14} /> {t('Add Item')}
                                </button>
                            </div>

                            <div className="space-y-3">
                                {data.items.map((item, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border group relative transition-colors"
                                        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                                        <div className="flex-1 space-y-1.5">
                                            <label className="text-[10px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Description')}</label>
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => updateItem(idx, 'description', e.target.value)}
                                                placeholder={t('Example: Zirconia Crown, Dental Scaling...')}
                                                className="app-input"
                                            />
                                        </div>
                                        <div className="w-full md:w-24 space-y-1.5">
                                            <label className="text-[10px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Qty')}</label>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value))}
                                                className="app-input text-center"
                                            />
                                        </div>
                                        <div className="w-full md:w-32 space-y-1.5">
                                            <label className="text-[10px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Unit Price')}</label>
                                            <div className="relative">
                                                <Coins className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--txt-3)' }} size={14} />
                                                <input
                                                    type="number"
                                                    value={item.unit_price}
                                                    onChange={(e) => updateItem(idx, 'unit_price', parseFloat(e.target.value))}
                                                    className="app-input pl-9"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full md:w-32 space-y-1.5">
                                            <label className="text-[10px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-3)' }}>{t('Total')}</label>
                                            <div className="flex items-center justify-between h-[40px] px-2 rounded-xl" style={{ background: 'var(--surface-hover)' }}>
                                                <span className="text-sm font-bold" style={{ color: 'var(--txt-1)' }}>
                                                    {formatCur(item.quantity * item.unit_price)}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(idx)}
                                                    className="p-1.5 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/10 rounded-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes Card */}
                        <div className="card p-5 space-y-4">
                            <label className="text-[12px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--txt-1)' }}>{t('Internal Notes / Terms')}</label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={2}
                                placeholder={t('Notes visible on invoice...')}
                                className="app-input text-[13px] leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* Right Column - Summary & Submit */}
                    <div className="space-y-6">
                        <div className="card p-5 lg:sticky lg:top-20 space-y-6">
                            <h2 className="text-[12px] font-semibold uppercase tracking-wider border-b pb-3" style={{ color: 'var(--txt-1)', borderColor: 'var(--border)' }}>{t('Total Summary')}</h2>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[13px] font-semibold">
                                    <span style={{ color: 'var(--txt-3)' }}>{t('Subtotal')}</span>
                                    <span style={{ color: 'var(--txt-1)' }}>{formatCur(subtotal)}</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[13px] font-semibold">
                                        <span style={{ color: 'var(--txt-3)' }}>{t('Discount')}</span>
                                        <span className="text-rose-500">-{formatCur(data.discount)}</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={data.discount}
                                        onChange={(e) => setData('discount', parseFloat(e.target.value) || 0)}
                                        className="app-input text-[12px]"
                                        placeholder={t('Extra discount...')}
                                    />
                                </div>

                                <div className="h-px w-full" style={{ background: 'var(--border)' }} />

                                <div className="flex justify-between items-end">
                                    <span className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--txt-3)' }}>{t('Total Amount')}</span>
                                    <span className="text-2xl font-black" style={{ color: 'var(--txt-1)' }}>{formatCur(total)}</span>
                                </div>

                                <div className="pt-4 flex flex-col gap-2.5 border-t" style={{ borderColor: 'var(--border)' }}>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
                                        style={{ background: 'linear-gradient(135deg, #60ddc6, #6638b4)' }}
                                    >
                                        <Save size={16} /> {t('Create Invoice')}
                                    </button>
                                    <Link
                                        href={route('clinic.patient-invoices.index')}
                                        className="btn-ghost w-full justify-center py-3"
                                    >
                                        {t('Cancel')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </ClinicLayout>
    );
}
