import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Property Sales',
    description: 'Expert assistance in selling your properties at the best market value.',
    slug: 'property-sales',
    icon: '🏠'
  },
  {
    title: 'Property Rentals',
    description: 'Find the perfect rental home or connect with reliable tenants.',
    slug: 'property-rentals',
    icon: '🔑'
  },
  {
    title: 'Property Leasing',
    description: 'Professional leasing services for commercial and residential properties.',
    slug: 'property-leasing',
    icon: '📄'
  },
  {
    title: 'Property Management',
    description: 'Hassle-free management of your real estate assets and investments.',
    slug: 'property-management',
    icon: '🏢'
  },
  {
    title: 'Property Marketing',
    description: 'Strategic marketing solutions to maximize property visibility.',
    slug: 'property-marketing',
    icon: '📢'
  },
  {
    title: 'Property Valuation',
    description: 'Accurate and market-driven property appraisals and valuations.',
    slug: 'property-valuation',
    icon: '📊'
  },
  {
    title: 'Real Estate Advisory',
    description: 'Expert guidance for real estate investment decisions and portfolio management.',
    slug: 'real-estate-advisory',
    icon: '💼'
  },
  {
    title: 'Property Search Services',
    description: 'Comprehensive property search tailored to your specific requirements.',
    slug: 'property-search-services',
    icon: '🔍'
  },
  {
    title: 'Real Estate Consultancy',
    description: 'Professional consulting services for all your real estate needs.',
    slug: 'real-estate-consultancy',
    icon: '🤝'
  },
  {
    title: 'Property Development Marketing',
    description: 'Marketing solutions for new developments and construction projects.',
    slug: 'property-development-marketing',
    icon: '🏗️'
  }
];

export default function Services() {
  return (
    <main className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Our Real Estate Services</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive real estate solutions tailored to meet your property needs. From sales and rentals to management and advisory services.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.slug}
              to={`/services/${service.slug}`}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h2>
              <p className="text-slate-600 text-sm mb-4">{service.description}</p>
              <span className="text-emerald-600 text-sm font-semibold hover:underline">Learn more →</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
