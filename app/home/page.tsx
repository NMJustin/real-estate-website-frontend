'use client'

import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PropertyCard from '@/components/ui/PropertyCard';
import CategoryCard from '@/components/ui/CategoryCard';
import GoldenParticles from '@/components/ui/GoldenParticles';
import type { PropertyProps } from '@/components/ui/PropertyCard';
import type { CategoryProps } from '@/components/ui/CategoryCard';
import api from '@/services/api';

type ApiProperty = {
  id: string;
  slug: string;
  title: string;
  price?: string | number;
  location?: string;
  propertyType?: string;
  transactionType?: string;
  status?: string;
  isFeatured?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  size?: string | number;
  sizeUnit?: string;
  propertyImages?: { imageUrl: string; isPrimary?: boolean; mediaType?: 'IMAGE' | 'VIDEO' }[];
  propertyFeatures?: { feature?: { name: string } }[];
};

const categories: CategoryProps[] = [
  {
    id: 'residential',
    name: 'Residential',
    slug: 'residential',
    description: 'Homes and residential properties for every stage of life.',
    imageUrl: '/images/images (2).jpeg',
    propertyType: 'RESIDENTIAL',
  },
  {
    id: 'apartments',
    name: 'Apartments',
    slug: 'apartments',
    description: 'Modern apartments and flats in sought-after locations.',
    imageUrl: '/images/images (3).jpeg',
    propertyType: 'APARTMENTS',
  },
  {
    id: 'houses',
    name: 'Houses',
    slug: 'houses',
    description: 'Detached and semi-detached houses for sale or rent.',
    imageUrl: '/images/images (1).jpeg',
    propertyType: 'HOUSES',
  },
  {
    id: 'villas',
    name: 'Villas',
    slug: 'villas',
    description: 'Explore spacious villas with room to make your own.',
    imageUrl: '/images/images (15).jpeg',
    propertyType: 'VILLA',
  },
  {
    id: 'land-plots',
    name: 'Land & Plots',
    slug: 'land',
    description: 'Find land and plots for your next home or investment.',
    imageUrl: '/images/images (9).jpeg',
    propertyType: 'LAND',
  },
  {
    id: 'commercial',
    name: 'Commercial',
    slug: 'commercial',
    description: 'Commercial spaces for businesses and investors.',
    imageUrl: '/images/images (14).jpeg',
    propertyType: 'COMMERCIAL',
  },
  {
    id: 'offices',
    name: 'Offices',
    slug: 'offices',
    description: 'Professional office spaces for teams of every size.',
    imageUrl: '/images/images (16).jpeg',
    propertyType: 'OFFICES',
  },
  {
    id: 'warehouses',
    name: 'Warehouses',
    slug: 'warehouses',
    description: 'Practical warehouse and storage spaces.',
    imageUrl: '/images/images (17).jpeg',
    propertyType: 'WAREHOUSES',
  },
  {
    id: 'new-developments',
    name: 'New Developments',
    slug: 'new-developments',
    description: 'Discover new-build homes and upcoming projects.',
    imageUrl: '/images/images (18).jpeg',
    isNewDevelopment: true,
  },
];

const formatStatus = (property: ApiProperty): PropertyProps['status'] => {
  if (property.status === 'SOLD') return 'Sold';
  if (property.transactionType === 'RENT') return 'For Rent';
  if (property.transactionType === 'LEASE') return 'For Rent';
  return 'For Sale';
};

const toCard = (property: ApiProperty): PropertyProps => {
  const primaryImage = property.propertyImages?.find((image) => image.isPrimary)?.imageUrl || property.propertyImages?.[0]?.imageUrl || '/images/OIP (1).webp';
  const hasVideo = property.propertyImages?.some(img => img.mediaType === 'VIDEO') || false;
  return {
    id: property.id,
    slug: property.slug,
    image: primaryImage,
    title: property.title || 'Property',
    status: formatStatus(property),
    type: property.propertyType || 'Property',
    price: property.price ? (() => {
      const price = Number(property.price);
      if (price >= 1000000) {
        return `RWF ${(price / 1000000).toFixed(0)}M`;
      } else if (price >= 1000) {
        return `RWF ${(price / 1000).toFixed(0)}K`;
      }
      return `RWF ${price.toLocaleString()}`;
    })() : 'Price on request',
    location: property.location || 'Location unavailable',
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    size: property.size ? (() => {
      const unit = property.sizeUnit || 'sqm';
      const unitDisplay = unit === 'sqm' ? 'm²' : unit === 'sqft' ? 'ft²' : unit === 'acres' ? 'acres' : unit === 'hectares' ? 'hectares' : unit;
      return `${property.size} ${unitDisplay}`;
    })() : 'Size unavailable',
    features: property.propertyFeatures?.map((item) => item.feature?.name || '').filter(Boolean) || [],
    hasVideo: hasVideo,
    isFeatured: property.isFeatured || false,
  };
};

