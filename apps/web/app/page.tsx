import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Feather } from "lucide-react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { urlForImage } from "@/sanity/lib/image";

export const metadata = {
  title: "Leon Di Monte",
  description: "Espacio personal y escritos de Leon Di Monte. Ensayos, notas y reflexiones.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getRecentPosts() {
  try {
    const query = groq`
      *[_type == "post"] | order(publishedAt desc) [0...6] {
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

export default async function Home() {
  const posts = await getRecentPosts();

  return (
    <>
      <SpeedInsights />
      <Analytics />
      <div className="max-w-3xl mx-auto py-12 md:py-20 space-y-20">
        {/* Hero / Intro */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-neutral-900 dark:text-neutral-50 font-normal">
              Leon Di Monte
            </h1>
            <p className="text-lg sm:text-xl font-serif italic text-neutral-600 dark:text-neutral-400">
              «El núcleo del hombre yace nacarado y soluble»
            </p>
          </div>

          <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-8 w-24" />

          <p className="text-base sm:text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
            Un espacio de escritura libre, lecturas y reflexiones sobre diversos temas.
            Pensamientos volcados con calma y tiempo.
          </p>
        </section>

        {/* Recent Writings */}
        <section className="space-y-10">
          <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 pb-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Escritos recientes
            </h2>
            <Link
              href="/blog"
              className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors inline-flex items-center gap-1"
            >
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          {posts && posts.length > 0 ? (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {posts.map((post: any) => (
                <article
                  key={post._id || post.slug?.current}
                  className="py-8 first:pt-0 last:pb-0 group"
                >
                  <Link
                    href={`/blog/${post.slug?.current}`}
                    className="block space-y-3"
                  >
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

                    <h3 className="text-xl sm:text-2xl font-serif text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                      {post.title}
                    </h3>

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
                Los textos publicados desde el panel de redacción aparecerán automáticamente aquí.
              </p>
            </div>
          )}
        </section>

        {/* Simple About Section */}
        <section className="pt-8 border-t border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Sobre este rincón
          </h2>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Un cuaderno digital personal concebido para perdurar, libre de algoritmos y ruido.
            Artículos, notas y ensayos archivados para su lectura sosegada.
          </p>
        </section>
      </div>
    </>
  );
}
