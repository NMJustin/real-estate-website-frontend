import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardFooter } from './Card';
import { Button } from './Button';

export interface CategoryProps {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string;
  propertyCount?: number;
}

export function CategoryCard({ category }: { category: CategoryProps }) {
  const defaultImage = '/images/category-placeholder.jpg';
  const imageSrc = category.imageUrl || defaultImage;

  return (
    <Card className="flex flex-col h-full group hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={category.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white">{category.name}</h3>
          {category.propertyCount !== undefined && (
            <p className="text-white/80 text-sm">{category.propertyCount} {category.propertyCount === 1 ? 'listing' : 'listings'}</p>
          )}
        </div>
      </div>
      
      <CardBody className="flex-1">
        <p className="text-slate-600 text-sm line-clamp-2">
          {category.description || 'Explore properties in this category'}
        </p>
      </CardBody>
      
      <CardFooter className="bg-white border-t-0 pt-0">
        <Link to={`/properties?category=${category.slug}`} className="block w-full">
          <Button variant="secondary" className="w-full">Browse {category.name}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default CategoryCard;