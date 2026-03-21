import { LucideIcon } from 'lucide-react';

interface Props {
 title: string;
 description: string;
 icon: LucideIcon;
 action?: React.ReactNode;
}

export default function EmptyState({ title, description, icon: Icon, action }: Props) {
 return (
 <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed">
 <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
 <Icon className="w-8 h-8 " />
 </div>
 <h3 className="text-lg font-semibold dark:text-white mb-1">
 {title}
 </h3>
 <p className="text-sm max-w-sm mb-6">
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
