import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'gallery',
  title: 'Fotogalerie',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nazev galerie',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Popis galerie',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'images',
      title: 'Fotografie (max. 24)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt text (popis)',
              type: 'string',
              description: 'Popis pro pristupnost a SEO',
            },
            {
              name: 'caption',
              title: 'Titulek fotky',
              type: 'string',
            },
          ],
        },
      ],
      validation: (Rule) =>
        Rule.max(24).error('Maximalne 24 fotografii na galerii'),
    }),
  ],
})