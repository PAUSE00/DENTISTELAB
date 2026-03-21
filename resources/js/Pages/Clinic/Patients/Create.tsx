import ClinicLayout from '@/Layouts/ClinicLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { ChevronLeft, Save, User, Phone } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Create({ auth }: PageProps) {
 const { data, setData, post, processing, errors, reset } = useForm({
 first_name: '',
 last_name: '',
 dob: '',
 phone: '',
 email: '',
 external_id: '',
 medical_notes: '',
 blood_group: '',
 allergies: '',
 medical_history: '',
 });

 const submit: FormEventHandler = (e) => {
 e.preventDefault();
 post(route('clinic.patients.store'));
 };

 return (
 <ClinicLayout>
 <Head title="Add Patient" />

 <div className="max-w-4xl mx-auto animate-fade-up space-y-6">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center gap-4">
 <Link
 href={route('clinic.patients.index')}
 className="p-2.5 rounded-xl transition-colors hover:bg-white/5" style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--txt-2)' }}
 >
 <ChevronLeft className="w-5 h-5" />
 </Link>
 <div>
 <h2 className="text-2xl font-bold" style={{ color: 'var(--txt-1)' }}>Add New Patient</h2>
 <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60" style={{ color: 'var(--txt-2)' }}>Register a new patient to your clinic</p>
 </div>
 </div>

 <div className="card overflow-hidden transition-all duration-300">
 <div className="p-8">
 <form onSubmit={submit} className="space-y-8">
 {/* Personal Information Section */}
 <div className="space-y-6">
 <h3 className="text-[11px] font-bold uppercase tracking-widest border-b pb-3 flex items-center gap-2" style={{ color: 'var(--txt-2)', borderColor: 'var(--border)' }}>
 <User className="w-4 h-4" style={{ color: 'var(--teal)' }} /> Personal Information
 </h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* First Name */}
 <div>
 <label htmlFor="first_name" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>First Name</label>
 <input
 id="first_name"
 className="app-input w-full"
 value={data.first_name}
 onChange={(e) => setData('first_name', e.target.value)}
 required
 autoFocus
 autoComplete="given-name"
 />
 <InputError className="mt-2" message={errors.first_name} />
 </div>

 {/* Last Name */}
 <div>
 <label htmlFor="last_name" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>Last Name</label>
 <input
 id="last_name"
 className="app-input w-full"
 value={data.last_name}
 onChange={(e) => setData('last_name', e.target.value)}
 required
 autoComplete="family-name"
 />
 <InputError className="mt-2" message={errors.last_name} />
 </div>

 {/* DOB */}
 <div>
 <label htmlFor="dob" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>Date of Birth</label>
 <input
 id="dob"
 type="date"
 className="app-input w-full"
 value={data.dob}
 onChange={(e) => setData('dob', e.target.value)}
 required
 />
 <InputError className="mt-2" message={errors.dob} />
 </div>
 </div>
 </div>

 {/* Contact Information Section */}
 <div className="space-y-6 mt-8">
 <h3 className="text-[11px] font-bold uppercase tracking-widest border-b pb-3 flex items-center gap-2" style={{ color: 'var(--txt-2)', borderColor: 'var(--border)' }}>
 <Phone className="w-4 h-4" style={{ color: 'var(--purple)' }} /> Contact & Additional Info
 </h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Phone */}
 <div>
 <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>Phone Number</label>
 <input
 id="phone"
 type="tel"
 className="app-input w-full"
 value={data.phone}
 onChange={(e) => setData('phone', e.target.value)}
 required
 autoComplete="tel"
 />
 <InputError className="mt-2" message={errors.phone} />
 </div>

 {/* Email (Optional) */}
 <div>
 <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>Email (Optional)</label>
 <input
 id="email"
 type="email"
 className="app-input w-full"
 value={data.email}
 onChange={(e) => setData('email', e.target.value)}
 autoComplete="email"
 />
 <InputError className="mt-2" message={errors.email} />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
 {/* Blood Group */}
 <div>
 <label htmlFor="blood_group" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>Blood Group</label>
 <select
 id="blood_group"
 className="app-input w-full appearance-none"
 value={data.blood_group}
 onChange={(e) => setData('blood_group', e.target.value)}
 >
 <option value="">N/A</option>
 <option value="A+">A+</option>
 <option value="A-">A-</option>
 <option value="B+">B+</option>
 <option value="B-">B-</option>
 <option value="AB+">AB+</option>
 <option value="AB-">AB-</option>
 <option value="O+">O+</option>
 <option value="O-">O-</option>
 </select>
 <InputError className="mt-2" message={errors.blood_group} />
 </div>

 {/* Medical History */}
 <div className="md:col-span-2">
 <label htmlFor="medical_history" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>Medical History</label>
 <input
 id="medical_history"
 className="app-input w-full"
 value={data.medical_history}
 onChange={(e) => setData('medical_history', e.target.value)}
 placeholder="e.g. Diabetes, Hypertension..."
 />
 <InputError className="mt-2" message={errors.medical_history} />
 </div>
 </div>

 {/* Allergies */}
 <div className="mt-4">
 <label htmlFor="allergies" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>Allergies</label>
 <input
 id="allergies"
 className="app-input w-full"
 value={data.allergies}
 onChange={(e) => setData('allergies', e.target.value)}
 placeholder="e.g. Penicillin, Latex..."
 />
 <InputError className="mt-2" message={errors.allergies} />
 </div>

 {/* Medical Notes */}
 <div className="mt-4">
 <label htmlFor="medical_notes" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--txt-2)' }}>Medical Notes (Optional)</label>
 <textarea
 id="medical_notes"
 className="app-input w-full resize-none"
 value={data.medical_notes}
 onChange={(e) => setData('medical_notes', e.target.value)}
 rows={4}
 placeholder="Any important medical history or allergies..."
 />
 <InputError className="mt-2" message={errors.medical_notes} />
 </div>
 </div>

 <div className="flex items-center justify-end gap-3 pt-6 mt-8 border-t" style={{ borderColor: 'var(--border)' }}>
 <Link href={route('clinic.patients.index')} className="btn-ghost" style={{ textDecoration: 'none' }}>
 Cancel
 </Link>
 <button
 type="submit"
 disabled={processing}
 className="btn-primary"
 >
 <Save className="w-4 h-4" />
 <span className="font-bold">Save Patient</span>
 </button>
 </div>
 </form>
 </div>
 </div>
 </div>
 </ClinicLayout>
 );
}
