import { LucideIcon } from 'lucide-react';

interface Props {
    title: string;
    description: string;
    icon: LucideIcon;
    action?: React.ReactNode;
}

export default function EmptyState({ title, description, icon: Icon, action }: Props) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 border-dashed">
            <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-700/50 flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                {description}
            </p>
            {action && (
                <div>
                    {action}
                </div>
            )}
        </div>
    );
}
