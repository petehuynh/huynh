import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
class CopyRefiner {
    constructor() {
        this.rules = [];
    }
    static getInstance() {
        if (!CopyRefiner.instance) {
            CopyRefiner.instance = new CopyRefiner();
        }
        return CopyRefiner.instance;
    }
    loadRules(rules) {
        this.rules = rules.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }
    async loadRulesFromFile(path) {
        try {
            const response = await fetch(path);
            const rules = await response.json();
            this.loadRules(rules);
        }
        catch (error) {
            console.error('Error loading copy replacement rules:', error);
            throw error;
        }
    }
    refineText(text, context = []) {
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
    refineComponent(code) {
        try {
            const ast = parse(code, {
                sourceType: 'module',
                plugins: ['jsx', 'typescript'],
            });
            let refinedCode = code;
            const textNodes = [];
            traverse(ast, {
                JSXText(path) {
                    const { node } = path;
                    if (node.value.trim()) {
                        textNodes.push({
                            start: node.start,
                            end: node.end,
                            value: node.value,
                        });
                    }
                },
                StringLiteral(path) {
                    const { node } = path;
                    if (path.parent.type === 'JSXAttribute' &&
                        ['label', 'placeholder', 'title', 'alt'].includes(path.parent.name.name)) {
                        textNodes.push({
                            start: node.start,
                            end: node.end,
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
        }
        catch (error) {
            console.error('Error refining component:', error);
            return code;
        }
    }
    getRules() {
        return [...this.rules];
    }
    clearRules() {
        this.rules = [];
    }
}
export default CopyRefiner;
//# sourceMappingURL=copyRefiner.js.map