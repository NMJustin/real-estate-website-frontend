'use client'

import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  AlertCircle,
  X,
  Save,
  Phone,
  Mail,
  MapPin,
  Share2,
  Shield,
  ShieldCheck,
  Lock,
  Clock,
  Activity,
  KeyRound,
  CheckCircle,
  AlertTriangle,
  Database,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '@/services/api';

interface ContactSettings {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

interface HomepageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaLink: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutCtaText: string;
  aboutCtaLink: string;
  servicesTitle: string;
  servicesDescription: string;
  showFeaturedSection: boolean;
  featuredSectionTitle: string;
  showServicesSection: boolean;
  showAboutSection: boolean;
}

interface SystemSettings {
  siteName: string;
  siteTagline: string;
  logoUrl: string;
  faviconUrl: string;
}

interface SecuritySettings {
  analyticsRetentionDays: number;
  inactivityTimeoutMinutes: number;
  warningTimeoutMinutes: number;
  maxAuthAttempts: number;
  authWindowMinutes: number;
  contactRateLimitPerHour: number;
  searchRateLimitPerMin: number;
  globalRateLimit: number;
  minPasswordLength: number;
  maxPasswordLength: number;
  csrfProtectionEnabled: boolean;
  crossTabSyncEnabled: boolean;
}

interface AllSettings {
  contact: ContactSettings;
  homepage: HomepageSettings;
  system: SystemSettings;
  security: SecuritySettings;
}

const defaultSettings: AllSettings = {
  contact: {
    phone: '+250 796 593 119',
    email: 'ingatatechnologiesltd@gmail.com',
    whatsapp: '+250796593119',
    address: 'KG 11 Ave, Zindiro, AZAM Rond Point, Gasabo-Kigali',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
  },
  homepage: {
    heroTitle: 'Find a Place to Call Home',
    heroSubtitle: 'Discover residential, commercial and investment properties that match your needs and goals.',
    heroCtaText: 'Explore Properties',
    heroCtaLink: '/properties',
    aboutTitle: 'About Ingata Real Estate',
    aboutDescription: 'Ingata Real Estate is a real estate company providing property sales, rentals, property management, marketing and related real estate services.',
    aboutCtaText: 'Learn More About Us',
    aboutCtaLink: '/about/our-company',
    servicesTitle: 'Our Services',
    servicesDescription: 'Comprehensive real estate solutions tailored for you.',
    showFeaturedSection: true,
    featuredSectionTitle: 'Featured Properties',
    showServicesSection: true,
    showAboutSection: true,
  },
  system: {
    siteName: 'Ingata Real Estate',
    siteTagline: 'Your Trusted Real Estate Partner',
    logoUrl: '',
    faviconUrl: '',
  },
  security: {
    analyticsRetentionDays: 365,
    inactivityTimeoutMinutes: 5,
    warningTimeoutMinutes: 3,
    maxAuthAttempts: 5,
    authWindowMinutes: 15,
    contactRateLimitPerHour: 3,
    searchRateLimitPerMin: 30,
    globalRateLimit: 100,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    csrfProtectionEnabled: true,
    crossTabSyncEnabled: true,
  },
};

