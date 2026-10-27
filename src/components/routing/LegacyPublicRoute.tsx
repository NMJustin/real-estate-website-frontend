import type { ComponentType } from 'react'
import { notFound } from 'next/navigation'
import Mission from '@/legacy-pages/About/Mission'
import OurCompany from '@/legacy-pages/About/OurCompany'
import ContactUs from '@/legacy-pages/ContactUs'
import FAQs from '@/legacy-pages/FAQs'
import PropertyValuationRequest from '@/legacy-pages/PropertyValuationRequest'
import RequestViewing from '@/legacy-pages/RequestViewing'
import PropertyDevelopmentMarketing from '@/legacy-pages/Services/PropertyDevelopmentMarketing'
import PropertyLeasing from '@/legacy-pages/Services/PropertyLeasing'
import PropertyManagement from '@/legacy-pages/Services/PropertyManagement'
import PropertyMarketing from '@/legacy-pages/Services/PropertyMarketing'
import PropertyRentals from '@/legacy-pages/Services/PropertyRentals'
import PropertySales from '@/legacy-pages/Services/PropertySales'
import PropertySearchServices from '@/legacy-pages/Services/PropertySearchServices'
import PropertyValuation from '@/legacy-pages/Services/PropertyValuation'
import RealEstateAdvisory from '@/legacy-pages/Services/RealEstateAdvisory'
import RealEstateConsultancy from '@/legacy-pages/Services/RealEstateConsultancy'
import DynamicPage from '@/components/content/DynamicPage'

const staticRoutes: Record<string, ComponentType> = {
  '/about/mission': Mission,
  '/about/our-company': OurCompany,
  '/contact-us': ContactUs,
  '/faqs': FAQs,
  '/property-valuation': PropertyValuationRequest,
  '/request-viewing': RequestViewing,
  '/services/property-development-marketing': PropertyDevelopmentMarketing,
  '/services/property-leasing': PropertyLeasing,
  '/services/property-management': PropertyManagement,
  '/services/property-marketing': PropertyMarketing,
  '/services/property-rentals': PropertyRentals,
  '/services/property-sales': PropertySales,
  '/services/property-search-services': PropertySearchServices,
  '/services/property-valuation': PropertyValuation,
  '/services/real-estate-advisory': RealEstateAdvisory,
  '/services/real-estate-consultancy': RealEstateConsultancy,
}

export function LegacyPublicRoute({ segments }: { segments: string[] }) {
  const path = `/${segments.join('/')}`
  const Page = staticRoutes[path]

  if (Page) return <Page />

  // Check for dynamic pages from database
  if (segments.length === 1) {
    return <DynamicPage slug={segments[0]} />
  }

  notFound()
}
