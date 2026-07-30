// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/product': {
      en: '/product',
      de: '/produkt' // You can customize localized URLs if desired!
    },
    '/contact-us': {
      en: '/contact-us',
      de: '/kontakt'
    },
    '/blog': {
      en: '/blog',
      de: '/blog'
    }
  }
});