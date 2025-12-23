# Example Issues for Reference

This document provides example issue content that can be used as templates. These demonstrate good issue structure for new contributors.

## Example 1: Good First Issue

**Title**: `[Good First Issue] Add keyboard shortcut to switch between Value and Calculation modes`

**Labels**: `good first issue`

**Description**:
```markdown
## Description
Add keyboard shortcuts to quickly switch between "Value" and "Calculation" input modes. This would improve workflow efficiency for users building many expressions.

## Context
Currently, users must click the toggle button to switch modes. A keyboard shortcut (e.g., `V` for Value, `C` for Calculation) would speed up the process.

## Acceptance Criteria
- [ ] Pressing `V` switches to Value mode
- [ ] Pressing `C` switches to Calculation mode
- [ ] Shortcuts work when focus is on any input field
- [ ] Visual indicator shows which mode is active
- [ ] Shortcuts are documented in a tooltip or help text

## Helpful Information
- Relevant file: `app/page.tsx` (around line 495-525)
- The mode toggle is already implemented, you just need to add keyboard event handlers
- Use React's `useEffect` and `addEventListener` for keyboard shortcuts
- Consider using a library like `react-hotkeys-hook` if needed

## Questions?
Feel free to ask if you need clarification on the implementation approach!
```

## Example 2: Help Wanted

**Title**: `[Help Wanted] Add support for string comparison operators (contains, startsWith, endsWith)`

**Labels**: `help wanted`, `enhancement`

**Description**:
```markdown
## Description
Extend the operator options to include string-specific comparison operators: `contains`, `startsWith`, and `endsWith`. This would enable more sophisticated string matching conditions.

## Why This Is Needed
Many industrial systems need to match string patterns (e.g., status codes, tag names with patterns). Currently, only exact equality (`=`) and numeric comparisons are supported.

## Suggested Approach
1. Add new operators to `constants/index.ts` in `COMPARISON_OPERATORS`
2. Update `lib/expression-generator.ts` to handle string operators in JSONLogic format
3. Update natural language generation in `lib/natural-language.tsx`
4. Add UI support in the operator combobox

## Acceptance Criteria
- [ ] `contains` operator works: `TAG_NAME contains "WELL"`
- [ ] `startsWith` operator works: `TAG_NAME startsWith "WELL_B1"`
- [ ] `endsWith` operator works: `TAG_NAME endsWith "_PRESSURE"`
- [ ] JSONLogic output correctly formats string operators
- [ ] Natural language preview shows readable descriptions

## Additional Context
JSONLogic supports string operations, so the format would be:
```json
{
  "in": ["WELL", { "var": "TAG_NAME" }]
}
```

## Getting Started
- Relevant files: 
  - `constants/index.ts` (add operators)
  - `lib/expression-generator.ts` (JSONLogic mapping)
  - `lib/natural-language.tsx` (text generation)
- Related documentation: JSONLogic string operations at https://jsonlogic.com/operations.html#string
```

## Example 3: Bug Report

**Title**: `[Bug] Calculation mode doesn't reset when switching back to Value mode`

**Labels**: `bug`

**Description**:
```markdown
## Description
When switching from Calculation mode back to Value mode, the calculation fields remain visible and can cause confusion. The calculation should be cleared or hidden when switching modes.

## Steps to Reproduce
1. Select "Calculation" mode
2. Enter values in the calculation fields (e.g., Tag1 + Tag2)
3. Switch back to "Value" mode
4. Observe that calculation fields are still visible/active

## Expected Behavior
When switching to Value mode, the calculation should be cleared and the calculation UI should be hidden.

## Actual Behavior
Calculation fields remain visible and can still be edited, which is confusing.

## Screenshots
[If applicable]

## Environment
- Browser: Chrome 120
- OS: macOS 14
- Node version: 18.17.0

## Additional Context
This happens because the `valueMode` state changes but the calculation state isn't reset. The `handleValueModeChange` function should clear the calculation when switching to Value mode.

## Possible Solution
In `app/page.tsx`, the `handleValueModeChange` function should reset the calculation:
```typescript
const handleValueModeChange = (mode: ValueMode) => {
  setValueMode(mode)
  setExpression(prev => ({ 
    ...prev, 
    rightValue: '',
    calculation: mode === 'calculation' ? prev.calculation : { leftTag: '', operator: '+', rightValue: '' }
  }))
}
```
```

## Example 4: Feature Request

**Title**: `[Feature] Add ability to export expressions to file`

**Labels**: `enhancement`

**Description**:
```markdown
## Description
Add a "Download" or "Export" button that allows users to save their generated expressions to a JSON file. This would make it easier to share expressions or import them into other systems.

## Problem It Solves
Currently, users must manually copy-paste the JSON/JSONLogic output. For complex expressions or when working with multiple expressions, this is tedious and error-prone.

## Proposed Solution
Add an "Export" button next to the output tabs that:
1. Generates a JSON file with the current expression
2. Includes metadata (timestamp, format type)
3. Allows user to download the file

## Alternatives Considered
- Copy to clipboard button (simpler, but less permanent)
- Multiple format export (could be added later)

## Additional Context
This would be especially useful for:
- Sharing expressions with team members
- Version control of expression configurations
- Batch importing into rule engines

## Implementation Notes
- Use browser's `Blob` API to create downloadable file
- File could include both JSON and JSONLogic formats
- Consider adding import functionality in the future
- Relevant area: `components/expression/OutputDisplay.tsx`
```

---

**Note**: These are example issues. To create actual issues on GitHub, use the issue templates in `.github/ISSUE_TEMPLATE/` or copy the content from these examples.

