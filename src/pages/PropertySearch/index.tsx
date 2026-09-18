import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

type SearchForm = {
  location: string; propertyType: string; transactionType: string; minPrice: string; maxPrice: string;
  minBedrooms: string; minBathrooms: string; minSize: string; maxSize: string; availability: string;
  furnishingStatus: string; features: string;
};

const initialForm: SearchForm = {
  location: '', propertyType: '', transactionType: '', minPrice: '', maxPrice: '', minBedrooms: '',
  minBathrooms: '', minSize: '', maxSize: '', availability: '', furnishingStatus: '', features: '',
};

type Property = { id: string; slug: string; title: string; location?: string; price?: string | number; bedrooms?: number; bathrooms?: number; size?: string | number };

export default function PropertySearch() {
  const [form, setForm] = useState(initialForm);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const update = (name: keyof SearchForm, value: string) => setForm((current) => ({ ...current, [name]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError('');
    const query = Object.fromEntries(Object.entries(form).filter(([, value]) => value.trim() !== ''));
    try { const response = await api.getProperties(query) as { data: Property[] }; setProperties(response.data || []); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to search properties'); }
    finally { setLoading(false); }
  };

  const saveSearch = async () => {
    try { await api.savePropertySearch({ ...form, features: form.features.split(',').map((feature) => feature.trim()).filter(Boolean) }); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to save this search'); }
  };

  return (
    <main className="bg-brand-background min-h-screen py-12"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-emerald">Property Search</p><h1 className="text-4xl font-bold text-brand-navy mt-2 mb-8">Find a property that fits</h1>
      <form onSubmit={handleSubmit} className="bg-brand-white rounded-xl shadow-sm border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <label className="lg:col-span-2">Location<input value={form.location} onChange={(event) => update('location', event.target.value)} placeholder="City, district, or address" className="search-input" /></label>
        <label>Property type<select value={form.propertyType} onChange={(event) => update('propertyType', event.target.value)} className="search-input"><option value="">Any type</option><option value="RESIDENTIAL">Residential</option><option value="COMMERCIAL">Commercial</option><option value="LAND">Land</option></select></label>
        <label>Purpose<select value={form.transactionType} onChange={(event) => update('transactionType', event.target.value)} className="search-input"><option value="">Any purpose</option><option value="SALE">Buy</option><option value="RENT">Rent</option><option value="LEASE">Lease</option></select></label>
        <label>Minimum price<input type="number" value={form.minPrice} onChange={(event) => update('minPrice', event.target.value)} className="search-input" /></label><label>Maximum price<input type="number" value={form.maxPrice} onChange={(event) => update('maxPrice', event.target.value)} className="search-input" /></label>
        <label>Minimum bedrooms<input type="number" min="0" value={form.minBedrooms} onChange={(event) => update('minBedrooms', event.target.value)} className="search-input" /></label><label>Minimum bathrooms<input type="number" min="0" value={form.minBathrooms} onChange={(event) => update('minBathrooms', event.target.value)} className="search-input" /></label>
        <label>Minimum size<input type="number" min="0" value={form.minSize} onChange={(event) => update('minSize', event.target.value)} className="search-input" /></label><label>Maximum size<input type="number" min="0" value={form.maxSize} onChange={(event) => update('maxSize', event.target.value)} className="search-input" /></label>
        <label>Availability<select value={form.availability} onChange={(event) => update('availability', event.target.value)} className="search-input"><option value="">Any availability</option><option value="AVAILABLE">Available</option><option value="SOLD">Sold</option><option value="RENTED">Rented</option></select></label>
        <label>Furnishing<select value={form.furnishingStatus} onChange={(event) => update('furnishingStatus', event.target.value)} className="search-input"><option value="">Any furnishing</option><option value="FURNISHED">Furnished</option><option value="SEMI_FURNISHED">Semi-furnished</option><option value="UNFURNISHED">Unfurnished</option></select></label>
        <label className="lg:col-span-2">Features <span className="font-normal text-slate-500">(comma-separated slugs)</span><input value={form.features} onChange={(event) => update('features', event.target.value)} placeholder="parking, pool, balcony" className="search-input" /></label>
        <div className="lg:col-span-4 flex flex-wrap gap-3 pt-2"><button type="submit" className="bg-brand-emerald hover:bg-brand-emerald-hover text-brand-white font-semibold rounded-lg px-6 py-3">{loading ? 'Searching...' : 'Search properties'}</button><button type="button" onClick={saveSearch} className="border border-brand-slate text-brand-navy rounded-lg px-6 py-3">Save this search</button></div>
      </form>
      {error && <p className="mt-5 text-red-600">{error}</p>}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{properties.map((property) => <article key={property.id} className="bg-brand-white rounded-xl border border-slate-200 p-5"><h2 className="text-xl font-bold text-brand-navy">{property.title}</h2><p className="text-brand-charcoal mt-2">{property.location || 'Location unavailable'}</p><p className="text-brand-emerald font-semibold mt-4">{property.price ?? 'Price on request'}</p><p className="text-sm text-slate-600 mt-2">{property.bedrooms ?? 0} beds · {property.bathrooms ?? 0} baths · {property.size ?? 'Size unavailable'}</p><Link to={`/properties/${property.slug}`} className="inline-block mt-4 text-brand-emerald font-semibold">View property</Link></article>)}</section>
    </div></main>
  );
}
