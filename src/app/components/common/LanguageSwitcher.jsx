'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const currentLocale = useMemo(() => {
    if (!pathname) return 'en';
    const segments = pathname.split('/').filter(Boolean);
    return segments[0] === 'de' ? 'de' : 'en';
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (locale) => {
    const path = pathname || '/';
    const withoutLocale = path.replace(/^\/(de|en)/, '') || '/';

    setOpen(false);
    if (locale === 'de') {
      router.push(`/de${withoutLocale === '/' ? '' : withoutLocale}`);
      return;
    }

    // Default locale is English and uses an unprefixed path.
    router.push(withoutLocale === '/' ? '/' : withoutLocale);
  };

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
      >
        {currentLocale.toUpperCase()}
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path d="M6 8l4 4 4-4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black/5">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                onClick={() => changeLanguage(language.code)}
                className={`flex w-full items-center justify-between px-4 py-2 text-sm transition ${
                  currentLocale === language.code
                    ? 'bg-slate-100 font-semibold text-slate-900'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{language.label}</span>
                {currentLocale === language.code && <span className="text-slate-400">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
