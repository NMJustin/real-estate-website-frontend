'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/utils/analytics';

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view on route change
    const pageTitle = document.title;
    trackPageView(pathname, pageTitle);
  }, [pathname]);

  useEffect(() => {
    const trackAfterConsent = () => trackPageView(pathname, document.title);
    window.addEventListener('ingata-cookie-preferences-updated', trackAfterConsent);
    return () => window.removeEventListener('ingata-cookie-preferences-updated', trackAfterConsent);
  }, [pathname]);

  return null; // This component doesn't render anything
}
