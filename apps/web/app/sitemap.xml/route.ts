import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { groq } from "next-sanity";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

async function getAllPosts() {
  try {
    const query = groq`
      *[_type == "post" && !(_id in path("drafts.**")) && defined(slug.current)] {
        "slug": slug.current,
        _updatedAt,
        publishedAt
      }
    `;
    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
    return [];
  }
}

export async function GET() {
  const posts = await getAllPosts();

  const staticPages = [
    { url: "https://leondm.com", changefreq: "weekly", priority: "1.0" },
    {
      url: "https://leondm.com/blog",
      changefreq: "daily",
      priority: "0.8",
    },
  ];

  const postPages = posts
    .filter((post: any) => Boolean(post?.slug))
    .map((post: any) => ({
      url: `https://leondm.com/blog/${encodeURIComponent(post.slug)}`,
      changefreq: "monthly",
      priority: "0.7",
      lastmod: post._updatedAt || post.publishedAt,
    }));

  const allPages = [...staticPages, ...postPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map((page: any) => {
    let lastmodTag = "";
    if (page.lastmod) {
      try {
        const d = new Date(page.lastmod);
        if (!isNaN(d.getTime())) {
          lastmodTag = `\n    <lastmod>${d.toISOString()}</lastmod>`;
        }
      } catch {
        lastmodTag = "";
      }
    }
    return `  <url>
    <loc>${escapeXml(page.url)}</loc>${lastmodTag}
    <changefreq>${escapeXml(page.changefreq)}</changefreq>
    <priority>${escapeXml(page.priority)}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

