"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { X, Calendar, Camera, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export interface GalleryItem {
  _id: string;
  title?: string;
  caption?: string;
  alt?: string;
  publishedAt?: string;
  tags?: string[];
  image: Record<string, unknown>;
}

export default function ImageGallery({ items }: { items: GalleryItem[] }) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(
      items
        .flatMap((item) => item.tags || [])
        .filter((t): t is string => Boolean(t && t.trim()))
    )
  );

  const filteredItems = activeTag
    ? items.filter((item) => item.tags?.includes(activeTag))
    : items;

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;

      if (e.key === "Escape") {
        setSelectedItem(null);
      } else if (e.key === "ArrowRight") {
        const currentIndex = filteredItems.findIndex((i) => i._id === selectedItem._id);
        if (currentIndex !== -1 && currentIndex < filteredItems.length - 1) {
          const nextItem = filteredItems[currentIndex + 1];
          if (nextItem) setSelectedItem(nextItem);
        }
      } else if (e.key === "ArrowLeft") {
        const currentIndex = filteredItems.findIndex((i) => i._id === selectedItem._id);
        if (currentIndex > 0) {
          const prevItem = filteredItems[currentIndex - 1];
          if (prevItem) setSelectedItem(prevItem);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, filteredItems]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedItem]);

  const currentIndex = selectedItem
    ? filteredItems.findIndex((i) => i._id === selectedItem._id)
    : -1;

  return (
    <div className="space-y-8">
      {/* Tag Filters (Tumblr-style) */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pb-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              activeTag === null
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
            }`}
          >
            Todas ({items.length})
          </button>
          {allTags.map((tag) => {
            const count = items.filter((i) => i.tags?.includes(tag)).length;
            const isActive = activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(isActive ? null : tag)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${
                  isActive
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                }`}
              >
                <span>#{tag}</span>
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Masonry Grid (CSS Columns Tumblr style) */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredItems.map((item) => {
          const imageObj = item.image as {
            asset?: { metadata?: { dimensions?: { width?: number; height?: number } } };
          };
          const dims = imageObj?.asset?.metadata?.dimensions;
          const imgWidth = dims?.width || 800;
          const imgHeight = dims?.height || 600;
          const imageUrl = item.image ? urlForImage(item.image).url() : "";

          return (
            <div
              key={item._id}
              className="break-inside-avoid group relative rounded-xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-[#111111] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300"
            >
              {/* Image Container with click to zoom */}
              <div
                className="relative cursor-zoom-in overflow-hidden bg-neutral-100 dark:bg-neutral-900"
                onClick={() => setSelectedItem(item)}
              >
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={item.alt || item.title || "Fotografía de Leon Di Monte"}
                    width={imgWidth}
                    height={imgHeight}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    priority={false}
                  />
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="bg-black/60 text-white rounded-full p-2 backdrop-blur-sm shadow-sm transform scale-90 group-hover:scale-100 transition-transform">
                    <ZoomIn size={16} />
                  </div>
                </div>
              </div>

              {/* Tumblr-style post card content / caption */}
              {(item.title || item.caption || (item.tags && item.tags.length > 0) || item.publishedAt) && (
                <div className="p-4 space-y-3">
                  {item.title && (
                    <h3 className="font-serif text-base text-neutral-900 dark:text-neutral-100 leading-snug">
                      {item.title}
                    </h3>
                  )}

                  {item.caption && (
                    <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
                      {item.caption}
                    </p>
                  )}

                  {/* Metadata: Date & Tags */}
                  <div className="pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400 dark:text-neutral-500">
                    {item.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar size={11} />
                        <time dateTime={item.publishedAt}>
                          {new Date(item.publishedAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </div>
                    )}

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 ml-auto">
                        {item.tags.map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTag(tag);
                            }}
                            className="inline-flex items-center text-[10px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="py-20 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-8 space-y-3">
          <Camera className="mx-auto h-8 w-8 text-neutral-400 dark:text-neutral-600" />
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            No se encontraron imágenes
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            {activeTag
              ? `No hay imágenes con la etiqueta #${activeTag}.`
              : "Las imágenes publicadas desde el panel de Sanity aparecerán aquí en cuadrícula estilo Tumblr."}
          </p>
          {activeTag && (
            <button
              onClick={() => setActiveTag(null)}
              className="text-xs text-neutral-900 dark:text-neutral-100 underline pt-2"
            >
              Ver todas las imágenes
            </button>
          )}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-5 right-5 z-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors backdrop-blur-sm"
            aria-label="Cerrar vista previa"
          >
            <X size={22} />
          </button>

          {/* Previous image button */}
          {currentIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const prev = filteredItems[currentIndex - 1];
                if (prev) setSelectedItem(prev);
              }}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 sm:p-3 rounded-full transition-colors backdrop-blur-sm"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Next image button */}
          {currentIndex < filteredItems.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const next = filteredItems[currentIndex + 1];
                if (next) setSelectedItem(next);
              }}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 sm:p-3 rounded-full transition-colors backdrop-blur-sm"
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Modal Content Box */}
          <div
            className="max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] w-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlForImage(selectedItem.image).url()}
                alt={selectedItem.alt || selectedItem.title || "Imagen ampliada"}
                className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Info footer in modal */}
            {(selectedItem.title || selectedItem.caption || (selectedItem.tags && selectedItem.tags.length > 0) || selectedItem.publishedAt) && (
              <div className="mt-4 max-w-2xl text-center space-y-2 text-white">
                {selectedItem.title && (
                  <h4 className="font-serif text-lg text-neutral-100 font-medium">
                    {selectedItem.title}
                  </h4>
                )}
                {selectedItem.caption && (
                  <p className="text-xs sm:text-sm text-neutral-300 whitespace-pre-line leading-relaxed">
                    {selectedItem.caption}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-400 pt-1">
                  {selectedItem.publishedAt && (
                    <span>
                      {new Date(selectedItem.publishedAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div className="flex gap-2">
                      {selectedItem.tags.map((tag) => (
                        <span key={tag} className="text-neutral-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
