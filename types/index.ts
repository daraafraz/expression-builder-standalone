/**
 * Type definitions for the Expression Builder application
 * 
 * @module types
 */

/**
 * Represents a calculation expression (e.g., "Tag1 + Tag2")
 */
export interface CalculationType {
  /** Left operand tag name */
  leftTag: string
  /** Mathematical operator (+, -, *, /) */
  operator: string
  /** Right operand (tag or constant) */
  rightValue: string
}

/**
 * Represents a complete expression with optional calculation
 */
export interface ExpressionType {
  /** Main left operand tag name */
  leftTag: string
  /** Comparison operator (=, >, <, !=, >=, <=) */
  operator: string
  /** Right operand (tag, constant, or calculation result) */
  rightValue: string
  /** Optional nested calculation */
  calculation?: CalculationType
}

/**
 * Value type classification for expression analysis
 */
export type ValueType = 'tag' | 'constant' | 'calculation'

/**
 * Analysis result for a simple value
 */
export interface SimpleValueAnalysis {
  type: 'tag' | 'constant'
  value: string | number
}

/**
 * Analysis result for a calculation value
 */
export interface CalculationValueAnalysis {
  type: 'calculation'
  value: {
    left: { type: 'tag'; value: string }
    operator: string
    right: SimpleValueAnalysis
  }
}

// Re-export for convenience (used in expression-analyzer)
export type { CalculationValueAnalysis as CalculationAnalysis }

/**
 * Union type for all value analysis results
 */
export type ValueAnalysis = SimpleValueAnalysis | CalculationValueAnalysis

/**
 * Output format options
 */
export type OutputFormat = 'json' | 'jsonlogic'

/**
 * Input mode for right value
 */
export type ValueMode = 'value' | 'calculation'

/**
 * Option structure for dropdown components
 */
export interface Option {
  value: string
  label: string
  display?: string
}

/**
 * Operator mapping for JSONLogic conversion
 */
export interface OperatorMap {
  [key: string]: string
}

/**
 * Operator option type with required display property
 * Used for operator selection components
 */
export interface OperatorOption extends Option {
  display: string
}

