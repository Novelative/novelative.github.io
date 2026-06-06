export interface BlogPostSource {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  created_at?: string;
}

const blogPostFiles = import.meta.glob("./blog/posts/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

export const blogPostSources = Object.entries(blogPostFiles)
  .map(([path, markdown]) => parseMarkdownBlogPost(path, markdown))
  .sort((a, b) => getSortableDate(b.created_at) - getSortableDate(a.created_at));

function parseMarkdownBlogPost(path: string, markdown: string): BlogPostSource {
  const { metadata, body } = parseFrontMatter(markdown);
  const fileSlug = slugifyBlogFileName(path);
  const title =
    metadata.title || findFirstHeading(body) || titleCaseFromSlug(fileSlug);
  const content = removeDuplicateTitleHeading(body, title);

  return {
    id: fileSlug,
    title,
    slug: metadata.slug || fileSlug,
    content,
    excerpt: metadata.excerpt,
    created_at: metadata.date || metadata.created_at,
  };
}

function parseFrontMatter(markdown: string) {
  const normalized = String(markdown || "").replace(/\r\n/g, "\n").trim();
  const match = normalized.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);

  if (!match) {
    return { metadata: {} as Record<string, string>, body: normalized };
  }

  const metadata = match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .reduce<Record<string, string>>((fields, line) => {
      const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (!field) return fields;

      fields[field[1].trim()] = stripWrappingQuotes(field[2].trim());
      return fields;
    }, {});

  return {
    metadata,
    body: normalized.slice(match[0].length).trim(),
  };
}

function stripWrappingQuotes(value: string) {
  return value.replace(/^["'](.*)["']$/, "$1").trim();
}

function findFirstHeading(markdown: string) {
  const heading = markdown.match(/^#\s+(.+)$/m);
  return heading ? heading[1].trim() : "";
}

function removeDuplicateTitleHeading(markdown: string, title: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const firstContentIndex = lines.findIndex((line) => line.trim());

  if (firstContentIndex === -1) {
    return "";
  }

  const firstLine = lines[firstContentIndex].trim();
  const heading = firstLine.match(/^#\s+(.+)$/);

  if (!heading || heading[1].trim() !== title) {
    return markdown.trim();
  }

  return lines
    .slice(0, firstContentIndex)
    .concat(lines.slice(firstContentIndex + 1))
    .join("\n")
    .trim();
}

function slugifyBlogFileName(path: string) {
  const fileName = path.split(/[\\/]/).pop() || "post.md";
  return slugifyBlogValue(fileName.replace(/\.md$/i, ""));
}

function titleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function slugifyBlogValue(value: string) {
  return (
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "post"
  );
}

function getSortableDate(value: string | undefined) {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}
