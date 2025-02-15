import type { ABTestConfig, ABTestResult } from '../types';
declare class ABTesting {
    private static instance;
    private tests;
    private results;
    private userAssignments;
    private readonly storageKey;
    private constructor();
    static getInstance(): ABTesting;
    private loadUserAssignments;
    private saveUserAssignments;
    createTest(config: ABTestConfig): void;
    getVariant(testId: string): string;
    trackConversion(testId: string): void;
    trackImpression(testId: string): void;
    getTestResults(testId: string): ABTestResult | undefined;
    getAllTestResults(): ABTestResult[];
    clearTest(testId: string): void;
}
export default ABTesting;
//# sourceMappingURL=abTesting.d.ts.map