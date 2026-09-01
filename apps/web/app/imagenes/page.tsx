import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import ImageGallery, { GalleryItem } from "@/components/ImageGallery";

export const metadata = {
  title: "Imágenes",
  description: "Galería visual, fragmentos y fotografías de Leon Di Monte.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getGalleryImages(): Promise<GalleryItem[]> {
  try {
    const query = groq`
      *[_type == "galleryImage"] | order(publishedAt desc) {
        _id,
        title,
        caption,
        alt,
        publishedAt,
        tags,
        image {
          ...,
          asset-> {
            _id,
            url,
            metadata {
              dimensions {
                width,
                height,
                aspectRatio
              },
              lqip
            }
          }
        }
      }
    `;
    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching gallery images from Sanity:", error);
    return [];
  }
}

export default async function ImagenesPage() {
  const images = await getGalleryImages();

  return (
    <div className="max-w-5xl mx-auto py-12 md:py-16 space-y-10">
      {/* Page Header */}
      <header className="space-y-3 border-b border-neutral-200/80 dark:border-neutral-800/80 pb-6">
        <h1 className="text-3xl font-serif tracking-tight text-neutral-900 dark:text-neutral-100 font-normal">
          Imágenes
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Fragmentos visuales, capturas y notas al margen en formato libre.
        </p>
      </header>

      {/* Masonry Image Gallery */}
      <ImageGallery items={images} />
    </div>
  );
}
