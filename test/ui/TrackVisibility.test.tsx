import React from 'react';
import { render, screen } from '@testing-library/react';
import TrackVisibility from '../../src/ui/TrackVisibility';
import AnalyticsTracker from '../../src/core/analyticsTracker';

jest.mock('../../src/core/analyticsTracker', () => ({
  getInstance: jest.fn(() => ({
    trackEvent: jest.fn(),
  })),
}));

describe('TrackVisibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <TrackVisibility>
        <div>Test Content</div>
      </TrackVisibility>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should track visibility when element becomes visible', () => {
    const handleVisible = jest.fn();
    render(
      <TrackVisibility onVisible={handleVisible} testId="test-element">
        <div>Test Content</div>
      </TrackVisibility>
    );

    // IntersectionObserver callback is triggered in our mock
    expect(handleVisible).toHaveBeenCalled();
    expect(AnalyticsTracker.getInstance().trackEvent).toHaveBeenCalledWith({
      eventName: 'element_visible',
      properties: {
        testId: 'test-element',
        threshold: 0.5,
        timestamp: expect.any(Number),
      },
    });
  });

  it('should use custom threshold', () => {
    const handleVisible = jest.fn();
    render(
      <TrackVisibility onVisible={handleVisible} threshold={0.75}>
        <div>Test Content</div>
      </TrackVisibility>
    );

    expect(handleVisible).toHaveBeenCalled();
    expect(AnalyticsTracker.getInstance().trackEvent).toHaveBeenCalledWith({
      eventName: 'element_visible',
      properties: {
        threshold: 0.75,
        timestamp: expect.any(Number),
      },
    });
  });

  it('should cleanup observer on unmount', () => {
    const { unmount } = render(
      <TrackVisibility>
        <div>Test Content</div>
      </TrackVisibility>
    );

    const mockObserver = new IntersectionObserver(() => {});
    const unobserveSpy = jest.spyOn(mockObserver, 'unobserve');

    unmount();

    // Cleanup should have been called
    expect(unobserveSpy).toHaveBeenCalled();
  });

  it('should track only once when element becomes visible multiple times', () => {
    const handleVisible = jest.fn();
    render(
      <TrackVisibility onVisible={handleVisible}>
        <div>Test Content</div>
      </TrackVisibility>
    );

    // First visibility trigger
    expect(handleVisible).toHaveBeenCalledTimes(1);
    expect(AnalyticsTracker.getInstance().trackEvent).toHaveBeenCalledTimes(1);

    // Simulate multiple intersection callbacks
    const observer = new IntersectionObserver(() => {});
    observer.observe(document.createElement('div'));
    observer.observe(document.createElement('div'));

    // Should still only have been called once
    expect(handleVisible).toHaveBeenCalledTimes(1);
    expect(AnalyticsTracker.getInstance().trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should apply test ID to wrapper element', () => {
    render(
      <TrackVisibility testId="visibility-test">
        <div>Test Content</div>
      </TrackVisibility>
    );

    expect(screen.getByTestId('visibility-tracker-visibility-test')).toBeInTheDocument();
  });

  it('should not apply test ID when not provided', () => {
    render(
      <TrackVisibility>
        <div>Test Content</div>
      </TrackVisibility>
    );

    const wrapper = screen.getByText('Test Content').parentElement;
    expect(wrapper).not.toHaveAttribute('data-testid');
  });
}); 