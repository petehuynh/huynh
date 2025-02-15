import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import type { 
  CopyReplacementRule, 
  CopyRefinerInterface, 
  ABTestReport,
  RuleUpdateStrategy 
} from '../types';

class CopyRefiner implements CopyRefinerInterface {
  private static instance: CopyRefiner;
  private rules: CopyReplacementRule[] = [];
  private ruleUpdateHistory: Array<{
    timestamp: number;
    ruleId: string;
    change: string;
    testId: string;
  }> = [];

  private constructor() {}

  public static getInstance(): CopyRefiner {
    if (!CopyRefiner.instance) {
      CopyRefiner.instance = new CopyRefiner();
    }
    return CopyRefiner.instance;
  }

  public loadRules(rules: CopyReplacementRule[]): void {
    this.rules = rules.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  public getRules(): CopyReplacementRule[] {
    return [...this.rules];
  }

  public async loadRulesFromFile(filePath: string): Promise<void> {
    try {
      const response = await fetch(filePath);
      const rules = await response.json();
      this.loadRules(rules);
    } catch (error) {
      console.error('Error loading copy replacement rules:', error);
      throw error;
    }
  }

  public updateRulesFromABTestResults(
    testResults: ABTestReport,
    strategy: RuleUpdateStrategy = {
      confidenceThreshold: 0.95,
      impactMultiplier: 1.5,
      maxRuleModifications: 3
    }
  ): void {
    if (!testResults.variants || testResults.variants.length === 0) {
      console.warn('No variants found in test results');
      return;
    }

    // Find the best performing variant
    const bestVariant = testResults.variants.reduce((best, current) => {
      return current.conversionRate > best.conversionRate ? current : best;
    });

    // Only proceed if the best variant shows significant improvement
    if (bestVariant.significance < strategy.confidenceThreshold) {
      console.log('No statistically significant improvements found');
      return;
    }

    // Find existing rules that might be affected
    const affectedRules = this.rules.filter(rule => 
      testResults.variants.some(variant => 
        variant.text.match(new RegExp(rule.pattern, 'gi'))
      )
    );

    let modificationsCount = 0;

    // Update or create rules based on the test results
    for (const rule of affectedRules) {
      if (modificationsCount >= strategy.maxRuleModifications) break;

      const currentPattern = new RegExp(rule.pattern, 'gi');
      if (bestVariant.text.match(currentPattern)) {
        // Update existing rule
        const oldReplacement = rule.replacement;
        rule.replacement = bestVariant.text;
        rule.priority = (rule.priority || 0) + 1;

        this.logRuleUpdate({
          ruleId: rule.pattern,
          change: `Updated replacement from "${oldReplacement}" to "${bestVariant.text}"`,
          testId: testResults.testId
        });

        modificationsCount++;
      }
    }

    // Create new rule if no existing rules were updated
    if (modificationsCount === 0 && this.shouldCreateNewRule(bestVariant)) {
      const newRule: CopyReplacementRule = {
        pattern: this.generatePatternFromText(bestVariant.text),
        replacement: bestVariant.text,
        priority: 1
      };

      this.rules.push(newRule);
      this.logRuleUpdate({
        ruleId: newRule.pattern,
        change: `Created new rule with replacement "${bestVariant.text}"`,
        testId: testResults.testId
      });
    }

    // Re-sort rules by priority
    this.rules.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  private shouldCreateNewRule(variant: ABTestReport['variants'][0]): boolean {
    return variant.conversionRate > 0.1 && variant.impressions > 100;
  }

  private generatePatternFromText(text: string): string {
    // Create a flexible pattern that matches similar phrases
    return text
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape regex special characters
      .replace(/\s+/g, '\\s+') // Make whitespace flexible
      .replace(/[A-Za-z]+/g, '\\w+'); // Make words flexible
  }

  private logRuleUpdate(update: { 
    ruleId: string; 
    change: string; 
    testId: string; 
  }): void {
    this.ruleUpdateHistory.push({
      ...update,
      timestamp: Date.now()
    });
  }

  public getRuleUpdateHistory(): typeof this.ruleUpdateHistory {
    return [...this.ruleUpdateHistory];
  }

  public refineText(text: string, context: string[] = []): string {
    let refinedText = text;

    for (const rule of this.rules) {
      if (rule.context && !rule.context.some(ctx => context.includes(ctx))) {
        continue;
      }

      const pattern = new RegExp(rule.pattern, 'gi');
      refinedText = refinedText.replace(pattern, rule.replacement);
    }

    return refinedText;
  }

  public refineComponent(code: string): string {
    try {
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });

      let refinedCode = code;
      const textNodes: { start: number; end: number; value: string }[] = [];

      traverse(ast, {
        JSXText(path) {
          const { node } = path;
          if (node.value.trim()) {
            textNodes.push({
              start: node.start!,
              end: node.end!,
              value: node.value,
            });
          }
        },
        StringLiteral(path) {
          const { node } = path;
          if (
            path.parent.type === 'JSXAttribute' &&
            ['label', 'placeholder', 'title', 'alt'].includes(path.parent.name.name as string)
          ) {
            textNodes.push({
              start: node.start!,
              end: node.end!,
              value: node.value,
            });
          }
        },
      });

      // Process text nodes in reverse order to maintain correct positions
      for (const node of textNodes.reverse()) {
        const refinedText = this.refineText(node.value);
        refinedCode =
          refinedCode.slice(0, node.start) +
          refinedText +
          refinedCode.slice(node.end);
      }

      return refinedCode;
    } catch (error) {
      console.error('Error refining component:', error);
      return code;
    }
  }

  public clearRules(): void {
    this.rules = [];
  }
}

export default CopyRefiner; 