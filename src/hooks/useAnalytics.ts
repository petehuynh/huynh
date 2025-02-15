import { useCallback } from 'react';
import type { AnalyticsEvent } from '../types';

export function useAnalytics() {
  const trackEvent = useCallback((event: Partial<AnalyticsEvent>) => {
    const completeEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
      eventName: event.eventName || '',
      properties: event.properties || {}
    };

    // Here you would typically call your analytics service
    // For now, we'll just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', completeEvent);
    }

    // You can implement your actual analytics tracking here
    // Example: googleAnalytics.trackEvent(event)
    // or mixpanel.track(event.eventName, event.properties)
  }, []);

  return { trackEvent };
} 