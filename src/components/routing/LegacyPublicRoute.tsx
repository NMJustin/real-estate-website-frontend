import type { ComponentType } from 'react'
import { notFound } from 'next/navigation'
import Mission from '@/legacy-pages/About/Mission'
import OurCompany from '@/legacy-pages/About/OurCompany'
import ContactUs from '@/legacy-pages/ContactUs'
import FAQs from '@/legacy-pages/FAQs'
import CookiePolicy from '@/legacy-pages/Legal/CookiePolicy'
import PrivacyPolicy from '@/legacy-pages/Legal/PrivacyPolicy'
import PropertyDisclaimer from '@/legacy-pages/Legal/PropertyDisclaimer'
import TermsAndConditions from '@/legacy-pages/Legal/TermsAndConditions'
import PropertyValuationRequest from '@/legacy-pages/PropertyValuationRequest'
import RequestViewing from '@/legacy-pages/RequestViewing'
import Apartments from '@/legacy-pages/Properties/Apartments'
import Commercial from '@/legacy-pages/Properties/Commercial'
import ForLease from '@/legacy-pages/Properties/ForLease'
import ForRent from '@/legacy-pages/Properties/ForRent'
import ForSale from '@/legacy-pages/Properties/ForSale'
import Houses from '@/legacy-pages/Properties/Houses'
import Land from '@/legacy-pages/Properties/Land'
import NewDevelopments from '@/legacy-pages/Properties/NewDevelopments'
import Offices from '@/legacy-pages/Properties/Offices'
import Residential from '@/legacy-pages/Properties/Residential'
import Warehouses from '@/legacy-pages/Properties/Warehouses'
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
  '/cookie-policy': CookiePolicy,
  '/faqs': FAQs,
  '/legal/cookie-policy': CookiePolicy,
  '/legal/privacy-policy': PrivacyPolicy,
  '/legal/property-listing-disclaimer': PropertyDisclaimer,
  '/legal/terms-and-conditions': TermsAndConditions,
  '/privacy-policy': PrivacyPolicy,
  '/properties/apartments': Apartments,
  '/properties/commercial': Commercial,
  '/properties/for-lease': ForLease,
  '/properties/for-rent': ForRent,
  '/properties/for-sale': ForSale,
  '/properties/houses': Houses,
  '/properties/land': Land,
  '/properties/new-developments': NewDevelopments,
  '/properties/offices': Offices,
  '/properties/residential': Residential,
  '/properties/warehouses': Warehouses,
  '/property-disclaimer': PropertyDisclaimer,
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
  '/terms-and-conditions': TermsAndConditions,
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
