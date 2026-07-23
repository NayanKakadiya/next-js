import Link from 'next/link';
import { getPosts } from '../services/api';

export const dynamic = 'force-dynamic';

async function getBlogs(page = 1) {
  try {
    const limit = 10;
    const data = await getPosts(page, limit);

    const totalItems = Number(data?.total || 0);
    const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

    return {
      blogs: Array.isArray(data?.posts) ? data.posts : [],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        perPage: limit,
      },
    };
  } catch (error) {
    console.error('Error fetching blogs in Page:', error);
    return {
      blogs: [],
      pagination: { currentPage: 1, totalPages: 1, totalItems: 0, perPage: 10 },
    };
  }
}

function createSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getBlogTitle(post) {
  return post?.title || post?.name || post?.headline || post?.heading || 'Untitled blog';
}

function getBlogSlug(post) {
  return post?.slug || createSlug(getBlogTitle(post)) || post?.id?.toString() || 'blog';
}

function getBlogExcerpt(post) {
  return post?.summary || post?.excerpt || post?.description || post?.content || post?.body || 'Read the full article to discover more insights.';
}

function getBlogCategory(post) {
  return post?.category || post?.tags?.[0] || 'Blog';
}

export const metadata = {
  title: 'Blog',
  description: 'Discover the latest stories and tutorials from our blog.',
};

export default async function BlogPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const requestedPage = Number(resolvedSearchParams?.page || 1);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const { blogs, pagination } = await getBlogs(page);
  const totalPages = pagination.totalPages;
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startItem = blogs.length > 0 ? (currentPage - 1) * pagination.perPage + 1 : 0;
  const endItem = Math.min(startItem + blogs.length - 1, pagination.totalItems);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).filter((item) => {
    return item === 1 || item === totalPages || Math.abs(item - currentPage) <= 1;
  });

  return (
    <main className="flex-1 bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600">
            Blog Test Commit
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Fresh ideas, practical tips, and thoughtful stories
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Browse the latest posts from our community and explore a curated selection of articles.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{startItem}</span> to <span className="font-semibold text-slate-900">{endItem}</span> of <span className="font-semibold text-slate-900">{pagination.totalItems}</span> posts
          </p>
          <p className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-900">{currentPage}</span> of <span className="font-semibold text-slate-900">{totalPages}</span>
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">No blogs found</h3>
            <p className="mt-2 text-sm text-slate-500">Unable to load blogs right now. Please try again later.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((post, index) => {
              const title = getBlogTitle(post);
              const slug = getBlogSlug(post);
              const excerpt = getBlogExcerpt(post);
              const category = getBlogCategory(post);
              const views = post?.views ?? 0;
              const likes = post?.reactions?.likes ?? 0;
              const dislikes = post?.reactions?.dislikes ?? 0;

              return (
                <article
                  key={slug + index}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                >
                  <div className="bg-gradient-to-br from-cyan-600 via-slate-800 to-slate-900 p-6 text-white">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-100">
                        {category}
                      </span>
                      <span className="text-xs font-semibold text-slate-200">
                        {views} views
                      </span>
                    </div>
                    <h2 className="mt-5 line-clamp-2 text-xl font-semibold text-white">
                      {title}
                    </h2>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-200">
                      {excerpt}
                    </p>
                  </div>

                  <div className="p-5">
                    <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {likes} likes
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {dislikes} dislikes
                      </span>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {Array.isArray(post?.tags) && post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/blog/${encodeURIComponent(slug)}`}
                      className="block w-full rounded-full bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Blog pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <Link
              href={`/blog?page=${Math.max(currentPage - 1, 1)}`}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-600 hover:text-cyan-600"
            >
              Previous
            </Link>

            {pageNumbers.map((pageNumber, index) => {
              const showEllipsis = index > 0 && pageNumber - pageNumbers[index - 1] > 1;

              return (
                <div key={pageNumber} className="flex items-center gap-2">
                  {showEllipsis && <span className="text-sm text-slate-400">...</span>}
                  <Link
                    href={`/blog?page=${pageNumber}`}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      currentPage === pageNumber
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'border border-slate-300 bg-white text-slate-700 hover:border-cyan-600 hover:text-cyan-600'
                    }`}
                  >
                    {pageNumber}
                  </Link>
                </div>
              );
            })}

            <Link
              href={`/blog?page=${Math.min(currentPage + 1, totalPages)}`}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-600 hover:text-cyan-600"
            >
              Next
            </Link>
          </nav>
        )}
      </div>
    </main>
  );
}