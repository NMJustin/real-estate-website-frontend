import { Link } from 'react-router-dom';

export default function PropertySales() {
  return (
    <main className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/services" className="text-emerald-600 hover:underline text-sm font-medium">
            ← Back to Services
          </Link>
        </div>
        
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Find the Right Property to Buy</h1>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <p className="text-slate-600 mb-6 leading-relaxed">
              The company assists buyers in exploring available properties and identifying opportunities that match their requirements. 
              Our Property Sales service provides comprehensive support throughout your property buying journey.
            </p>
            
            <h2 className="text-xl font-bold text-slate-900 mb-4">Our Services</h2>
            <ul className="space-y-3 text-slate-600 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Property search</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Property viewing coordination</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Property information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Buyer support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Transaction coordination</span>
              </li>
            </ul>
            
            <Link
              to="/properties/for-sale"
              className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Explore Properties for Sale
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
