import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import Image from 'next/image'

const galleryQuery = groq`
*[_type == "gallery" && slug.current == $slug][0]{
  title,
  description,
  "images": images[0..23]{
    ...,
    asset->{
      _id,
      url,
      metadata
    }
  }
}
`

export default async function GalleryPage({
  params,
}: {
  params: { slug: string }
}) {
  const gallery = await client.fetch(galleryQuery, { slug: params.slug })

  if (!gallery) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-center text-gray-500">Galerie nebyla nalezena.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{gallery.title}</h1>
        {gallery.description && (
          <p className="text-lg text-gray-600 whitespace-pre-wrap">
            {gallery.description}
          </p>
        )}
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {gallery.images?.map((image: any) => (
          <figure
            key={image.asset._id}
            className="relative w-full overflow-hidden rounded-lg bg-gray-200"
          >
            <div className="relative w-full pb-[100%]">
              <Image
                src={image.asset.url}
                alt={image.alt || 'Fotka'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            {image.caption && (
              <figcaption className="bg-white p-2 text-sm text-gray-700">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {gallery.images && gallery.images.length > 0 && (
        <p className="text-center mt-8 text-gray-500 text-sm">
          Fotografie: {gallery.images.length} / 24
        </p>
      )}
    </main>
  )
}

export async function generateStaticParams() {
  const galleries = await client.fetch(
    groq`*[_type == "gallery"]{ slug }`
  )
  return galleries.map((g: any) => ({
    slug: g.slug.current,
  }))
}