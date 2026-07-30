import React from 'react';
import Link from 'next/link';
import { getProductById } from '../../../services/api';
import {getTranslations} from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  return {
    title: product?.title || 'Product Details',
    description: product?.description || 'Product details page',
  };
}

export default async function ProductDetailPage({ params }) {
    const { id } = await params;
    const product = await getProductById(id);
    const t = await getTranslations('ProductPage');
    const image = product?.thumbnail || product?.images?.[0] || '';
    const price = Number(product?.price ?? 0).toFixed(2);
    const discount = Number(product?.discountPercentage ?? 0);
    const discountedPrice = discount > 0 ? (Number(product?.price ?? 0) * (1 - discount / 100)).toFixed(2) : price;

    
  return (
    <main className="flex-1 bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/product" className="mb-6 inline-block text-sm font-semibold text-cyan-600 hover:text-cyan-700">
          {t('head.backBtnText')}
        </Link>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
            <div className="rounded-2xl bg-slate-100 p-4">
              <img src={image} alt={product?.title} className="h-80 w-full rounded-2xl object-cover" />
            </div>

            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
                  {product?.category || 'Product'}
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {product?.availabilityStatus || 'In Stock'}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-slate-900">{product?.title}</h1>
              <p className="mt-2 text-lg font-medium text-slate-500">{product?.brand}</p>

              <div className="mt-6 flex items-center gap-4">
                <p className="text-3xl font-bold text-cyan-600">${discountedPrice}</p>
                {discount > 0 ? <p className="text-lg text-slate-400 line-through">${price}</p> : null}
              </div>

              <p className="mt-6 text-base leading-7 text-slate-600">{product?.description}</p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">⭐ {product?.rating ?? '0.0'}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">{product?.stock ?? 0} in stock</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">{product?.shippingInformation}</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                  {t('head.addtoCartBtnText')}
                </button>
                <button className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                  {t('head.wishlistBtnText')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
