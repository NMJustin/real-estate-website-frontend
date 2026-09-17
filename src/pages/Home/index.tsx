import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { PropertyCard, PropertyProps } from '../../components/ui/PropertyCard';
import { Input } from '../../components/ui/Input';

const mockProperties: PropertyProps[] = [
  {
    id: '1',
    slug: 'modern-downtown-apartment',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'For Sale',
    type: 'Apartment',
    price: ',000',
    location: '123 Downtown Ave, Cityville',
    bedrooms: 2,
    bathrooms: 2,
    size: '1,200 sqft',
    features: ['Balcony', 'Gym', 'Pool']
  },
  {
    id: '2',
    slug: 'luxury-suburban-house',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'For Rent',
    type: 'House',
    price: ',500 / mo',
    location: '456 Oak Lane, Suburbia',
    bedrooms: 4,
    bathrooms: 3,
    size: '2,800 sqft',
    features: ['Large Yard', 'Garage', 'Fireplace']
  },
  {
    id: '3',
    slug: 'commercial-office-space',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'For Sale',
    type: 'Commercial',
    price: ',200,000',
    location: '789 Business Blvd, Metropolis',
    bedrooms: 0,
    bathrooms: 4,
    size: '5,000 sqft',
    features: ['Conference Room', 'High-Speed Internet']
  }
];

export default function Home() {
  return (
    <div className="w-full">
      {/* 1. Hero & Property Search */}
      <section className="relative w-full h-[600px] flex flex-col items-center justify-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Beautiful Home" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Find a Place to Call Home</h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10">Discover residential, commercial and investment properties that match your needs and goals.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/properties"><Button variant="primary" className="text-lg px-8 py-3">Explore Properties</Button></Link>
            <Link to="/list-your-property"><Button variant="secondary" className="text-lg px-8 py-3">List Your Property</Button></Link>
          </div>
        </div>

        {/* Search Component overlaying hero bottom */}
        <div className="absolute -bottom-16 w-full max-w-5xl px-4 z-20 hidden md:block">
          <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-5 gap-4 items-end border border-slate-100">
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">I want to</label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald">
                <option>Buy</option>
                <option>Rent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Location</label>
              <input type="text" placeholder="City, Zip, Address" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Property Type</label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald">
                <option>Any</option>
                <option>House</option>
                <option>Apartment</option>
                <option>Commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Price Range</label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald">
                <option>Any Price</option>
                <option> - </option>
                <option> - </option>
                <option>+</option>
              </select>
            </div>
            <div>
              <Button variant="primary" className="w-full h-11">Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Properties */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-0">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
            <p className="text-brand-charcoal">Hand-picked properties for you.</p>
          </div>
          <Link to="/properties" className="text-brand-emerald hover:text-brand-emerald-hover font-medium">View All Properties &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockProperties.map(prop => <PropertyCard key={prop.id} property={prop} />)}
        </div>
      </section>

      {/* 3. Services */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-brand-charcoal max-w-2xl mx-auto">Comprehensive real estate solutions designed to provide you with the best outcomes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-3">Property Sales</h3>
              <p className="text-slate-600 mb-6">Expert guidance through buying or selling properties with maximum value.</p>
              <Link to="/services/property-sales"><Button variant="ghost">Learn More</Button></Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-3">Property Leasing</h3>
              <p className="text-slate-600 mb-6">Connecting landlords with reliable tenants through efficient processes.</p>
              <Link to="/services/property-leasing"><Button variant="ghost">Learn More</Button></Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-3">Property Management</h3>
              <p className="text-slate-600 mb-6">Complete management solutions to protect and grow your investment.</p>
              <Link to="/services/property-management"><Button variant="ghost">Learn More</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. About / Why Choose Us */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="About Us" className="rounded-2xl shadow-lg" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6">Why Choose RealEstate?</h2>
          <p className="text-lg text-slate-600 mb-6">With over 15 years of market experience, we provide transparent, modern, and trustworthy real estate services tailored specifically for you.</p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-slate-700">
              <span className="text-brand-emerald">?</span> Expert Local Knowledge
            </li>
            <li className="flex items-center gap-3 text-slate-700">
              <span className="text-brand-emerald">?</span> Transparent Pricing & Processes
            </li>
            <li className="flex items-center gap-3 text-slate-700">
              <span className="text-brand-emerald">?</span> Dedicated Agent Support
            </li>
          </ul>
          <Link to="/about/why-choose-us"><Button variant="primary">Read Our Story</Button></Link>
        </div>
      </section>

      {/* 5. Contact CTA */}
      <section className="bg-brand-navy py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to take the next step?</h2>
          <p className="text-slate-300 text-lg mb-10">Contact our experts today to discuss your real estate needs.</p>
          <Link to="/contact"><Button variant="primary" className="text-lg px-8 py-3 bg-white text-brand-navy hover:bg-slate-100">Contact Us Now</Button></Link>
        </div>
      </section>
    </div>
  );
}
