import mixpanel from 'mixpanel-browser';
import { v4 as uuidv4 } from 'uuid';
import type { AnalyticsEvent, CopyAnalyticsConfig, AnalyticsTrackerInterface } from '../types';

class AnalyticsTracker implements AnalyticsTrackerInterface {
  private static instance: AnalyticsTracker;
  private provider: string;
  private config: CopyAnalyticsConfig;
  private sessionId: string;
  private eventQueue: AnalyticsEvent[] = [];

  private constructor(config: CopyAnalyticsConfig) {
    this.provider = config.analyticsProvider;
    this.config = config;
    this.sessionId = uuidv4();
    this.initializeProvider();
  }

  public static getInstance(config?: CopyAnalyticsConfig): AnalyticsTracker {
    if (!AnalyticsTracker.instance && config) {
      AnalyticsTracker.instance = new AnalyticsTracker(config);
    }
    return AnalyticsTracker.instance;
  }

  private initializeProvider(): void {
    switch (this.provider) {
      case 'mixpanel':
        if (this.config.providerConfig?.apiKey) {
          mixpanel.init(this.config.providerConfig.apiKey);
        }
        break;
      case 'gtag':
        // Initialize Google Analytics
        if (typeof window !== 'undefined' && this.config.providerConfig?.apiKey) {
          const script = document.createElement('script');
          script.async = true;
          script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.providerConfig.apiKey}`;
          document.head.appendChild(script);

          window.dataLayer = window.dataLayer || [];
          window.gtag = function(...args) {
            window.dataLayer.push(args);
          };
          window.gtag('js', new Date());
          window.gtag('config', this.config.providerConfig.apiKey);
        }
        break;
    }
  }

  public getEventQueue(): AnalyticsEvent[] {
    return this.eventQueue;
  }

  public trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>): void {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.eventQueue.push(fullEvent);
    this.dispatchEvent(fullEvent);
  }

  private dispatchEvent(event: AnalyticsEvent): void {
    const enrichedProperties = {
      ...event.properties,
      sessionId: this.sessionId,
      timestamp: event.timestamp,
    };

    switch (this.provider) {
      case 'mixpanel':
        mixpanel.track(event.eventName, enrichedProperties);
        break;
      case 'gtag':
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', event.eventName, enrichedProperties);
        }
        break;
      case 'custom':
        // Handle custom analytics provider
        if (this.config.providerConfig?.customTracker) {
          this.config.providerConfig.customTracker(event);
        }
        break;
    }
  }

  public clearEventQueue(): void {
    this.eventQueue = [];
  }

  public trackPageView(path: string): void {
    this.trackEvent({
      eventName: 'page_view',
      properties: {
        path,
        title: document.title,
      },
    });
  }

  public trackCopyVariant(testId: string, variant: string): void {
    this.trackEvent({
      eventName: 'copy_variant_view',
      properties: {
        testId,
        variant,
      },
    });
  }

  public trackEngagement(elementId: string, action: string, duration?: number): void {
    this.trackEvent({
      eventName: 'engagement',
      properties: {
        elementId,
        action,
        duration,
      },
    });
  }
}

export default AnalyticsTracker; 