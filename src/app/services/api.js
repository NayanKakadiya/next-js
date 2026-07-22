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

const getPostsFromApi = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const response = await api.get(`/posts`, {
      params: { limit, skip },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw error;
  }
};

const getPostByIdFromApi = async (id) => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch post details:', error);
    throw error;
  }
};

export const getProducts = unstable_cache(getProductsFromApi, ['products-list'], {
  revalidate: 60,
});

export const getProductById = unstable_cache(getProductByIdFromApi, ['product-by-id'], {
  revalidate: 60,
});

export const getPosts = unstable_cache(getPostsFromApi, ['posts-list'], {
  revalidate: 60,
});

export const getPostById = unstable_cache(getPostByIdFromApi, ['post-by-id'], {
  revalidate: 60,
});

export default api;
