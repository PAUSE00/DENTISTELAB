import { InputHTMLAttributes } from 'react';

export default function Checkbox({
 className = '',
 ...props
}: InputHTMLAttributes<HTMLInputElement>) {
 return (
 <input
 {...props}
 type="checkbox"
 className={
 'rounded text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800 ' +
 className
 }
 />
 );
}
