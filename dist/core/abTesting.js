import AnalyticsTracker from './analyticsTracker';
class ABTesting {
    constructor() {
        this.tests = new Map();
        this.results = new Map();
        this.userAssignments = new Map();
        this.storageKey = 'copywriting_ab_assignments';
        this.loadUserAssignments();
    }
    static getInstance() {
        if (!ABTesting.instance) {
            ABTesting.instance = new ABTesting();
        }
        return ABTesting.instance;
    }
    loadUserAssignments() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.userAssignments = new Map(JSON.parse(stored));
            }
        }
        catch (error) {
            console.error('Error loading A/B test assignments:', error);
        }
    }
    saveUserAssignments() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.userAssignments.entries())));
        }
        catch (error) {
            console.error('Error saving A/B test assignments:', error);
        }
    }
    createTest(config) {
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
    getVariant(testId) {
        if (!this.tests.has(testId)) {
            throw new Error(`Test with ID ${testId} not found`);
        }
        // Check if user already has an assignment
        if (this.userAssignments.has(testId)) {
            return this.userAssignments.get(testId);
        }
        const test = this.tests.get(testId);
        const randomValue = Math.random();
        let cumulativeWeight = 0;
        for (let i = 0; i < test.variants.length; i++) {
            cumulativeWeight += test.weights[i];
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
    trackConversion(testId) {
        if (!this.results.has(testId)) {
            return;
        }
        const result = this.results.get(testId);
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
    trackImpression(testId) {
        if (!this.results.has(testId)) {
            return;
        }
        const result = this.results.get(testId);
        result.metrics.impressions++;
        result.metrics.clickThroughRate =
            result.metrics.conversions / result.metrics.impressions;
    }
    getTestResults(testId) {
        return this.results.get(testId);
    }
    getAllTestResults() {
        return Array.from(this.results.values());
    }
    clearTest(testId) {
        this.tests.delete(testId);
        this.results.delete(testId);
        this.userAssignments.delete(testId);
        this.saveUserAssignments();
    }
}
export default ABTesting;
//# sourceMappingURL=abTesting.js.map