import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { CheckCircle2, User, CloudUpload } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

const LABEL = "block text-[10px] uppercase font-bold tracking-widest mb-2 opacity-70";
const INPUT_BASE = "app-input w-full";

export default function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  className = '',
}: {
  mustVerifyEmail: boolean;
  status?: string;
  className?: string;
}) {
  const user = usePage().props.auth.user;
  const { t } = useTranslation();

  const { data, setData, post, errors, processing, recentlySuccessful } =
    useForm({
      name: user.name,
      email: user.email,
      avatar: null as File | null,
      _method: 'PATCH',
    });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('profile.update'), {
        preserveScroll: true,
    });
  };

  return (
    <form onSubmit={submit} encType="multipart/form-data" className={`space-y-6 ${className}`}>
      <div className="flex flex-col md:flex-row gap-10 mt-6">
        
        {/* Avatar Upload (Left Col) */}
        <div className="w-full md:w-[220px] shrink-0">
          <label className={LABEL} style={{ color: 'var(--txt-1)' }}>{t('Profile Picture')}</label>
          <div className="relative h-[220px] rounded-2xl flex flex-col items-center justify-center transition-colors overflow-hidden mt-1 group cursor-pointer"
           style={{ background: 'var(--surface)', border: '2px dashed var(--border-strong)' }}
           onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
           onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}>
            <input
              type="file"
              onChange={(e) => setData('avatar', e.target.files ? e.target.files[0] : null)}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              accept="image/*"
            />
            {user.avatar_path && !data.avatar ? (
              <div className="absolute inset-0 bg-black">
                <img src={`/storage/${user.avatar_path}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" alt="Avatar" />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <CloudUpload className="text-white w-8 h-8 mb-2" />
                  <span className="text-white text-xs font-bold">{t('Change Picture')}</span>
                </div>
              </div>
            ) : data.avatar ? (
              <div className="text-center px-4">
                <div className="w-10 h-10 mx-auto bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-3">
                  <CloudUpload className="w-5 h-5" />
                </div>
                <p className="text-[12px] font-bold text-emerald-500 truncate">{data.avatar.name}</p>
              </div>
            ) : (
              <div className="text-center px-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <User className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--txt-1)' }} />
                <p className="text-[11.5px] font-medium px-4" style={{ color: 'var(--txt-1)' }}>{t('Click to upload image')}</p>
              </div>
            )}
          </div>
          <p className="text-[10px] mt-4 font-medium opacity-50 text-center" style={{ color: 'var(--txt-1)' }}>
            {t('Recommended: 1:1 ratio, max 5MB.')}
          </p>
          {errors.avatar && <p className="text-red-500 text-[11px] font-bold mt-2 text-center">{errors.avatar}</p>}
        </div>

        {/* Form Inputs (Right Col) */}
        <div className="flex-1 flex flex-col gap-6 pt-1">
          <div>
            <label htmlFor="name" className={LABEL} style={{ color: 'var(--txt-1)' }}>
              {t('Full Name')}
            </label>
            <input
              id="name"
              type="text"
              value={data.name}
              className={INPUT_BASE}
              onChange={(e) => setData('name', e.target.value)}
              required
              autoComplete="name"
            />
            <InputError className="mt-2 text-[11px]" message={errors.name} />
          </div>

          <div>
            <label htmlFor="email" className={LABEL} style={{ color: 'var(--txt-1)' }}>
              {t('Personal Work Email')}
            </label>
            <input
              id="email"
              type="email"
              value={data.email}
              className={INPUT_BASE}
              onChange={(e) => setData('email', e.target.value)}
              required
              autoComplete="username"
            />
            <InputError className="mt-2 text-[11px]" message={errors.email} />
          </div>

          {mustVerifyEmail && user.email_verified_at === null && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-[12.5px] text-amber-500 font-medium">
                {t('Your email address is unverified.')}
                <Link
                  href={route('verification.send')}
                  method="post"
                  as="button"
                  className="ml-2 font-bold text-amber-400 underline hover:no-underline transition-all"
                >
                  {t('Resend verification email')}
                </Link>
              </p>

              {status === 'verification-link-sent' && (
                <div className="mt-2 text-[11.5px] font-bold text-emerald-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('A new verification link has been sent.')}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-6 mt-auto pt-2">
            <Transition
              show={recentlySuccessful}
              enter="transition ease-in-out duration-300"
              enterFrom="opacity-0 translate-x-4"
              enterTo="opacity-100 translate-x-0"
              leave="transition ease-in-out duration-300"
              leaveTo="opacity-0 translate-x-4"
            >
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4" />
                {t('Updated')}
              </div>
            </Transition>

            <button 
              type="submit" 
              disabled={processing}
              className="btn-primary py-2.5 px-6 rounded-xl text-[13px] font-bold disabled:opacity-50"
            >
              {t('Update Identity')}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
