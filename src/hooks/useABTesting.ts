import { useCallback } from 'react';
import ConfigManager from '../core/configManager';

export function useABTesting() {
  const getVariant = useCallback((testId: string, variants: string[]): string | null => {
    const config = ConfigManager.getInstance().getConfig();
    
    if (!config.enableABTesting) {
      return variants[0]; // Return control variant if A/B testing is disabled
    }

    // Here you would typically implement your A/B testing logic
    // For now, we'll randomly select a variant
    // In production, this should be deterministic per user/session
    const randomIndex = Math.floor(Math.random() * variants.length);
    return variants[randomIndex];
  }, []);

  return { getVariant };
} 