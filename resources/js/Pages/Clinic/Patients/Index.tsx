import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps, Patient } from '@/types';
import { useState, FormEvent } from 'react';
import { Search, UserPlus, Phone, Calendar, Eye, Edit, Users, X } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import Pagination from '@/Components/Pagination';

interface Props extends PageProps {
    patients: { data: Patient[]; links: any[] };
    filters: { search?: string };
}

export default function Index({ auth, patients, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(route('clinic.patients.index'), { search }, { preserveState: true });
    };

    const getInitials = (first: string, last: string) =>
        `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();

    return (
        <ClinicLayout>
            <Head title={t('Patients')} />
            <div className="flex flex-col gap-5 pb-10">

                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(129,140,248,0.1)', color: '#818cf8' }}>
                            <Users size={18} />
                        </div>
                        <div>
                            <h1 className="text-[17px] font-bold tracking-tight" style={{ color: 'var(--txt-1)' }}>
                                {t('Patient Registry')}
                            </h1>
                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--txt-3)' }}>
                                {t('Manage patient records, history and contact information.')}
                            </p>
                        </div>
                    </div>
                    <Link href={route('clinic.patients.create')} className="btn-primary">
                        <UserPlus size={13} /> {t('New Patient')}
                    </Link>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch}>
                    <div className="flex items-center gap-2 px-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)' }}>
                        <Search size={14} style={{ color: 'var(--txt-3)' }} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={t('Search by name, phone or ID...')}
                            className="flex-1 bg-transparent py-2.5 text-[13px] outline-none"
                            style={{ color: 'var(--txt-1)' }}
                        />
                        {search && (
                            <button type="button" onClick={() => { setSearch(''); router.get(route('clinic.patients.index')); }}
                                style={{ color: 'var(--txt-3)' }}>
                                <X size={13} />
                            </button>
                        )}
                    </div>
                </form>

                {/* Table */}
                <div className="card overflow-hidden" style={{ background: 'var(--bg-raised)' }}>
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>{t('Patient')}</th>
                                    <th className="hidden md:table-cell">{t('Date of Birth')}</th>
                                    <th>{t('Contact')}</th>
                                    <th className="text-right w-24">{t('Actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.data.length > 0 ? (
                                    patients.data.map(patient => (
                                        <tr key={patient.id}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                                                        style={{ background: 'linear-gradient(135deg, #818cf8, #6638b4)' }}>
                                                        {getInitials(patient.first_name, patient.last_name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-[13px]" style={{ color: 'var(--txt-1)' }}>
                                                            {patient.first_name} {patient.last_name}
                                                        </p>
                                                        <p className="text-[10.5px]" style={{ color: 'var(--txt-3)' }}>
                                                            #{patient.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell">
                                                <div className="flex items-center gap-1.5" style={{ color: 'var(--txt-2)' }}>
                                                    <Calendar size={12} style={{ color: 'var(--txt-3)' }} />
                                                    <span className="text-[12px]">{patient.dob ?? '—'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1.5" style={{ color: 'var(--txt-2)' }}>
                                                    <Phone size={12} style={{ color: '#34d399' }} />
                                                    <span className="text-[12px]">{patient.phone ?? '—'}</span>
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={route('clinic.patients.show', patient.id)}
                                                        className="w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all"
                                                        style={{ color: 'var(--txt-3)' }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(129,140,248,0.1)'; e.currentTarget.style.color = '#818cf8'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--txt-3)'; }}
                                                        title={t('View Details')}>
                                                        <Eye size={13} />
                                                    </Link>
                                                    <Link href={route('clinic.patients.edit', patient.id)}
                                                        className="w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all"
                                                        style={{ color: 'var(--txt-3)' }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(96,221,198,0.1)'; e.currentTarget.style.color = '#60ddc6'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--txt-3)'; }}
                                                        title={t('Edit Patient')}>
                                                        <Edit size={13} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-16">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                                    style={{ background: 'var(--surface)' }}>
                                                    <Users size={24} style={{ color: 'var(--txt-3)' }} />
                                                </div>
                                                <p className="font-semibold text-[13px]" style={{ color: 'var(--txt-1)' }}>{t('No Patients Found')}</p>
                                                <p className="text-[11.5px]" style={{ color: 'var(--txt-3)' }}>{t('Adjust your search or add a new patient.')}</p>
                                                <Link href={route('clinic.patients.create')} className="btn-primary mt-1">
                                                    <UserPlus size={13} /> {t('Add New Patient')}
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {patients.links && patients.links.length > 3 && (
                        <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                            <span className="text-[11px]" style={{ color: 'var(--txt-3)' }}>{t('Patient Directory')}</span>
                            <Pagination links={patients.links} />
                        </div>
                    )}
                </div>
            </div>
        </ClinicLayout>
    );
}
