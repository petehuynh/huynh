export interface RollbackConfig {
    maxHistoryVersions: number;
    autoRollbackThreshold: number;
    backupInterval: number;
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
//# sourceMappingURL=index.d.ts.map