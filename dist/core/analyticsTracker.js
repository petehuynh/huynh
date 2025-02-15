import mixpanel from 'mixpanel-browser';
import { v4 as uuidv4 } from 'uuid';
class AnalyticsTracker {
    constructor(config) {
        this.eventQueue = [];
        this.provider = config.analyticsProvider;
        this.config = config;
        this.sessionId = uuidv4();
        this.initializeProvider();
    }
    static getInstance(config) {
        if (!AnalyticsTracker.instance && config) {
            AnalyticsTracker.instance = new AnalyticsTracker(config);
        }
        return AnalyticsTracker.instance;
    }
    initializeProvider() {
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
                    window.gtag = function () {
                        window.dataLayer.push(arguments);
                    };
                    window.gtag('js', new Date());
                    window.gtag('config', this.config.providerConfig.apiKey);
                }
                break;
        }
    }
    trackEvent(event) {
        const fullEvent = {
            ...event,
            timestamp: Date.now(),
        };
        this.eventQueue.push(fullEvent);
        this.dispatchEvent(fullEvent);
    }
    dispatchEvent(event) {
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
    getEventQueue() {
        return [...this.eventQueue];
    }
    clearEventQueue() {
        this.eventQueue = [];
    }
    trackPageView(path) {
        this.trackEvent({
            eventName: 'page_view',
            properties: {
                path,
                title: document.title,
            },
        });
    }
    trackCopyVariant(testId, variant) {
        this.trackEvent({
            eventName: 'copy_variant_view',
            properties: {
                testId,
                variant,
            },
        });
    }
    trackEngagement(elementId, action, duration) {
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
//# sourceMappingURL=analyticsTracker.js.map