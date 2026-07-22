'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (locale) => {
    const path = pathname || '/';
    const withoutLocale = path.replace(/^\/(de|en)/, '') || '/';

    if (locale === 'de') {
      router.push(`/de${withoutLocale === '/' ? '' : withoutLocale}`);
      return;
    }

    router.push(`/en${withoutLocale === '/' ? '' : withoutLocale}`);
  };

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-sm shadow-sm">
      <button
        onClick={() => changeLanguage('en')}
        className="rounded-full px-2 py-1 font-medium text-slate-700 transition hover:bg-slate-100"
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('de')}
        className="rounded-full px-2 py-1 font-medium text-slate-700 transition hover:bg-slate-100"
      >
        DE
      </button>
    </div>
  );
}
