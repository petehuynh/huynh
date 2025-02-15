import { RollbackConfig, RollbackSystem } from '../types';

class RollbackManager implements RollbackSystem {
  private config: RollbackConfig;
  private snapshots: Map<string, unknown>;
  private snapshotTimestamps: string[];

  constructor(config: RollbackConfig) {
    this.config = config;
    this.snapshots = new Map();
    this.snapshotTimestamps = [];
  }

  async takeSnapshot(state: unknown): Promise<string> {
    const timestamp = new Date().toISOString();
    this.snapshots.set(timestamp, JSON.parse(JSON.stringify(state)));
    this.snapshotTimestamps.push(timestamp);
    
    // Maintain history limit
    while (this.snapshotTimestamps.length > this.config.maxHistoryVersions) {
      const oldestTimestamp = this.snapshotTimestamps.shift();
      if (oldestTimestamp) {
        this.snapshots.delete(oldestTimestamp);
      }
    }

    return timestamp;
  }

  async restoreSnapshot(version: string): Promise<void> {
    const snapshot = this.snapshots.get(version);
    if (!snapshot) {
      throw new Error(`Snapshot ${version} not found`);
    }
    return Promise.resolve();
  }

  async purgeOldVersions(): Promise<void> {
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - this.config.backupInterval);
    
    this.snapshotTimestamps = this.snapshotTimestamps.filter(timestamp => {
      const snapshotTime = new Date(timestamp);
      if (snapshotTime < cutoffTime) {
        this.snapshots.delete(timestamp);
        return false;
      }
      return true;
    });
  }
}

export const createRollbackSystem = (config: RollbackConfig): RollbackSystem => {
  return new RollbackManager(config);
}; 