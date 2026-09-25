import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ListYourProperty() {
  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    email: '',
    propertyType: '',
    propertyLocation: '',
    transactionType: '',
    expectedPrice: '',
    propertySize: '',
    sizeUnit: 'sqm',
    bedrooms: '',
    bathrooms: '',
    propertyDescription: ''
  });

  const formatPrice = (price: string): string => {
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (isNaN(numericPrice)) return price;
    
    if (numericPrice >= 1000000) {
      return `RWF ${(numericPrice / 1000000).toFixed(0)}M`;
    } else if (numericPrice >= 1000) {
      return `RWF ${(numericPrice / 1000).toFixed(0)}K`;
    }
    return `RWF ${numericPrice.toLocaleString()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Property listing submitted:', formData);
    alert('Property listing request submitted successfully! Your submission will be reviewed by authorized staff before publication.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/services" className="text-emerald-600 hover:underline text-sm font-medium">
            ← Back to Services
          </Link>
        </div>
        
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">List Your Property</h1>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Submitted information shall be reviewed by authorized staff before publication.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ownerName" className="block text-sm font-medium text-slate-700 mb-2">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    required
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-slate-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    required
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select property type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="office">Office</option>
                    <option value="retail">Retail Space</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="land">Land</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="transactionType" className="block text-sm font-medium text-slate-700 mb-2">
                    Transaction Type *
                  </label>
                  <select
                    id="transactionType"
                    name="transactionType"
                    required
                    value={formData.transactionType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select transaction type</option>
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                    <option value="lease">Lease</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="propertyLocation" className="block text-sm font-medium text-slate-700 mb-2">
                  Property Location *
                </label>
                <input
                  type="text"
                  id="propertyLocation"
                  name="propertyLocation"
                  required
                  placeholder="e.g., 123 Main St, City, State"
                  value={formData.propertyLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="expectedPrice" className="block text-sm font-medium text-slate-700 mb-2">
                    Expected Price (RWF) *
                  </label>
                  <input
                    type="number"
                    id="expectedPrice"
                    name="expectedPrice"
                    required
                    placeholder="e.g., 250000000"
                    value={formData.expectedPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  {formData.expectedPrice && (
                    <p className="text-emerald-600 text-sm mt-1 font-medium">
                      {formatPrice(formData.expectedPrice)}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="propertySize" className="block text-sm font-medium text-slate-700 mb-2">
                    Property Size *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      id="propertySize"
                      name="propertySize"
                      required
                      placeholder="e.g., 1500"
                      value={formData.propertySize}
                      onChange={handleChange}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <select
                      id="sizeUnit"
                      name="sizeUnit"
                      value={formData.sizeUnit}
                      onChange={handleChange}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="sqm">m²</option>
                      <option value="sqft">ft²</option>
                      <option value="acres">acres</option>
                      <option value="hectares">hectares</option>
                    </select>
                  </div>
                  {formData.propertySize && (
                    <p className="text-emerald-600 text-sm mt-1 font-medium">
                      {formData.propertySize} {formData.sizeUnit === 'sqm' ? 'm²' : formData.sizeUnit === 'sqft' ? 'ft²' : formData.sizeUnit === 'acres' ? 'acres' : 'hectares'}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Bedrooms
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    min="0"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Bathrooms
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    min="0"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="propertyDescription" className="block text-sm font-medium text-slate-700 mb-2">
                  Property Description *
                </label>
                <textarea
                  id="propertyDescription"
                  name="propertyDescription"
                  rows={4}
                  required
                  value={formData.propertyDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describe your property features, amenities, condition, etc..."
                />
              </div>

              <div>
                <label htmlFor="images" className="block text-sm font-medium text-slate-700 mb-2">
                  Property Images
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  accept="image/*"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-slate-500 text-sm mt-1">Upload property images (optional)</p>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Submit Property Listing
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
