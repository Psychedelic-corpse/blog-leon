import Link from "next/link";
import { client } from "../../sanity/lib/client";
import { groq } from "next-sanity";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { ArrowRight, Feather } from "lucide-react";

export const metadata = {
  title: "Escritos",
  description: "Archivo de artículos, lecturas y ensayos de Leon Di Monte.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPosts(page = 1, pageSize = 12) {
  try {
    const safePage = Math.max(1, Math.floor(Number(page) || 1));
    const skip = (safePage - 1) * pageSize;
    const query = groq`
      *[_type == "post" && !(_id in path("drafts.**")) && defined(slug.current)] | order(publishedAt desc) [${skip}...${skip + pageSize}] {
        _id,
        title,
        slug,
        publishedAt,
        excerpt,
        mainImage,
        "categories": categories[]->title
      }
    `;
    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

async function getTotalPosts() {
  try {
    const query = groq`count(*[_type == "post" && !(_id in path("drafts.**")) && defined(slug.current)])`;
    return await client.fetch(query);
  } catch (error) {
    return 0;
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const rawPage = Number(resolvedSearchParams?.page);
  const pageNumber = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const pageSize = 12;
  const totalPosts = await getTotalPosts();
  const totalPages = Math.max(1, Math.ceil(totalPosts / pageSize));
  const posts = await getPosts(pageNumber, pageSize);

  return (
    <div className="max-w-3xl mx-auto py-12 md:py-16 space-y-12">
      <header className="space-y-3 border-b border-neutral-200/80 dark:border-neutral-800/80 pb-6">
        <h1 className="text-3xl font-serif tracking-tight text-neutral-900 dark:text-neutral-100 font-normal">
          Escritos
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Ensayos, notas y reflexiones archivadas cronológicamente.
        </p>
      </header>

      {posts && posts.length > 0 ? (
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {posts.map((post: any) => (
            <article
              key={post._id || post.slug?.current}
              className="py-8 first:pt-0 last:pb-0 group"
            >
              <Link href={`/blog/${post.slug?.current}`} className="block space-y-3">
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

                <h2 className="text-xl sm:text-2xl font-serif text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  {post.title}
                </h2>

                {post.mainImage && (
                  <div className="relative aspect-[21/9] w-full overflow-hidden rounded-md my-4 bg-neutral-100 dark:bg-neutral-900">
                    <Image
                      src={urlForImage(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-[1.01] transition-transform duration-300"
                    />
                  </div>
                )}

                {post.excerpt && (
                  <p className="text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                <div className="pt-2 text-xs font-medium text-neutral-900 dark:text-neutral-200 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Leer escrito <ArrowRight size={12} />
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg p-8 space-y-3">
          <Feather className="mx-auto h-8 w-8 text-neutral-400 dark:text-neutral-600" />
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Aún no hay publicaciones
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            Los escritos que publiques desde tu panel aparecerán en esta sección.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <nav className="flex justify-between items-center pt-8 border-t border-neutral-200/80 dark:border-neutral-800/80 text-xs font-medium text-neutral-600 dark:text-neutral-400">
          {pageNumber > 1 ? (
            <Link
              href={`?page=${pageNumber - 1}`}
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              ← Anteriores
            </Link>
          ) : (
            <span />
          )}
          <span>
            Página {pageNumber} de {totalPages}
          </span>
          {pageNumber < totalPages ? (
            <Link
              href={`?page=${pageNumber + 1}`}
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Siguientes →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
