# Copywriting Analytics Package

A self-contained, reusable npm package that automates copy refinement, tracks analytics, and integrates A/B testing capabilities across different websites.

## Features

- 🔄 Automated copy refinement based on predefined rules
- 📊 Built-in analytics tracking with multiple provider support
- 🔬 Integrated A/B testing capabilities
- 🎯 Pre-built UI components with analytics tracking
- ♿ Accessibility-focused components
- 🎨 TailwindCSS styling support

## Installation

```bash
npm install copywriting-analytics-package
```

## Quick Start

```tsx
import { initializeCopyAnalytics, ButtonWithAnalytics, ABTestWrapper } from 'copywriting-analytics-package';

// Initialize the package
await initializeCopyAnalytics({
  analyticsProvider: 'gtag', // or 'mixpanel'
  rulesPath: '/path/to/copyReplacementRules.json',
  enableABTesting: true,
  providerConfig: {
    apiKey: 'your-analytics-api-key',
  },
});

// Use the pre-built components
function LandingPage() {
  return (
    <div>
      <ABTestWrapper
        testId="hero-cta"
        controlText="Get Started"
        variantText="Start Your Journey"
      >
        {(selectedText) => (
          <ButtonWithAnalytics
            label={selectedText}
            onClick={() => console.log('CTA clicked')}
            testId="hero-button"
          />
        )}
      </ABTestWrapper>
    </div>
  );
}
```

## Components

### ButtonWithAnalytics

A button component that automatically tracks click events and supports A/B testing.

```tsx
<ButtonWithAnalytics
  label="Get Started"
  onClick={() => {}}
  className="custom-class"
  testId="unique-id"
  variant="variant-name"
  disabled={false}
  aria-label="Accessible label"
/>
```

### ABTestWrapper

A wrapper component that manages A/B test variants and tracks conversions.

```tsx
<ABTestWrapper
  testId="unique-test-id"
  controlText="Original Text"
  variantText="Test Variant"
>
  {(selectedText) => (
    // Your component using the selected text
  )}
</ABTestWrapper>
```

### TrackVisibility

A component that tracks when elements become visible in the viewport.

```tsx
<TrackVisibility
  onVisible={() => console.log('Element is visible')}
  threshold={0.5}
  testId="visibility-tracker"
>
  <div>Content to track</div>
</TrackVisibility>
```

### Dashboard

A real-time monitoring dashboard that provides insights into your system's performance, A/B tests, and analytics events.

```tsx
import { Dashboard } from 'copywriting-analytics-package';

function App() {
  return (
    <div>
      <Dashboard />
    </div>
  );
}
```

Features:
- Real-time metrics overview
- Active A/B test monitoring
- Event log tracking
- System health indicators
- Auto-refreshing data every 2 seconds
- Responsive layout with Tailwind CSS

## Copy Replacement Rules

Create a JSON file with your copy replacement rules:

```json
{
  "rules": [
    {
      "pattern": "click here",
      "replacement": "get started",
      "context": ["cta"],
      "priority": 1
    }
  ]
}
```

## Analytics Integration

The package supports multiple analytics providers:

- Google Analytics (gtag)
- Mixpanel
- Custom providers

Configure your analytics provider during initialization:

```tsx
await initializeCopyAnalytics({
  analyticsProvider: 'mixpanel',
  providerConfig: {
    apiKey: 'your-mixpanel-token',
  },
});
```

## A/B Testing

The package includes a built-in A/B testing system that:

- Manages variant assignment
- Tracks impressions and conversions
- Supports multiple concurrent tests
- Persists user assignments

## TypeScript Support

The package is written in TypeScript and includes full type definitions.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT

## Support

For issues and feature requests, please use the GitHub issue tracker.
```
