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
  RotateCcw,
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
  sessionTimeoutMinutes: number;
  sessionWarningMinutes: number;
  minPasswordLength: number;
  maxPasswordLength: number;
  maxAuthAttempts: number;
  authRateLimitWindowMinutes: number;
  contactRateLimitPerHour: number;
  searchRateLimitPerMinute: number;
  globalRateLimit: number;
  csrfProtectionEnabled: boolean;
  crossTabSyncEnabled: boolean;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
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
    facebook: 'https://www.facebook.com',
    twitter: 'https://x.com/GlobalOncg25',
    instagram: 'https://www.instagram.com',
    linkedin: 'https://www.linkedin.com/company/ingata-technologies-ltd/',
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
    sessionTimeoutMinutes: 5,
    sessionWarningMinutes: 3,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    maxAuthAttempts: 5,
    authRateLimitWindowMinutes: 15,
    contactRateLimitPerHour: 3,
    searchRateLimitPerMinute: 30,
    globalRateLimit: 100,
    csrfProtectionEnabled: true,
    crossTabSyncEnabled: true,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
};

const toNumber = (val: unknown, fallback: number): number => {
  if (typeof val === 'number' && !Number.isNaN(val)) return val;
  if (typeof val === 'string' && val.trim() !== '') {
    const parsed = Number(val);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
};

const toBoolean = (val: unknown, fallback: boolean): boolean => {
  if (typeof val === 'boolean') return val;
  if (val === 'true') return true;
  if (val === 'false') return false;
  return fallback;
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
    showFeaturedSection: toBoolean(saved.showFeaturedSection ?? saved.show_featured_section, defaults.homepage.showFeaturedSection),
    showServicesSection: toBoolean(saved.showServicesSection ?? saved.show_services_section, defaults.homepage.showServicesSection),
    showAboutSection: toBoolean(saved.showAboutSection ?? saved.show_about_section, defaults.homepage.showAboutSection),
  },
  system: {
    ...defaults.system,
    siteName: typeof saved.siteName === 'string' ? saved.siteName : defaults.system.siteName,
    logoUrl: typeof saved.logoUrl === 'string' ? saved.logoUrl : defaults.system.logoUrl,
    faviconUrl: typeof saved.faviconUrl === 'string' ? saved.faviconUrl : defaults.system.faviconUrl,
  },
  security: {
    analyticsRetentionDays: toNumber(saved.analyticsRetentionDays ?? saved.analytics_retention_days, defaults.security.analyticsRetentionDays),
    sessionTimeoutMinutes: toNumber(saved.sessionTimeoutMinutes ?? saved.session_timeout_minutes, defaults.security.sessionTimeoutMinutes),
    sessionWarningMinutes: toNumber(saved.sessionWarningMinutes ?? saved.session_warning_minutes, defaults.security.sessionWarningMinutes),
    minPasswordLength: toNumber(saved.minPasswordLength ?? saved.min_password_length, defaults.security.minPasswordLength),
    maxPasswordLength: toNumber(saved.maxPasswordLength ?? saved.max_password_length, defaults.security.maxPasswordLength),
    maxAuthAttempts: toNumber(saved.maxAuthAttempts ?? saved.max_auth_attempts, defaults.security.maxAuthAttempts),
    authRateLimitWindowMinutes: toNumber(saved.authRateLimitWindowMinutes ?? saved.auth_rate_limit_window_minutes, defaults.security.authRateLimitWindowMinutes),
    contactRateLimitPerHour: toNumber(saved.contactRateLimitPerHour ?? saved.contact_rate_limit_per_hour, defaults.security.contactRateLimitPerHour),
    searchRateLimitPerMinute: toNumber(saved.searchRateLimitPerMinute ?? saved.search_rate_limit_per_minute, defaults.security.searchRateLimitPerMinute),
    globalRateLimit: toNumber(saved.globalRateLimit ?? saved.global_rate_limit, defaults.security.globalRateLimit),
    csrfProtectionEnabled: toBoolean(saved.csrfProtectionEnabled ?? saved.csrf_protection_enabled, defaults.security.csrfProtectionEnabled),
    crossTabSyncEnabled: toBoolean(saved.crossTabSyncEnabled ?? saved.cross_tab_sync_enabled, defaults.security.crossTabSyncEnabled),
    requireUppercase: toBoolean(saved.requireUppercase ?? saved.require_uppercase, defaults.security.requireUppercase),
    requireLowercase: toBoolean(saved.requireLowercase ?? saved.require_lowercase, defaults.security.requireLowercase),
    requireNumbers: toBoolean(saved.requireNumbers ?? saved.require_numbers, defaults.security.requireNumbers),
    requireSpecialChars: toBoolean(saved.requireSpecialChars ?? saved.require_special_chars, defaults.security.requireSpecialChars),
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
        setSettings((current) => {
          const merged = mergeSavedSettings(result.data, current);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('site_security_settings', JSON.stringify(merged.security));
            } catch {}
          }
          return merged;
        });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError('Failed to load settings. Using default values.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate security relationships
    if (settings.security.sessionWarningMinutes >= settings.security.sessionTimeoutMinutes) {
      setError('Session early warning window must be less than the total inactivity timeout.');
      return;
    }
    if (settings.security.minPasswordLength >= settings.security.maxPasswordLength) {
      setError('Minimum password length must be less than maximum password length.');
      return;
    }

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
        sessionTimeoutMinutes: Number(settings.security.sessionTimeoutMinutes) || 5,
        sessionWarningMinutes: Number(settings.security.sessionWarningMinutes) || 3,
        minPasswordLength: Number(settings.security.minPasswordLength) || 8,
        maxPasswordLength: Number(settings.security.maxPasswordLength) || 128,
        maxAuthAttempts: Number(settings.security.maxAuthAttempts) || 5,
        authRateLimitWindowMinutes: Number(settings.security.authRateLimitWindowMinutes) || 15,
        contactRateLimitPerHour: Number(settings.security.contactRateLimitPerHour) || 3,
        searchRateLimitPerMinute: Number(settings.security.searchRateLimitPerMinute) || 30,
        globalRateLimit: Number(settings.security.globalRateLimit) || 100,
        csrfProtectionEnabled: Boolean(settings.security.csrfProtectionEnabled),
        crossTabSyncEnabled: Boolean(settings.security.crossTabSyncEnabled),
        requireUppercase: Boolean(settings.security.requireUppercase),
        requireLowercase: Boolean(settings.security.requireLowercase),
        requireNumbers: Boolean(settings.security.requireNumbers),
        requireSpecialChars: Boolean(settings.security.requireSpecialChars),
      });

      if ((response as { success: boolean }).success) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('site_security_settings', JSON.stringify(settings.security));
          } catch {}
        }
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const failureMsg = (response as { message?: string })?.message || 'Failed to save settings';
        setError(failureMsg);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
      const errMsg = err instanceof Error ? err.message : 'Failed to save settings. Please try again.';
      setError(errMsg);
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

  const handleSecurityNumberChange = (field: keyof SecuritySettings, value: number) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [field]: value }
    }));
  };

  const handleSecurityBooleanChange = (field: keyof SecuritySettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [field]: value }
    }));
  };

  const handleResetSecurityDefaults = () => {
    setSettings(prev => ({
      ...prev,
      security: { ...defaultSettings.security }
    }));
    setMessage('Security settings reset to recommended defaults. Click "Save Changes" to apply.');
    setTimeout(() => setMessage(''), 4000);
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
                    placeholder="https://www.facebook.com/..."
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
                    placeholder="https://x.com/..."
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
                    placeholder="https://www.instagram.com/..."
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
                    placeholder="https://www.linkedin.com/company/..."
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
          {/* Top Dynamic Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2.5 text-emerald-700">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Inactivity Timeout</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{settings.security.sessionTimeoutMinutes} min</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Warning triggers {settings.security.sessionWarningMinutes} min before logout.
              </p>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2.5 text-blue-700">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-800">Auth Rate Limit</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {settings.security.maxAuthAttempts} req / {settings.security.authRateLimitWindowMinutes} min
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Contact: {settings.security.contactRateLimitPerHour}/hr, Search: {settings.security.searchRateLimitPerMinute}/min.
              </p>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2.5 text-purple-700">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-800">Password Policy</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {settings.security.minPasswordLength} – {settings.security.maxPasswordLength} chars
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Enforced on user registration and password updates.
              </p>
            </div>

            <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-teal-100 p-2.5 text-teal-700">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">Analytics Retention</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{settings.security.analyticsRetentionDays} days</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Automated data cleanup threshold for privacy minimization.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  Security Configuration
                </h2>
                <p className="text-sm text-slate-500">
                  Configure session intervals, credential strength, rate limits, and data retention rules.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetSecurityDefaults}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" /> Reset Defaults
              </button>
            </div>

            {/* SECTION 1: Session & Inactivity Protection */}
            <div className="border-t border-slate-200 pt-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                1. Session & Inactivity Controls
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Define idle timeout duration and the pre-logout alert window for active admin and portal sessions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Inactivity Timeout (Minutes)
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Time without interaction before the user is automatically logged out (Recommended: 5-30 min).
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={settings.security.sessionTimeoutMinutes}
                      onChange={(e) => handleSecurityNumberChange('sessionTimeoutMinutes', Number(e.target.value))}
                      className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                    <span className="text-sm text-slate-600 font-medium">minutes</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Early Warning Dialog (Minutes)
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Minutes before timeout when the warning popup appears with live countdown (Must be less than timeout).
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={settings.security.sessionWarningMinutes}
                      onChange={(e) => handleSecurityNumberChange('sessionWarningMinutes', Number(e.target.value))}
                      className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                    <span className="text-sm text-slate-600 font-medium">minutes before</span>
                  </div>
                </div>

                <div className="md:col-span-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="block text-sm font-semibold text-slate-800">Cross-Tab Session Synchronization</span>
                    <span className="block text-xs text-slate-500">
                      Sync activity and session logout across all open browser tabs via localStorage & BroadcastChannel.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.crossTabSyncEnabled}
                    onChange={(e) => handleSecurityBooleanChange('crossTabSyncEnabled', e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Password & Authentication Policy */}
            <div className="border-t border-slate-200 pt-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-emerald-600" />
                2. Password & Credential Policy
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Set password length constraints enforced when creating users or resetting passwords.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Minimum Password Length
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Minimum number of characters required for passwords (Minimum standard: 8 characters).
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={6}
                      max={32}
                      value={settings.security.minPasswordLength}
                      onChange={(e) => handleSecurityNumberChange('minPasswordLength', Number(e.target.value))}
                      className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                    <span className="text-sm text-slate-600 font-medium">characters</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Maximum Password Length
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Maximum allowed password length to mitigate long-string hash computation attacks (Default: 128).
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={32}
                      max={256}
                      value={settings.security.maxPasswordLength}
                      onChange={(e) => handleSecurityNumberChange('maxPasswordLength', Number(e.target.value))}
                      className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                    <span className="text-sm text-slate-600 font-medium">characters</span>
                  </div>
                </div>

                {/* Standard Complexity Requirements Sub-Section */}
                <div className="md:col-span-2 pt-4 border-t border-slate-200">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Standard Password Complexity Requirements (OWASP / NIST Guidelines)
                      </h4>
                      <p className="text-xs text-slate-500">
                        Enforce character diversity rules across user creation, staff invitations, and password reset flows.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Active Protection
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 cursor-pointer hover:border-emerald-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={settings.security.requireUppercase}
                        onChange={(e) => handleSecurityBooleanChange('requireUppercase', e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1 text-xs">
                        <span className="font-semibold text-slate-800 block">Require Uppercase Letter</span>
                        <span className="text-slate-500 block">Password must contain at least one capital letter (A–Z).</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 cursor-pointer hover:border-emerald-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={settings.security.requireLowercase}
                        onChange={(e) => handleSecurityBooleanChange('requireLowercase', e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1 text-xs">
                        <span className="font-semibold text-slate-800 block">Require Lowercase Letter</span>
                        <span className="text-slate-500 block">Password must contain at least one small letter (a–z).</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 cursor-pointer hover:border-emerald-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={settings.security.requireNumbers}
                        onChange={(e) => handleSecurityBooleanChange('requireNumbers', e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1 text-xs">
                        <span className="font-semibold text-slate-800 block">Require Numeric Digit</span>
                        <span className="text-slate-500 block">Password must contain at least one numeric digit (0–9).</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 cursor-pointer hover:border-emerald-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={settings.security.requireSpecialChars}
                        onChange={(e) => handleSecurityBooleanChange('requireSpecialChars', e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1 text-xs">
                        <span className="font-semibold text-slate-800 block">Require Special Character</span>
                        <span className="text-slate-500 block">Password must contain at least one special symbol (!@#$%^&*...).</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="block text-sm font-semibold text-slate-800">CSRF Double-Submit Token Defense</span>
                    <span className="block text-xs text-slate-500">
                      Validate anti-CSRF request headers on all state-altering mutation endpoints (POST/PUT/DELETE).
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.security.csrfProtectionEnabled}
                    onChange={(e) => handleSecurityBooleanChange('csrfProtectionEnabled', e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Rate Limiting & Abuse Prevention */}
            <div className="border-t border-slate-200 pt-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-600" />
                3. Rate Limiting & Throttling Parameters
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Tune request rate limits across authentication, public leads, searches, and global endpoints.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">
                    Max Auth Attempts
                  </label>
                  <p className="text-xs text-slate-500 mb-2">Max failed logins per window.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={settings.security.maxAuthAttempts}
                      onChange={(e) => handleSecurityNumberChange('maxAuthAttempts', Number(e.target.value))}
                      className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-slate-600 font-medium">attempts</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">
                    Auth Limit Window
                  </label>
                  <p className="text-xs text-slate-500 mb-2">Window tracking auth attempts.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={settings.security.authRateLimitWindowMinutes}
                      onChange={(e) => handleSecurityNumberChange('authRateLimitWindowMinutes', Number(e.target.value))}
                      className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-slate-600 font-medium">minutes</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">
                    Contact / Inquiries Limit
                  </label>
                  <p className="text-xs text-slate-500 mb-2">Form submissions per IP per hour.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={settings.security.contactRateLimitPerHour}
                      onChange={(e) => handleSecurityNumberChange('contactRateLimitPerHour', Number(e.target.value))}
                      className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-slate-600 font-medium">per hour</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">
                    Property Search Limit
                  </label>
                  <p className="text-xs text-slate-500 mb-2">Search queries per IP per minute.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={5}
                      max={300}
                      value={settings.security.searchRateLimitPerMinute}
                      onChange={(e) => handleSecurityNumberChange('searchRateLimitPerMinute', Number(e.target.value))}
                      className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-slate-600 font-medium">per min</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">
                    Global API Rate Limit
                  </label>
                  <p className="text-xs text-slate-500 mb-2">Total requests per IP per 15 min.</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={10}
                      max={2000}
                      value={settings.security.globalRateLimit}
                      onChange={(e) => handleSecurityNumberChange('globalRateLimit', Number(e.target.value))}
                      className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-slate-600 font-medium">per 15m</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: Data Privacy & Analytics Retention */}
            <div className="border-t border-slate-200 pt-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-600" />
                4. Data Privacy & Analytics Retention Policy
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Automated lifecycle retention for analytics page views, property impressions, and event tracking records.
              </p>

              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Analytics Retention Period (Days)
                  </label>
                  <p className="text-xs text-slate-500">
                    Records older than this period are purged automatically during routine maintenance runs.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={7}
                    max={3650}
                    value={settings.security.analyticsRetentionDays}
                    onChange={(e) => handleSecurityNumberChange('analyticsRetentionDays', Number(e.target.value))}
                    className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                  <span className="text-sm text-slate-600 font-medium">days</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
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
