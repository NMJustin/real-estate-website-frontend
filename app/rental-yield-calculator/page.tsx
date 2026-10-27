import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import RentalYieldCalculatorContent from '@/components/tools/RentalYieldCalculatorContent'

export const metadata: Metadata = generatePageMetadata({
  title: 'Rental Yield Calculator | Ingata Real Estate Rwanda',
  description: 'Calculate rental yield on investment properties with our rental yield calculator.',
  path: '/rental-yield-calculator',
  keywords: [
    'rental yield calculator',
    'property investment',
    'rental return',
  ],
})

export default function RentalYieldCalculatorPage() {
  return <RentalYieldCalculatorContent />
}
