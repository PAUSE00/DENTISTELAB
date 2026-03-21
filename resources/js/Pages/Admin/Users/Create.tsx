import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import { ArrowLeft, User, Mail, Shield, Lock, UserPlus, Save, X } from 'lucide-react';
import { FormEventHandler } from 'react';
import useTranslation from '@/Hooks/useTranslation';

const fieldBase = {
  background: 'var(--surface)',
  border: '1.5px solid var(--border)',
  color: 'var(--txt-1)',
  borderRadius: '12px',
  padding: '11px 14px 11px 42px',
  width: '100%',
  outline: 'none',
  fontSize: '13px',
  fontWeight: '500',
  transition: 'border-color 0.2s',
} as React.CSSProperties;

export default function Create() {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'dentist',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('admin.users.store'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  const roles = [
    { value: 'dentist',      label: t('Dentist (Clinic Owner)'),  access: t('Clinic Owner') },
    { value: 'lab_owner',    label: t('Lab Owner'),                access: t('Lab Enterprise') },
    { value: 'lab_tech',     label: t('Lab Technician'),           access: t('Technician Staff') },
    { value: 'clinic_staff', label: t('Clinic Staff'),             access: t('Clinic Staff') },
    { value: 'super_admin',  label: t('Super Admin'),              access: t('Full Access') },
  ];

  return (
    <AdminLayout header={t('Create New User')}>
      <Head title={t('Create User')} />

      <div className="space-y-8 animate-fade-in pb-12">

        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Link
            href={route('admin.users.index')}
            className="p-2.5 rounded-xl border transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)', color: 'var(--txt-3)' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <UserPlus className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>{t('User Management')}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--txt-1)' }}>
              {t('Create')} <span style={{ color: 'var(--accent)' }}>{t('New User')}</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left Sidebar */}
          <div className="space-y-4">

            {/* Role Reference Card */}
            <div className="rounded-2xl p-5 border" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--txt-3)' }}>
                {t('Access Level Map')}
              </p>
              <div className="space-y-1">
                {roles.map(item => (
                  <div
                    key={item.value}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors"
                    style={{
                      background: data.role === item.value ? 'var(--accent-10)' : 'transparent',
                    }}
                  >
                    <span className="text-[12px] font-semibold capitalize" style={{ color: data.role === item.value ? 'var(--accent)' : 'var(--txt-2)' }}>
                      {item.value.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-tight" style={{ color: data.role === item.value ? 'var(--accent)' : 'var(--txt-3)' }}>
                      {item.access}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Badges */}
            <div className="rounded-2xl p-5 border" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--txt-3)' }}>
                {t('Connection Status')}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="w-2 h-2 rounded-full bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('SSL Encryption Active')}</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="w-2 h-2 rounded-full shadow-[0_0_8px_var(--accent-20)]" style={{ background: 'var(--accent)' }} />
                  <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-2)' }}>{t('Role Validation Ready')}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <form onSubmit={submit} className="rounded-2xl border" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
              <div className="p-8 space-y-8">

                {/* Primary Identity */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-px" style={{ background: 'var(--accent)' }} />
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>{t('Primary Identity')}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Full Name')}</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                        <input
                          id="name"
                          type="text"
                          value={data.name}
                          onChange={e => setData('name', e.target.value)}
                          placeholder="Dr. Sara Bennani"
                          required
                          style={fieldBase}
                        />
                      </div>
                      <InputError message={errors.name} />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Email Address')}</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                        <input
                          id="email"
                          type="email"
                          value={data.email}
                          onChange={e => setData('email', e.target.value)}
                          placeholder="sara@clinic.ma"
                          required
                          style={fieldBase}
                        />
                      </div>
                      <InputError message={errors.email} />
                    </div>

                  </div>
                </section>

                {/* Role */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-px" style={{ background: 'var(--accent)' }} />
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>{t('Access & Permissions')}</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Role')}</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                      <select
                        id="role"
                        value={data.role}
                        onChange={e => setData('role', e.target.value)}
                        required
                        style={{ ...fieldBase, appearance: 'none', cursor: 'pointer' }}
                      >
                        {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                    <InputError message={errors.role} />
                  </div>
                </section>

                {/* Password */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-px" style={{ background: 'var(--accent)' }} />
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>{t('Security Credentials')}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Password')}</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                        <input
                          id="password"
                          type="password"
                          value={data.password}
                          onChange={e => setData('password', e.target.value)}
                          placeholder="••••••••"
                          required
                          style={fieldBase}
                        />
                      </div>
                      <InputError message={errors.password} />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--txt-3)' }}>{t('Confirm Password')}</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--txt-3)' }} />
                        <input
                          id="password_confirmation"
                          type="password"
                          value={data.password_confirmation}
                          onChange={e => setData('password_confirmation', e.target.value)}
                          placeholder="••••••••"
                          required
                          style={fieldBase}
                        />
                      </div>
                      <InputError message={errors.password_confirmation} />
                    </div>

                  </div>
                </section>

              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <Link
                  href={route('admin.users.index')}
                  className="flex items-center gap-2 text-[12px] font-semibold transition-colors hover:text-[var(--accent)]"
                  style={{ color: 'var(--txt-3)' }}
                >
                  <X className="w-4 h-4" />
                  {t('Cancel')}
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-white font-bold text-[13px] transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'var(--accent-grad)', boxShadow: '0 4px 20px var(--accent-20)' }}
                >
                  <Save className="w-4 h-4" />
                  {processing ? t('Creating...') : t('Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
