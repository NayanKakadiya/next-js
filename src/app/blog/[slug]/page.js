import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '../../services/api';


function getBlogTitle(post) {
  return post?.title || post?.name || post?.headline || post?.heading || 'Untitled blog';
}

function getBlogSubtitle(post) {
  return post?.subtitle || post?.summary || post?.excerpt || post?.description || '';
}

function getBlogContent(post) {
  return post?.body || post?.main_content || post?.content || post?.excerpt || post?.description || post?.summary || 'No content available for this article yet.';
}


function getBlogImage(post) {
  return post?.featured_image || post?.image || post?.featuredImage || post?.thumbnail || '';
}

async function getSiteUrl() {
  const requestHeaders = await headers();
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/$/, '');
  }

  const host = requestHeaders.get('host');
  if (host) {
    const forwardedProto = requestHeaders.get('x-forwarded-proto');
    const protocol = forwardedProto?.split(',')[0]?.trim() || (host.includes('localhost') ? 'http' : 'https');
    return `${protocol}://${host}`;
  }

  return 'http://localhost:3000';
}

async function getAbsoluteUrl(value) {
  if (!value) {
    return '';
  }

  try {
    const siteUrl = await getSiteUrl();
    return new URL(value, siteUrl).toString();
  } catch {
    return String(value);
  }
}

function getBlogCategory(post) {
  return post?.category || post?.tag || post?.topic || (Array.isArray(post?.tags) ? post.tags[0] : '') || 'Blog';
}

function getTagLabel(tag) {
  if (!tag && tag !== 0) {
    return '';
  }
  if (typeof tag === 'string' || typeof tag === 'number') {
    return String(tag);
  }
  if (typeof tag === 'object') {
    return tag.name || tag.label || tag.title || String(tag);
  }
  return String(tag);
}

function formatDate(value) {
  if (!value) {
    return 'Recently published';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

async function getBlogBySlug(slug) {
  const post = await getPostBySlug(slug);
  return post ?? undefined;
}

export async function generateMetadata({ params }) {
  const slug = (await params).slug;
  const post = await getBlogBySlug(slug);
  const siteUrl = await getSiteUrl();

  if (!post) {
    return {
      title: 'Blog not found',
      description: 'The requested blog article could not be found.',
    };
  }

  const title = getBlogTitle(post);
  const description = getBlogContent(post);
  const pageUrl = new URL(`/blog/${encodeURIComponent(slug)}`, siteUrl).toString();
  const imageUrl = await getAbsoluteUrl(getBlogImage(post) || '/images/og-blog.png');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: pageUrl,
      images: imageUrl ? [{ url: imageUrl, alt: title }] : [],
      publishedTime: post?.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const slug = (await params).slug;
  const post = await getBlogBySlug(slug);
  const siteUrl = await getSiteUrl();

  if (!post) {
    notFound();
  }

  const title = getBlogTitle(post);
  const subtitle = getBlogSubtitle(post);
  const content = getBlogContent(post);
  const image = getBlogImage(post);
  const category = getBlogCategory(post);
  const authorName = post?.user?.first_name
    ? `${post.user.first_name} ${post.user.last_name || ''}`.trim()
    : 'Editorial team';
  const tags = Array.isArray(post?.tags) ? post.tags : [];
  const commentsCount = Array.isArray(post?.comments) ? post.comments.length : 0;
  const pageUrl = new URL(`/blog/${encodeURIComponent(slug)}`, siteUrl).toString();
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(subtitle || content.slice(0, 120));
  const shareUrl = encodeURIComponent(pageUrl);

  return (
    <main className="flex-1 bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="relative h-72 overflow-hidden sm:h-96">
            {image ? (
              <img src={image} alt={title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-cyan-600 via-slate-800 to-slate-900 text-2xl font-semibold text-white">
                {title}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-100 backdrop-blur">
                {category}
              </span>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-8 p-6 lg:grid-cols-[1.6fr_0.8fr] lg:p-10">
            <article className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                  {authorName}
                </span>
                <span>•</span>
                <span>{formatDate(post?.created_at)}</span>
                <span>•</span>
                <span>{commentsCount} comments</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base leading-8 text-slate-700 sm:p-6">
                <p className="whitespace-pre-line">{content}</p>
              </div>
            </article>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600">
                  About the author
                </p>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">{authorName}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {post?.user?.role || 'Writing insightful stories for curious readers.'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600">
                  Quick facts
                </p>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center justify-between gap-3">
                    <span>Category</span>
                    <span className="font-semibold text-slate-900">{category}</span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span>Published</span>
                    <span className="font-semibold text-slate-900">{formatDate(post?.created_at)}</span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span>Comments</span>
                    <span className="font-semibold text-slate-900">{commentsCount}</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600">
                  Share this article
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-cyan-600 hover:text-cyan-600"
                  >
                    Twitter
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-cyan-600 hover:text-cyan-600"
                  >
                    Facebook
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}&summary=${shareDescription}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-cyan-600 hover:text-cyan-600"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-cyan-600 hover:text-cyan-600"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              {tags.length > 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600">
                    Tags
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag, index) => {
                      const label = getTagLabel(tag);
                      return (
                        <span key={`${label}-${index}`} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                ← Back to blog
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
