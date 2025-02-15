import React, { useCallback, useEffect, useRef } from 'react';
import { cn } from '../utils/cn';
import { useAnalytics } from '../hooks/useAnalytics';
import { useABTesting } from '../hooks/useABTesting';
import type { ButtonWithAnalyticsProps } from '../types';

const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

export const ButtonWithAnalytics: React.FC<ButtonWithAnalyticsProps> = ({
  label,
  onClick,
  className,
  testId,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  trackingId,
  eventCategory = 'user_interaction',
  abTestId,
  abVariants,
  'aria-label': ariaLabel,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { trackEvent } = useAnalytics();
  const { getVariant } = useABTesting();

  const displayLabel = abTestId && abVariants 
    ? getVariant(abTestId, abVariants) || label
    : label;

  const handleInteraction = useCallback((
    interactionType: 'click' | 'keydown',
    event?: React.KeyboardEvent
  ) => {
    if (disabled || loading) return;

    // Track the interaction
    trackEvent({
      eventName: `button_${interactionType}`,
      properties: {
        trackingId,
        buttonLabel: displayLabel,
        eventCategory,
        variant,
        abTestId,
        interactionType,
        keyPressed: event?.key
      }
    });

    // Call the provided onClick handler
    if (onClick) onClick();
  }, [
    disabled,
    loading,
    trackEvent,
    trackingId,
    displayLabel,
    eventCategory,
    variant,
    abTestId,
    onClick
  ]);

  const handleClick = useCallback(() => {
    handleInteraction('click');
  }, [handleInteraction]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleInteraction('keydown', event);
    }
  }, [handleInteraction]);

  // Track button visibility
  useEffect(() => {
    if (!buttonRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackEvent({
              eventName: 'button_impression',
              properties: {
                trackingId,
                buttonLabel: displayLabel,
                eventCategory,
                variant,
                abTestId
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(buttonRef.current);
    return () => observer.disconnect();
  }, [trackEvent, trackingId, displayLabel, eventCategory, variant, abTestId]);

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      aria-label={ariaLabel || displayLabel}
      aria-disabled={disabled || loading}
      data-testid={testId}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        // Base styles
        'relative inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Variant styles
        variantStyles[variant as keyof typeof variantStyles],
        
        // Size styles
        sizeStyles[size as keyof typeof sizeStyles],
        
        // Loading state styles
        loading && 'cursor-wait',
        
        // Custom classes
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
          <span className="opacity-0">{displayLabel}</span>
        </>
      ) : (
        displayLabel
      )}
    </button>
  );
};

export default ButtonWithAnalytics; 