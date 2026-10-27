import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import ListYourProperty from '@/components/content/ListYourProperty'

export const metadata: Metadata = generatePageMetadata({
  title: 'List Your Property - Ingata Real Estate Rwanda',
  description: 'Submit your property for listing on Ingata Real Estate. We help property owners across Rwanda sell, rent, or lease their properties.',
  path: '/list-your-property',
  keywords: [
    'list property Rwanda',
    'sell property Rwanda',
    'rent property Rwanda',
    'property listing request',
  ],
})

export default function ListYourPropertyPage() {
  return <ListYourProperty />
}
