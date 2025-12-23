/**
 * Expression output generators
 * 
 * Generates JSON and JSONLogic representations of expressions
 * 
 * @module lib/expression-generator
 */

import type { ExpressionType, ValueAnalysis } from '@/types'
import {
  JSONLOGIC_COMPARISON_OPERATORS,
  JSONLOGIC_MATH_OPERATORS
} from '@/constants'

/**
 * Generate JSON representation of the current expression
 * 
 * @param expression - The expression to convert
 * @param rightAnalysis - Pre-analyzed right value
 * @returns JSON object representing the expression structure
 * 
 * @example
 * ```typescript
 * const expr = { leftTag: "Tag1", operator: "=", rightValue: "100" }
 * const analysis = analyzeRightValue(expr, "value", availableTags)
 * generateJSON(expr, analysis)
 * // Returns: { type: 'comparison', left: { type: 'tag', value: 'Tag1' }, operator: '=', right: {...} }
 * ```
 */
export function generateJSON(
  expression: ExpressionType,
  rightAnalysis: ValueAnalysis
): Record<string, unknown> {
  return {
    type: 'comparison',
    left: {
      type: 'tag',
      value: expression.leftTag
    },
    operator: expression.operator,
    right: rightAnalysis
  }
}

/**
 * Generate JSONLogic representation of the current expression
 * 
 * JSONLogic is a data logic format for representing complex conditional logic.
 * It uses a standardized format that can be evaluated by JSONLogic libraries.
 * 
 * @param expression - The expression to convert
 * @param rightAnalysis - Pre-analyzed right value
 * @returns JSONLogic object representing the expression structure
 * 
 * @example
 * ```typescript
 * const expr = { leftTag: "Tag1", operator: "=", rightValue: "100" }
 * const analysis = analyzeRightValue(expr, "value", availableTags)
 * generateJSONLogic(expr, analysis)
 * // Returns: { "==": [{ "var": "Tag1" }, 100] }
 * ```
 * 
 * @see {@link https://jsonlogic.com/} JSONLogic specification
 */
export function generateJSONLogic(
  expression: ExpressionType,
  rightAnalysis: ValueAnalysis
): Record<string, unknown> {
  // Map comparison operators to JSONLogic format
  const jsonLogicOperator =
    JSONLOGIC_COMPARISON_OPERATORS[expression.operator] || expression.operator

  // Handle calculation in right value
  if (
    rightAnalysis.type === 'calculation' &&
    rightAnalysis.value &&
    typeof rightAnalysis.value === 'object' &&
    'operator' in rightAnalysis.value
  ) {
    const calc = rightAnalysis.value as {
      left: { type: string; value: string }
      operator: string
      right: { type: string; value: string | number }
    }

    // Map mathematical operators to JSONLogic format
    const jsonLogicCalcOperator =
      JSONLOGIC_MATH_OPERATORS[calc.operator] || calc.operator

    // Build the calculation part
    const calcRight =
      calc.right.type === 'tag'
        ? { var: calc.right.value }
        : calc.right.value

    const calculation = {
      [jsonLogicCalcOperator]: [{ var: calc.left.value }, calcRight]
    }

    // Return the comparison with calculation
    return {
      [jsonLogicOperator]: [{ var: expression.leftTag }, calculation]
    }
  }

  // Handle simple right value
  const rightValue =
    rightAnalysis.type === 'tag'
      ? { var: rightAnalysis.value }
      : rightAnalysis.value

  return {
    [jsonLogicOperator]: [{ var: expression.leftTag }, rightValue]
  }
}

