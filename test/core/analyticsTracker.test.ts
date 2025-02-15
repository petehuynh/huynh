import AnalyticsTracker from '../../src/core/analyticsTracker';
import type { CopyAnalyticsConfig } from '../../src/types';
import mixpanel from 'mixpanel-browser';

jest.mock('mixpanel-browser', () => ({
  init: jest.fn(),
  track: jest.fn(),
}));

describe('AnalyticsTracker', () => {
  beforeEach(() => {
    // Reset mocks and singleton instance
    jest.clearAllMocks();
    (AnalyticsTracker as any).instance = undefined;
    localStorage.clear();
    (global as any).gtag = jest.fn();
  });

  describe('initialization', () => {
    it('should initialize with Google Analytics', () => {
      const config: CopyAnalyticsConfig = {
        analyticsProvider: 'gtag',
        providerConfig: {
          apiKey: 'GA-TEST-ID',
        },
      };

      const tracker = AnalyticsTracker.getInstance(config);
      expect(document.head.appendChild).toHaveBeenCalled();
      expect(global.gtag).toHaveBeenCalledWith('js', expect.any(Date));
      expect(global.gtag).toHaveBeenCalledWith('config', 'GA-TEST-ID');
    });

    it('should initialize with Mixpanel', () => {
      const config: CopyAnalyticsConfig = {
        analyticsProvider: 'mixpanel',
        providerConfig: {
          apiKey: 'MIXPANEL-TEST-KEY',
        },
      };

      const tracker = AnalyticsTracker.getInstance(config);
      expect(mixpanel.init).toHaveBeenCalledWith('MIXPANEL-TEST-KEY');
    });
  });

  describe('event tracking', () => {
    it('should track events with Google Analytics', () => {
      const config: CopyAnalyticsConfig = {
        analyticsProvider: 'gtag',
        providerConfig: {
          apiKey: 'GA-TEST-ID',
        },
      };

      const tracker = AnalyticsTracker.getInstance(config);
      tracker.trackEvent({
        eventName: 'test_event',
        properties: {
          category: 'test',
          action: 'click',
        },
      });

      expect(global.gtag).toHaveBeenCalledWith('event', 'test_event', expect.objectContaining({
        category: 'test',
        action: 'click',
        sessionId: expect.any(String),
        timestamp: expect.any(Number),
      }));
    });

    it('should track events with Mixpanel', () => {
      const config: CopyAnalyticsConfig = {
        analyticsProvider: 'mixpanel',
        providerConfig: {
          apiKey: 'MIXPANEL-TEST-KEY',
        },
      };

      const tracker = AnalyticsTracker.getInstance(config);
      tracker.trackEvent({
        eventName: 'test_event',
        properties: {
          category: 'test',
          action: 'click',
        },
      });

      expect(mixpanel.track).toHaveBeenCalledWith('test_event', expect.objectContaining({
        category: 'test',
        action: 'click',
        sessionId: expect.any(String),
        timestamp: expect.any(Number),
      }));
    });
  });

  describe('utility methods', () => {
    it('should track page views', () => {
      const config: CopyAnalyticsConfig = {
        analyticsProvider: 'gtag',
        providerConfig: {
          apiKey: 'GA-TEST-ID',
        },
      };

      const tracker = AnalyticsTracker.getInstance(config);
      tracker.trackPageView('/test-page');

      expect(global.gtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
        path: '/test-page',
        title: expect.any(String),
      }));
    });

    it('should track copy variants', () => {
      const config: CopyAnalyticsConfig = {
        analyticsProvider: 'gtag',
        providerConfig: {
          apiKey: 'GA-TEST-ID',
        },
      };

      const tracker = AnalyticsTracker.getInstance(config);
      tracker.trackCopyVariant('test-id', 'variant-a');

      expect(global.gtag).toHaveBeenCalledWith('event', 'copy_variant_view', expect.objectContaining({
        testId: 'test-id',
        variant: 'variant-a',
      }));
    });

    it('should track engagement', () => {
      const config: CopyAnalyticsConfig = {
        analyticsProvider: 'gtag',
        providerConfig: {
          apiKey: 'GA-TEST-ID',
        },
      };

      const tracker = AnalyticsTracker.getInstance(config);
      tracker.trackEngagement('button-1', 'click', 5000);

      expect(global.gtag).toHaveBeenCalledWith('event', 'engagement', expect.objectContaining({
        elementId: 'button-1',
        action: 'click',
        duration: 5000,
      }));
    });

    it('should manage event queue', () => {
      const config: CopyAnalyticsConfig = {
        analyticsProvider: 'gtag',
        providerConfig: {
          apiKey: 'GA-TEST-ID',
        },
      };

      const tracker = AnalyticsTracker.getInstance(config);
      tracker.trackEvent({
        eventName: 'test_event',
        properties: { test: true },
      });

      const queue = tracker.getEventQueue();
      expect(queue).toHaveLength(1);
      expect(queue[0]).toMatchObject({
        eventName: 'test_event',
        properties: { test: true },
      });

      tracker.clearEventQueue();
      expect(tracker.getEventQueue()).toHaveLength(0);
    });
  });
}); 