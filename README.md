# Copywriting Analytics Package

A comprehensive analytics and optimization toolkit for tracking, analyzing, and refining website copy and content performance.

## Features

- **Advanced Analytics Tracking**
  - Multi-provider support (Google Analytics, Mixpanel, custom)
  - Detailed event tracking
  - Performance metrics collection
  - User engagement monitoring

- **A/B Testing**
  - Easy test creation and management
  - Variant performance tracking
  - Statistical significance analysis
  - Automated recommendations

- **Copy Refinement**
  - Rule-based text optimization
  - Context-aware replacements
  - Component-level refinements
  - Style guide generation

- **Privacy Management**
  - GDPR and CCPA compliance
  - Granular consent management
  - Data minimization
  - Configurable privacy modes

- **Reporting**
  - Comprehensive performance reports
  - A/B test analysis
  - Copy style guides
  - Custom metric tracking

## Installation

```bash
npm install huynh
# or
yarn add huynh
```

## Quick Start

```typescript
import { initializeCopyAnalytics } from 'huynh';

// Initialize with basic configuration
await initializeCopyAnalytics({
  analyticsProvider: 'gtag',
  providerConfig: {
    apiKey: 'YOUR_GA_KEY',
  },
  enableABTesting: true,
  privacyMode: 'strict',
  consentRequired: true,
});
```

## Usage Examples

### Analytics Tracking

```typescript
import { AnalyticsTracker } from 'huynh';

const analytics = AnalyticsTracker.getInstance();

<<<<<<< HEAD
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

### Running the Dashboard Locally

To start the development server and view the dashboard:

```bash
# If you're using npm
npm run dev

# If you're using yarn
yarn dev

# If you're using pnpm
pnpm dev
```

The dashboard will be available at `http://localhost:3000` by default. You can access it through your web browser.

For production deployment:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

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
=======
// Track custom events
analytics.trackEvent({
  eventName: 'button_click',
  properties: {
    buttonId: 'cta-main',
    location: 'hero-section',
>>>>>>> e1427f2b (Fix error with npm run build and run dev)
  },
});
```

### A/B Testing

```typescript
import { ABTesting } from 'huynh';

const abTesting = ABTesting.getInstance();

// Create a new test
const testId = abTesting.createTest({
  variants: [
    'Sign up now - it\'s free!',
    'Start your free trial today',
    'Join thousands of happy users',
  ],
});

// Get variant for current user
const variant = abTesting.getVariant(testId);

// Track conversions
abTesting.trackConversion(testId);
```

### Copy Refinement

```typescript
import { CopyRefiner } from 'huynh';

const copyRefiner = CopyRefiner.getInstance();

// Load rules
await copyRefiner.loadRulesFromFile('/path/to/rules.json');

// Refine text
const refinedText = copyRefiner.refineText(
  'Click here to learn more!',
  ['cta', 'landing-page']
);
```

### Privacy Management

```typescript
import { ConsentManager } from 'huynh';

const consentManager = ConsentManager.getInstance();

// Render consent banner
const ConsentBanner = () => {
  return consentManager.renderConsentBanner({
    onAccept: (types) => {
      // Handle consent acceptance
    },
    onDecline: () => {
      // Handle consent rejection
    },
    requiredTypes: ['analytics'],
    position: 'bottom',
    theme: 'light',
  });
};
```

### Reporting

```typescript
import { ReportGenerator } from 'huynh';

const reportGenerator = ReportGenerator.getInstance();

// Generate A/B test report
const testReport = await reportGenerator.generateABTestReport('test-id');

// Generate copy style guide
const styleGuide = await reportGenerator.generateCopyStyleGuide();

// Export performance metrics
const metrics = await reportGenerator.exportPerformanceMetrics();
```

## Configuration Options

```typescript
interface CopyAnalyticsConfig {
  // Core Configuration
  analyticsProvider: 'gtag' | 'mixpanel' | 'custom';
  providerConfig?: {
    apiKey?: string;
    projectId?: string;
    [key: string]: any;
  };
  
  // Privacy Settings
  privacyMode?: 'strict' | 'default' | 'permissive';
  consentRequired?: boolean;
  
  // A/B Testing
  enableABTesting?: boolean;
  abTestConfig?: {
    autoTerminate?: boolean;
    significanceThreshold?: number;
    maxTestDuration?: number;
  };
  
  // Reporting
  reportingOptions?: {
    generateStyleGuide?: boolean;
    reportFrequency?: 'daily' | 'weekly' | 'monthly';
    reportChannels?: ('email' | 'webhook' | 'console')[];
  };
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- Documentation: [https://docs.huynh.dev](https://docs.huynh.dev)
- Issues: [GitHub Issues](https://github.com/your-org/huynh/issues)
- Community: [Discord](https://discord.gg/huynh)
```
