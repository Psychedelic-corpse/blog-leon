import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'galleryImage',
  title: 'Imágenes',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título (opcional)',
      type: 'string',
      description: 'Breve título o descripción de la imagen.',
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error('La imagen es obligatoria.'),
    }),
    defineField({
      name: 'alt',
      title: 'Texto alternativo (Alt)',
      type: 'string',
      description: 'Descripción para accesibilidad y SEO.',
    }),
    defineField({
      name: 'caption',
      title: 'Nota / Pie de foto (opcional)',
      type: 'text',
      rows: 3,
      description: 'Texto, cita o reflexión que acompaña la imagen al estilo Tumblr.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
  ],

  preview: {
    select: {
      title: 'title',
      caption: 'caption',
      media: 'image',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const {title, caption, media, publishedAt} = selection
      const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : ''
      return {
        title: title || caption || 'Sin título',
        subtitle: formattedDate,
        media,
      }
    },
  },
})
