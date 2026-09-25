import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import all pages
import Home from './pages/Home';

// About Us
import OurCompany from './pages/About/OurCompany';
import Mission from './pages/About/Mission';
import Vision from './pages/About/Vision';
import CoreValues from './pages/About/CoreValues';
import WhyChooseUs from './pages/About/WhyChooseUs';

// Properties
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import ForSale from './pages/Properties/ForSale';
import ForRent from './pages/Properties/ForRent';
import ForLease from './pages/Properties/ForLease';
import Residential from './pages/Properties/Residential';
import Commercial from './pages/Properties/Commercial';
import Apartments from './pages/Properties/Apartments';
import Houses from './pages/Properties/Houses';
import Land from './pages/Properties/Land';
import Offices from './pages/Properties/Offices';
import Warehouses from './pages/Properties/Warehouses';
import NewDevelopments from './pages/Properties/NewDevelopments';

// Services
import Services from './pages/Services';
import PropertySales from './pages/Services/PropertySales';
import PropertyRentals from './pages/Services/PropertyRentals';
import PropertyLeasing from './pages/Services/PropertyLeasing';
import PropertyManagement from './pages/Services/PropertyManagement';
import PropertyValuation from './pages/Services/PropertyValuation';
import PropertyMarketing from './pages/Services/PropertyMarketing';
import RealEstateAdvisory from './pages/Services/RealEstateAdvisory';
import PropertySearchServices from './pages/Services/PropertySearchServices';
import PropertyDevelopmentMarketing from './pages/Services/PropertyDevelopmentMarketing';
import RealEstateConsultancy from './pages/Services/RealEstateConsultancy';

// Agents
import Agents from './pages/Agents';
import AgentProfile from './pages/AgentProfile';

// Other Pages
import OurTeam from './pages/OurTeam';
import PropertySearch from './pages/PropertySearch';
import FAQs from './pages/FAQs';
import Contact from './pages/Contact';
import ContactUs from './pages/ContactUs';
import ListYourProperty from './pages/ListYourProperty';
import RequestViewing from './pages/RequestViewing';
import PropertyValuationRequest from './pages/PropertyValuationRequest';
import CompareProperties from './pages/CustomerTools/CompareProperties';
import MortgageCalculator from './pages/CustomerTools/MortgageCalculator';
import RentalYieldCalculator from './pages/CustomerTools/RentalYieldCalculator';
import Favorites from './pages/CustomerTools/Favorites';

// Insights
import Articles from './pages/Insights/Articles';
import News from './pages/Insights/News';
import PropertyGuides from './pages/Insights/PropertyGuides';

// Legal
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsAndConditions from './pages/Legal/TermsAndConditions';
import PropertyDisclaimer from './pages/Legal/PropertyDisclaimer';
import CookiePolicy from './pages/Legal/CookiePolicy';

// Admin pages
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminProperties from './pages/Admin/Properties';
import AdminNewProperty from './pages/Admin/Properties/NewProperty';
import AdminEditProperty from './pages/Admin/Properties/EditProperty';
import AdminCategories from './pages/Admin/Categories';
import AdminAgents from './pages/Admin/Agents';
import AdminInquiries from './pages/Admin/Inquiries';
import AdminViewings from './pages/Admin/Viewings';
import AdminArticles from './pages/Admin/Articles';
import AdminFAQs from './pages/Admin/FAQs';
import AdminTestimonials from './pages/Admin/Testimonials';
import AdminUsers from './pages/Admin/Users';
import AdminSettings from './pages/Admin/Settings';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ── Public site (uses MainLayout) ── */}
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />

                {/* About Us */}
                <Route path="/about/our-company" element={<OurCompany />} />
                <Route path="/about/mission" element={<Mission />} />
                <Route path="/about/vision" element={<Vision />} />
                <Route path="/about/core-values" element={<CoreValues />} />
                <Route path="/about/why-choose-us" element={<WhyChooseUs />} />

                {/* Properties */}
                <Route path="/properties" element={<Properties />} />
                <Route path="/properties/for-sale" element={<ForSale />} />
                <Route path="/properties/for-rent" element={<ForRent />} />
                <Route path="/properties/for-lease" element={<ForLease />} />
                <Route path="/properties/residential" element={<Residential />} />
                <Route path="/properties/commercial" element={<Commercial />} />
                <Route path="/properties/apartments" element={<Apartments />} />
                <Route path="/properties/houses" element={<Houses />} />
                <Route path="/properties/land" element={<Land />} />
                <Route path="/properties/offices" element={<Offices />} />
                <Route path="/properties/warehouses" element={<Warehouses />} />
                <Route path="/properties/new-developments" element={<NewDevelopments />} />
                <Route path="/properties/:propertySlug" element={<PropertyDetails />} />

                {/* Services */}
                <Route path="/services" element={<Services />} />
                <Route path="/services/property-sales" element={<PropertySales />} />
                <Route path="/services/property-rentals" element={<PropertyRentals />} />
                <Route path="/services/property-leasing" element={<PropertyLeasing />} />
                <Route path="/services/property-management" element={<PropertyManagement />} />
                <Route path="/services/property-valuation" element={<PropertyValuation />} />
                <Route path="/services/property-marketing" element={<PropertyMarketing />} />
                <Route path="/services/real-estate-advisory" element={<RealEstateAdvisory />} />
                <Route path="/services/property-search-services" element={<PropertySearchServices />} />
                <Route path="/services/property-development-marketing" element={<PropertyDevelopmentMarketing />} />
                <Route path="/services/real-estate-consultancy" element={<RealEstateConsultancy />} />

                {/* Agents */}
                <Route path="/agents" element={<Agents />} />
                <Route path="/agents/:agentName" element={<AgentProfile />} />

                {/* Other */}
                <Route path="/our-team" element={<OurTeam />} />
                <Route path="/property-search" element={<PropertySearch />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/list-your-property" element={<ListYourProperty />} />
                <Route path="/request-viewing" element={<RequestViewing />} />
                <Route path="/property-valuation" element={<PropertyValuationRequest />} />
                <Route path="/compare-properties" element={<CompareProperties />} />
                <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
                <Route path="/rental-yield-calculator" element={<RentalYieldCalculator />} />
                <Route path="/favorites" element={<Favorites />} />

                {/* Insights */}
                <Route path="/insights/articles" element={<Articles />} />
                <Route path="/insights/news" element={<News />} />
                <Route path="/insights/property-guides" element={<PropertyGuides />} />

                {/* Legal */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/property-disclaimer" element={<PropertyDisclaimer />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
              </Routes>
            </MainLayout>
          }
        />

        {/* ── Admin login (no layout wrapping) ── */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* ── Protected admin portal (uses AdminLayout) ── */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="properties" element={<AdminProperties />} />
                  <Route path="properties/new" element={<AdminNewProperty />} />
                  <Route path="properties/:id/edit" element={<AdminEditProperty />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="agents" element={<AdminAgents />} />
                  <Route path="inquiries" element={<AdminInquiries />} />
                  <Route path="viewings" element={<AdminViewings />} />
                  <Route path="articles" element={<AdminArticles />} />
                  <Route path="faqs" element={<AdminFAQs />} />
                  <Route path="testimonials" element={<AdminTestimonials />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
