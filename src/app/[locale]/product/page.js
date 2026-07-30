import React from 'react';
import ProductCard from '@/app/components/common/ProductCard';
import { getProducts } from '@/app/services/api';
import {getTranslations} from 'next-intl/server';


export default async function ProductPage() {
    let products = await getProducts();
    const t = await getTranslations('ProductPage');
  return (
    <main className="flex-1 bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">
                {t('head.label')}
            </p>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                {t('head.title')}
            </h1>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        </div>
    </main>
  );
}
