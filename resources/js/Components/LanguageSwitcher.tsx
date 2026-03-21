import { router, usePage } from '@inertiajs/react';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const languages = [
 { code: 'fr', label: 'Français', flag: '🇫🇷' },
 { code: 'en', label: 'English', flag: '🇬🇧' }
];

 export default function LanguageSwitcher() {
 const { locale } = usePage().props as any;
 const [isOpen, setIsOpen] = useState(false);
 const dropdownRef = useRef<HTMLDivElement>(null);

 const currentLang = languages.find(l => l.code === locale) || languages[0];

 useEffect(() => {
 const handleClickOutside = (e: MouseEvent) => {
 if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
 setIsOpen(false);
 }
 };
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 const switchLocale = (code: string) => {
 router.post(route('locale.update'), { locale: code }, {
 preserveState: false,
 preserveScroll: true,
 onFinish: () => setIsOpen(false),
 });
 };

 return (
 <div className="relative" ref={dropdownRef}>
 <button
 onClick={() => setIsOpen(!isOpen)}
 className="flex items-center justify-center p-1.5 rounded-md transition-colors gap-1.5"
 style={{
 color: isOpen ? 'var(--txt-accent)' : 'var(--txt-2)',
 background: isOpen ? 'var(--surface)' : 'transparent',
 }}
 onMouseEnter={e => {
 if (!isOpen) {
 e.currentTarget.style.background = 'var(--surface)';
 }
 }}
 onMouseLeave={e => {
 if (!isOpen) {
 e.currentTarget.style.background = 'transparent';
 }
 }}
 title="Change language"
 >
 <Globe size={16} />
 <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">
 {currentLang.code}
 </span>
 </button>

 {isOpen && (
 <div className="absolute top-full right-0 mt-2 w-40 rounded-xl overflow-hidden shadow-2xl z-50 p-1 animate-in fade-in zoom-in-95 duration-200"
 style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
 {languages.map((lang) => {
 const active = lang.code === locale;
 return (
 <button
 key={lang.code}
 onClick={() => switchLocale(lang.code)}
 className="w-full flex items-center gap-3 px-3 py-2 text-[12.5px] font-medium rounded-lg transition-colors text-left"
 style={{
 color: active ? 'var(--txt-accent)' : 'var(--txt-2)',
 background: active ? 'var(--teal-10)' : 'transparent',
 }}
 onMouseEnter={e => {
 if (!active) {
 e.currentTarget.style.background = 'var(--bg)';
 e.currentTarget.style.color = 'var(--txt-1)';
 }
 }}
 onMouseLeave={e => {
 if (!active) {
 e.currentTarget.style.background = 'transparent';
 e.currentTarget.style.color = 'var(--txt-2)';
 }
 }}
 >
 <span className="text-[14px]">{lang.flag}</span>
 <span className="flex-1">{lang.label}</span>
 {active && <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--txt-accent)' }} />}
 </button>
 );
 })}
 </div>
 )}
 </div>
 );
}
