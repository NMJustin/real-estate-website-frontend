'use client'

import { useEffect, useState } from 'react';
import { Link } from '@/navigation/legacy-router';
import api from '../../services/api';

type Property = { id: string; slug: string; title: string; location?: string; price?: string | number; bedrooms?: number; bathrooms?: number; size?: string | number; sizeUnit?: string; propertyImages?: { imageUrl: string; isPrimary?: boolean; mediaType?: 'IMAGE' | 'VIDEO' }[] };

type CategoryListingProps = { title: string; query: Record<string, string> };

export function CategoryListing({ title, query }: CategoryListingProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState('');
  const queryKey = JSON.stringify(query);

  useEffect(() => {
    api.getProperties(JSON.parse(queryKey) as Record<string, string>).then((response) => setProperties((response as { data: Property[] }).data || [])).catch(() => setError('Unable to load properties.'));
  }, [queryKey]);

  return (
    <main className="bg-brand-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-emerald">Property Listings</p>
        <h1 className="text-4xl font-bold text-brand-navy mt-2 mb-8">{title}</h1>
        {error && <p className="text-red-600">{error}</p>}
        {!error && properties.length === 0 && <p className="text-brand-charcoal">No properties are currently listed in this category.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <article key={property.id} className="bg-brand-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-brand-navy">{property.title}</h2>
              <p className="text-brand-charcoal mt-2">{property.location || 'Location unavailable'}</p>
              <p className="text-brand-emerald font-semibold mt-4">{property.price ? (() => {
                const price = Number(property.price);
                if (price >= 1000000) {
                  return `RWF ${(price / 1000000).toFixed(0)}M`;
                } else if (price >= 1000) {
                  return `RWF ${(price / 1000).toFixed(0)}K`;
                }
                return `RWF ${price.toLocaleString()}`;
              })() : 'Price on request'}</p>
              <p className="text-sm text-slate-600 mt-2">{property.bedrooms ?? 0} beds · {property.bathrooms ?? 0} baths · {property.size ? (() => {
                const unit = property.sizeUnit || 'sqm';
                const unitDisplay = unit === 'sqm' ? 'm²' : unit === 'sqft' ? 'ft²' : unit === 'acres' ? 'acres' : unit === 'hectares' ? 'hectares' : unit;
                return `${property.size} ${unitDisplay}`;
              })() : 'Size unavailable'}</p>
              <Link to={`/properties/${property.slug}`} className="inline-block mt-4 text-brand-emerald font-semibold">View property</Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}