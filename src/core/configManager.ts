import type { CopyAnalyticsConfig } from '../types';

class ConfigManager {
  private static instance: ConfigManager;
  private config: CopyAnalyticsConfig;
  private readonly defaultConfig: CopyAnalyticsConfig = {
    analyticsProvider: 'gtag',
    enableABTesting: true,
    privacyMode: 'default',
    consentRequired: true,
    debugMode: false,
    abTestConfig: {
      autoTerminate: true,
      significanceThreshold: 0.95,
      maxTestDuration: 30 // days
    },
    reportingOptions: {
      generateStyleGuide: true,
      reportFrequency: 'weekly',
      reportChannels: ['email', 'console']
    }
  };

  private constructor() {
    this.config = { ...this.defaultConfig };
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public updateConfig(newConfig: Partial<CopyAnalyticsConfig>): void {
    this.validateConfig(newConfig);
    this.config = this.mergeConfigs(this.config, newConfig);
  }

  public getConfig(): CopyAnalyticsConfig {
    return { ...this.config };
  }

  public resetToDefaults(): void {
    this.config = { ...this.defaultConfig };
  }

  private validateConfig(config: Partial<CopyAnalyticsConfig>): void {
    // Validate analytics provider
    if (config.analyticsProvider && 
        !['gtag', 'mixpanel', 'custom'].includes(config.analyticsProvider)) {
      throw new Error('Invalid analytics provider specified');
    }

    // Validate privacy mode
    if (config.privacyMode && 
        !['strict', 'default', 'permissive'].includes(config.privacyMode)) {
      throw new Error('Invalid privacy mode specified');
    }

    // Validate AB testing configuration
    if (config.abTestConfig) {
      const { significanceThreshold, maxTestDuration } = config.abTestConfig;
      
      if (significanceThreshold !== undefined && 
          (significanceThreshold < 0 || significanceThreshold > 1)) {
        throw new Error('Significance threshold must be between 0 and 1');
      }

      if (maxTestDuration !== undefined && maxTestDuration < 1) {
        throw new Error('Max test duration must be at least 1 day');
      }
    }

    // Validate reporting options
    if (config.reportingOptions) {
      const validFrequencies = ['daily', 'weekly', 'monthly'];
      const validChannels = ['email', 'webhook', 'console'];

      if (config.reportingOptions.reportFrequency && 
          !validFrequencies.includes(config.reportingOptions.reportFrequency)) {
        throw new Error('Invalid reporting frequency specified');
      }

      if (config.reportingOptions.reportChannels) {
        const invalidChannels = config.reportingOptions.reportChannels
          .filter(channel => !validChannels.includes(channel));
        
        if (invalidChannels.length > 0) {
          throw new Error(`Invalid reporting channels specified: ${invalidChannels.join(', ')}`);
        }
      }
    }
  }

  private mergeConfigs(
    baseConfig: CopyAnalyticsConfig, 
    newConfig: Partial<CopyAnalyticsConfig>
  ): CopyAnalyticsConfig {
    const merged = { ...baseConfig };

    // Merge top-level properties
    Object.keys(newConfig).forEach(key => {
      const typedKey = key as keyof CopyAnalyticsConfig;
      const value = newConfig[typedKey];

      if (value === undefined) return;

      if (typeof value === 'object' && value !== null) {
        const currentValue = merged[typedKey];
        if (currentValue && typeof currentValue === 'object') {
          (merged[typedKey] as any) = {
            ...currentValue,
            ...value
          };
        } else {
          (merged[typedKey] as any) = { ...value };
        }
      } else {
        (merged[typedKey] as any) = value;
      }
    });

    return merged;
  }

  public validateAndNormalizeApiKey(apiKey: string): string {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    // Remove whitespace and validate format
    const normalizedKey = apiKey.trim();
    if (!/^[A-Za-z0-9_-]{20,}$/.test(normalizedKey)) {
      throw new Error('Invalid API key format');
    }

    return normalizedKey;
  }

  public getDebugInfo(): Record<string, unknown> {
    return {
      currentConfig: this.config,
      defaultConfig: this.defaultConfig,
      configDiff: this.getConfigDiff()
    };
  }

  private getConfigDiff(): Record<string, { current: unknown; default: unknown }> {
    const diff: Record<string, { current: unknown; default: unknown }> = {};
    
    Object.keys(this.config).forEach(key => {
      const typedKey = key as keyof CopyAnalyticsConfig;
      if (JSON.stringify(this.config[typedKey]) !== 
          JSON.stringify(this.defaultConfig[typedKey])) {
        diff[key] = {
          current: this.config[typedKey],
          default: this.defaultConfig[typedKey]
        };
      }
    });

    return diff;
  }
}

export default ConfigManager; 