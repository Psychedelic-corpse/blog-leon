import { client } from "../../../sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { Blog, WithContext } from "schema-dts";
import JsonLd from "@/components/JsonLd";
import Image from "next/image";
import { urlForImage } from "../../../sanity/lib/image";
import { notFound } from "next/navigation";

const components = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="relative w-full h-96 my-8">
          <Image
            src={urlForImage(value).url()}
            alt={value.alt || " "}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      );
    },
  },
};

async function getPost(slug: string) {
  const query = groq`
    *[_type == "post" && slug.current == $slug][0] {
      title,
      publishedAt,
      body,
      "author": author->name,
      excerpt
    }
  `;
  return client.fetch(query, { slug });
}

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: `${post.title} - Ivan Barinaga Psicólogo`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} - Ivan Barinaga Psicólogo`,
      description: post.excerpt,
      url: `https://www.ivanbarinaga.com/blog/${slug}`,
      siteName: "Ivan Barinaga Psicólogo",
      images: [
        {
          url: "https://www.ivanbarinaga.com/og-image.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale: "es_AR",
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: any) {
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
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Ivan Barinaga Psicólogo",
      logo: {
        "@type": "ImageObject",
        url: "https://www.ivanbarinaga.com/logo.png",
      },
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <article className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100">
        <header className="w-full px-6 pt-24 pb-16">
          <div className="max-w-screen-xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
              {post.title}
            </h1>
            <div className="flex justify-center items-center space-x-4 text-gray-600 dark:text-gray-400 text-lg">
              <time>
                {new Date(post.publishedAt).toLocaleDateString("es-AR")}
              </time>
              <span>·</span>
              <span>Por {post.author}</span>
            </div>
          </div>
        </header>

        <div className="w-full px-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8 lg:col-start-3">
                <div className="prose dark:prose-invert prose-lg md:prose-xl max-w-none">
                  <PortableText
                    value={post.body}
                    components={{
                      ...components,
                      types: {
                        ...components.types,
                        image: ({ value }: any) => {
                          if (!value?.asset?._ref) {
                            return null;
                          }
                          return (
                            <div className="my-12">
                              <div className="relative aspect-[16/9]">
                                <Image
                                  src={urlForImage(value).url()}
                                  alt={value.alt || " "}
                                  fill
                                  className="object-cover rounded-xl shadow-2xl"
                                  priority
                                />
                              </div>
                            </div>
                          );
                        },
                      },
                      block: {
                        normal: ({ children }) => (
                          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                            {children}
                          </p>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-3xl font-bold mt-12 mb-6">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-2xl font-bold mt-8 mb-4">
                            {children}
                          </h3>
                        ),
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-24 bg-gradient-to-t from-white dark:from-[#0A0A0A] to-transparent mt-24" />
      </article>
    </>
  );
}