const mergeSavedSettings = (saved: Record<string, unknown>, defaults: AllSettings): AllSettings => ({
  contact: {
    ...defaults.contact,
    phone: typeof saved.phone === 'string' ? saved.phone : defaults.contact.phone,
    email: typeof saved.email === 'string' ? saved.email : defaults.contact.email,
    whatsapp: typeof saved.whatsapp === 'string' ? saved.whatsapp : defaults.contact.whatsapp,
    address: typeof saved.address === 'string' ? saved.address : defaults.contact.address,
    facebook: typeof saved.facebookUrl === 'string' ? saved.facebookUrl : defaults.contact.facebook,
    twitter: typeof saved.xUrl === 'string' ? saved.xUrl : defaults.contact.twitter,
    instagram: typeof saved.instagramUrl === 'string' ? saved.instagramUrl : defaults.contact.instagram,
    linkedin: typeof saved.linkedinUrl === 'string' ? saved.linkedinUrl : defaults.contact.linkedin,
  },
  homepage: {
    ...defaults.homepage,
    heroTitle: typeof saved.heroTitle === 'string' ? saved.heroTitle : defaults.homepage.heroTitle,
    heroSubtitle: typeof saved.heroSubtitle === 'string' ? saved.heroSubtitle : defaults.homepage.heroSubtitle,
    heroCtaText: typeof saved.heroCtaText === 'string' ? saved.heroCtaText : defaults.homepage.heroCtaText,
    heroCtaLink: typeof saved.heroCtaLink === 'string' ? saved.heroCtaLink : defaults.homepage.heroCtaLink,
    aboutTitle: typeof saved.aboutTitle === 'string' ? saved.aboutTitle : defaults.homepage.aboutTitle,
    aboutDescription: typeof saved.aboutDescription === 'string' ? saved.aboutDescription : defaults.homepage.aboutDescription,
    aboutCtaText: typeof saved.aboutCtaText === 'string' ? saved.aboutCtaText : defaults.homepage.aboutCtaText,
    aboutCtaLink: typeof saved.aboutCtaLink === 'string' ? saved.aboutCtaLink : defaults.homepage.aboutCtaLink,
    servicesTitle: typeof saved.servicesTitle === 'string' ? saved.servicesTitle : defaults.homepage.servicesTitle,
    servicesDescription: typeof saved.servicesDescription === 'string' ? saved.servicesDescription : defaults.homepage.servicesDescription,
    featuredSectionTitle: typeof saved.featuredSectionTitle === 'string' ? saved.featuredSectionTitle : defaults.homepage.featuredSectionTitle,
    showFeaturedSection: typeof saved.showFeaturedSection === 'boolean' ? saved.showFeaturedSection : defaults.homepage.showFeaturedSection,
    showServicesSection: typeof saved.showServicesSection === 'boolean' ? saved.showServicesSection : defaults.homepage.showServicesSection,
    showAboutSection: typeof saved.showAboutSection === 'boolean' ? saved.showAboutSection : defaults.homepage.showAboutSection,
  },
  system: {
    ...defaults.system,
    siteName: typeof saved.siteName === 'string' ? saved.siteName : defaults.system.siteName,
    logoUrl: typeof saved.logoUrl === 'string' ? saved.logoUrl : defaults.system.logoUrl,
    faviconUrl: typeof saved.faviconUrl === 'string' ? saved.faviconUrl : defaults.system.faviconUrl,
  },
  security: {
    ...defaults.security,
    analyticsRetentionDays: typeof saved.analyticsRetentionDays === 'number'
      ? saved.analyticsRetentionDays
      : typeof saved.analytics_retention_days === 'number'
      ? saved.analytics_retention_days
      : defaults.security.analyticsRetentionDays,
  },
});

