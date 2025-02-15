'use client';

import { useEffect, useState } from 'react';
import AnalyticsTracker from '../core/analyticsTracker';

export default function AnalyticsInitializer() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Check if GA ID is available
      if (!process.env.NEXT_PUBLIC_GA_ID) {
        console.warn('Google Analytics ID is not set in environment variables');
      }

      // Initialize analytics with default configuration
      AnalyticsTracker.getInstance({
        analyticsProvider: 'gtag',
        enableABTesting: true,
        privacyMode: 'default',
        consentRequired: true,
        debugMode: process.env.NODE_ENV === 'development',
        providerConfig: {
          apiKey: process.env.NEXT_PUBLIC_GA_ID
        }
      });

      // Track page view on initial load
      const analytics = AnalyticsTracker.getInstance();
      if (typeof window !== 'undefined') {
        analytics.trackPageView(window.location.pathname);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize analytics';
      setError(errorMessage);
      console.error('Analytics initialization failed:', err);
    }
  }, []);

  // Only render error message in development
  if (error && process.env.NODE_ENV === 'development') {
    return (
      <div role="alert" className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Analytics Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return null;
} 