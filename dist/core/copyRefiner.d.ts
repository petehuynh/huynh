import type { CopyReplacementRule } from '../types';
declare class CopyRefiner {
    private static instance;
    private rules;
    private constructor();
    static getInstance(): CopyRefiner;
    loadRules(rules: CopyReplacementRule[]): void;
    loadRulesFromFile(path: string): Promise<void>;
    refineText(text: string, context?: string[]): string;
    refineComponent(code: string): string;
    getRules(): CopyReplacementRule[];
    clearRules(): void;
}
export default CopyRefiner;
//# sourceMappingURL=copyRefiner.d.ts.map