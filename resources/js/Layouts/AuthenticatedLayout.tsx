import { PropsWithChildren, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Sidebar from '@/Components/Sidebar';
import ThemeToggle from '@/Components/ThemeToggle';
import NotificationBell from '@/Components/NotificationBell';
import { useTranslation } from 'react-i18next';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-bg dark:bg-bg font-sans text-text dark:text-text flex">

            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-20 lg:ml-64 transition-all duration-300">

                {/* Top Bar (Header + User/Theme Actions) */}
                <header className="sticky top-0 z-30 bg-surface/80 dark:bg-surface/80 backdrop-blur-md border-b border-border dark:border-border h-16 flex items-center justify-between px-6">
                    <div>
                        {header}
                    </div>

                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <ThemeToggle />
                        <div className="flex items-center gap-3 pl-4 border-l border-border dark:border-border">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-text dark:text-text">{user.name}</p>
                                <p className="text-xs text-sub dark:text-sub capitalize">{t(`roles.${user.role}`, user.role.replace('_', ' '))}</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-brand dark:bg-accent/20 flex items-center justify-center text-accent-dark dark:text-accent font-bold">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
