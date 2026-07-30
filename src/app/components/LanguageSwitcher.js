"use client";

import {useLocale} from "next-intl";
import {useRouter, usePathname} from "@/i18n/navigation";

export default function LanguageSwitcher() {

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function changeLanguage(e) {
    router.replace(pathname, {
      locale: e.target.value
    });
  }

  return (
    <select
      value={locale}
      onChange={changeLanguage}
    >
      <option value="en">English</option>
      <option value="de">German</option>
    </select>
  );
}