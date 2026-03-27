import LabLayout from '@/Layouts/LabLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import useTranslation from '@/Hooks/useTranslation';
import { ArrowLeft, Send } from 'lucide-react';

export default function Create() {
    const { t } = useTranslation();
    
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        category: 'general',
        priority: 'medium',
        message: ''
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('lab.tickets.store'));
    };

    return (
        <LabLayout header={t('Support Helpdesk')}>
            <Head title={t('Create Ticket')} />

            <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
                
                {/* Header Section */}
                <div className="flex flex-col gap-4 mb-8">
                    <Link
                        href={route('lab.tickets.index')}
                        className="inline-flex items-center gap-2 text-[13px] font-bold transition-colors w-fit"
                        style={{ color: 'var(--txt-3)' }}
                    >
                        <ArrowLeft size={16} />
                        <span className="hover:text-[var(--txt-1)]">{t('Back to Tickets')}</span>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--txt-1)' }}>
                            {t('Open New Ticket')}
                        </h2>
                        <p className="text-[13px] mt-1" style={{ color: 'var(--txt-3)' }}>
                            {t('Please provide as much detail as possible to help us resolve an issue quickly.')}
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="p-6 sm:p-8 rounded-3xl border shadow-lg" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Subject */}
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>{t('Subject')}</label>
                            <input
                                type="text"
                                required
                                value={data.subject}
                                onChange={e => setData('subject', e.target.value)}
                                placeholder={t('Brief description of the issue...')}
                                className="w-full px-5 py-3.5 rounded-xl text-[14px] outline-none transition-all placeholder:opacity-40 focus:ring-2 focus:ring-[var(--accent)]"
                                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--txt-1)' }}
                            />
                            {errors.subject && <span className="text-red-500 text-[12px] font-bold mt-1.5 block">{errors.subject}</span>}
                        </div>

                        {/* Category & Priority */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>{t('Category')}</label>
                                <select
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl text-[14px] outline-none cursor-pointer focus:ring-2 focus:ring-[var(--accent)] appearance-none"
                                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--txt-1)' }}
                                >
                                    <option value="general">{t('General Inquiry')}</option>
                                    <option value="bug">{t('Bug Report')}</option>
                                    <option value="billing">{t('Billing Issue')}</option>
                                    <option value="feature_request">{t('Feature Request')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>{t('Priority')}</label>
                                <select
                                    value={data.priority}
                                    onChange={e => setData('priority', e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-xl text-[14px] outline-none cursor-pointer focus:ring-2 focus:ring-[var(--accent)] appearance-none"
                                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--txt-1)' }}
                                >
                                    <option value="low">{t('Low')}</option>
                                    <option value="medium">{t('Medium')}</option>
                                    <option value="high">{t('High')}</option>
                                    <option value="urgent">{t('Urgent')}</option>
                                </select>
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>{t('MessageDetails')}</label>
                            <textarea
                                required
                                rows={8}
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                                className="w-full px-5 py-4 rounded-xl text-[14px] outline-none transition-all resize-y placeholder:opacity-40 focus:ring-2 focus:ring-[var(--accent)]"
                                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--txt-1)' }}
                                placeholder={t('Tell us all the details about your inquiry or the issue you are facing...')}
                            ></textarea>
                            {errors.message && <span className="text-red-500 text-[12px] font-bold mt-1.5 block">{errors.message}</span>}
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 border-t flex flex-col-reverse sm:flex-row items-center justify-end gap-3" style={{ borderColor: 'var(--border)' }}>
                            <Link
                                href={route('lab.tickets.index')}
                                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-[13px] text-center transition-colors hover:bg-[var(--surface-hover)] border"
                                style={{ color: 'var(--txt-2)', borderColor: 'transparent' }}
                            >
                                {t('Cancel')}
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-[#0d1f1a] font-bold text-[14px] transition-all hover:bg-opacity-90 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                                style={{ background: 'var(--accent)', boxShadow: '0 8px 20px rgba(96,221,198,0.2)' }}
                            >
                                <Send size={16} />
                                {processing ? t('Submitting...') : t('Submit Ticket')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </LabLayout>
    );
}
