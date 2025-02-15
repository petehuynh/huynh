import { v4 as uuidv4 } from 'uuid';
import type { ABTestConfig, ABTestResult } from '../types';
import AnalyticsTracker from './analyticsTracker';

class ABTesting {
  private static instance: ABTesting;
  private tests: Map<string, ABTestConfig> = new Map();
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
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.userAssignments = new Map(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading A/B test assignments:', error);
    }
  }

  private saveUserAssignments(): void {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(Array.from(this.userAssignments.entries()))
      );
    } catch (error) {
      console.error('Error saving A/B test assignments:', error);
    }
  }

  public createTest(config: ABTestConfig): void {
    if (this.tests.has(config.testId)) {
      throw new Error(`Test with ID ${config.testId} already exists`);
    }

    this.tests.set(config.testId, {
      ...config,
      weights: config.weights || config.variants.map(() => 1 / config.variants.length),
    });

    this.results.set(config.testId, {
      testId: config.testId,
      variant: '',
      metrics: {
        impressions: 0,
        conversions: 0,
        clickThroughRate: 0,
      },
    });
  }

  public getVariant(testId: string): string {
    if (!this.tests.has(testId)) {
      throw new Error(`Test with ID ${testId} not found`);
    }

    // Check if user already has an assignment
    if (this.userAssignments.has(testId)) {
      return this.userAssignments.get(testId)!;
    }

    const test = this.tests.get(testId)!;
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
    if (!this.results.has(testId)) {
      return;
    }

    const result = this.results.get(testId)!;
    result.metrics.conversions++;
    result.metrics.clickThroughRate = 
      result.metrics.conversions / result.metrics.impressions;

    AnalyticsTracker.getInstance().trackEvent({
      eventName: 'ab_test_conversion',
      properties: {
        testId,
        variant: this.userAssignments.get(testId),
      },
    });
  }

  public trackImpression(testId: string): void {
    if (!this.results.has(testId)) {
      return;
    }

    const result = this.results.get(testId)!;
    result.metrics.impressions++;
    result.metrics.clickThroughRate = 
      result.metrics.conversions / result.metrics.impressions;
  }

  public getTestResults(testId: string): ABTestResult | undefined {
    return this.results.get(testId);
  }

  public getAllTestResults(): ABTestResult[] {
    return Array.from(this.results.values());
  }

  public clearTest(testId: string): void {
    this.tests.delete(testId);
    this.results.delete(testId);
    this.userAssignments.delete(testId);
    this.saveUserAssignments();
  }
}

export default ABTesting; 