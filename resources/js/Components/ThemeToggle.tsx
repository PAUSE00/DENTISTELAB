import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        // Initialize state based on localStorage or OS preference on mount
        const isDark = localStorage.theme === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setDark(isDark);
    }, []);

    const toggle = () => {
        const next = !dark;
        setDark(next);
        if (next) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-500 hover:bg-hover dark:text-gray-400 dark:hover:bg-hover transition-colors"
            aria-label="Toggle Dark Mode"
        >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
