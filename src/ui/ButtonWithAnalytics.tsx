import React from 'react';
import type { ButtonWithAnalyticsProps } from '../types';
import AnalyticsTracker from '../core/analyticsTracker';

const ButtonWithAnalytics: React.FC<ButtonWithAnalyticsProps> = ({
  label,
  onClick,
  className = '',
  testId,
  variant,
  disabled = false,
  'aria-label': ariaLabel,
}) => {
  const handleClick = () => {
    AnalyticsTracker.getInstance().trackEvent({
      eventName: 'button_click',
      properties: {
        label,
        testId,
        variant,
      },
    });

    onClick?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md 
        transition-colors duration-200 ease-in-out
        ${disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        } ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel || label}
      tabIndex={0}
      data-testid={testId}
      data-variant={variant}
    >
      {label}
    </button>
  );
};

export default ButtonWithAnalytics; 