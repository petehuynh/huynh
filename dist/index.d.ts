import type { CopyAnalyticsConfig, CopyReplacementRule, ABTestConfig, ABTestResult, AnalyticsEvent, ButtonWithAnalyticsProps, ABTestWrapperProps, TrackVisibilityProps } from './types';
import AnalyticsTracker from './core/analyticsTracker';
import ABTesting from './core/abTesting';
import CopyRefiner from './core/copyRefiner';
import ButtonWithAnalytics from './ui/ButtonWithAnalytics';
import ABTestWrapper from './ui/ABTestWrapper';
import TrackVisibility from './ui/TrackVisibility';
export declare const initializeCopyAnalytics: (config: CopyAnalyticsConfig) => Promise<void>;
export { AnalyticsTracker, ABTesting, CopyRefiner, ButtonWithAnalytics, ABTestWrapper, TrackVisibility, CopyAnalyticsConfig, CopyReplacementRule, ABTestConfig, ABTestResult, AnalyticsEvent, ButtonWithAnalyticsProps, ABTestWrapperProps, TrackVisibilityProps, };
export declare const VERSION = "0.1.0";
export declare const PACKAGE_NAME = "huynh";
//# sourceMappingURL=index.d.ts.map