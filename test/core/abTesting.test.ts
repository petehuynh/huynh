import ABTesting from '../../src/core/abTesting';
import AnalyticsTracker from '../../src/core/analyticsTracker';
import type { ABTestConfig } from '../../src/types';

jest.mock('../../src/core/analyticsTracker', () => ({
  getInstance: jest.fn(() => ({
    trackEvent: jest.fn(),
    trackCopyVariant: jest.fn(),
  })),
}));

describe('ABTesting', () => {
  let abTesting: ABTesting;
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (ABTesting as any).instance = undefined;
    localStorage.clear();
    abTesting = ABTesting.getInstance();
  });

  describe('test creation and management', () => {
    it('should create a new test', () => {
      const testConfig: ABTestConfig = {
        testId: 'test-1',
        variants: ['A', 'B'],
      };

      abTesting.createTest(testConfig);
      const results = abTesting.getTestResults('test-1');

      expect(results).toBeDefined();
      expect(results?.metrics).toEqual({
        impressions: 0,
        conversions: 0,
        clickThroughRate: 0,
      });
    });

    it('should throw error when creating duplicate test', () => {
      const testConfig: ABTestConfig = {
        testId: 'test-1',
        variants: ['A', 'B'],
      };

      abTesting.createTest(testConfig);
      expect(() => abTesting.createTest(testConfig)).toThrow();
    });

    it('should clear test data', () => {
      const testConfig: ABTestConfig = {
        testId: 'test-1',
        variants: ['A', 'B'],
      };

      abTesting.createTest(testConfig);
      abTesting.clearTest('test-1');

      expect(abTesting.getTestResults('test-1')).toBeUndefined();
    });
  });

  describe('variant assignment', () => {
    it('should assign variant and persist assignment', () => {
      const testConfig: ABTestConfig = {
        testId: 'test-1',
        variants: ['A', 'B'],
        weights: [0.5, 0.5],
      };

      abTesting.createTest(testConfig);
      const variant = abTesting.getVariant('test-1');

      expect(['A', 'B']).toContain(variant);
      expect(localStorage.setItem).toHaveBeenCalled();
      expect(AnalyticsTracker.getInstance().trackCopyVariant).toHaveBeenCalledWith('test-1', variant);
    });

    it('should return consistent variant for same user', () => {
      const testConfig: ABTestConfig = {
        testId: 'test-1',
        variants: ['A', 'B'],
      };

      abTesting.createTest(testConfig);
      const firstVariant = abTesting.getVariant('test-1');
      const secondVariant = abTesting.getVariant('test-1');

      expect(firstVariant).toBe(secondVariant);
    });

    it('should throw error for non-existent test', () => {
      expect(() => abTesting.getVariant('non-existent')).toThrow();
    });
  });

  describe('metrics tracking', () => {
    it('should track impressions and update metrics', () => {
      const testConfig: ABTestConfig = {
        testId: 'test-1',
        variants: ['A', 'B'],
      };

      abTesting.createTest(testConfig);
      abTesting.trackImpression('test-1');

      const results = abTesting.getTestResults('test-1');
      expect(results?.metrics.impressions).toBe(1);
    });

    it('should track conversions and update metrics', () => {
      const testConfig: ABTestConfig = {
        testId: 'test-1',
        variants: ['A', 'B'],
      };

      abTesting.createTest(testConfig);
      abTesting.trackImpression('test-1');
      abTesting.trackConversion('test-1');

      const results = abTesting.getTestResults('test-1');
      expect(results?.metrics.conversions).toBe(1);
      expect(results?.metrics.clickThroughRate).toBe(1);
    });

    it('should calculate correct click-through rate', () => {
      const testConfig: ABTestConfig = {
        testId: 'test-1',
        variants: ['A', 'B'],
      };

      abTesting.createTest(testConfig);
      abTesting.trackImpression('test-1');
      abTesting.trackImpression('test-1');
      abTesting.trackConversion('test-1');

      const results = abTesting.getTestResults('test-1');
      expect(results?.metrics.clickThroughRate).toBe(0.5);
    });
  });

  describe('results retrieval', () => {
    it('should get results for specific test', () => {
      const testConfig: ABTestConfig = {
        testId: 'test-1',
        variants: ['A', 'B'],
      };

      abTesting.createTest(testConfig);
      const results = abTesting.getTestResults('test-1');

      expect(results).toBeDefined();
      expect(results?.testId).toBe('test-1');
    });

    it('should get all test results', () => {
      const testConfigs: ABTestConfig[] = [
        { testId: 'test-1', variants: ['A', 'B'] },
        { testId: 'test-2', variants: ['X', 'Y'] },
      ];

      testConfigs.forEach(config => abTesting.createTest(config));
      const allResults = abTesting.getAllTestResults();

      expect(allResults).toHaveLength(2);
      expect(allResults.map(r => r.testId)).toEqual(['test-1', 'test-2']);
    });
  });
}); 