import type {
  CopyAnalyticsConfig,
  CopyReplacementRule,
  ABTestConfig,
  ABTestResult,
  AnalyticsEvent,
  ButtonWithAnalyticsProps,
  ABTestWrapperProps,
  TrackVisibilityProps,
} from './types';

import AnalyticsTracker from './core/analyticsTracker';
import ABTesting from './core/abTesting';
import CopyRefiner from './core/copyRefiner';

import ButtonWithAnalytics from './ui/ButtonWithAnalytics';
import ABTestWrapper from './ui/ABTestWrapper';
import TrackVisibility from './ui/TrackVisibility';

export const initializeCopyAnalytics = async (config: CopyAnalyticsConfig): Promise<void> => {
  // Initialize analytics
  const analytics = AnalyticsTracker.getInstance(config);

  // Initialize copy refiner if rules path is provided
  if (config.rulesPath) {
    const copyRefiner = CopyRefiner.getInstance();
    await copyRefiner.loadRulesFromFile(config.rulesPath);
  }

  // Track initialization
  analytics.trackEvent({
    eventName: 'copy_analytics_initialized',
    properties: {
      provider: config.analyticsProvider,
      abTestingEnabled: config.enableABTesting,
      timestamp: Date.now(),
    },
  });
};

export {
  // Core functionality
  AnalyticsTracker,
  ABTesting,
  CopyRefiner,
  
  // UI Components
  ButtonWithAnalytics,
  ABTestWrapper,
  TrackVisibility,
  
  // Types
  CopyAnalyticsConfig,
  CopyReplacementRule,
  ABTestConfig,
  ABTestResult,
  AnalyticsEvent,
  ButtonWithAnalyticsProps,
  ABTestWrapperProps,
  TrackVisibilityProps,
};

// Version and package info
export const VERSION = '0.1.0';
export const PACKAGE_NAME = 'huynh'; 