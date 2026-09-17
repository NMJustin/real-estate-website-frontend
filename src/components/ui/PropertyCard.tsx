import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardFooter } from './Card';
import { Button } from './Button';

export interface PropertyProps {
  id: string;
  slug: string;
  image: string;
  status: 'For Sale' | 'For Rent' | 'Pending' | 'Sold';
  type: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  size: string;
  features: string[];
}

export function PropertyCard({ property }: { property: PropertyProps }) {
  const statusColors = {
    'For Sale': 'bg-emerald-100 text-emerald-800',
    'For Rent': 'bg-blue-100 text-blue-800',
    'Pending': 'bg-amber-100 text-amber-800',
    'Sold': 'bg-gray-100 text-gray-800',
  };

  return (
    <Card className="flex flex-col h-full group hover:shadow-md transition-shadow">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.location} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={px-3 py-1 text-xs font-bold rounded-full $statusColors[property.status]}}>
            {property.status}
          </span>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-black/50 text-white backdrop-blur-sm">
            {property.type}
          </span>
        </div>
        <button className="absolute top-4 right-4 w-8 h-8 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center text-brand-charcoal transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </button>
      </div>
      
      <CardBody className="flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-brand-navy mb-2">{property.price}</h3>
        <p className="text-brand-charcoal mb-4 flex-1">{property.location}</p>
        
        <div className="flex items-center gap-4 text-sm text-brand-charcoal mb-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1">
            <span className="font-bold">{property.bedrooms}</span> Beds
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">{property.bathrooms}</span> Baths
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">{property.size}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {property.features.slice(0, 3).map((feature, i) => (
            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
              {feature}
            </span>
          ))}
          {property.features.length > 3 && (
            <span className="text-xs text-slate-400 px-2 py-1">+{property.features.length - 3} more</span>
          )}
        </div>
      </CardBody>
      
      <CardFooter className="bg-white border-t-0 pt-0">
        <Link to={/properties/$property.slug}} className="block w-full">
          <Button variant="secondary" className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
