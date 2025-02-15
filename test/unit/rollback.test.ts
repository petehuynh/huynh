import { createRollbackSystem } from '../../src/core/rollback';
import { RollbackConfig } from '../../src/types';

describe('Rollback System', () => {
  const mockConfig: RollbackConfig = {
    maxHistoryVersions: 3,
    autoRollbackThreshold: 0.1,
    backupInterval: 60
  };

  it('should create a rollback system with the provided config', () => {
    const system = createRollbackSystem(mockConfig);
    expect(system).toBeDefined();
    expect(system.takeSnapshot).toBeDefined();
    expect(system.restoreSnapshot).toBeDefined();
    expect(system.purgeOldVersions).toBeDefined();
  });

  it('should take and restore snapshots', async () => {
    const system = createRollbackSystem(mockConfig);
    const state = { key: 'value' };
    
    const version = await system.takeSnapshot(state);
    expect(version).toBeDefined();
    
    await expect(system.restoreSnapshot(version)).resolves.not.toThrow();
    await expect(system.restoreSnapshot('invalid-version')).rejects.toThrow();
  });

  it('should maintain history limit', async () => {
    const system = createRollbackSystem(mockConfig);
    const states = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 }
    ];

    const versions = await Promise.all(
      states.map(state => system.takeSnapshot(state))
    );

    // Should be able to restore the last 3 versions
    await expect(system.restoreSnapshot(versions[1])).resolves.not.toThrow();
    await expect(system.restoreSnapshot(versions[2])).resolves.not.toThrow();
    await expect(system.restoreSnapshot(versions[3])).resolves.not.toThrow();
    
    // Should not be able to restore the oldest version
    await expect(system.restoreSnapshot(versions[0])).rejects.toThrow();
  });
}); 