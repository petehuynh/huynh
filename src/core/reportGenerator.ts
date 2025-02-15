import type { 
  ABTestReport, 
  PerformanceMetrics, 
  ABTestingInterface,
  AnalyticsTrackerInterface,
  CopyRefinerInterface,
} from '../types';
import AnalyticsTracker from './analyticsTracker';
import ABTesting from './abTesting';
import CopyRefiner from './copyRefiner';

class ReportGenerator {
  private static instance: ReportGenerator;
  private analyticsTracker: AnalyticsTrackerInterface;
  private abTesting: ABTestingInterface;
  private copyRefiner: CopyRefinerInterface;

  private constructor() {
    this.analyticsTracker = AnalyticsTracker.getInstance();
    this.abTesting = ABTesting.getInstance();
    this.copyRefiner = CopyRefiner.getInstance();
  }

  public static getInstance(): ReportGenerator {
    if (!ReportGenerator.instance) {
      ReportGenerator.instance = new ReportGenerator();
    }
    return ReportGenerator.instance;
  }

  public async generateCopyStyleGuide(): Promise<string> {
    const rules = this.copyRefiner.getRules();
    const performanceData = await this.getPerformanceData();

    let styleGuide = '# Copy Style Guide\n\n';

    // Add general statistics
    styleGuide += '## Performance Overview\n\n';
    styleGuide += `- Total Rules: ${rules.length}\n`;
    styleGuide += `- Average Conversion Rate: ${performanceData.averageConversionRate}%\n`;
    styleGuide += `- Top Performing Patterns: ${performanceData.topPatterns.join(', ')}\n\n`;

    // Add rules documentation
    styleGuide += '## Copy Rules\n\n';
    rules.forEach((rule, index) => {
      styleGuide += `### Rule ${index + 1}\n`;
      styleGuide += `- Pattern: \`${rule.pattern}\`\n`;
      styleGuide += `- Replacement: "${rule.replacement}"\n`;
      styleGuide += `- Context: ${rule.context ? rule.context.join(', ') : 'All'}\n`;
      styleGuide += `- Priority: ${rule.priority || 'Default'}\n\n`;
    });

    return styleGuide;
  }

  public async generateABTestReport(testId: string): Promise<ABTestReport> {
    const test = this.abTesting.getTest(testId);
    if (!test) {
      throw new Error(`Test with ID ${testId} not found`);
    }

    const results = this.abTesting.getTestResults(testId);
    if (!results) {
      throw new Error(`No results found for test ID ${testId}`);
    }

    const variants = test.variants.map(variant => {
      const variantResults = results.metrics.variantMetrics[variant] || {
        impressions: 0,
        conversions: 0,
      };

      return {
        text: variant,
        conversionRate: variantResults.impressions > 0
          ? (variantResults.conversions / variantResults.impressions) * 100
          : 0,
        impressions: variantResults.impressions,
        significance: this.calculateSignificance(variantResults, results.metrics),
      };
    });

    // Sort variants by conversion rate
    variants.sort((a, b) => b.conversionRate - a.conversionRate);

    // Generate recommendation
    const recommendation = this.generateTestRecommendation(variants);

    return {
      testId,
      variants,
      recommendation,
      startDate: results.startTime,
      endDate: results.endTime,
      status: results.status,
    };
  }

  public async exportPerformanceMetrics(): Promise<PerformanceMetrics> {
    const events = await this.analyticsTracker.getEventQueue();
    const componentMetrics: Record<string, {
      renderCount: number;
      interactions: number;
      errors: number;
      renderTimes: number[];
    }> = {};

    // Process events to calculate metrics
    events.forEach(event => {
      if (event.properties.componentName) {
        const name = event.properties.componentName;
        if (!componentMetrics[name]) {
          componentMetrics[name] = {
            renderCount: 0,
            interactions: 0,
            errors: 0,
            renderTimes: [],
          };
        }

        switch (event.eventName) {
          case 'component_render':
            componentMetrics[name].renderCount++;
            if (event.properties.renderTime) {
              componentMetrics[name].renderTimes.push(event.properties.renderTime);
            }
            break;
          case 'user_interaction':
            componentMetrics[name].interactions++;
            break;
          case 'error':
            componentMetrics[name].errors++;
            break;
        }
      }
    });

    // Calculate average metrics for a specific component
    const calculateComponentMetrics = (name: string, data: typeof componentMetrics[string]): PerformanceMetrics => ({
      componentName: name,
      renderTime: data.renderTimes.reduce((a, b) => a + b, 0) / data.renderTimes.length,
      interactionCount: data.interactions,
      errorRate: data.renderCount > 0 ? (data.errors / data.renderCount) * 100 : 0,
      customMetrics: {
        totalRenders: data.renderCount,
        averageInteractionsPerRender: data.renderCount > 0 
          ? data.interactions / data.renderCount 
          : 0,
      },
    });

    // Return metrics for the most active component
    const [mostActiveComponent] = Object.entries(componentMetrics)
      .sort(([, a], [, b]) => b.interactions - a.interactions);

    if (!mostActiveComponent) {
      throw new Error('No component metrics available');
    }

    return calculateComponentMetrics(mostActiveComponent[0], mostActiveComponent[1]);
  }

  private calculateSignificance(
    variantMetrics: { impressions: number; conversions: number },
    overallMetrics: { impressions: number; conversions: number }
  ): number {
    // Implement statistical significance calculation (e.g., chi-square test)
    // This is a simplified version - in production, use a proper statistical library
    const variantRate = variantMetrics.conversions / variantMetrics.impressions;
    const overallRate = overallMetrics.conversions / overallMetrics.impressions;
    const difference = Math.abs(variantRate - overallRate);
    
    // Return a value between 0 and 1, where > 0.95 is typically considered significant
    return Math.min(difference * Math.sqrt(variantMetrics.impressions), 1);
  }

  private generateTestRecommendation(variants: ABTestReport['variants']): string {
    const [bestVariant, secondBest] = variants;
    const significantDifference = bestVariant.significance > 0.95;

    if (!significantDifference) {
      return 'Continue testing - no statistically significant winner yet.';
    }

    const improvement = ((bestVariant.conversionRate - secondBest.conversionRate) / 
      secondBest.conversionRate * 100).toFixed(1);

    return `Recommend using variant "${bestVariant.text}" - ${improvement}% improvement in conversion rate with ${bestVariant.significance * 100}% confidence.`;
  }

  private async getPerformanceData() {
    // Implement performance data aggregation
    return {
      averageConversionRate: 2.5, // Example value
      topPatterns: ['Pattern 1', 'Pattern 2'], // Example values
    };
  }
}

export default ReportGenerator; 