export default function Settings() {
  const [settings, setSettings] = useState<AllSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'homepage' | 'system' | 'security'>('contact');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getSettings();
      const result = response as { success: boolean; data: Record<string, unknown> };
      if (result.success && result.data) {
        setSettings((current) => mergeSavedSettings(result.data, current));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError('Failed to load settings. Using default values.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const response = await adminApi.updateSettings({
        siteName: settings.system.siteName,
        logoUrl: settings.system.logoUrl,
        faviconUrl: settings.system.faviconUrl,
        email: settings.contact.email,
        phone: settings.contact.phone,
        whatsapp: settings.contact.whatsapp,
        address: settings.contact.address,
        facebookUrl: settings.contact.facebook,
        xUrl: settings.contact.twitter,
        instagramUrl: settings.contact.instagram,
        linkedinUrl: settings.contact.linkedin,
        heroTitle: settings.homepage.heroTitle,
        heroSubtitle: settings.homepage.heroSubtitle,
        heroCtaText: settings.homepage.heroCtaText,
        heroCtaLink: settings.homepage.heroCtaLink,
        aboutTitle: settings.homepage.aboutTitle,
        aboutDescription: settings.homepage.aboutDescription,
        aboutCtaText: settings.homepage.aboutCtaText,
        aboutCtaLink: settings.homepage.aboutCtaLink,
        servicesTitle: settings.homepage.servicesTitle,
        servicesDescription: settings.homepage.servicesDescription,
        featuredSectionTitle: settings.homepage.featuredSectionTitle,
        showFeaturedSection: settings.homepage.showFeaturedSection,
        showServicesSection: settings.homepage.showServicesSection,
        showAboutSection: settings.homepage.showAboutSection,
        analyticsRetentionDays: Number(settings.security.analyticsRetentionDays) || 365,
      });
      if ((response as { success: boolean }).success) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError('Failed to save settings');
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleContactChange = (field: keyof ContactSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handleHomepageChange = (field: keyof HomepageSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      homepage: { ...prev.homepage, [field]: value }
    }));
  };

  const handleSystemChange = (field: keyof SystemSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      system: { ...prev.system, [field]: value }
    }));
  };

  const handleSecurityChange = (field: keyof SecuritySettings, value: number) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [field]: value }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Manage contact information, homepage content, system identity, and security policies.
        </p>
      </div>

      <div className="border-b border-slate-200">
        <nav className="flex gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'contact'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Contact Information
          </button>
          <button
            onClick={() => setActiveTab('homepage')}
            className={`pb-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'homepage'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Homepage Content
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`pb-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === 'system'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            System Settings
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'security'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Shield className="h-4 w-4" />
            Security & Policies
          </button>
        </nav>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Error</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError('')}
            className="rounded p-1 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {message && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
          <span className="text-sm font-medium">{message}</span>
          <button
            type="button"
            onClick={() => setMessage('')}
            className="ml-auto rounded p-1 hover:bg-emerald-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* CONTACT TAB */}
      {activeTab === 'contact' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Contact Information</h2>
            <p className="text-sm text-slate-500">
              Update the company's contact details displayed on the website.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="tel"
                    value={settings.contact.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="+250 7XX XXX XXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={settings.contact.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="company@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="tel"
                    value={settings.contact.whatsapp}
                    onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="+250 7XX XXX XXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Physical Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={settings.contact.address}
                    onChange={(e) => handleContactChange('address', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="City, District, Country"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-md font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-slate-400" />
                Social Media Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={settings.contact.facebook}
                    onChange={(e) => handleContactChange('facebook', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="https://facebook.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    X (Twitter) URL
                  </label>
                  <input
                    type="url"
                    value={settings.contact.twitter}
                    onChange={(e) => handleContactChange('twitter', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="https://twitter.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={settings.contact.instagram}
                    onChange={(e) => handleContactChange('instagram', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={settings.contact.linkedin}
                    onChange={(e) => handleContactChange('linkedin', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* HOMEPAGE TAB */}
      {activeTab === 'homepage' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Homepage Content</h2>
            <p className="text-sm text-slate-500">
              Customize text and visibility of sections on the landing page.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-md font-semibold text-slate-900 mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={settings.homepage.heroTitle}
                    onChange={(e) => handleHomepageChange('heroTitle', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={settings.homepage.heroSubtitle}
                    onChange={(e) => handleHomepageChange('heroSubtitle', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={settings.homepage.heroCtaText}
                      onChange={(e) => handleHomepageChange('heroCtaText', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      CTA Button Link
                    </label>
                    <input
                      type="text"
                      value={settings.homepage.heroCtaLink}
                      onChange={(e) => handleHomepageChange('heroCtaLink', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-md font-semibold text-slate-900 mb-4">About Section</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    About Title
                  </label>
                  <input
                    type="text"
                    value={settings.homepage.aboutTitle}
                    onChange={(e) => handleHomepageChange('aboutTitle', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    About Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.homepage.aboutDescription}
                    onChange={(e) => handleHomepageChange('aboutDescription', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={settings.homepage.aboutCtaText}
                      onChange={(e) => handleHomepageChange('aboutCtaText', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      CTA Button Link
                    </label>
                    <input
                      type="text"
                      value={settings.homepage.aboutCtaLink}
                      onChange={(e) => handleHomepageChange('aboutCtaLink', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-md font-semibold text-slate-900 mb-4">Section Visibility</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showFeaturedSection"
                    checked={settings.homepage.showFeaturedSection}
                    onChange={(e) => handleHomepageChange('showFeaturedSection', e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="showFeaturedSection" className="text-sm text-slate-700">
                    Show Featured Properties Section
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showServicesSection"
                    checked={settings.homepage.showServicesSection}
                    onChange={(e) => handleHomepageChange('showServicesSection', e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="showServicesSection" className="text-sm text-slate-700">
                    Show Services Section
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showAboutSection"
                    checked={settings.homepage.showAboutSection}
                    onChange={(e) => handleHomepageChange('showAboutSection', e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="showAboutSection" className="text-sm text-slate-700">
                    Show About Section
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* SYSTEM TAB */}
      {activeTab === 'system' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">System Settings</h2>
            <p className="text-sm text-slate-500">
              Configure site-wide identity and branding.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.system.siteName}
                onChange={(e) => handleSystemChange('siteName', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Site Tagline
              </label>
              <input
                type="text"
                value={settings.system.siteTagline}
                onChange={(e) => handleSystemChange('siteTagline', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={settings.system.logoUrl}
                  onChange={(e) => handleSystemChange('logoUrl', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Favicon URL
                </label>
                <input
                  type="url"
                  value={settings.system.faviconUrl}
                  onChange={(e) => handleSystemChange('faviconUrl', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* SECURITY SETTINGS TAB */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Security Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2.5 text-emerald-700">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Inactivity Protection</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{settings.security.inactivityTimeoutMinutes}m Auto-Logout</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Warning modal appears {settings.security.warningTimeoutMinutes}m before session timeout with live countdown.
              </p>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2.5 text-blue-700">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-800">Rate Limiting</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">Active & Throttled</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                {settings.security.maxAuthAttempts} auth attempts / 15m; {settings.security.contactRateLimitPerHour} inquiries / hr per IP.
              </p>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2.5 text-purple-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-800">Access Control</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">RBAC & Scoped</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Granular media upload permissions and property manager ownership verification.
              </p>
            </div>

            <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-teal-100 p-2.5 text-teal-700">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">Data Privacy</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">GDPR & CSRF Guard</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Double-submit CSRF validation and automated analytics retention lifecycle.
              </p>
            </div>
          </div>

          {/* Security Policy Configuration Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                Security Policies & Architecture
              </h2>
              <p className="text-sm text-slate-500">
                Review and configure system protection parameters based on active security features.
              </p>
            </div>

            {/* 1. Analytics & Data Retention */}
            <div className="border-t border-slate-200 pt-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-600" />
                1. Data Privacy & Analytics Retention
              </h3>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1">
                      Analytics Retention Period (Days)
                    </label>
                    <p className="text-xs text-slate-500">
                      Page views and property clicks older than this threshold are purged for data minimization.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={30}
                      max={1825}
                      value={settings.security.analyticsRetentionDays}
                      onChange={(e) => handleSecurityChange('analyticsRetentionDays', Number(e.target.value))}
                      className="w-36 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                    <span className="text-sm font-medium text-slate-600">days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Session & Idle Timeout */}
            <div className="border-t border-slate-200 pt-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                2. Session & Inactivity Protection
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-lg border border-slate-200 p-4 bg-white">
                  <span className="block text-xs font-semibold text-slate-500 uppercase">Inactivity Limit</span>
                  <p className="mt-1 text-lg font-bold text-slate-900">5 Minutes</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Automatic logout triggered when no mouse, scroll, or keyboard event occurs.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4 bg-white">
                  <span className="block text-xs font-semibold text-slate-500 uppercase">Warning Window</span>
                  <p className="mt-1 text-lg font-bold text-slate-900">3 Minutes</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Live modal popup prompting user to extend session or sign out securely.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4 bg-white">
                  <span className="block text-xs font-semibold text-slate-500 uppercase">Multi-Tab Sync</span>
                  <p className="mt-1 text-lg font-bold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4" /> Synchronized
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Activity and logout events sync across tabs via BroadcastChannel & LocalStorage.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. API Rate Limiting Thresholds */}
            <div className="border-t border-slate-200 pt-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-600" />
                3. Rate Limiting & Anti-Abuse Safeguards
              </h3>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold text-slate-600">Endpoint Category</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-slate-600">Window</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-slate-600">Threshold</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-slate-600">Protection Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="px-4 py-3 font-medium text-slate-900">Authentication (/auth/*)</td>
                      <td className="px-4 py-3 text-slate-600">15 minutes</td>
                      <td className="px-4 py-3 font-semibold text-rose-700">5 requests / IP</td>
                      <td className="px-4 py-3 text-slate-500">Credential brute-force prevention</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-slate-900">Inquiries & Contact Messages</td>
                      <td className="px-4 py-3 text-slate-600">60 minutes</td>
                      <td className="px-4 py-3 font-semibold text-amber-700">3 submissions / IP</td>
                      <td className="px-4 py-3 text-slate-500">Spam bot & email flooding mitigation</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-slate-900">Property Search Queries</td>
                      <td className="px-4 py-3 text-slate-600">1 minute</td>
                      <td className="px-4 py-3 font-semibold text-blue-700">30 requests / IP</td>
                      <td className="px-4 py-3 text-slate-500">Database query scraping protection</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-slate-900">Global API Endpoints</td>
                      <td className="px-4 py-3 text-slate-600">15 minutes</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">100 requests / IP</td>
                      <td className="px-4 py-3 text-slate-500">Denial-of-Service (DoS) mitigation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Password & Credential Standards */}
            <div className="border-t border-slate-200 pt-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-emerald-600" />
                4. Password & Authorization Controls
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
                    <Lock className="h-4 w-4 text-slate-600" /> Password Strength Rule
                  </div>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      Minimum length: 8 characters required
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      Maximum length: 128 characters cap
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      BCrypt salted hash storage
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
                    <ShieldCheck className="h-4 w-4 text-slate-600" /> Granular Permissions
                  </div>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      Property managers: Full upload permission by role
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      Agents & Owners: Individual explicit admin grant
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      Ownership middleware verifies property-manager association
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Security Settings'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
