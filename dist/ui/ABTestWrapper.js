import React, { useEffect, useState } from 'react';
import ABTesting from '../core/abTesting';
const ABTestWrapper = ({ testId, controlText, variantText, children, }) => {
    const [selectedText, setSelectedText] = useState(controlText);
    const abTesting = ABTesting.getInstance();
    useEffect(() => {
        // Create the test if it doesn't exist
        try {
            abTesting.createTest({
                testId,
                variants: [controlText, variantText],
            });
        }
        catch (error) {
            // Test already exists, ignore the error
        }
        // Get the variant for this user
        const variant = abTesting.getVariant(testId);
        setSelectedText(variant === controlText ? controlText : variantText);
        // Track impression
        abTesting.trackImpression(testId);
    }, [testId, controlText, variantText]);
    const handleInteraction = () => {
        abTesting.trackConversion(testId);
    };
    return (React.createElement("div", { onClick: handleInteraction, onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                handleInteraction();
            }
        }, role: "button", tabIndex: 0, "data-testid": `ab-test-${testId}`, "data-variant": selectedText === controlText ? 'control' : 'variant' }, children(selectedText)));
};
export default ABTestWrapper;
//# sourceMappingURL=ABTestWrapper.js.map