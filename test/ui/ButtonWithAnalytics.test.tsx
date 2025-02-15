import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ButtonWithAnalytics from '../../src/ui/ButtonWithAnalytics';
import AnalyticsTracker from '../../src/core/analyticsTracker';

jest.mock('../../src/core/analyticsTracker', () => ({
  getInstance: jest.fn(() => ({
    trackEvent: jest.fn(),
  })),
}));

describe('ButtonWithAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with provided label', () => {
    render(<ButtonWithAnalytics label="Test Button" />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<ButtonWithAnalytics label="Test" className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('should handle click events and track analytics', () => {
    const handleClick = jest.fn();
    render(<ButtonWithAnalytics label="Test" onClick={handleClick} testId="test-button" />);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalled();
    expect(AnalyticsTracker.getInstance().trackEvent).toHaveBeenCalledWith({
      eventName: 'button_click',
      properties: {
        label: 'Test',
        testId: 'test-button',
        variant: undefined,
      },
    });
  });

  it('should handle keyboard events', () => {
    const handleClick = jest.fn();
    render(<ButtonWithAnalytics label="Test" onClick={handleClick} />);
    const button = screen.getByRole('button');

    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalled();

    fireEvent.keyDown(button, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(button, { key: 'Tab' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<ButtonWithAnalytics label="Test" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should have correct accessibility attributes', () => {
    render(
      <ButtonWithAnalytics
        label="Test"
        aria-label="Custom Label"
        testId="test-button"
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Custom Label');
    expect(button).toHaveAttribute('tabIndex', '0');
    expect(button).toHaveAttribute('data-testid', 'test-button');
  });

  it('should use label as aria-label when not provided', () => {
    render(<ButtonWithAnalytics label="Test Button" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Test Button');
  });

  it('should apply variant data attribute when provided', () => {
    render(<ButtonWithAnalytics label="Test" variant="A" />);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'A');
  });

  it('should apply correct styles based on disabled state', () => {
    const { rerender } = render(<ButtonWithAnalytics label="Test" />);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

    rerender(<ButtonWithAnalytics label="Test" disabled />);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-300');
  });
}); 