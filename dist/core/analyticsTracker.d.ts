import type { AnalyticsEvent, CopyAnalyticsConfig } from '../types';
declare class AnalyticsTracker {
    private static instance;
    private provider;
    private config;
    private sessionId;
    private eventQueue;
    private constructor();
    static getInstance(config?: CopyAnalyticsConfig): AnalyticsTracker;
    private initializeProvider;
    trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>): void;
    private dispatchEvent;
    getEventQueue(): AnalyticsEvent[];
    clearEventQueue(): void;
    trackPageView(path: string): void;
    trackCopyVariant(testId: string, variant: string): void;
    trackEngagement(elementId: string, action: string, duration?: number): void;
}
export default AnalyticsTracker;
//# sourceMappingURL=analyticsTracker.d.ts.map