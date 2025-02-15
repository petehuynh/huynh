import React, { useEffect, useRef } from 'react';
import type { TrackVisibilityProps } from '../types';
import AnalyticsTracker from '../core/analyticsTracker';

const TrackVisibility: React.FC<TrackVisibilityProps> = ({
  children,
  onVisible,
  threshold = 0.5,
  testId,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
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
      },
      {
        threshold,
        root: null,
        rootMargin: '0px',
      }
    );

    if (elementRef.current) {
      const element = elementRef.current;
      observer.observe(element);

      return () => {
        observer.unobserve(element);
      };
    }
  }, [threshold, testId, onVisible]);

  return (
    <div
      ref={elementRef}
      data-testid={testId ? `visibility-tracker-${testId}` : undefined}
    >
      {children}
    </div>
  );
};

export default TrackVisibility; 