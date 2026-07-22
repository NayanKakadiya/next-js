import Link from 'next/link';

async function getBlogs(page = 1) {
  const response = await fetch(`https://jsonfakery.com/blogs/paginated?page=${page}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error('Unable to fetch blogs');
  }

  const data = await response.json();

  const blogs = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : Array.isArray(data?.blogs)
        ? data.blogs
        : Array.isArray(data?.posts)
          ? data.posts
          : [];

  const totalPages = Number(data?.last_page || data?.total_pages || 1);
  const currentPage = Number(data?.current_page || page || 1);
  const totalItems = Number(data?.total || blogs.length || 0);
  const perPage = Number(data?.per_page || 10);

  return {
    blogs,
    pagination: {
      currentPage,
      totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1,
      totalItems,
      perPage,
    },
  };
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
  return post?.summary || post?.excerpt || post?.description || post?.content || 'Read the full article to discover more insights.';
}

function getBlogImage(post) {
  return post?.featured_image || post?.image || post?.featuredImage || post?.thumbnail || '';
}

function getBlogCategory(post) {
  return post?.category?.name || post?.tag?.name || post?.category || post?.tag || post?.topic || 'Blog';
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
  const startItem = (currentPage - 1) * pagination.perPage + 1;
  const endItem = Math.min(startItem + blogs.length - 1, pagination.totalItems);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).filter((item) => {
    return item === 1 || item === totalPages || Math.abs(item - currentPage) <= 1;
  });

  return (
    <main className="flex-1 bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600">
            Blog
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((post, index) => {
            const title = getBlogTitle(post);
            const slug = getBlogSlug(post);
            const excerpt = getBlogExcerpt(post);
            const image = getBlogImage(post);
            const category = getBlogCategory(post);

            return (
              <article
                key={slug + index}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative">
                  <img
                    src={image}
                    alt={title}
                    className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-cyan-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white">
                    {category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">
                      Blog
                    </span>
                    <span className="text-xs font-medium text-emerald-600">
                      {post?.created_at ? post.created_at : 'Fresh'}
                    </span>
                  </div>

                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="line-clamp-1 text-lg font-semibold text-slate-900">
                        {title}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {post?.user?.first_name ? `${post.user.first_name} ${post.user.last_name || ''}`.trim() : 'Editorial team'}
                      </p>
                    </div>
                  </div>

                  <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-600">
                    {excerpt}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                      {post?.comments?.length ?? 0} comments
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                      {post?.tags?.length ?? 0} tags
                    </span>
                  </div>

                  <Link
                    href={`/blog/${encodeURIComponent(slug)}`}
                    className="block w-full rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

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
