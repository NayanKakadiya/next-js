'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function onSelectChange(event) {
    const nextLocale = event.target.value;

    startTransition(() => {
      // next-intl નો router પોતે જ લોકેલ બદલી આપશે
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <label className="relative inline-flex items-center text-gray-400">
      <select
        className="inline-flex appearance-none bg-transparent p-2 text-sm font-medium text-slate-700 cursor-pointer"
        defaultValue={locale}
        //value={locale}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}