/**
 * Natural language generation utilities
 * 
 * Converts expressions into human-readable descriptions
 * 
 * @module lib/natural-language
 */

import type { ReactElement } from 'react'
import type { ExpressionType, ValueMode } from '@/types'
import type { Option } from '@/types'
import { OPERATOR_TEXT_MAP, CALC_OPERATOR_TEXT_MAP } from '@/constants'
import { analyzeSimpleValue } from './expression-analyzer'

/**
 * Generate styled natural language description of the current expression
 * 
 * @param expression - The expression to describe
 * @param valueMode - Current input mode (value or calculation)
 * @param availableTags - Array of available tag options for validation
 * @returns React element with formatted natural language description
 * 
 * @example
 * ```typescript
 * const expr = { leftTag: "WELL_B1_PRESSURE", operator: ">", rightValue: "100" }
 * generateStyledNaturalLanguage(expr, "value", availableTags)
 * // Returns: <span>Condition: When WELL_B1_PRESSURE is greater than the number 100</span>
 * ```
 */
export function generateStyledNaturalLanguage(
  expression: ExpressionType,
  valueMode: ValueMode,
  availableTags: Option[]
): ReactElement {
  const operatorText =
    OPERATOR_TEXT_MAP[expression.operator] || expression.operator

  if (valueMode === 'calculation' && expression.calculation) {
    const calc = expression.calculation
    const calcOperatorText =
      CALC_OPERATOR_TEXT_MAP[calc.operator] || calc.operator

    const calcRightAnalysis = analyzeSimpleValue(calc.rightValue, availableTags)

    return (
      <span>
        <strong>Condition:</strong> When{' '}
        <em>{expression.leftTag || '___'}</em> {operatorText} the result of{' '}
        <em>{calc.leftTag || '___'}</em> {calcOperatorText}{' '}
        {calcRightAnalysis.type === 'tag' ? (
          <>the value of <em>{calc.rightValue}</em></>
        ) : calcRightAnalysis.type === 'constant' &&
          typeof calcRightAnalysis.value === 'number' ? (
          <>the number <strong>{calcRightAnalysis.value}</strong></>
        ) : (
          <em>&quot;{calcRightAnalysis.value}&quot;</em>
        )}
      </span>
    )
  }

  const rightAnalysis = analyzeSimpleValue(expression.rightValue, availableTags)

  return (
    <span>
      <strong>Condition:</strong> When{' '}
      <em>{expression.leftTag || '___'}</em> {operatorText}{' '}
      {rightAnalysis.type === 'tag' ? (
        <>the value of <em>{expression.rightValue}</em></>
      ) : rightAnalysis.type === 'constant' &&
        typeof rightAnalysis.value === 'number' ? (
        <>the number <strong>{rightAnalysis.value}</strong></>
      ) : (
        <em>&quot;{rightAnalysis.value}&quot;</em>
      )}
    </span>
  )
}

