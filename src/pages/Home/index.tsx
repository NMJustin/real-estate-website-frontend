import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropertyCard from '../../components/ui/PropertyCard';
import type { PropertyProps } from '../../components/ui/PropertyCard';
import api from '../../services/api';

type ApiProperty = {
  id: string;
  slug: string;
  title: string;
  price?: string | number;
  location?: string;
  propertyType?: string;
  transactionType?: string;
  status?: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: string | number;
  propertyImages?: { imageUrl: string; isPrimary?: boolean }[];
  propertyFeatures?: { feature?: { name: string } }[];
};

const formatStatus = (property: ApiProperty): PropertyProps['status'] => {
  if (property.status === 'SOLD') return 'Sold';
  if (property.transactionType === 'RENT') return 'For Rent';
  if (property.transactionType === 'LEASE') return 'For Rent';
  return 'For Sale';
};

const toCard = (property: ApiProperty): PropertyProps => ({
  id: property.id,
  slug: property.slug,
  image: property.propertyImages?.find((image) => image.isPrimary)?.imageUrl || property.propertyImages?.[0]?.imageUrl || '/images/OIP (1).webp',
  status: formatStatus(property),
  type: property.propertyType || 'Property',
  price: property.price ? String(property.price) : 'Price on request',
  location: property.location || 'Location unavailable',
  bedrooms: property.bedrooms || 0,
  bathrooms: property.bathrooms || 0,
  size: property.size ? `${property.size}` : 'Size unavailable',
  features: property.propertyFeatures?.map((item) => item.feature?.name || '').filter(Boolean) || [],
});

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({ location: '', propertyType: '' });
  const [featuredProperties, setFeaturedProperties] = useState<PropertyProps[]>([]);

  useEffect(() => {
    api.getProperties({ featured: true, limit: 3 })
      .then((response) => setFeaturedProperties(((response as { data: ApiProperty[] }).data || []).map(toCard)))
      .catch(() => setFeaturedProperties([]));
  }, []);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const query = new URLSearchParams(Object.fromEntries(Object.entries(searchParams).filter(([, value]) => value))).toString();
    navigate(`/property-search${query ? `?${query}` : ''}`);
  };

  return (
    <div className="flex flex-col w-full">
      <section className="relative w-full min-h-[600px] lg:min-h-[700px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/OIP (1).webp')" }}>
        <div className="absolute inset-0 bg-brand-navy/70" />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center mt-10">
          <span className="px-4 py-1.5 rounded-full bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30 text-sm font-semibold mb-6">Rwanda's Premier Real Estate Platform</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-white text-center mb-6 leading-tight">Discover Your Next <br className="hidden md:block" /><span className="text-brand-emerald">Perfect Property</span></h1>
          <div className="w-full bg-brand-white rounded-xl shadow-2xl p-4 md:p-6 mt-8">
            <div className="flex flex-wrap gap-6 border-b border-slate-200 mb-5 pb-2"><Link to="/properties/for-rent" className="text-sm font-bold text-brand-charcoal hover:text-brand-emerald">For Rent</Link><Link to="/properties/for-sale" className="text-sm font-bold text-brand-charcoal hover:text-brand-emerald">For Sale</Link><Link to="/properties/commercial" className="text-sm font-bold text-brand-charcoal hover:text-brand-emerald">Commercial</Link></div>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Location<input value={searchParams.location} onChange={(event) => setSearchParams({ ...searchParams, location: event.target.value })} placeholder="City, district, or address" className="search-input" /></label>
              <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Property type<select value={searchParams.propertyType} onChange={(event) => setSearchParams({ ...searchParams, propertyType: event.target.value })} className="search-input"><option value="">All types</option><option value="RESIDENTIAL">Residential</option><option value="COMMERCIAL">Commercial</option><option value="LAND">Land</option></select></label>
              <button type="submit" className="self-end bg-brand-emerald hover:bg-brand-emerald-hover text-brand-white font-bold rounded-lg px-6 py-3">Search properties</button>
            </form>
          </div>
        </div>
      </section>
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-8"><div><h2 className="text-3xl font-bold text-brand-navy">Featured Properties</h2><p className="text-brand-charcoal mt-2">Explore the latest highlighted listings.</p></div><Link to="/properties" className="text-brand-emerald font-semibold">View all properties</Link></div>
        {featuredProperties.length ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{featuredProperties.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <p className="text-brand-charcoal">Featured properties will appear here soon.</p>}
      </section>
      <section className="bg-brand-navy py-16 text-center"><h2 className="text-3xl font-bold text-brand-white mb-4">Need help choosing?</h2><p className="text-slate-300 mb-8">Search, compare, calculate, and request a viewing from one place.</p><div className="flex flex-wrap justify-center gap-3"><Link to="/compare-properties" className="bg-brand-emerald text-brand-white rounded-lg px-5 py-3">Compare properties</Link><Link to="/property-valuation" className="border border-white text-white rounded-lg px-5 py-3">Request valuation</Link></div></section>
    </div>
  );
}
