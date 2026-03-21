import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Search, Plus, Edit2, Trash2, Activity, Power, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import useTranslation from '@/Hooks/useTranslation';

interface Lab {
  id: number;
  name: string;
  address: string;
  phone: string;
  owner?: { name: string };
  created_at: string;
  is_active: boolean;
  clinics?: { id: number; name: string }[];
}

interface Props extends PageProps {
  labs: {
    data: Lab[];
    links: any[];
    total?: number;
  };
  filters: { search?: string };
}

const initials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

const clinicColor = (idx: number) => {
  const p = ['#38bdf8', '#c084fc', '#34d399', '#fbbf24', '#f43f5e', '#818cf8'];
  return p[idx % p.length];
};

export default function Index({ auth, labs, filters }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [view, setView] = useState<'list' | 'grid'>('list');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('admin.labs.index'), { search }, { preserveState: true, replace: true });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this lab?')) {
      router.delete(route('admin.labs.destroy', id));
    }
  };

  const StatusBadge = ({ active }: { active: boolean }) => (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border"
      style={{
        background: active ? 'rgba(52,211,153,0.1)' : 'rgba(244,63,94,0.1)',
        borderColor: active ? 'rgba(52,211,153,0.25)' : 'rgba(244,63,94,0.25)',
        color: active ? '#34d399' : '#f43f5e',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
      {active ? t('Active') : t('Inactive')}
    </span>
  );

  const ClinicAvatars = ({ clinics }: { clinics?: { id: number; name: string }[] }) => {
    if (!clinics || clinics.length === 0)
      return <span className="text-[11px] italic opacity-40" style={{ color: 'var(--txt-3)' }}>No clinics linked</span>;
    return (
      <div className="flex items-center">
        {clinics.slice(0, 3).map((clinic, i) => (
          <div
            key={clinic.id}
            title={clinic.name}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black text-white border-2 -ml-1.5 first:ml-0"
            style={{ background: clinicColor(i), borderColor: 'var(--bg-raised)' }}
          >{initials(clinic.name)}</div>
        ))}
        {clinics.length > 3 && (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black border-2 -ml-1.5"
            style={{ background: 'var(--surface)', borderColor: 'var(--bg-raised)', color: 'var(--txt-3)' }}
          >+{clinics.length - 3}</div>
        )}
      </div>
    );
  };

  return (
    <AdminLayout header="Lab Management">
      <Head title="Labs" />

      <div className="animate-fade-in space-y-6 pb-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>
              {t('Lab Directory')}
            </p>
            <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--txt-1)' }}>
              {t('Active')} <span style={{ color: 'var(--accent)' }}>{t('Laboratories')}</span>
            </h2>
          </div>
          <Link
            href={route('admin.labs.create')}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: '#34d399', color: '#0d1f1a', boxShadow: '0 4px 16px rgba(52,211,153,0.3)' }}
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span>{t('Add New Lab')}</span>
          </Link>
        </div>

        {/* Search + View Toggle */}
        <div className="flex gap-3 items-center">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Search labs by name, address, or owner...')}
              className="w-full pl-11 pr-5 py-3 rounded-xl text-[13px] outline-none transition-all"
              style={{ background: 'var(--bg-raised)', border: '1.5px solid var(--border)', color: 'var(--txt-1)' }}
            />
          </form>
          {/* View switcher */}
          <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => setView('grid')}
              className="p-2.5 transition-colors"
              style={{
                background: view === 'grid' ? 'var(--accent-10)' : 'var(--bg-raised)',
                color: view === 'grid' ? 'var(--accent)' : 'var(--txt-3)',
                borderRight: '1px solid var(--border)',
              }}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className="p-2.5 transition-colors"
              style={{
                background: view === 'list' ? 'var(--accent-10)' : 'var(--bg-raised)',
                color: view === 'list' ? 'var(--accent)' : 'var(--txt-3)',
              }}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── LIST VIEW ─── */}
        {view === 'list' && (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                    {['Lab Name', 'Owner / Lead', 'Contact Info', 'Linked Clinics', 'Status', 'Actions'].map((h, i) => (
                      <th
                        key={h}
                        className={`py-4 px-6 text-[10px] font-black uppercase tracking-widest opacity-60 ${i === 5 ? 'text-right' : ''}`}
                        style={{ color: 'var(--txt-2)' }}
                      >{t(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {labs.data.length > 0 ? labs.data.map((lab) => (
                    <tr
                      key={lab.id}
                      className="group border-b transition-colors hover:bg-[var(--surface-hover)] last:border-0 cursor-pointer"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--accent-10)', border: '1px solid var(--border)' }}>
                            <Activity className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold leading-tight" style={{ color: 'var(--txt-1)' }}>{lab.name}</p>
                            {lab.address && <p className="text-[11px] mt-0.5 truncate max-w-[180px]" style={{ color: 'var(--txt-3)' }}>{lab.address}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {lab.owner ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0" style={{ background: 'var(--accent-grad)' }}>
                              {initials(lab.owner.name)}
                            </div>
                            <div>
                              <p className="text-[12px] font-semibold" style={{ color: 'var(--txt-1)' }}>{lab.owner.name}</p>
                              <p className="text-[10px]" style={{ color: 'var(--txt-3)' }}>Operation Lead</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] italic opacity-50" style={{ color: 'var(--txt-3)' }}>—</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          {lab.phone && <p className="text-[12px] font-medium" style={{ color: 'var(--txt-2)' }}>{lab.phone}</p>}
                          {lab.address && <p className="text-[11px] truncate max-w-[180px]" style={{ color: 'var(--txt-3)' }}>{lab.address}</p>}
                        </div>
                      </td>
                      <td className="py-4 px-6"><ClinicAvatars clinics={lab.clinics} /></td>
                      <td className="py-4 px-6"><StatusBadge active={lab.is_active} /></td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => router.patch(route('admin.labs.toggle-active', lab.id), {}, { preserveScroll: true })}
                            className="p-2 rounded-xl border transition-all"
                            style={{ background: lab.is_active ? 'rgba(251,191,36,0.1)' : 'rgba(52,211,153,0.1)', borderColor: lab.is_active ? 'rgba(251,191,36,0.25)' : 'rgba(52,211,153,0.25)', color: lab.is_active ? '#fbbf24' : '#34d399' }}
                          ><Power className="w-3.5 h-3.5" /></button>
                          <Link href={route('admin.labs.edit', lab.id)} className="p-2 rounded-xl border transition-all" style={{ background: 'var(--accent-10)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button onClick={() => handleDelete(lab.id)} className="p-2 rounded-xl border transition-all" style={{ background: 'rgba(244,63,94,0.1)', borderColor: 'rgba(244,63,94,0.25)', color: '#f43f5e' }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--surface)' }}>
                          <Activity className="w-7 h-7" style={{ color: 'var(--txt-3)' }} />
                        </div>
                        <p className="font-bold text-[13px]" style={{ color: 'var(--txt-1)' }}>{t('No Labs Found')}</p>
                        <p className="text-[12px]" style={{ color: 'var(--txt-3)' }}>{t('Try adjusting your search terms')}</p>
                      </div>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t flex justify-between items-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
                {t('Showing')} <span className="font-bold" style={{ color: 'var(--txt-2)' }}>{labs.data.length}</span> {t('of')} {labs.total ?? labs.data.length} {t('labs')}
              </p>
              <Pagination links={labs.links} />
            </div>
          </div>
        )}

        {/* ─── GRID VIEW ─── */}
        {view === 'grid' && (
          <>
            {labs.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {labs.data.map((lab) => (
                  <div
                    key={lab.id}
                    className="group rounded-2xl border transition-all hover:border-[var(--accent)] hover:-translate-y-0.5 overflow-hidden"
                    style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}
                  >
                    {/* Card header */}
                    <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--accent-10)', border: '1px solid var(--border)' }}>
                          <Activity className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                        </div>
                        <StatusBadge active={lab.is_active} />
                      </div>
                      <p className="text-[14px] font-bold leading-tight mb-1" style={{ color: 'var(--txt-1)' }}>{lab.name}</p>
                      {lab.address && (
                        <p className="text-[11px] truncate" style={{ color: 'var(--txt-3)' }}>{lab.address}</p>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-5 space-y-3">
                      {lab.owner && (
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0" style={{ background: 'var(--accent-grad)' }}>
                            {initials(lab.owner.name)}
                          </div>
                          <div>
                            <p className="text-[12px] font-semibold" style={{ color: 'var(--txt-1)' }}>{lab.owner.name}</p>
                            <p className="text-[10px]" style={{ color: 'var(--txt-3)' }}>Operation Lead</p>
                          </div>
                        </div>
                      )}
                      {lab.phone && (
                        <p className="text-[12px] font-medium" style={{ color: 'var(--txt-2)' }}>{lab.phone}</p>
                      )}
                      <div className="flex items-center justify-between pt-1">
                        <ClinicAvatars clinics={lab.clinics} />
                      </div>
                    </div>

                    {/* Card footer actions */}
                    <div className="px-5 py-3 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                      <button
                        onClick={() => router.patch(route('admin.labs.toggle-active', lab.id), {}, { preserveScroll: true })}
                        className="p-1.5 rounded-lg border transition-all"
                        style={{ background: lab.is_active ? 'rgba(251,191,36,0.1)' : 'rgba(52,211,153,0.1)', borderColor: lab.is_active ? 'rgba(251,191,36,0.2)' : 'rgba(52,211,153,0.2)', color: lab.is_active ? '#fbbf24' : '#34d399' }}
                      ><Power className="w-3.5 h-3.5" /></button>
                      <Link href={route('admin.labs.edit', lab.id)} className="p-1.5 rounded-lg border transition-all" style={{ background: 'var(--accent-10)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button onClick={() => handleDelete(lab.id)} className="p-1.5 rounded-lg border transition-all" style={{ background: 'rgba(244,63,94,0.1)', borderColor: 'rgba(244,63,94,0.2)', color: '#f43f5e' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-24 gap-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--surface)' }}>
                  <Activity className="w-8 h-8" style={{ color: 'var(--txt-3)' }} />
                </div>
                <p className="font-bold text-[14px]" style={{ color: 'var(--txt-1)' }}>{t('No Labs Found')}</p>
                <p className="text-[12px]" style={{ color: 'var(--txt-3)' }}>{t('Try adjusting your search terms')}</p>
              </div>
            )}
            <div className="flex justify-between items-center pt-2">
              <p className="text-[11px]" style={{ color: 'var(--txt-3)' }}>
                {t('Showing')} <span className="font-bold" style={{ color: 'var(--txt-2)' }}>{labs.data.length}</span> {t('of')} {labs.total ?? labs.data.length} {t('labs')}
              </p>
              <Pagination links={labs.links} />
            </div>
          </>
        )}

      </div>
    </AdminLayout>
  );
}
