export interface RollbackConfig {
  maxHistoryVersions: number;
  autoRollbackThreshold: number; // Error rate percentage
  backupInterval: number; // Minutes
}

export interface RollbackSystem {
  takeSnapshot: (state: unknown) => Promise<string>;
  restoreSnapshot: (version: string) => Promise<void>;
  purgeOldVersions: () => Promise<void>;
}

export interface OptimizationConfig {
  enabled: boolean;
  aiProvider: 'openai' | 'anthropic';
  maxIterations: number;
  confidenceThreshold: number;
}

export interface MetricsData {
  timestamp: number;
  errorRate: number;
  performanceScore: number;
  userEngagement: number;
}

export interface CopyAnalyticsConfig {
  analyticsProvider: 'gtag' | 'mixpanel' | 'custom';
  rulesPath?: string;
  enableABTesting?: boolean;
  providerConfig?: {
    apiKey?: string;
    projectId?: string;
    [key: string]: any;
  };

  // New Configuration Options
  privacyMode?: 'strict' | 'default' | 'permissive';
  consentRequired?: boolean;
  debugMode?: boolean;
  
  // Advanced A/B Testing Controls
  abTestConfig?: {
    autoTerminate?: boolean;
    significanceThreshold?: number;
    maxTestDuration?: number;
  };

  // Reporting Configuration
  reportingOptions?: {
    generateStyleGuide?: boolean;
    reportFrequency?: 'daily' | 'weekly' | 'monthly';
    reportChannels?: ('email' | 'webhook' | 'console')[];
  };

  // Custom Event Mappings
  customEventMappings?: {
    [key: string]: string;
  };
}

export interface CopyReplacementRule {
  pattern: string;
  replacement: string;
  context?: string[];
  priority?: number;
}

export interface ABTestConfig {
  testId: string;
  variants: string[];
  weights?: number[];
  duration?: number; // in days
  sampleSize?: number;
}

export interface ABTestResult {
  testId: string;
  variant: string;
  metrics: {
    impressions: number;
    conversions: number;
    clickThroughRate: number;
    engagementTime?: number;
    variantMetrics: Record<string, {
      impressions: number;
      conversions: number;
    }>;
  };
  startTime: number;
  endTime?: number;
  status: 'running' | 'completed' | 'terminated';
}

export interface AnalyticsEvent {
  eventName: string;
  properties: {
    componentName?: string;
    renderTime?: number;
    [key: string]: any;
  };
  timestamp: number;
}

export interface TrackingElement {
  id: string;
  type: 'button' | 'text' | 'section';
  content: string;
  variant?: string;
  testId?: string;
}

export interface ButtonWithAnalyticsProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick?: () => void;
  className?: string;
  testId?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  trackingId?: string;
  eventCategory?: string;
  abTestId?: string;
  abVariants?: string[];
  'aria-label'?: string;
}

export interface ABTestWrapperProps {
  testId: string;
  controlText: string;
  variantText: string;
  children: (selectedText: string) => React.ReactNode;
}

export interface TrackVisibilityProps {
  children: React.ReactNode;
  onVisible?: () => void;
  threshold?: number;
  testId?: string;
}

export type ConsentType = 'analytics' | 'abTesting' | 'personalization';

export interface ConsentStatus {
  type: ConsentType;
  granted: boolean;
  timestamp: number;
  expiresAt?: number;
}

export interface ConsentBannerProps {
  onAccept: (types: ConsentType[]) => void;
  onDecline: () => void;
  requiredTypes?: ConsentType[];
  position?: 'top' | 'bottom';
  theme?: 'light' | 'dark';
}

export interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  interactionCount: number;
  errorRate: number;
  customMetrics?: Record<string, number>;
}

export interface ABTestReport {
  testId: string;
  variants: Array<{
    text: string;
    conversionRate: number;
    impressions: number;
    significance: number;
  }>;
  recommendation?: string;
  startDate: number;
  endDate?: number;
  status: 'running' | 'completed' | 'terminated';
}

export interface ABTest {
  id: string;
  variants: string[];
  weights?: number[];
  startDate: number;
  endDate?: number;
  status: 'running' | 'completed' | 'terminated';
}

export interface ABTestingInterface {
  getTest(testId: string): ABTest | undefined;
  getTestResults(testId: string): ABTestResult | undefined;
}

export interface AnalyticsTrackerInterface {
  getEventQueue(): AnalyticsEvent[];
}

export interface CopyRefinerInterface {
  getRules(): CopyReplacementRule[];
}

export interface RuleUpdateStrategy {
  confidenceThreshold: number;  // Statistical significance threshold (0-1)
  impactMultiplier: number;    // Multiplier for rule priority adjustments
  maxRuleModifications: number; // Maximum number of rules to modify per update
} 