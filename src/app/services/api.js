import axios from 'axios';
import { unstable_cache } from 'next/cache';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});

const getProductsFromApi = async () => {
  try {
    const response = await api.get('/products');
    return response.data.products ?? [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
};

const getProductByIdFromApi = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch product details:', error);
    throw error;
  }
};

export const getProducts = unstable_cache(getProductsFromApi, ['products-list'], {
  revalidate: 60,
});

export const getProductById = unstable_cache(getProductByIdFromApi, ['product-by-id'], {
  revalidate: 60,
});

export default api;
