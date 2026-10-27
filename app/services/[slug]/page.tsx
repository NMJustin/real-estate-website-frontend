import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import Link from 'next/link'
import { ArrowLeft, Home, KeyRound, FileText, Building2, Megaphone, BadgeDollarSign, BriefcaseBusiness, Search, Handshake, Construction } from 'lucide-react'
import { notFound } from 'next/navigation'

const serviceDetails: Record<string, { title: string; description: string; content: string; icon: any }> = {
  'property-sales': {
    title: 'Property Sales',
    description: 'Expert assistance in selling your properties at the best market value.',
    icon: Home,
    content: 'Our property sales service provides comprehensive support for selling residential and commercial properties. We conduct market analysis, prepare professional listings, manage property viewings, negotiate offers, and handle all documentation. Our experienced team ensures a smooth transaction from listing to closing, maximizing your property value while minimizing stress.'
  },
  'property-rentals': {
    title: 'Property Rentals',
    description: 'Find the perfect rental home or connect with reliable tenants.',
    icon: KeyRound,
    content: 'Whether you are looking to rent a property or find tenants for your rental property, our rental services streamline the process. For tenants, we help find properties that match your requirements and budget. For landlords, we screen tenants, manage lease agreements, and handle property maintenance coordination.'
  },
  'property-leasing': {
    title: 'Property Leasing',
    description: 'Professional leasing services for commercial and residential properties.',
    icon: FileText,
    content: 'Our leasing services cater to both commercial and residential properties. We prepare comprehensive lease agreements, conduct tenant screening, manage lease renewals, and ensure compliance with local regulations. Our expertise helps landlords secure reliable tenants and tenants find suitable lease terms.'
  },
  'property-management': {
    title: 'Property Management',
    description: 'Hassle-free management of your real estate assets and investments.',
    icon: Building2,
    content: 'Our property management services take the hassle out of owning rental properties. We handle tenant communication, rent collection, property maintenance, financial reporting, and legal compliance. Whether you own a single property or a portfolio, we ensure your investment is well-managed and profitable.'
  },
  'property-marketing': {
    title: 'Property Marketing',
    description: 'Strategic marketing solutions to maximize property visibility.',
    icon: Megaphone,
    content: 'Effective marketing is crucial for property success. We develop comprehensive marketing strategies including professional photography, virtual tours, targeted advertising, and multi-platform listings. Our marketing approach ensures your property reaches the right audience and achieves maximum exposure.'
  },
  'property-valuation': {
    title: 'Property Valuation',
    description: 'Accurate and market-driven property appraisals and valuations.',
    icon: BadgeDollarSign,
    content: 'Our professional valuation services provide accurate property assessments for various purposes including sales, purchases, refinancing, and investment decisions. We consider market trends, property condition, location factors, and comparable sales to deliver reliable valuations you can trust.'
  },
  'real-estate-advisory': {
    title: 'Real Estate Advisory',
    description: 'Expert guidance for real estate investment decisions and portfolio management.',
    icon: BriefcaseBusiness,
    content: 'Our advisory services provide expert guidance for real estate investment decisions. We help clients analyze market opportunities, assess property investments, develop portfolio strategies, and optimize real estate holdings. Whether you are a first-time investor or experienced portfolio manager, our insights help you make informed decisions.'
  },
  'property-search-services': {
    title: 'Property Search Services',
    description: 'Comprehensive property search tailored to your specific requirements.',
    icon: Search,
    content: 'Finding the right property can be challenging. Our property search services handle the entire process for you. We identify properties matching your criteria, arrange viewings, provide comparative analysis, and negotiate on your behalf. Our expertise saves you time and ensures you find properties that truly meet your needs.'
  },
  'real-estate-consultancy': {
    title: 'Real Estate Consultancy',
    description: 'Professional consulting services for all your real estate needs.',
    icon: Handshake,
    content: 'Our consultancy services offer professional guidance across all aspects of real estate. From market analysis and feasibility studies to project planning and execution support, we provide the expertise you need. Whether you are developing property, investing, or managing real estate operations, our consultancy helps you achieve your goals.'
  },
  'property-development-marketing': {
    title: 'Property Development Marketing',
    description: 'Marketing solutions for new developments and construction projects.',
    icon: Construction,
    content: 'Development projects require specialized marketing approaches. We create comprehensive marketing strategies for new developments, including pre-sales campaigns, project branding, buyer engagement, and sales support. Our development marketing helps projects achieve successful launches and strong sales performance.'
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = serviceDetails[slug]

  if (!service) {
    return generatePageMetadata({
      title: 'Service Not Found',
      description: 'The requested service page could not be found.',
      path: '/services/[slug]',
    })
  }

  return generatePageMetadata({
    title: `${service.title} - Ingata Real Estate Rwanda`,
    description: service.description,
    path: `/services/${slug}`,
    keywords: [service.title, 'real estate services Rwanda', 'property services'],
  })
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const service = serviceDetails[slug]

  if (!service) {
    notFound()
  }

  const Icon = service.icon

  return (
    <main className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/services" className="text-emerald-600 hover:underline text-sm font-medium">
            <><ArrowLeft className="mr-1 inline h-4 w-4" aria-hidden="true" />Back to Services</>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <Icon className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{service.title}</h1>
              <p className="text-slate-600">{service.description}</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed text-lg">{service.content}</p>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Interested in this service?</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/property-valuation"
                className="border border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
              >
                Request Valuation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
