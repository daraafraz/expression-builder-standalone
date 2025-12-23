/**
 * Expression preview component
 * 
 * Displays a live preview of the current expression with syntax highlighting
 * 
 * @module components/expression/ExpressionPreview
 */

import type { ExpressionType, ValueMode } from '@/types'
import type { Option } from '@/types'
import { analyzeSimpleValue } from '@/lib/expression-analyzer'

interface ExpressionPreviewProps {
  /** Current expression */
  expression: ExpressionType
  /** Current input mode */
  valueMode: ValueMode
  /** Available tags for validation */
  availableTags: Option[]
}

/**
 * Expression preview component with syntax highlighting
 * 
 * @param props - Component props
 * @returns JSX element with expression preview
 */
export function ExpressionPreview({
  expression,
  valueMode,
  availableTags
}: ExpressionPreviewProps) {
  return (
    <div className="mb-6 p-3 bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
      <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
        Preview:
      </h3>
      <div>
        <div className="text-sm font-mono font-medium">
          <span
            className="font-medium font-mono"
            style={{ color: '#5ebbef' }}
          >
            {expression.leftTag || '___'}
          </span>
          <span className="mx-1" style={{ color: '#ff7e5f' }}>
            {expression.operator}
          </span>
          {valueMode === 'calculation' && expression.calculation ? (
            <span>
              <span className="font-medium" style={{ color: '#000000' }}>
                (
              </span>
              <span
                className="font-medium font-mono"
                style={{ color: '#5ebbef' }}
              >
                {expression.calculation.leftTag || '___'}
              </span>
              <span className="mx-1" style={{ color: '#ff7e5f' }}>
                {expression.calculation.operator}
              </span>
              <span
                className="font-medium font-mono"
                style={{
                  color: (() => {
                    const calcRightAnalysis = analyzeSimpleValue(
                      expression.calculation.rightValue,
                      availableTags
                    )
                    return calcRightAnalysis.type === 'tag' ? '#5ebbef' : '#9ac42f'
                  })()
                }}
              >
                {expression.calculation.rightValue || '___'}
              </span>
              <span className="font-medium" style={{ color: '#000000' }}>
                )
              </span>
            </span>
          ) : (
            <span
              className="font-medium font-mono"
              style={{
                color: (() => {
                  const rightAnalysis = analyzeSimpleValue(
                    expression.rightValue,
                    availableTags
                  )
                  return rightAnalysis.type === 'tag' ? '#5ebbef' : '#9ac42f'
                })()
              }}
            >
              {expression.rightValue || '___'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

