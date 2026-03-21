import { PropsWithChildren } from 'react';

export default function Card({
 children,
 className = '',
}: PropsWithChildren<{ className?: string }>) {
 return (
 <div
 className={`bg-surface dark:bg-surface border border-border dark:border-border rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden ${className}`}
 >
 {children}
 </div>
 );
}
