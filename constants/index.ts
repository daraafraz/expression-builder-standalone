/**
 * Application constants and configuration
 * 
 * @module constants
 */

import type { Option, OperatorOption } from '@/types'

/**
 * Default tags available when no custom tags are configured
 */
export const DEFAULT_TAGS: Option[] = [
  { value: 'Tag1', label: 'Tag1' },
  { value: 'Tag2', label: 'Tag2' },
  { value: 'Tag3', label: 'Tag3' },
  { value: 'Tag4', label: 'Tag4' },
  { value: 'Tag5', label: 'Tag5' },
  { value: 'Tag6', label: 'Tag6' }
]

/**
 * Comparison operators for expressions
 */
export const COMPARISON_OPERATORS: OperatorOption[] = [
  { value: '=', label: '= (equals)', display: '=' },
  { value: '>', label: '> (greater than)', display: '>' },
  { value: '<', label: '< (less than)', display: '<' },
  { value: '!=', label: '!= (not equals)', display: '!=' },
  { value: '>=', label: '>= (greater than or equal)', display: '>=' },
  { value: '<=', label: '<= (less than or equal)', display: '<=' }
]

/**
 * Mathematical operators for calculations
 */
export const MATH_OPERATORS: OperatorOption[] = [
  { value: '+', label: '+ (addition)', display: '+' },
  { value: '-', label: '- (subtraction)', display: '-' },
  { value: '*', label: '* (multiplication)', display: '*' },
  { value: '/', label: '/ (division)', display: '/' }
]

/**
 * Default industrial tags for oil & gas operations
 * These represent typical sensor data points in industrial facilities
 */
export const DEFAULT_INDUSTRIAL_TAGS = [
  'WELL_B1_PRESSURE',
  'WELL_B1_TEMP',
  'WELL_B1_FLOW_OIL',
  'WELL_B1_FLOW_GAS',
  'WELL_B1_CHOKE_POS',
  'WELL_B2_PRESSURE',
  'WELL_B2_TEMP',
  'WELL_B2_FLOW_OIL',
  'WELL_B2_FLOW_WATER',
  'WELL_B2_STATUS',
  'SEP_03_TEMP_IN',
  'SEP_03_TEMP_OUT',
  'SEP_03_PRESS_IN',
  'SEP_03_PRESS_OUT',
  'SEP_03_LEVEL',
  'SEP_04_TEMP_IN',
  'SEP_04_PRESS_OUT',
  'SEP_04_LEVEL',
  'SEP_05_TEMP_IN',
  'SEP_05_PRESS_OUT',
  'COMP_C1_SPEED',
  'COMP_C1_TEMP_DISCH',
  'COMP_C1_VIB_X',
  'COMP_C1_VIB_Y',
  'COMP_C1_VIB_Z',
  'COMP_C2_PRESS_SUCTION',
  'COMP_C2_PRESS_DISCH',
  'COMP_C2_TEMP_BRG',
  'COMP_C2_STATUS',
  'COMP_C2_LOAD',
  'PUMP_D1_SPEED',
  'PUMP_D1_PRESS_DISCH',
  'PUMP_D1_FLOWRATE',
  'PUMP_D1_STATUS',
  'PUMP_D1_TEMP_BRG',
  'PUMP_D2_SPEED',
  'PUMP_D2_PRESS_DISCH',
  'PUMP_D2_VIBRATION',
  'PUMP_D2_POWER_KW',
  'PUMP_D2_STATUS',
  'TANK_10_LEVEL',
  'TANK_10_PRESSURE',
  'TANK_10_TEMP',
  'TANK_11_LEVEL',
  'TANK_11_TEMP',
  'PIPELINE_SEC_PRESS_IN',
  'PIPELINE_SEC_PRESS_OUT',
  'PIPELINE_SEC_FLOWRATE',
  'PIPELINE_SEC_TEMP_IN',
  'PIPELINE_SEC_TEMP_OUT'
]

/**
 * Generate default industrial tags as comma-separated string
 * @returns Comma-separated string of default industrial tags
 */
export const generateDefaultTags = (): string => {
  return DEFAULT_INDUSTRIAL_TAGS.join(', ')
}

/**
 * Operator text mappings for natural language generation
 */
export const OPERATOR_TEXT_MAP: Record<string, string> = {
  '=': 'equals',
  '>': 'is greater than',
  '<': 'is less than',
  '!=': 'does not equal',
  '>=': 'is greater than or equal to',
  '<=': 'is less than or equal to'
}

/**
 * Calculation operator text mappings for natural language generation
 */
export const CALC_OPERATOR_TEXT_MAP: Record<string, string> = {
  '+': 'plus',
  '-': 'minus',
  '*': 'times',
  '/': 'divided by'
}

/**
 * JSONLogic operator mapping for comparison operators
 */
export const JSONLOGIC_COMPARISON_OPERATORS: Record<string, string> = {
  '=': '==',
  '!=': '!=',
  '>': '>',
  '<': '<',
  '>=': '>=',
  '<=': '<='
}

/**
 * JSONLogic operator mapping for mathematical operators
 */
export const JSONLOGIC_MATH_OPERATORS: Record<string, string> = {
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '/'
}

