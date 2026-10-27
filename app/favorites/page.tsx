import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import FavoritesContent from '@/components/tools/FavoritesContent'

export const metadata: Metadata = generatePageMetadata({
  title: 'Saved Properties | Ingata Real Estate Rwanda',
  description: 'View and manage your saved favorite properties on Ingata Real Estate.',
  path: '/favorites',
  keywords: [
    'saved properties',
    'favorites',
    'property wishlist',
  ],
})

export default function FavoritesPage() {
  return <FavoritesContent />
}
