import React, { useEffect, useRef } from 'react';
import AnalyticsTracker from '../core/analyticsTracker';
const TrackVisibility = ({ children, onVisible, threshold = 0.5, testId, }) => {
    const elementRef = useRef(null);
    const hasTracked = useRef(false);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasTracked.current) {
                    hasTracked.current = true;
                    AnalyticsTracker.getInstance().trackEvent({
                        eventName: 'element_visible',
                        properties: {
                            testId,
                            threshold,
                            timestamp: Date.now(),
                        },
                    });
                    onVisible?.();
                }
            });
        }, {
            threshold,
            root: null,
            rootMargin: '0px',
        });
        if (elementRef.current) {
            observer.observe(elementRef.current);
        }
        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [threshold, testId, onVisible]);
    return (React.createElement("div", { ref: elementRef, "data-testid": testId ? `visibility-tracker-${testId}` : undefined }, children));
};
export default TrackVisibility;
//# sourceMappingURL=TrackVisibility.js.map