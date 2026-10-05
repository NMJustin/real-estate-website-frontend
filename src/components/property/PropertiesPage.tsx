'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, ArrowUpDown, MapPin, BedDouble, Bath, Ruler, X } from 'lucide-react';
import api from '@/services/api';

type Property = {
  id: string;
  slug: string;
  title: string;
  location?: string;
  district?: string;
  sector?: string;
  price?: string | number;
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: string | number;
  sizeUnit?: string;
  propertyType: string;
  transactionType: string;
  isNewDevelopment?: boolean;
  propertyImages?: { imageUrl: string; isPrimary?: boolean }[];
  featured?: boolean;
  listedDate?: string;
};

export default function Properties() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionType, setTransactionType] = useState(() => searchParams.get('transactionType')?.toUpperCase() || 'ALL');
  const [propertyType, setPropertyType] = useState(() => searchParams.get('propertyType')?.toUpperCase() || 'ALL');
  const [location, setLocation] = useState(() => searchParams.get('location') || '');
  const [newDevelopmentsOnly, setNewDevelopmentsOnly] = useState(() => searchParams.get('isNewDevelopment') === 'true');
  const [district, setDistrict] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('ALL');
  const [bathrooms, setBathrooms] = useState('ALL');
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const [furnished, setFurnished] = useState('ALL');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    setTransactionType(searchParams.get('transactionType')?.toUpperCase() || 'ALL');
    setPropertyType(searchParams.get('propertyType')?.toUpperCase() || 'ALL');
    setLocation(searchParams.get('location') || '');
    setNewDevelopmentsOnly(searchParams.get('isNewDevelopment') === 'true');
  }, [searchParams]);

  useEffect(() => {
    api.getProperties({})
      .then((response) => {
        setProperties((response as { data: Property[] }).data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Unable to load properties.');
        setLoading(false);
      });
  }, []);

  // Filter and sort properties
  const filteredProperties = properties
    .filter((property) => {
      // Search term filter
      if (searchTerm && !property.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !property.location?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Transaction type filter
      if (transactionType !== 'ALL' && property.transactionType !== transactionType) {
        return false;
      }
      
      // Property type filter
      if (propertyType !== 'ALL' && property.propertyType !== propertyType) {
        return false;
      }
      if (newDevelopmentsOnly && !property.isNewDevelopment) {
        return false;
      }
      
      // Location filters
      if (location && !property.location?.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
      if (district && !property.district?.toLowerCase().includes(district.toLowerCase())) {
        return false;
      }
      
      // Price filters
      const propertyPrice = property.price ? Number(property.price) : 0;
      if (minPrice && propertyPrice < Number(minPrice)) {
        return false;
      }
      if (maxPrice && propertyPrice > Number(maxPrice)) {
        return false;
      }
      
      // Bedroom filter
      if (bedrooms !== 'ALL') {
        if (bedrooms === '5+' && (property.bedrooms ?? 0) < 5) return false;
        if (bedrooms !== '5+' && property.bedrooms !== Number(bedrooms)) return false;
      }
      
      // Bathroom filter
      if (bathrooms !== 'ALL') {
        if (bathrooms === '5+' && (property.bathrooms ?? 0) < 5) return false;
        if (bathrooms !== '5+' && property.bathrooms !== Number(bathrooms)) return false;
      }
      
      // Size filters
      const propertySize = property.size ? Number(property.size) : 0;
      if (minSize && propertySize < Number(minSize)) {
        return false;
      }
      if (maxSize && propertySize > Number(maxSize)) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price ? Number(a.price) : 0) - (b.price ? Number(b.price) : 0);
        case 'price-high':
          return (b.price ? Number(b.price) : 0) - (a.price ? Number(a.price) : 0);
        case 'size':
          return (b.size ? Number(b.size) : 0) - (a.size ? Number(a.size) : 0);
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'recent':
        default:
          return new Date(b.listedDate || 0).getTime() - new Date(a.listedDate || 0).getTime();
      }
    });

  const clearFilters = () => {
    setSearchTerm('');
    setTransactionType('ALL');
    setPropertyType('ALL');
    setLocation('');
    setNewDevelopmentsOnly(false);
    setDistrict('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('ALL');
    setBathrooms('ALL');
    setMinSize('');
    setMaxSize('');
    setFurnished('ALL');
    setSortBy('recent');
  };

  const hasActiveFilters = searchTerm || transactionType !== 'ALL' || propertyType !== 'ALL' || newDevelopmentsOnly ||
    location || district || minPrice || maxPrice || bedrooms !== 'ALL' || 
    bathrooms !== 'ALL' || minSize || maxSize || furnished !== 'ALL';

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-16 text-slate-500">Loading properties…</main>;

  return (
    <main className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Property Listings</p>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">Browse Properties</h1>
          <p className="text-slate-600 mt-2">Find your perfect property from our extensive listings</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filters
          </button>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-10 pr-8 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500 bg-white"
            >
              <option value="recent">Most Recent</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="size">Property Size</option>
              <option value="featured">Featured</option>
            </select>
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Type</label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Types</option>
                  <option value="SALE">For Sale</option>
                  <option value="RENT">For Rent</option>
                  <option value="LEASE">For Lease</option>
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Types</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="VILLA">Villa</option>
                  <option value="OFFICE">Office</option>
                  <option value="SHOP">Shop</option>
                  <option value="WAREHOUSE">Warehouse</option>
                  <option value="LAND">Land</option>
                  <option value="COMMERCIAL_BUILDING">Commercial Building</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City/Location</label>
                <input
                  type="text"
                  placeholder="e.g., Kigali"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  placeholder="e.g., Gasabo"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price Range (RWF)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bathrooms</label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>

              {/* Size Range */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Size Range (sqm)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minSize}
                    onChange={(e) => setMinSize(e.target.value)}
                    className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxSize}
                    onChange={(e) => setMaxSize(e.target.value)}
                    className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Furnished */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Furnishing</label>
                <select
                  value={furnished}
                  onChange={(e) => setFurnished(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">Any</option>
                  <option value="furnished">Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-600">
            {error ? (
              <span className="text-red-600">{error}</span>
            ) : (
              <>
                {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
              </>
            )}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Property Grid */}
        {!error && filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No properties match your search criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const primaryImage = property.propertyImages?.find(img => img.isPrimary) || property.propertyImages?.[0];
              return (
                <Link
                  key={property.id}
                  href={`/properties/${property.slug}`}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Image */}
                  <div className="aspect-video bg-slate-200 relative">
                    {primaryImage ? (
                      <img
                        src={primaryImage.imageUrl}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No image
                      </div>
                    )}
                    {property.featured && (
                      <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 text-slate-900 text-xs font-semibold px-2 py-1 rounded">
                      {property.transactionType}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{property.location || 'Location unavailable'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{property.title}</h3>
                    <p className="text-xl font-bold text-emerald-700 mb-3">
                      {property.price ? (() => {
                        const price = Number(property.price);
                        if (price >= 1000000) {
                          return `RWF ${(price / 1000000).toFixed(0)}M`;
                        } else if (price >= 1000) {
                          return `RWF ${(price / 1000).toFixed(0)}K`;
                        }
                        return `RWF ${price.toLocaleString()}`;
                      })() : 'Price on request'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <BedDouble className="h-4 w-4" />
                        <span>{property.bedrooms ?? '—'} beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms ?? '—'} baths</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Ruler className="h-4 w-4" />
                        <span>{property.size ? (() => {
                          const unit = property.sizeUnit || 'sqm';
                          const unitDisplay = unit === 'sqm' ? 'm²' : unit === 'sqft' ? 'ft²' : unit === 'acres' ? 'acres' : unit === 'hectares' ? 'hectares' : unit;
                          return `${property.size} ${unitDisplay}`;
                        })() : '—'}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <span className="text-emerald-600 font-medium text-sm">View Property →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
