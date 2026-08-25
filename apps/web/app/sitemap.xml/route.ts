import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { groq } from "next-sanity";

async function getAllPosts() {
  const posts = await client.fetch(groq`*[_type == "post"]`);
  return posts;
}

export async function GET() {
  // Fetch dynamic routes, e.g., blog posts
  const posts = await getAllPosts();

  // Define static routes
  const staticPages = [
    { url: "https://leondm.com/", changefreq: "weekly", priority: 1.0 },
    {
      url: "https://leondm.com/blog",
      changefreq: "daily",
      priority: 0.8,
    },
  ];

  // Combine static and dynamic routes
  const allPages = [
    ...staticPages,
    ...posts.map((post: any) => ({
      url: `https://leondm.com/blog/${post.slug.current}`,
      changefreq: "never",
      priority: 0.7,
    })),
  ];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allPages
      .map(
        ({ url, changefreq, priority }) => `
        <url>
          <loc>${url}</loc>
          <changefreq>${changefreq}</changefreq>
          <priority>${priority}</priority>
        </url>
      `
      )
      .join("")}
  </urlset>`;

  // Return the sitemap as a response
  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
