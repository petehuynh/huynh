import CopyRefiner from '../../src/core/copyRefiner';
import type { CopyReplacementRule } from '../../src/types';

describe('CopyRefiner', () => {
  let copyRefiner: CopyRefiner;

  beforeEach(() => {
    jest.clearAllMocks();
    (CopyRefiner as any).instance = undefined;
    copyRefiner = CopyRefiner.getInstance();
  });

  describe('rule management', () => {
    it('should load and sort rules by priority', () => {
      const rules: CopyReplacementRule[] = [
        {
          pattern: 'low',
          replacement: 'low_priority',
          priority: 1,
        },
        {
          pattern: 'high',
          replacement: 'high_priority',
          priority: 2,
        },
      ];

      copyRefiner.loadRules(rules);
      const loadedRules = copyRefiner.getRules();

      expect(loadedRules[0].pattern).toBe('high');
      expect(loadedRules[1].pattern).toBe('low');
    });

    it('should clear rules', () => {
      const rules: CopyReplacementRule[] = [
        {
          pattern: 'test',
          replacement: 'replacement',
        },
      ];

      copyRefiner.loadRules(rules);
      copyRefiner.clearRules();

      expect(copyRefiner.getRules()).toHaveLength(0);
    });

    it('should load rules from file', async () => {
      const mockRules = {
        rules: [
          {
            pattern: 'test',
            replacement: 'replacement',
          },
        ],
      };

      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockRules),
        })
      );

      await copyRefiner.loadRulesFromFile('/mock/rules.json');
      expect(copyRefiner.getRules()).toHaveLength(1);
    });
  });

  describe('text refinement', () => {
    it('should refine text based on rules', () => {
      const rules: CopyReplacementRule[] = [
        {
          pattern: 'click here',
          replacement: 'get started',
          context: ['cta'],
        },
      ];

      copyRefiner.loadRules(rules);
      const refined = copyRefiner.refineText('Please click here to continue', ['cta']);

      expect(refined).toBe('Please get started to continue');
    });

    it('should respect context in rules', () => {
      const rules: CopyReplacementRule[] = [
        {
          pattern: 'click here',
          replacement: 'get started',
          context: ['cta'],
        },
      ];

      copyRefiner.loadRules(rules);
      const refined = copyRefiner.refineText('Please click here to continue', ['other']);

      expect(refined).toBe('Please click here to continue');
    });

    it('should apply multiple rules in order', () => {
      const rules: CopyReplacementRule[] = [
        {
          pattern: 'click here',
          replacement: 'get started',
          priority: 1,
        },
        {
          pattern: 'get started',
          replacement: 'begin now',
          priority: 2,
        },
      ];

      copyRefiner.loadRules(rules);
      const refined = copyRefiner.refineText('Please click here to continue');

      expect(refined).toBe('Please begin now to continue');
    });
  });

  describe('component refinement', () => {
    it('should refine JSX text nodes', () => {
      const rules: CopyReplacementRule[] = [
        {
          pattern: 'click here',
          replacement: 'get started',
        },
      ];

      copyRefiner.loadRules(rules);
      const component = `
        <div>
          <p>Please click here to continue</p>
          <button>Click here</button>
        </div>
      `;

      const refined = copyRefiner.refineComponent(component);
      expect(refined).toContain('get started');
      expect(refined).not.toContain('click here');
    });

    it('should refine component attributes', () => {
      const rules: CopyReplacementRule[] = [
        {
          pattern: 'click here',
          replacement: 'get started',
        },
      ];

      copyRefiner.loadRules(rules);
      const component = `
        <button
          label="Click here"
          placeholder="Click here to type"
          title="Click here for more"
          alt="Click here icon"
        >
          Submit
        </button>
      `;

      const refined = copyRefiner.refineComponent(component);
      expect(refined).toContain('label="get started"');
      expect(refined).toContain('placeholder="get started to type"');
      expect(refined).toContain('title="get started for more"');
      expect(refined).toContain('alt="get started icon"');
    });

    it('should handle invalid component code gracefully', () => {
      const rules: CopyReplacementRule[] = [
        {
          pattern: 'test',
          replacement: 'replacement',
        },
      ];

      copyRefiner.loadRules(rules);
      const invalidComponent = 'invalid { jsx';
      const result = copyRefiner.refineComponent(invalidComponent);

      expect(result).toBe(invalidComponent);
    });
  });
}); 