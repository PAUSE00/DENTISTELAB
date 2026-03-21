import { ButtonHTMLAttributes } from 'react';

export default function SecondaryButton({
 type = 'button',
 className = '',
 disabled,
 children,
 ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
 return (
 <button
 {...props}
 type={type}
 className={
 `inline-flex items-center justify-center rounded-xl border border-brand/50 bg-white px-5 py-2.5 text-sm font-semibold text-green-900 shadow-sm transition-all duration-200 ease-in-out hover:bg-bg hover:border-brand focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:border-green-900/30 dark:bg-surface dark:text-brand dark:hover:bg-sidebar dark:focus:ring-offset-gray-800 ${disabled && 'opacity-50 cursor-not-allowed'
 } ` + className
 }
 disabled={disabled}
 >
 {children}
 </button>
 );
}