export default function Home() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({ transactionType: 'buy', location: '', propertyType: '', priceRange: '', bedrooms: '' });
  const [featuredProperties, setFeaturedProperties] = useState<PropertyProps[]>([]);

  useEffect(() => {
    api.getProperties({ featured: true, limit: 3 })
      .then((response) => setFeaturedProperties(((response as { data: ApiProperty[] }).data || []).map(toCard)))
      .catch(() => setFeaturedProperties([]));
  }, []);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const query = new URLSearchParams(Object.fromEntries(Object.entries(searchParams).filter(([, value]) => value))).toString();
    router.push(`/property-search${query ? `?${query}` : ''}`);
  };

  return (
    <div className="flex flex-col w-full bg-brand-navy">
      <section className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
        <GoldenParticles />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center mt-10 text-center">
          <span className="px-4 py-1.5 rounded-full bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30 text-sm font-semibold mb-6">Rwanda's Premier Real Estate Platform</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-white mb-6 leading-tight">Find a Place to <span className="text-brand-emerald">Call Home</span></h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl">Discover residential, commercial and investment properties that match your needs and goals.</p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link href="/properties" className="bg-brand-emerald hover:bg-brand-emerald-hover text-brand-white px-6 py-3 rounded-md text-base font-medium transition-colors duration-200 shadow-md">
              Explore Properties
            </Link>
            <Link href="/list-your-property" className="bg-white/10 hover:bg-white/20 text-brand-white border border-white/30 px-6 py-3 rounded-md text-base font-medium transition-colors duration-200 shadow-md">
              List Your Property
            </Link>
          </div>

          <div className="w-full bg-brand-white rounded-xl shadow-2xl p-4 md:p-6 text-left">
            <h3 className="text-brand-navy font-bold text-lg mb-4">What are you looking for?</h3>
            <div className="flex flex-wrap gap-4 border-b border-slate-200 mb-5 pb-3">
              <button onClick={() => setSearchParams({ ...searchParams, transactionType: 'buy' })} className={`text-sm font-bold pb-1 ${searchParams.transactionType === 'buy' ? 'text-brand-emerald border-b-2 border-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>Buy</button>
              <button onClick={() => setSearchParams({ ...searchParams, transactionType: 'rent' })} className={`text-sm font-bold pb-1 ${searchParams.transactionType === 'rent' ? 'text-brand-emerald border-b-2 border-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>Rent</button>
            </div>
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider flex flex-col">Location<input value={searchParams.location} onChange={(event) => setSearchParams({ ...searchParams, location: event.target.value })} placeholder="City or area" className="search-input mt-1 p-2 border rounded-md" /></label>
              <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider flex flex-col">Property Type<select value={searchParams.propertyType} onChange={(event) => setSearchParams({ ...searchParams, propertyType: event.target.value })} className="search-input mt-1 p-2 border rounded-md"><option value="">All types</option><option value="RESIDENTIAL">Residential</option><option value="COMMERCIAL">Commercial</option><option value="APARTMENTS">Apartments</option><option value="HOUSES">Houses</option><option value="VILLA">Villa</option><option value="LAND">Land &amp; plots</option><option value="OFFICES">Offices</option><option value="WAREHOUSES">Warehouses</option><option value="NEW_DEVELOPMENTS">New Developments</option></select></label>
              <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider flex flex-col">Price Range<select value={searchParams.priceRange} onChange={(event) => setSearchParams({ ...searchParams, priceRange: event.target.value })} className="search-input mt-1 p-2 border rounded-md"><option value="">Any price</option><option value="0-50000000">RWF Under 50M</option><option value="50000000-100000000">RWF 50M - 100M</option><option value="100000000-500000000">RWF 100M - 500M</option><option value="500000000+">RWF 500M+</option></select></label>
              <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider flex flex-col">Bedrooms<select value={searchParams.bedrooms} onChange={(event) => setSearchParams({ ...searchParams, bedrooms: event.target.value })} className="search-input mt-1 p-2 border rounded-md"><option value="">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></label>
              <button type="submit" className="self-end bg-brand-navy hover:bg-slate-800 text-brand-white font-bold rounded-md px-4 py-2 h-[42px] mt-1 md:mt-0 transition-colors">Search</button>
            </form>
          </div>
        </div>
      </section>
      {/* Property categories */}
      <section className="w-full bg-slate-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand-emerald">Explore by type</span>
            <h2 className="mt-2 text-3xl font-bold text-brand-navy md:text-4xl">Find the right property for you</h2>
            <p className="mx-auto mt-3 max-w-2xl text-brand-charcoal">Browse homes, business spaces, land and new developments across Rwanda.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 w-full bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8"><div><h2 className="text-3xl font-bold text-brand-navy">Featured Properties</h2><p className="text-brand-charcoal mt-2">Explore the latest highlighted listings.</p></div><Link href="/properties" className="text-brand-emerald font-semibold">View all properties</Link></div>
          {featuredProperties.length ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{featuredProperties.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <p className="text-brand-charcoal">Featured properties will appear here soon.</p>}
        </div>
      </section>
      <section className="bg-brand-navy/95 backdrop-blur-md py-16 text-center"><h2 className="text-3xl font-bold text-brand-white mb-4">Need help choosing?</h2><p className="text-slate-300 mb-8">Search, compare, calculate, and request a viewing from one place.</p><div className="flex flex-wrap justify-center gap-3"><Link href="/compare-properties" className="bg-brand-emerald text-brand-white rounded-lg px-5 py-3">Compare properties</Link><Link href="/property-valuation" className="border border-white text-white rounded-lg px-5 py-3">Request valuation</Link></div></section>
      
      {/* About the company */}
      <section className="py-16 bg-white/95 backdrop-blur-md w-full border-t border-slate-100/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-brand-navy mb-4">About Ingata Real Estate</h2>
            <p className="text-brand-charcoal mb-4">Ingata Real Estate is a real estate company providing property sales, rentals, property management, marketing and related real estate services.</p>
            <p className="text-brand-charcoal mb-4">We connect property owners, buyers, tenants, investors and developers with suitable real estate opportunities.</p>
            <Link href="/about/our-company" className="text-brand-emerald font-semibold hover:underline">Learn More About Us &rarr;</Link>
          </div>
          <div className="h-64 rounded-xl overflow-hidden">
            <Image
              src="/images/wp4110652.jpg"
              alt="Ingata Real Estate"
              width={1920}
              height={1080}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Real estate services */}
      <section className="py-16 w-full text-center bg-white/95 backdrop-blur-md border-t border-slate-100/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-navy mb-2">Our Services</h2>
          <p className="text-brand-charcoal mb-10">Comprehensive real estate solutions tailored for you.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-xl shadow-sm"><h3 className="font-bold text-lg mb-2">Property Sales</h3><p className="text-sm text-brand-charcoal mb-4">Expert assistance in selling your properties.</p><Link href="/services/property-sales" className="text-brand-emerald text-sm font-semibold">Read more</Link></div>
            <div className="p-6 bg-white rounded-xl shadow-sm"><h3 className="font-bold text-lg mb-2">Property Rentals</h3><p className="text-sm text-brand-charcoal mb-4">Find the perfect rental home or tenant.</p><Link href="/services/property-rentals" className="text-brand-emerald text-sm font-semibold">Read more</Link></div>
            <div className="p-6 bg-white rounded-xl shadow-sm"><h3 className="font-bold text-lg mb-2">Property Management</h3><p className="text-sm text-brand-charcoal mb-4">Hassle-free management of your assets.</p><Link href="/services/property-management" className="text-brand-emerald text-sm font-semibold">Read more</Link></div>
            <div className="p-6 bg-white rounded-xl shadow-sm"><h3 className="font-bold text-lg mb-2">Property Valuation</h3><p className="text-sm text-brand-charcoal mb-4">Accurate and market-driven appraisals.</p><Link href="/services/property-valuation" className="text-brand-emerald text-sm font-semibold">Read more</Link></div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-brand-navy/95 backdrop-blur-md text-brand-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-10">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <div><h3 className="text-xl font-bold text-brand-emerald mb-2">Professional Expertise</h3><p className="text-slate-300">Our team provides professional support throughout the property search and transaction process.</p></div>
            <div><h3 className="text-xl font-bold text-brand-emerald mb-2">Local Market Knowledge</h3><p className="text-slate-300">We understand the local property market and customer requirements.</p></div>
            <div><h3 className="text-xl font-bold text-brand-emerald mb-2">Verified Listings</h3><p className="text-slate-300">Where applicable, we aim to provide accurate and appropriately verified property information.</p></div>
            <div><h3 className="text-xl font-bold text-brand-emerald mb-2">Customer Focus</h3><p className="text-slate-300">We focus on understanding customer needs and matching them with suitable property opportunities.</p></div>
            <div><h3 className="text-xl font-bold text-brand-emerald mb-2">Transparent Service</h3><p className="text-slate-300">We communicate relevant property information, terms and processes clearly.</p></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 w-full text-center bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-navy mb-10">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="flex-1"><div className="w-12 h-12 bg-brand-emerald text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">1</div><h3 className="font-bold text-lg">Search</h3><p className="text-brand-charcoal text-sm mt-2">Find your dream property using our advanced filters.</p></div>
            <div className="flex-1"><div className="w-12 h-12 bg-brand-emerald text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">2</div><h3 className="font-bold text-lg">Connect</h3><p className="text-brand-charcoal text-sm mt-2">Contact our agents or request a viewing easily.</p></div>
            <div className="flex-1"><div className="w-12 h-12 bg-brand-emerald text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">3</div><h3 className="font-bold text-lg">Acquire</h3><p className="text-brand-charcoal text-sm mt-2">Close the deal and move into your new space.</p></div>
          </div>
        </div>
      </section>

      {/* New/featured developments */}
      <section className="py-16 bg-white/95 backdrop-blur-md w-full border-t border-slate-100/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8"><div><h2 className="text-3xl font-bold text-brand-navy">New Developments</h2><p className="text-brand-charcoal mt-2">Discover the latest projects in the market.</p></div><Link href="/properties/new-developments" className="text-brand-emerald font-semibold">View developments</Link></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center min-h-[200px]"><h3 className="text-xl font-bold text-brand-navy mb-2">Development Alpha</h3><p className="text-brand-charcoal mb-4">A premium residential complex in the city center.</p><Link href="/properties/new-developments" className="text-brand-emerald font-semibold text-sm">Explore project</Link></div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center min-h-[200px]"><h3 className="text-xl font-bold text-brand-navy mb-2">Sunset Villas</h3><p className="text-brand-charcoal mb-4">Exclusive luxury villas with breathtaking views.</p><Link href="/properties/new-developments" className="text-brand-emerald font-semibold text-sm">Explore project</Link></div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 w-full text-center bg-white/95 backdrop-blur-md border-t border-slate-100/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-navy mb-10">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-xl italic">"The team made finding our new home a breeze. Highly recommended!"<div className="font-bold text-brand-navy mt-4 not-italic">- John D.</div></div>
            <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-xl italic">"Professional, responsive, and truly understood our needs."<div className="font-bold text-brand-navy mt-4 not-italic">- Sarah K.</div></div>
            <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-xl italic">"Their property management service gives me total peace of mind."<div className="font-bold text-brand-navy mt-4 not-italic">- Michael R.</div></div>
          </div>
        </div>
      </section>

      {/* Latest articles */}
      <section className="py-16 bg-white/95 backdrop-blur-md w-full border-t border-slate-100/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8"><div><h2 className="text-3xl font-bold text-brand-navy">Latest Articles</h2><p className="text-brand-charcoal mt-2">Insights and news from the real estate world.</p></div><Link href="/insights/articles" className="text-brand-emerald font-semibold">Read our blog</Link></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><div className="h-40 bg-slate-200"></div><div className="p-6"><h3 className="font-bold text-lg mb-2">Market Trends 2024</h3><p className="text-sm text-brand-charcoal mb-4">What to expect in the upcoming year.</p><Link href="/insights/articles" className="text-brand-emerald text-sm font-semibold">Read more</Link></div></div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><div className="h-40 bg-slate-200"></div><div className="p-6"><h3 className="font-bold text-lg mb-2">First-Time Buyer Guide</h3><p className="text-sm text-brand-charcoal mb-4">Tips for securing your first home.</p><Link href="/insights/articles" className="text-brand-emerald text-sm font-semibold">Read more</Link></div></div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><div className="h-40 bg-slate-200"></div><div className="p-6"><h3 className="font-bold text-lg mb-2">Investing in Commercial</h3><p className="text-sm text-brand-charcoal mb-4">Why commercial real estate is booming.</p><Link href="/insights/articles" className="text-brand-emerald text-sm font-semibold">Read more</Link></div></div>
          </div>
        </div>
      </section>

      {/* Contact call-to-action */}
      <section className="bg-brand-emerald/95 backdrop-blur-md py-16 text-center text-white w-full">
        <h2 className="text-3xl font-bold mb-4">Ready to take the next step?</h2>
        <p className="text-emerald-50 mb-8 max-w-2xl mx-auto">Contact us today to speak with one of our real estate experts and start your journey.</p>
        <Link href="/contact-us" className="bg-white text-brand-emerald font-bold rounded-lg px-8 py-3 shadow-lg hover:bg-slate-50 transition">Contact Us</Link>
      </section>
    </div>
  );
}
