'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import { Link } from '@/i18n/navigation';

export default function NavigationLink({ href, ...rest }) {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/';
  const isActive = pathname === href;

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={`block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 ${
        isActive ? 'text-black' : 'text-gray-600 hover:text-gray-800'
      }`}
      href={href}
      {...rest}
    />
  );
}