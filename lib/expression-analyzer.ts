/**
 * Expression analysis utilities
 * 
 * Analyzes expression values to determine their type and structure
 * 
 * @module lib/expression-analyzer
 */

import type {
  ExpressionType,
  ValueAnalysis,
  SimpleValueAnalysis,
  ValueMode
} from '@/types'
import type { Option } from '@/types'

/**
 * Analyze a simple value to determine if it's a tag, number, or string constant
 * 
 * @param value - The value to analyze
 * @param availableTags - Array of available tag options for validation
 * @returns Analysis object with type and parsed value
 * 
 * @example
 * ```typescript
 * analyzeSimpleValue("100", availableTags)
 * // Returns: { type: 'constant', value: 100 }
 * 
 * analyzeSimpleValue("WELL_B1_PRESSURE", availableTags)
 * // Returns: { type: 'tag', value: "WELL_B1_PRESSURE" }
 * ```
 */
export function analyzeSimpleValue(
  value: string,
  availableTags: Option[]
): SimpleValueAnalysis {
  // Check if it's an existing tag
  const tagExists = availableTags.some(tag => tag.value === value)
  if (tagExists) {
    return { type: 'tag', value }
  }

  // Check if it's a number
  const numValue = Number(value)
  if (!isNaN(numValue) && value.trim() !== '') {
    return { type: 'constant', value: numValue }
  }

  // Otherwise it's a string constant
  return { type: 'constant', value }
}

/**
 * Analyze the right value of an expression to determine its type and structure
 * Handles both simple values and nested calculations
 * 
 * @param expression - The expression to analyze
 * @param valueMode - Current input mode (value or calculation)
 * @param availableTags - Array of available tag options for validation
 * @returns Analysis object with type and value information
 * 
 * @example
 * ```typescript
 * const expr = { leftTag: "Tag1", operator: "=", rightValue: "", calculation: { leftTag: "Tag2", operator: "+", rightValue: "Tag3" } }
 * analyzeRightValue(expr, "calculation", availableTags)
 * // Returns: { type: 'calculation', value: { left: {...}, operator: '+', right: {...} } }
 * ```
 */
export function analyzeRightValue(
  expression: ExpressionType,
  valueMode: ValueMode,
  availableTags: Option[]
): ValueAnalysis {
  // If in calculation mode, return the calculation structure
  if (valueMode === 'calculation' && expression.calculation) {
    const calc = expression.calculation
    const calcRightAnalysis = analyzeSimpleValue(calc.rightValue, availableTags)

    return {
      type: 'calculation',
      value: {
        left: { type: 'tag', value: calc.leftTag },
        operator: calc.operator,
        right: calcRightAnalysis
      }
    }
  }

  // Otherwise analyze as simple value
  return analyzeSimpleValue(expression.rightValue, availableTags)
}

