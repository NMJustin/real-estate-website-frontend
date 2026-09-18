import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-brand-navy text-slate-300 py-12 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Intro */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-white text-xl font-bold mb-4">Nihohange Real Estate</h4>
            <p className="text-sm text-gray-400">
              Helping you discover, buy, rent, and manage property with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-white transition-colors" to="/properties">Properties</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/agents">Our Agents</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/about/our-company">About Us</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-white transition-colors" to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/terms-and-conditions">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Customer tools */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-white transition-colors" to="/property-search">Search properties</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/compare-properties">Compare properties</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/mortgage-calculator">Mortgage calculator</Link></li>
              <li><Link className="hover:text-white transition-colors" to="/rental-yield-calculator">Rental yield calculator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="tel:+250781830071" className="hover:text-white transition-colors">+250 781830071</a></li>
              <li><a href="mailto:contact@nihohange.com" className="hover:text-white transition-colors">contact@nihohange.com</a></li>
              <li><a href="https://wa.me/250781830071" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">WhatsApp</a></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Kigali, Rwanda and directions</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} RealEstate Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;