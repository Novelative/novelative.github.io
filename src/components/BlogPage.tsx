import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ParticleCanvas, reveal } from "./shared";

interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  formattedDate: string;
  readTime: string;
}

const blogAuthorName = "Moogstir";
const blogAuthorRole = "Developer & Writer";

export function BlogPage() {
  const shouldReduceMotion = useReducedMotion();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    title: string;
    body: string;
    type: "empty" | "error" | "warning";
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadBlogPosts() {
      setLoading(true);
      setStatus(null);

      try {
        const response = await fetch("/api/posts", {
          headers: { Accept: "application/json" },
        });
        const text = await response.text();
        const payload = text ? JSON.parse(text) : null;

        if (!response.ok) {
          throw new Error(
            payload?.error || "The blog API returned an unexpected response.",
          );
        }

        const rows = Array.isArray(payload?.posts)
          ? payload.posts
          : Array.isArray(payload)
            ? payload
            : [];
        const normalized = normalizeBlogPosts(rows);

        if (cancelled) return;

        if (!normalized.length) {
          setPosts([]);
          setSelectedSlug(null);
          setStatus({
            title: "No posts found yet",
            body: "Add a row to your Supabase posts table and it will appear here automatically.",
            type: "empty",
          });
          return;
        }

        const requestedSlug = getBlogRequestedSlug();
        const selectedPost =
          normalized.find((post) => post.slug === requestedSlug) ||
          normalized[0];

        setPosts(normalized);
        setSelectedSlug(selectedPost.slug);

        if (requestedSlug && requestedSlug !== selectedPost.slug) {
          setStatus({
            title: "That post was not found.",
            body: "Showing the latest post instead.",
            type: "warning",
          });
          syncBlogUrl(selectedPost.slug, "replace", false);
        }
      } catch (error) {
        if (cancelled) return;
        setPosts([]);
        setSelectedSlug(null);
        setStatus({
          title: "Blog connection issue",
          body:
            error instanceof Error
              ? error.message
              : "The site could not load posts from the blog API right now.",
          type: "error",
        });
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBlogPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!posts.length || !selectedSlug) return;

    const selectedPost = posts.find((post) => post.slug === selectedSlug);
    document.title = selectedPost
      ? `${selectedPost.title} | Novelative Blog`
      : "Blog | Novelative";
  }, [posts, selectedSlug]);

  useEffect(() => {
    if (!posts.length) return;

    const handlePopState = () => {
      const requestedSlug = getBlogRequestedSlug();
      const post =
        posts.find((item) => item.slug === requestedSlug) || posts[0];
      setSelectedSlug(post.slug);

      if (window.location.hash === "#post-detail") {
        window.requestAnimationFrame(() => {
          document
            .getElementById("post-detail")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [posts]);

  const featuredPost = posts[0] || null;
  const selectedPost =
    posts.find((post) => post.slug === selectedSlug) || featuredPost;
  const otherPosts = featuredPost
    ? posts.filter((post) => post.slug !== featuredPost.slug)
    : [];

  const selectPost = (slug: string, scrollToArticle = false) => {
    const post = posts.find((item) => item.slug === slug);
    if (!post) return;
    setSelectedSlug(post.slug);
    syncBlogUrl(post.slug, "push", scrollToArticle);
    if (scrollToArticle) {
      window.requestAnimationFrame(() => {
        document
          .getElementById("post-detail")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <section className="blog-page">
      {!shouldReduceMotion && <ParticleCanvas />}
      <div className="container blog-page-inner">
        <motion.div
          className="blog-hero-copy"
          initial="hidden"
          animate="show"
          variants={reveal}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1>
            The <span>Novelative</span> Blog
          </h1>
          <p>
            Exploring the craft of storytelling and the tools that bring worlds
            to life.
          </p>
        </motion.div>

        {status && status.type === "warning" && (
          <div className="blog-status warning">
            <strong>{status.title}</strong> {status.body}
          </div>
        )}

        {loading && <BlogLoadingCard />}

        {!loading && status && status.type !== "warning" && (
          <section className={`blog-empty-state ${status.type}`}>
            <p className="eyebrow">Blog Status</p>
            <h2>{status.title}</h2>
            <p>{status.body}</p>
          </section>
        )}

        {!loading && featuredPost && selectedPost && (
          <>
            <BlogOverview
              posts={posts}
              selectedPost={selectedPost}
              onSelect={selectPost}
            />
            <FeaturedBlogPost
              post={featuredPost}
              selectedSlug={selectedPost.slug}
              onSelect={selectPost}
            />
            {otherPosts.length > 0 && (
              <BlogGrid
                posts={otherPosts}
                selectedSlug={selectedPost.slug}
                onSelect={selectPost}
              />
            )}
            <BlogArticle post={selectedPost} />
          </>
        )}
      </div>
    </section>
  );
}

function BlogLoadingCard() {
  return (
    <section className="blog-loading-card">
      <div className="blog-loading-visual" />
      <div className="blog-loading-copy">
        <div className="skeleton-text w-32 mb-4" />
        <div className="skeleton-text w-full mb-3" />
        <div className="skeleton-text w-4/5 mb-8" />
        <div className="skeleton-text w-full mb-3" />
        <div className="skeleton-text w-11/12 mb-3" />
        <div className="skeleton-text w-3/4" />
      </div>
    </section>
  );
}

function BlogOverview({
  posts,
  selectedPost,
  onSelect,
}: {
  posts: BlogPost[];
  selectedPost: BlogPost;
  onSelect: (slug: string, scrollToArticle?: boolean) => void;
}) {
  return (
    <section className="blog-overview">
      <div className="blog-archive-panel">
        <p className="eyebrow">Blog Archive</p>
        <h2>Browse every post without leaving the page</h2>
        <p>
          New entries load from the live blog feed, and the archive below lets
          readers jump between articles instantly.
        </p>
        <div className="blog-jump-list">
          {posts.map((post) => (
            <button
              type="button"
              className={post.slug === selectedPost.slug ? "active" : ""}
              onClick={() => onSelect(post.slug)}
              key={post.slug}
            >
              {post.title}
            </button>
          ))}
        </div>
      </div>
      <div className="blog-stats-grid">
        <BlogStat label="Total Posts" value={String(posts.length)} />
        <BlogStat label="Latest Update" value={posts[0]?.formattedDate || ""} />
        <BlogStat label="Current Article" value={selectedPost.title} />
      </div>
    </section>
  );
}

function BlogStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="blog-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FeaturedBlogPost({
  post,
  selectedSlug,
  onSelect,
}: {
  post: BlogPost;
  selectedSlug: string;
  onSelect: (slug: string, scrollToArticle?: boolean) => void;
}) {
  return (
    <section className="featured-blog-section">
      <div
        className={`featured-blog-card ${
          selectedSlug === post.slug ? "selected" : ""
        }`}
      >
        <div className="featured-blog-visual">
          <span>Featured Post</span>
          <div>
            <p>Latest entry</p>
            <h2>{post.title}</h2>
          </div>
          <small>{post.readTime}</small>
        </div>
        <div className="featured-blog-copy">
          <div>{post.formattedDate} - By {blogAuthorName}</div>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <button type="button" onClick={() => onSelect(post.slug, true)}>
            Read Full Article
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

function BlogGrid({
  posts,
  selectedSlug,
  onSelect,
}: {
  posts: BlogPost[];
  selectedSlug: string;
  onSelect: (slug: string, scrollToArticle?: boolean) => void;
}) {
  return (
    <section className="blog-grid-section">
      <div className="blog-grid-heading">
        <div>
          <p className="eyebrow">Recent Posts</p>
          <h2>More from Novelative</h2>
        </div>
        <p>
          Explore our full archive of world-building advice, creative workflow
          experiments, and the newest tools we're building for authors.
        </p>
      </div>
      <div className="blog-card-grid">
        {posts.map((post) => (
          <article
            className={`blog-post-card ${
              post.slug === selectedSlug ? "active" : ""
            }`}
            key={post.slug}
          >
            <div>
              <span>{post.formattedDate}</span>
              <span>{post.readTime}</span>
            </div>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <button type="button" onClick={() => onSelect(post.slug, true)}>
              Read more
              <ArrowRight size={15} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <section id="post-detail" className="blog-detail-section">
      <article>
        <header>
          <div className="blog-article-meta">
            <span>Blog Post</span>
            <small>
              {post.formattedDate} - {post.readTime}
            </small>
          </div>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="blog-author-row">
            <img src="/assets/moogstir.png" alt="Author" />
            <div>
              <strong>{blogAuthorName}</strong>
              <span>{blogAuthorRole}</span>
            </div>
          </div>
        </header>
        <div
          className="blog-content blog-readable"
          dangerouslySetInnerHTML={{ __html: renderBlogMarkdown(post.content) }}
        />
      </article>
    </section>
  );
}

function normalizeBlogPosts(rows: unknown[]) {
  const usedSlugs = new Set<string>();

  return rows
    .map((row, index) => normalizeBlogPost(row, index, usedSlugs))
    .filter((post): post is BlogPost => Boolean(post));
}

function normalizeBlogPost(
  row: unknown,
  index: number,
  usedSlugs: Set<string>,
) {
  if (!row || typeof row !== "object") {
    return null;
  }

  const record = row as Record<string, unknown>;
  const title =
    typeof record.title === "string" && record.title.trim()
      ? record.title.trim()
      : `Untitled Post ${index + 1}`;
  const content =
    typeof record.content === "string" ? record.content.trim() : "";
  const manualExcerpt =
    typeof record.excerpt === "string" ? record.excerpt.trim() : "";
  const createdAt = parseBlogDate(record.created_at);
  const baseSlug = slugifyBlogPost(record.slug || title || `post-${index + 1}`);
  const slug = makeUniqueBlogSlug(baseSlug, usedSlugs);
  const plainText = stripBlogMarkdown(content || title);

  return {
    id:
      typeof record.id === "string" || typeof record.id === "number"
        ? record.id
        : slug,
    title,
    slug,
    content,
    excerpt: manualExcerpt || createBlogExcerpt(plainText),
    formattedDate: formatBlogDate(createdAt),
    readTime: estimateBlogReadTime(plainText),
  };
}

function parseBlogDate(value: unknown) {
  const parsed =
    typeof value === "string" || typeof value === "number"
      ? new Date(value)
      : new Date();
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function formatBlogDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function estimateBlogReadTime(text: string) {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 220));
  return `${minutes} min read`;
}

function slugifyBlogPost(value: unknown) {
  return (
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "post"
  );
}

function makeUniqueBlogSlug(baseSlug: string, usedSlugs: Set<string>) {
  let slug = baseSlug;
  let counter = 2;

  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  usedSlugs.add(slug);
  return slug;
}

function createBlogExcerpt(text: string) {
  const compact = text.replace(/\s+/g, " ").trim();

  if (!compact) {
    return "This post does not have a body yet.";
  }

  if (compact.length <= 190) {
    return compact;
  }

  return `${compact.slice(0, 187).trimEnd()}...`;
}

function getBlogRequestedSlug() {
  return new URLSearchParams(window.location.search).get("slug");
}

function syncBlogUrl(
  slug: string,
  mode: "push" | "replace",
  includeHash: boolean,
) {
  const url = new URL(window.location.href);
  url.pathname = "/blog";
  url.searchParams.set("slug", slug);
  url.hash = includeHash ? "post-detail" : "";

  if (mode === "push") {
    window.history.pushState({}, "", url);
    return;
  }

  window.history.replaceState({}, "", url);
}

function renderBlogMarkdown(markdown: string) {
  const normalized = String(markdown || "")
    .replace(/\r\n/g, "\n")
    .trim();

  if (!normalized) {
    return "<p>This post does not have any content yet.</p>";
  }

  return normalized
    .split(/```/)
    .map((segment, index) => {
      if (index % 2 === 1) {
        return renderBlogCodeFence(segment);
      }

      return segment
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map(renderBlogMarkdownBlock)
        .join("");
    })
    .join("");
}

function renderBlogCodeFence(block: string) {
  const lines = block.replace(/^\n+|\n+$/g, "").split("\n");
  const maybeLanguage = lines[0]?.trim() || "";
  const codeLines =
    maybeLanguage && /^[a-z0-9_+-]+$/i.test(maybeLanguage)
      ? lines.slice(1)
      : lines;

  return `<pre><code>${escapeBlogHtml(codeLines.join("\n"))}</code></pre>`;
}

function renderBlogMarkdownBlock(block: string) {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const firstLine = lines[0] || "";

  if (/^###\s+/.test(firstLine) && lines.length === 1) {
    return `<h3>${renderBlogInline(firstLine.replace(/^###\s+/, ""))}</h3>`;
  }

  if (/^##\s+/.test(firstLine) && lines.length === 1) {
    return `<h2>${renderBlogInline(firstLine.replace(/^##\s+/, ""))}</h2>`;
  }

  if (/^#\s+/.test(firstLine) && lines.length === 1) {
    return `<h1>${renderBlogInline(firstLine.replace(/^#\s+/, ""))}</h1>`;
  }

  if (lines.length === 1 && /^---+$/.test(firstLine)) {
    return "<hr />";
  }

  if (lines.every((line) => /^[-*]\s+/.test(line))) {
    const items = lines
      .map((line) => `<li>${renderBlogInline(line.replace(/^[-*]\s+/, ""))}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  }

  if (lines.every((line) => /^\d+\.\s+/.test(line))) {
    const items = lines
      .map((line) => `<li>${renderBlogInline(line.replace(/^\d+\.\s+/, ""))}</li>`)
      .join("");
    return `<ol>${items}</ol>`;
  }

  if (lines.every((line) => /^>\s?/.test(line))) {
    return `<blockquote>${lines
      .map((line) => renderBlogInline(line.replace(/^>\s?/, "")))
      .join("<br />")}</blockquote>`;
  }

  return `<p>${lines.map((line) => renderBlogInline(line)).join("<br />")}</p>`;
}

function renderBlogInline(text: string) {
  const placeholders: string[] = [];
  let output = escapeBlogHtml(text);

  output = output.replace(/`([^`]+)`/g, (_, code: string) =>
    stashBlogPlaceholder(placeholders, `<code>${escapeBlogHtml(code)}</code>`),
  );

  output = output.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    (_, label: string, url: string) =>
      stashBlogPlaceholder(
        placeholders,
        `<a href="${escapeBlogAttribute(url)}" target="_blank" rel="noreferrer">${escapeBlogHtml(label)}</a>`,
      ),
  );

  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  output = output.replace(/_([^_]+)_/g, "<em>$1</em>");

  return restoreBlogPlaceholders(output, placeholders);
}

function stashBlogPlaceholder(placeholders: string[], html: string) {
  const token = `@@BLOGTOKEN${placeholders.length}@@`;
  placeholders.push(html);
  return token;
}

function restoreBlogPlaceholders(text: string, placeholders: string[]) {
  return text.replace(/@@BLOGTOKEN(\d+)@@/g, (_, index: string) => {
    return placeholders[Number(index)] || "";
  });
}

function stripBlogMarkdown(text: string) {
  return String(text || "")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[`*_>#-]/g, " ")
    .replace(/\d+\.\s+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeBlogHtml(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeBlogAttribute(value: string) {
  return String(value).replace(/"/g, "&quot;");
}
