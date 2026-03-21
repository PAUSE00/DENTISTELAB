import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
 active = false,
 className = '',
 children,
 ...props
}: InertiaLinkProps & { active: boolean }) {
 return (
 <Link
 {...props}
 className={
 'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
 (active
 ? 'border-indigo-400 focus:border-indigo-700 dark:border-indigo-600 '
 : 'border-transparent hover: hover: focus: focus: dark:hover: dark:hover: dark:focus: dark:focus:') +
 className
 }
 >
 {children}
 </Link>
 );
}
