import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

type Favorite = { id: string; property: { slug: string; title: string; location?: string; price?: string | number } };

export default function Favorites() {
  const [userId, setUserId] = useState(''); const [favorites, setFavorites] = useState<Favorite[]>([]); const [message, setMessage] = useState('');
  const load = async () => { try { const result = await api.getFavorites(userId); setFavorites((result as { data: Favorite[] }).data || []); setMessage(''); } catch { setMessage('Enter a valid account ID to load saved properties.'); } };
  return <main className="max-w-5xl mx-auto px-4 py-12"><h1 className="text-3xl font-bold text-brand-navy mb-6">Saved Properties</h1><div className="flex gap-3"><input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Account ID" className="search-input" /><button onClick={load} className="bg-brand-emerald text-brand-white rounded-lg px-5">Load saved properties</button></div>{message && <p className="text-red-600 mt-4">{message}</p>}<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">{favorites.map((favorite) => <article key={favorite.id} className="border border-slate-200 bg-brand-white rounded-xl p-5"><h2 className="font-bold text-brand-navy">{favorite.property.title}</h2><p>{favorite.property.location}</p><p className="text-brand-emerald">{favorite.property.price ?? 'Price on request'}</p><Link to={`/properties/${favorite.property.slug}`} className="inline-block mt-4 text-brand-emerald">View property</Link></article>)}</div></main>;
}