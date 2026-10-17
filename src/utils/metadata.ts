import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ingata-real-estate.com'

interface PropertyMetadataParams {
  title: string
  description?: string
  imageUrl?: string
  price?: string | number
  location?: string
  propertyType?: string
  transactionType?: string
  slug: string
}

export function generatePropertyMetadata(params: PropertyMetadataParams): Metadata {
  const {
    title,
    description,
    imageUrl,
    price,
    location,
    propertyType,
    transactionType,
    slug,
  } = params

  const formattedPrice = price
    ? typeof price === 'number'
      ? `RWF ${price.toLocaleString()}`
      : price
    : 'Price on request'

  const metaDescription =
    description ||
    `${transactionType || ''} ${propertyType || ''} in ${location || 'Rwanda'} - ${title}. ${formattedPrice}. View this property on Ingata Real Estate.`

  const metaTitle = `${title} | ${transactionType || ''} ${propertyType || ''} in ${location || 'Rwanda'}`

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      'real estate Rwanda',
      title,
      location || 'Rwanda',
      propertyType || 'property',
      transactionType || 'real estate',
      'properties for sale',
      'properties for rent',
      'Ingata Real Estate',
    ],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `${baseUrl}/properties/${slug}`,
      title: metaTitle,
      description: metaDescription,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [
            {
              url: '/images/wp4110652.jpg',
              width: 1200,
              height: 630,
              alt: 'Ingata Real Estate',
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: imageUrl ? [imageUrl] : ['/images/wp4110652.jpg'],
    },
    alternates: {
      canonical: `${baseUrl}/properties/${slug}`,
    },
  }
}

export function generatePageMetadata(params: {
  title: string
  description: string
  path: string
  keywords?: string[]
  imageUrl?: string
}): Metadata {
  const { title, description, path, keywords, imageUrl } = params

  return {
    title,
    description,
    keywords: keywords || ['real estate Rwanda', 'Ingata Real Estate', 'properties Rwanda'],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `${baseUrl}${path}`,
      title,
      description,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [
            {
              url: '/images/wp4110652.jpg',
              width: 1200,
              height: 630,
              alt: 'Ingata Real Estate',
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : ['/images/wp4110652.jpg'],
    },
    alternates: {
      canonical: `${baseUrl}${path}`,
    },
  }
}
