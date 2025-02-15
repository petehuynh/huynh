import { v4 as uuidv4 } from 'uuid';
import type { ABTestConfig, ABTestResult, ABTest, ABTestingInterface } from '../types';
import AnalyticsTracker from './analyticsTracker';

class ABTesting implements ABTestingInterface {
  private static instance: ABTesting;
  private tests: Map<string, ABTest> = new Map();
  private results: Map<string, ABTestResult> = new Map();
  private userAssignments: Map<string, string> = new Map();
  private readonly storageKey = 'copywriting_ab_assignments';

  private constructor() {
    this.loadUserAssignments();
  }

  public static getInstance(): ABTesting {
    if (!ABTesting.instance) {
      ABTesting.instance = new ABTesting();
    }
    return ABTesting.instance;
  }

  private loadUserAssignments(): void {
    if (typeof window === 'undefined') return;

    const storedAssignments = localStorage.getItem(this.storageKey);
    if (storedAssignments) {
      this.userAssignments = new Map(JSON.parse(storedAssignments));
    }
  }

  private saveUserAssignments(): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(Array.from(this.userAssignments.entries()))
    );
  }

  public createTest(config: ABTestConfig): string {
    const testId = uuidv4();
    const test: ABTest = {
      id: testId,
      variants: config.variants,
      weights: config.weights || config.variants.map(() => 1 / config.variants.length),
      startDate: Date.now(),
      status: 'running',
    };

    // Select initial variant
    const randomValue = Math.random();
    let cumulativeWeight = 0;
    let initialVariant = test.variants[0]; // Default to first variant

    // Since we set weights in the test object above, we can safely assert it's not undefined
    const weights = test.weights!;
    for (let i = 0; i < test.variants.length; i++) {
      cumulativeWeight += weights[i];
      if (randomValue <= cumulativeWeight) {
        initialVariant = test.variants[i];
        break;
      }
    }

    // Save the test and initial variant assignment
    this.tests.set(testId, test);
    this.userAssignments.set(testId, initialVariant);
    this.saveUserAssignments();

    this.results.set(testId, {
      testId,
      variant: initialVariant,
      metrics: {
        impressions: 0,
        conversions: 0,
        clickThroughRate: 0,
        variantMetrics: {},
      },
      startTime: test.startDate,
      status: 'running',
    });

    // Track the variant assignment
    AnalyticsTracker.getInstance().trackCopyVariant(testId, initialVariant);

    return testId;
  }

  public getTest(testId: string): ABTest | undefined {
    return this.tests.get(testId);
  }

  public getTestResults(testId: string): ABTestResult | undefined {
    return this.results.get(testId);
  }

  public getVariant(testId: string): string {
    const test = this.tests.get(testId);
    if (!test) {
      throw new Error(`Test with ID ${testId} not found`);
    }

    // Check if user already has an assignment
    if (this.userAssignments.has(testId)) {
      return this.userAssignments.get(testId)!;
    }

    const randomValue = Math.random();
    let cumulativeWeight = 0;

    for (let i = 0; i < test.variants.length; i++) {
      cumulativeWeight += test.weights![i];
      if (randomValue <= cumulativeWeight) {
        const variant = test.variants[i];
        this.userAssignments.set(testId, variant);
        this.saveUserAssignments();
        
        // Track the variant assignment
        AnalyticsTracker.getInstance().trackCopyVariant(testId, variant);
        
        return variant;
      }
    }

    return test.variants[0]; // Fallback to first variant
  }

  public trackConversion(testId: string): void {
    const results = this.results.get(testId);
    if (!results) return;

    const variant = this.userAssignments.get(testId);
    if (!variant) return;

    // Update overall metrics
    results.metrics.conversions++;
    results.metrics.clickThroughRate = 
      results.metrics.conversions / results.metrics.impressions;

    // Update variant-specific metrics
    const variantMetrics = results.metrics.variantMetrics[variant] || {
      impressions: 0,
      conversions: 0,
    };
    variantMetrics.conversions++;
    results.metrics.variantMetrics[variant] = variantMetrics;

    AnalyticsTracker.getInstance().trackEvent({
      eventName: 'ab_test_conversion',
      properties: {
        testId,
        variant,
      },
    });
  }

  public trackImpression(testId: string): void {
    const results = this.results.get(testId);
    if (!results) return;

    const variant = this.userAssignments.get(testId);
    if (!variant) return;

    // Update overall metrics
    results.metrics.impressions++;
    results.metrics.clickThroughRate = 
      results.metrics.conversions / results.metrics.impressions;

    // Update variant-specific metrics
    const variantMetrics = results.metrics.variantMetrics[variant] || {
      impressions: 0,
      conversions: 0,
    };
    variantMetrics.impressions++;
    results.metrics.variantMetrics[variant] = variantMetrics;
  }

  public endTest(testId: string): void {
    const test = this.tests.get(testId);
    if (!test) return;

    test.status = 'completed';
    test.endDate = Date.now();

    const results = this.results.get(testId);
    if (results) {
      results.status = 'completed';
      results.endTime = test.endDate;
    }
  }

  public getAllTestResults(): ABTestResult[] {
    return Array.from(this.results.values()).map(result => ({
      ...result,
      testId: Array.from(this.results.entries())
        .find(([, r]) => r === result)?.[0] || '',
      variant: this.userAssignments.get(Array.from(this.results.entries())
        .find(([, r]) => r === result)?.[0] || '') || ''
    }));
  }
}

export default ABTesting; 