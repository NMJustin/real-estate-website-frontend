'use client'

import { useState } from 'react';
import api from '../../services/api';

type Property = { id: string; slug: string; title: string; price?: string | number; location?: string; bedrooms?: number; bathrooms?: number; size?: string | number; sizeUnit?: string };

const formatPrice = (price: string | number | undefined): string => {
  if (!price) return 'Price on request';
  const num = Number(price);
  if (num >= 1000000) {
    return `RWF ${(num / 1000000).toFixed(0)}M`;
  } else if (num >= 1000) {
    return `RWF ${(num / 1000).toFixed(0)}K`;
  }
  return `RWF ${num.toLocaleString()}`;
};

const formatSize = (size: string | number | undefined, sizeUnit?: string): string => {
  if (!size) return 'Size unavailable';
  const unit = sizeUnit || 'sqm';
  const unitDisplay = unit === 'sqm' ? 'm²' : unit === 'sqft' ? 'ft²' : unit === 'acres' ? 'acres' : unit === 'hectares' ? 'hectares' : unit;
  return `${size} ${unitDisplay}`;
};

export default function CompareProperties() {
  const [slugs, setSlugs] = useState(''); const [properties, setProperties] = useState<Property[]>([]); const [error, setError] = useState('');
  const compare = async () => { try { setError(''); const result = await Promise.all(slugs.split(',').map((slug) => api.getProperty(slug.trim()))); setProperties(result.map((item) => (item as { data: Property }).data)); } catch { setError('Enter valid property slugs separated by commas.'); } };
  return <main className="max-w-6xl mx-auto px-4 py-12"><h1 className="text-3xl font-bold text-brand-navy mb-6">Compare Properties</h1><div className="flex gap-3"><input value={slugs} onChange={(e) => setSlugs(e.target.value)} placeholder="property-slug, another-slug" className="search-input" /><button onClick={compare} className="bg-brand-emerald text-brand-white rounded-lg px-5">Compare</button></div>{error && <p className="text-red-600 mt-4">{error}</p>}<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">{properties.map((property) => <article key={property.id} className="border border-slate-200 bg-brand-white rounded-xl p-5"><h2 className="font-bold text-brand-navy">{property.title}</h2><p>{property.location}</p><p className="text-brand-emerald">{formatPrice(property.price)}</p><p>{property.bedrooms ?? 0} beds · {property.bathrooms ?? 0} baths · {formatSize(property.size, property.sizeUnit)}</p></article>)}</div></main>;
}