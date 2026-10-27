import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import MortgageCalculatorContent from '@/components/tools/MortgageCalculatorContent'

export const metadata: Metadata = generatePageMetadata({
  title: 'Mortgage Calculator | Ingata Real Estate Rwanda',
  description: 'Calculate your monthly mortgage payments with our easy-to-use mortgage affordability calculator.',
  path: '/mortgage-calculator',
  keywords: [
    'mortgage calculator',
    'loan calculator',
    'mortgage affordability',
  ],
})

export default function MortgageCalculatorPage() {
  return <MortgageCalculatorContent />
}
