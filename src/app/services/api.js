import axios from 'axios';
import { unstable_cache } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dummyjson.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
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

const getPostByIdFromApi = async (id) => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch post details:', error);
    throw error;
  }
};

function createSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const getPostBySlugFromApi = async (slug, limit = 10) => {
  const id = Number(slug);
  if (Number.isFinite(id) && id > 0) {
    return getPostByIdFromApi(id);
  }

  const normalizedSlug = createSlug(slug);
  let page = 1;

  while (true) {
    const skip = (page - 1) * limit;
    const response = await api.get('/posts', {
      params: { limit, skip },
    });

    const data = response.data;
    const posts = Array.isArray(data?.posts) ? data.posts : [];
    if (posts.length === 0) {
      break;
    }

    const found = posts.find((post) => {
      const postSlug = createSlug(post?.title || '');
      return postSlug === normalizedSlug || post?.id?.toString() === slug;
    });

    if (found) {
      return found;
    }

    const totalItems = Number(data?.total || 0);
    const totalPages = Math.max(Math.ceil(totalItems / limit), 1);
    if (page >= totalPages) {
      break;
    }

    page += 1;
  }

  return null;
};

const getPostsFromApi = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const response = await api.get('/posts', {
      params: { limit, skip },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch posts:', error?.message || error);
    // Vercel પર ક્રેશ થવાને બદલે ખાલી સ્ટ્રક્ચર રિટર્ન કરશે
    return { posts: [], total: 0 };
  }
};

// dynamic keyParts આપવી જરૂરી છે જેથી દરેક પેજ માટે અલગ કેશ બને
export const getPosts = async (page = 1, limit = 10) => {
  return unstable_cache(
    async () => getPostsFromApi(page, limit),
    [`posts-page-${page}-limit-${limit}`],
    { revalidate: 60 }
  )();
};

export const getProducts = unstable_cache(getProductsFromApi, ['products-list'], {
  revalidate: 60,
});

export const getProductById = unstable_cache(getProductByIdFromApi, ['product-by-id'], {
  revalidate: 60,
});


export const getPostBySlug = async (slug, limit = 10) => {
  return unstable_cache(
    async () => getPostBySlugFromApi(slug, limit),
    [`post-by-slug-${slug}`],
    { revalidate: 60 }
  )();
};
export default api;
