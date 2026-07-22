import Link from 'next/link';
import React from 'react';

export default function ProductCard({ product }) {
  const image = product?.thumbnail || product?.images?.[0] || product?.image || '';
  const price = Number(product?.price ?? 0).toFixed(2);
  const discount = Number(product?.discountPercentage ?? 0);
  const discountedPrice = discount > 0 ? (Number(product?.price ?? 0) * (1 - discount / 100)).toFixed(2) : price;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative">
            <img src={image} alt={product?.title || product?.name} className="h-48 w-full object-cover transition duration-300 group-hover:scale-105" />
            {discount > 0 ? (
            <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white">
                -{discount.toFixed(0)}%
            </span>
            ) : null}
        </div>

        <div className="p-5">
            <div className="mb-2 flex items-center justify-between gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                {product?.category || 'Product'}
            </span>
            <span className="text-xs font-medium text-emerald-600">
                {product?.availabilityStatus || 'In Stock'}
            </span>
        </div>

        <div className="mb-3 flex items-start justify-between gap-3">
            <div>
                <h2 className="text-lg font-semibold text-slate-900 text-ellipsis line-clamp-1">{product?.title || product?.name}</h2>
                <p className="text-sm text-slate-500">{product?.brand}</p>
            </div>
            <div className="text-right">
                <p className="text-sm font-semibold text-cyan-600">${discountedPrice}</p>
                {discount > 0 ? <p className="text-xs text-slate-400 line-through">${price}</p> : null}
            </div>
        </div>

        <p className="mb-4 text-sm leading-6 text-slate-600 line-clamp-2 text-ellipsis">{product?.description}</p>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
            ⭐ {product?.rating ?? '0.0'}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
            {product?.stock ?? 0} in stock
          </span>
        </div>

        <Link
          href={`/product/${product?.id}`}
          className="block w-full rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
