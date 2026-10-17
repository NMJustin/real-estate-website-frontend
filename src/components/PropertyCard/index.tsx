import Image from 'next/image';
import { MapPin, Bed, Bath, Square } from 'lucide-react'; // Using lucide-react for clean icons

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    price: string;
    beds: number;
    baths: number;
    sqft: number;
    location: string;
    image: string;
    transactionType?: string;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer">
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image alt="{property.title}" className="object-cover group-hover:scale-105 transition-transform duration-500" fill src="{property.image}"/>
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
          {property.transactionType === 'SALE' ? 'For Sale' : property.transactionType === 'RENT' ? 'For Rent' : property.transactionType === 'LEASE' ? 'For Lease' : 'For Sale'}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6">
        <div className="text-2xl font-bold text-blue-600 mb-2">{property.price}</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{property.title}</h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1"/>
          <span className="truncate">{property.location}</span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4"/> <span>{property.beds}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4"/> <span>{property.baths}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4"/> <span>{property.sqft} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
}