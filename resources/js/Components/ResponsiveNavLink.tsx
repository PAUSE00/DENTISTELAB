import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
 active = false,
 className = '',
 children,
 ...props
}: InertiaLinkProps & { active?: boolean }) {
 return (
 <Link
 {...props}
 className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
 active
 ? 'border-indigo-400 bg-indigo-50 text-indigo-700 focus:border-indigo-700 focus:bg-indigo-100 focus:text-indigo-800 dark:border-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 dark:focus:border-indigo-300 dark:focus:bg-indigo-900 dark:focus:text-indigo-200'
 : 'border-transparent hover: hover: hover: focus: focus: focus: dark:hover: dark:hover: dark:hover: dark:focus: dark:focus: dark:focus:'
 } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
 >
 {children}
 </Link>
 );
}
