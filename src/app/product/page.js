import React from 'react';
import ProductCard from '../components/common/ProductCard';
import { getProducts } from '../services/api';


export default async function ProductPage() {
    let products = await getProducts();
  return (
    <main className="flex-1 bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">
                Featured Products
            </p>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Discover your next favorite piece
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
