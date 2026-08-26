import Link from "next/link";
import { client } from "../../../sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { Blog, WithContext } from "schema-dts";
import JsonLd from "@/components/JsonLd";
import Image from "next/image";
import { urlForImage } from "../../../sanity/lib/image";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPost(slug: string) {
  const query = groq`
    *[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      title,
      publishedAt,
      body,
      "author": author->name,
      excerpt,
      mainImage,
      "categories": categories[]->title
    }
  `;
  return client.fetch(query, { slug });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Escrito no encontrado" };
  }

  return {
    title: `${post.title} · Leon Di Monte`,
    description: post.excerpt || "Escrito por Leon Di Monte",
    openGraph: {
      title: `${post.title} · Leon Di Monte`,
      description: post.excerpt || "Escrito por Leon Di Monte",
      url: `https://leondm.com/blog/${slug}`,
      siteName: "Leon Di Monte",
      locale: "es_ES",
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd: WithContext<Blog> = {
    "@context": "https://schema.org",
    "@type": "Blog",
    headline: post.title,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author || "Leon Di Monte",
    },
    publisher: {
      "@type": "Organization",
      name: "Leon Di Monte",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <article className="max-w-3xl mx-auto py-12 md:py-16 space-y-12">
        {/* Top navigation */}
        <div>
          <Link
            href="/blog"
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            ← Volver a escritos
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4 border-b border-neutral-200/80 dark:border-neutral-800/80 pb-8">
          <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            {post.categories && post.categories[0] && (
              <>
                <span>·</span>
                <span className="uppercase tracking-wider text-[10px]">
                  {post.categories[0]}
                </span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.15]">
            {post.title}
          </h1>

          {post.author && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 pt-1">
              Por {post.author}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {post.mainImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-900">
            <Image
              src={urlForImage(post.mainImage).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Body Content */}
        <div className="prose prose-neutral dark:prose-invert prose-lg max-w-none leading-relaxed text-neutral-800 dark:text-neutral-200 font-sans">
          <PortableText
            value={post.body}
            components={{
              types: {
                image: ({ value }: any) => {
                  if (!value?.asset?._ref) return null;
                  return (
                    <figure className="my-8">
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-900">
                        <Image
                          src={urlForImage(value).url()}
                          alt={value.alt || "Imagen del artículo"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {value.alt && (
                        <figcaption className="text-center text-xs text-neutral-500 mt-2 italic">
                          {value.alt}
                        </figcaption>
                      )}
                    </figure>
                  );
                },
              },
              block: {
                normal: ({ children }) => (
                  <p className="text-base sm:text-lg leading-relaxed text-neutral-700 dark:text-neutral-300 mb-6">
                    {children}
                  </p>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl sm:text-3xl font-serif font-normal text-neutral-900 dark:text-neutral-100 mt-12 mb-6">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl sm:text-2xl font-serif font-normal text-neutral-900 dark:text-neutral-100 mt-8 mb-4">
                    {children}
                  </h3>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-neutral-300 dark:border-neutral-700 pl-4 my-6 italic text-neutral-600 dark:text-neutral-400">
                    {children}
                  </blockquote>
                ),
              },
              marks: {
                link: ({ value, children }: any) => {
                  const href = value?.href || "";
                  const isExternal = /^https?:\/\//i.test(href);
                  const isSafeScheme =
                    /^https?:\/\//i.test(href) ||
                    /^mailto:/i.test(href) ||
                    /^tel:/i.test(href) ||
                    href.startsWith("/") ||
                    href.startsWith("#");

                  if (!isSafeScheme) {
                    return <span>{children}</span>;
                  }

                  if (isExternal) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 decoration-neutral-400 hover:decoration-neutral-900 dark:hover:decoration-neutral-100 transition-colors"
                      >
                        {children}
                      </a>
                    );
                  }

                  return (
                    <Link
                      href={href}
                      className="underline underline-offset-4 decoration-neutral-400 hover:decoration-neutral-900 dark:hover:decoration-neutral-100 transition-colors"
                    >
                      {children}
                    </Link>
                  );
                },
              },
            }}
          />
        </div>

        {/* Article Footer */}
        <footer className="pt-12 border-t border-neutral-200/80 dark:border-neutral-800/80 flex justify-between items-center text-xs text-neutral-500">
          <Link
            href="/blog"
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            ← Volver a todos los escritos
          </Link>
          <span className="italic font-serif text-neutral-400">
            Leon Di Monte
          </span>
        </footer>
      </article>
    </>
  );
}
