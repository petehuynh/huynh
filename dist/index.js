import AnalyticsTracker from './core/analyticsTracker';
import ABTesting from './core/abTesting';
import CopyRefiner from './core/copyRefiner';
import ButtonWithAnalytics from './ui/ButtonWithAnalytics';
import ABTestWrapper from './ui/ABTestWrapper';
import TrackVisibility from './ui/TrackVisibility';
export const initializeCopyAnalytics = async (config) => {
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
AnalyticsTracker, ABTesting, CopyRefiner, 
// UI Components
ButtonWithAnalytics, ABTestWrapper, TrackVisibility, };
// Version and package info
export const VERSION = '0.1.0';
export const PACKAGE_NAME = 'huynh';
//# sourceMappingURL=index.js.map