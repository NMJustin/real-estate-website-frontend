'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

type Favorite = { id: string; property: { slug: string; title: string; location?: string; price?: string | number } };

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

export default function FavoritesContent() {
  const { isAuthenticated, user, userLogin, userRegister, logout } = useAuth();
  
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadFavorites();
    }
  }, [isAuthenticated, user]);

  const loadFavorites = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const result = await api.getFavorites(user.id);
      setFavorites((result as { data: Favorite[] }).data || []);
      setMessage('');
    } catch {
      setMessage('Failed to load saved properties.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      if (isLogin) {
        await userLogin(email, password);
      } else {
        await userRegister(name, email, password);
      }
    } catch (err: any) {
      setMessage(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-brand-navy mb-6 text-center">
          {isLogin ? 'Login to view saved properties' : 'Sign up to save properties'}
        </h1>
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              className="p-3 border border-slate-300 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="p-3 border border-slate-300 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border border-slate-300 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-brand-emerald text-brand-white p-3 rounded-lg font-bold disabled:opacity-50"
          >
            {isLoading ? 'Please wait...' : isLogin ? 'Log In' : 'Sign Up'}
          </button>
          {message && <p className="text-red-600 text-center">{message}</p>}
        </form>
        <p className="text-center mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            className="text-brand-emerald font-bold"
            onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-navy">Saved Properties</h1>
        <button onClick={logout} className="text-red-600 hover:underline">Log out</button>
      </div>
      
      {message && <p className="text-red-600 mb-4">{message}</p>}
      
      {isLoading ? (
        <p>Loading...</p>
      ) : favorites.length === 0 ? (
        <p className="text-slate-600">You haven't saved any properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          {favorites.map((favorite) => (
            <article key={favorite.id} className="border border-slate-200 bg-brand-white rounded-xl p-5">
              <h2 className="font-bold text-brand-navy">{favorite.property.title}</h2>
              <p>{favorite.property.location}</p>
              <p className="text-brand-emerald">{formatPrice(favorite.property.price)}</p>
              <Link href={`/properties/${favorite.property.slug}`} className="inline-block mt-4 text-brand-emerald hover:underline">
                View property
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
