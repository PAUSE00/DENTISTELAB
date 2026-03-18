import LabLayout from '@/Layouts/LabLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, Save, Calendar, Check, AlertCircle, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import useTranslation from '@/Hooks/useTranslation';
import axios from 'axios';

interface Clinic {
    id: number;
    name: string;
}

interface Order {
    id: number;
    patient: { first_name: string; last_name: string };
    service: { name: string };
    price: number;
    created_at: string;
}

interface Props extends PageProps {
    clinics: Clinic[];
}

const SECTION_TITLE = "text-[16px] font-bold flex items-center gap-3 text-white tracking-wide";
const LABEL = "block text-[10px] uppercase font-bold tracking-widest mb-2 opacity-70";
const INPUT_BASE = "w-full px-4 py-2.5 rounded-lg text-[13px] border border-[#312e81] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-slate-600";

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

const fmtCurrency = (v: number) =>
    new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(v);

export default function Create({ clinics }: Props) {
    const { t } = useTranslation();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        clinic_id: '',
        order_ids: [] as number[],
        due_date: '',
        notes: '',
    });

    useEffect(() => {
        if (data.clinic_id) {
            setLoading(true);
            axios.get(route('lab.invoices.clinic-orders', data.clinic_id))
                .then(res => {
                    setOrders(res.data);
                    setSelectedOrders(res.data.map((o: Order) => o.id));
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setOrders([]);
            setSelectedOrders([]);
        }
    }, [data.clinic_id]);

    useEffect(() => {
        setData('order_ids', selectedOrders);
    }, [selectedOrders]);

    const toggleOrder = (id: number) => {
        if (selectedOrders.includes(id)) {
            setSelectedOrders(selectedOrders.filter(o => o !== id));
        } else {
            setSelectedOrders([...selectedOrders, id]);
        }
    };

    const toggleAll = () => {
        if (selectedOrders.length === orders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(orders.map(o => o.id));
        }
    };

    const totalAmount = orders.filter(o => selectedOrders.includes(o.id)).reduce((acc, o) => acc + Number(o.price), 0);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('lab.invoices.store'));
    };

    return (
        <LabLayout>
            <Head title={t('Generate Invoice')} />

            <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-12">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.history.back()} className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors text-slate-400">
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h2 className="text-[20px] font-semibold tracking-tight text-white">{t('Generate New Invoice')}</h2>
                            <p className="text-[12.5px] mt-0.5 text-slate-400">{t('Select clinic and uninvoiced orders.')}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT PANEL: Form Inputs */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="card p-6 flex flex-col gap-6" style={{ border: '1px solid #312e81', background: 'transparent' }}>
                            <div>
                                <label className={LABEL}>{t('Select Clinic')}</label>
                                <select
                                    className={INPUT_BASE}
                                    style={{ background: 'rgba(15,23,42,0.2)' }}
                                    value={data.clinic_id}
                                    onChange={e => setData('clinic_id', e.target.value)}
                                >
                                    <option value="">{t('Choose clinic...')}</option>
                                    {clinics.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.clinic_id && <p className="text-red-400 text-[11px] mt-2 italic">{errors.clinic_id}</p>}
                            </div>

                            <div>
                                <label className={LABEL}>{t('Due Date')}</label>
                                <input
                                    type="date"
                                    className={INPUT_BASE}
                                    style={{ background: 'rgba(15,23,42,0.2)' }}
                                    value={data.due_date}
                                    onChange={e => setData('due_date', e.target.value)}
                                />
                                {errors.due_date && <p className="text-red-400 text-[11px] mt-2 italic">{errors.due_date}</p>}
                            </div>

                            <div>
                                <label className={LABEL}>{t('Notes')}</label>
                                <textarea
                                    className={`${INPUT_BASE} min-h-[100px] resize-none`}
                                    style={{ background: 'rgba(15,23,42,0.2)' }}
                                    placeholder={t('Optional notes to clinic...')}
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                />
                            </div>

                            <div className="pt-4 border-t border-[#312e81]">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[12px] text-slate-400 font-bold uppercase tracking-wider">{t('Total Amount')}</span>
                                    <span className="text-[20px] font-black" style={{ color: 'var(--txt-accent)' }}>{fmtCurrency(totalAmount)}</span>
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing || selectedOrders.length === 0}
                                    className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    style={{ background: 'var(--txt-accent)', color: '#000' }}
                                >
                                    <Save size={18} />
                                    {t('Generate Invoice')}
                                </button>
                                {errors.order_ids && <p className="text-red-400 text-[11px] mt-2 text-center italic">{errors.order_ids}</p>}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Orders Selection */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[13px] font-bold text-slate-300 uppercase tracking-widest">{t('Select Orders')}</h3>
                            {orders.length > 0 && (
                                <button type="button" onClick={toggleAll} className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300">
                                    {selectedOrders.length === orders.length ? t('Deselect All') : t('Select All')}
                                </button>
                            )}
                        </div>

                        {!data.clinic_id ? (
                            <div className="card p-12 flex flex-col items-center justify-center text-center border-dashed border-[#312e81] bg-transparent opacity-50">
                                <AlertCircle size={40} className="mb-4 text-slate-600" />
                                <p className="text-slate-400 text-[14px]">{t('Please select a clinic to see available orders.')}</p>
                            </div>
                        ) : loading ? (
                            <div className="card p-12 flex items-center justify-center border-[#312e81] bg-transparent">
                                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="card p-12 flex flex-col items-center justify-center text-center border-dashed border-[#312e81] bg-transparent">
                                <Package size={40} className="mb-4 text-slate-600" />
                                <p className="text-slate-400 text-[14px]">{t('No uninvoiced orders found for this clinic.')}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders.map(order => (
                                    <div
                                        key={order.id}
                                        onClick={() => toggleOrder(order.id)}
                                        className="card p-4 flex items-center justify-between cursor-pointer transition-all hover:translate-x-1"
                                        style={{
                                            border: '1px solid #312e81',
                                            background: selectedOrders.includes(order.id) ? 'rgba(99,102,241,0.1)' : 'transparent',
                                            borderColor: selectedOrders.includes(order.id) ? '#60ddc6' : '#312e81'
                                        }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${selectedOrders.includes(order.id) ? 'bg-[#60ddc6] border-[#60ddc6]' : 'border-[#312e81]'}`}
                                            >
                                                {selectedOrders.includes(order.id) && <Check size={14} className="text-black" />}
                                            </div>
                                            <div>
                                                <p className="text-[13.5px] font-bold text-white">
                                                    #{order.id} - {order.patient.first_name} {order.patient.last_name}
                                                </p>
                                                <p className="text-[11.5px] text-slate-500 font-medium">
                                                    {order.service.name} · {fmtDate(order.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[14px] font-black text-white">{fmtCurrency(order.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </LabLayout>
    );
}
