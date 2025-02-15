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
  };
}

export interface AnalyticsEvent {
  eventName: string;
  properties: {
    category?: string;
    action?: string;
    label?: string;
    value?: number;
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

export interface ButtonWithAnalyticsProps {
  label: string;
  onClick?: () => void;
  className?: string;
  testId?: string;
  variant?: string;
  disabled?: boolean;
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