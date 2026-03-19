import { PropsWithChildren, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Sidebar from '@/Components/Sidebar';
import ThemeToggle from '@/Components/ThemeToggle';
import NotificationBell from '@/Components/NotificationBell';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const { t } = useTranslation();

    const getInitials = (name: string) =>
        name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);

    return (
        <div className="min-h-screen font-sans text-sm flex transition-colors duration-300" style={{ background: 'var(--bg-color)', color: 'var(--txt-1)' }}>

            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-20 lg:ml-64 transition-all duration-300 min-h-screen flex flex-col">

                {/* Top Bar */}
                <header
                    className="sticky top-0 z-30 backdrop-blur-md border-b h-16 flex items-center justify-between px-6 shrink-0"
                    style={{ background: 'var(--bg-color)', borderColor: 'var(--border)' }}
                >
                    <div>
                        {header}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Language switcher */}
                        <div className="hidden sm:block rounded-xl border p-1" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                            <LanguageSwitcher />
                        </div>

                        {/* Icon actions */}
                        <div className="flex items-center gap-1 rounded-xl border p-1" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                            <ThemeToggle />
                            <NotificationBell />
                        </div>

                        {/* User chip */}
                        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border ml-1" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold leading-none" style={{ color: 'var(--txt-1)' }}>{user.name}</p>
                                <p className="text-[10px] font-bold uppercase text-indigo-500">{t(`roles.${user.role}`, user.role.replace('_', ' '))}</p>
                            </div>
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                                {getInitials(user.name)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 max-w-7xl mx-auto w-full flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
