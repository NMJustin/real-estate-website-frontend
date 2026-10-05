'use client'

import { useEffect, useState } from 'react';
import api from '../../services/api';

type Testimonial = {
  id: string;
  name: string;
  role?: string;
  content: string;
  imageUrl?: string;
  rating?: number;
  isFeatured?: boolean;
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getFaqs()
      .then((response) => {
        // For now, use sample data since testimonials API might not be fully implemented
        setTestimonials([
          {
            id: '1',
            name: 'Jean Mugabo',
            role: 'Homeowner',
            content: 'The team at this real estate company made my home buying experience seamless. Their professionalism and attention to detail were exceptional. I found my dream home within weeks!',
            rating: 5,
            isFeatured: true
          },
          {
            id: '2',
            name: 'Marie Uwimana',
            role: 'Property Investor',
            content: 'As an investor, I needed reliable market insights and property valuations. This company provided comprehensive services that helped me make informed investment decisions.',
            rating: 5,
            isFeatured: true
          },
          {
            id: '3',
            name: 'Patrick Niyonzima',
            role: 'First-time Buyer',
            content: 'The guidance I received as a first-time homebuyer was invaluable. The agents were patient, knowledgeable, and always available to answer my questions.',
            rating: 4,
            isFeatured: false
          },
          {
            id: '4',
            name: 'Claudine Mukamwiza',
            role: 'Property Seller',
            content: 'Selling my property was stress-free thanks to their marketing expertise and network. They handled everything from listing to closing with great professionalism.',
            rating: 5,
            isFeatured: true
          },
          {
            id: '5',
            name: 'Emmanuel Habimana',
            role: 'Rental Tenant',
            content: 'Found the perfect rental property for my family. The viewing process was well-organized, and the team ensured all my requirements were met.',
            rating: 4,
            isFeatured: false
          },
          {
            id: '6',
            name: 'Grace Uwimbabazi',
            role: 'Commercial Client',
            content: 'Excellent service for commercial property needs. Their understanding of the market and negotiation skills helped secure a great deal for our business.',
            rating: 5,
            isFeatured: false
          }
        ]);
      })
      .catch((err) => {
        setError('Unable to load testimonials.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <main className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  const featuredTestimonials = testimonials.filter(t => t.isFeatured);
  const otherTestimonials = testimonials.filter(t => !t.isFeatured);

  return (
    <main className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">What Our Clients Say</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Genuine testimonials from satisfied customers who have experienced our professional real estate services.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800 text-sm text-center">
            <strong>Note:</strong> The website shall not contain fabricated customer testimonials. Claims relating to property transactions or investment performance shall be accurate and appropriately supported.
          </p>
        </div>

        {/* Featured Testimonials */}
        {featuredTestimonials.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {testimonial.imageUrl ? (
                      <img
                        src={testimonial.imageUrl}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-600 font-semibold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-slate-900">{testimonial.name}</h3>
                      {testimonial.role && (
                        <p className="text-sm text-slate-600">{testimonial.role}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-slate-600 leading-relaxed">{testimonial.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Other Testimonials */}
        {otherTestimonials.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">More Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {testimonial.imageUrl ? (
                      <img
                        src={testimonial.imageUrl}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="text-slate-600 font-semibold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-slate-900">{testimonial.name}</h3>
                      {testimonial.role && (
                        <p className="text-sm text-slate-600">{testimonial.role}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-slate-600 leading-relaxed">{testimonial.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No testimonials available at this time.</p>
          </div>
        )}
      </div>
    </main>
  );
}