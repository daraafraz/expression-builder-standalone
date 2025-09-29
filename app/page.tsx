'use client'
import { useState } from 'react'
import { Trash2, Settings } from 'lucide-react'
// import { ComboBox } from '@/components/ui/combobox' // Unused
import { SmartComboBox } from '@/components/ui/smart-combobox'
import { OperatorComboBox } from '@/components/ui/operator-combobox'
import { Modal } from '@/components/ui/modal'

/**
 * Type definitions for the expression builder
 */

// Represents a calculation expression (e.g., "Tag1 + Tag2")
type CalculationType = {
  leftTag: string    // Left operand tag
  operator: string   // Mathematical operator (+, -, *, /)
  rightValue: string // Right operand (tag or constant)
}

// Represents a complete expression with optional calculation
type ExpressionType = {
  leftTag: string           // Main left operand tag
  operator: string          // Comparison operator (=, >, <, etc.)
  rightValue: string        // Right operand (tag, constant, or calculation result)
  calculation?: CalculationType // Optional nested calculation
}

/**
 * Default configuration data for the expression builder
 */

// Default tags available when no custom tags are configured
const AVAILABLE_TAGS = [
  { value: 'Tag1', label: 'Tag1' },
  { value: 'Tag2', label: 'Tag2' },
  { value: 'Tag3', label: 'Tag3' },
  { value: 'Tag4', label: 'Tag4' },
  { value: 'Tag5', label: 'Tag5' },
  { value: 'Tag6', label: 'Tag6' }
]

// Comparison operators for expressions (e.g., =, >, <, !=, >=, <=)
const OPERATORS = [
  { value: '=', label: '= (equals)', display: '=' },
  { value: '>', label: '> (greater than)', display: '>' },
  { value: '<', label: '< (less than)', display: '<' },
  { value: '!=', label: '!= (not equals)', display: '!=' },
  { value: '>=', label: '>= (greater than or equal)', display: '>=' },
  { value: '<=', label: '<= (less than or equal)', display: '<=' }
]

// Mathematical operators for calculations (e.g., +, -, *, /)
const CALC_OPERATORS = [
  { value: '+', label: '+ (addition)', display: '+' },
  { value: '-', label: '- (subtraction)', display: '-' },
  { value: '*', label: '* (multiplication)', display: '*' },
  { value: '/', label: '/ (division)', display: '/' }
]

// Unused value type options (kept for potential future use)
// const VALUE_TYPES = [
//   { value: 'constant', label: 'Constant' },
//   { value: 'tag', label: 'Tag' }
// ]

/**
 * Main Expression Builder component
 * 
 * This component provides a no-code interface for building complex expressions
 * with support for both simple comparisons and nested calculations.
 * 
 * Features:
 * - Tag-based expression building
 * - Support for calculations (Tag1 + Tag2)
 * - Live JSON output
 * - Custom tag configuration
 * - Natural language preview
 */
export default function ExpressionBuilder() {
  /**
   * Generate default industrial tags for oil & gas operations
   * These represent typical sensor data points in industrial facilities
   */
  const generateDefaultTags = () => {
    return "WELL_B1_PRESSURE, WELL_B1_TEMP, WELL_B1_FLOW_OIL, WELL_B1_FLOW_GAS, WELL_B1_CHOKE_POS, WELL_B2_PRESSURE, WELL_B2_TEMP, WELL_B2_FLOW_OIL, WELL_B2_FLOW_WATER, WELL_B2_STATUS, SEP_03_TEMP_IN, SEP_03_TEMP_OUT, SEP_03_PRESS_IN, SEP_03_PRESS_OUT, SEP_03_LEVEL, SEP_04_TEMP_IN, SEP_04_PRESS_OUT, SEP_04_LEVEL, SEP_05_TEMP_IN, SEP_05_PRESS_OUT, COMP_C1_SPEED, COMP_C1_TEMP_DISCH, COMP_C1_VIB_X, COMP_C1_VIB_Y, COMP_C1_VIB_Z, COMP_C2_PRESS_SUCTION, COMP_C2_PRESS_DISCH, COMP_C2_TEMP_BRG, COMP_C2_STATUS, COMP_C2_LOAD, PUMP_D1_SPEED, PUMP_D1_PRESS_DISCH, PUMP_D1_FLOWRATE, PUMP_D1_STATUS, PUMP_D1_TEMP_BRG, PUMP_D2_SPEED, PUMP_D2_PRESS_DISCH, PUMP_D2_VIBRATION, PUMP_D2_POWER_KW, PUMP_D2_STATUS, TANK_10_LEVEL, TANK_10_PRESSURE, TANK_10_TEMP, TANK_11_LEVEL, TANK_11_TEMP, PIPELINE_SEC_PRESS_IN, PIPELINE_SEC_PRESS_OUT, PIPELINE_SEC_FLOWRATE, PIPELINE_SEC_TEMP_IN, PIPELINE_SEC_TEMP_OUT"
  }
  
  // State management for UI interactions and data
  const [customTags, setCustomTags] = useState(generateDefaultTags()) // User-defined tags
  const [leftTagOpen, setLeftTagOpen] = useState(false)               // Left tag dropdown state
  const [operatorOpen, setOperatorOpen] = useState(false)             // Operator dropdown state
  const [calcLeftTagOpen, setCalcLeftTagOpen] = useState(false)       // Calculation left tag dropdown state
  const [calcOperatorOpen, setCalcOperatorOpen] = useState(false)     // Calculation operator dropdown state
  const [rightValueOpen, setRightValueOpen] = useState(false)         // Right value dropdown state
  const [calcRightValueOpen, setCalcRightValueOpen] = useState(false) // Calculation right value dropdown state
  const [valueMode, setValueMode] = useState<'value' | 'calculation'>('value') // Current input mode
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)   // Configuration modal state
  const [tempCustomTags, setTempCustomTags] = useState('')            // Temporary tags during editing
  const [outputTab, setOutputTab] = useState<'json' | 'jsonlogic'>('jsonlogic') // Output format tab
  
  // Current expression being built
  const [expression, setExpression] = useState<ExpressionType>({
    leftTag: '',      // Main left operand
    operator: '=',    // Comparison operator
    rightValue: '',   // Right operand
    calculation: {    // Optional nested calculation
      leftTag: '',
      operator: '+',
      rightValue: ''
    }
  })

  /**
   * Parse custom tags from comma-separated string or return default tags
   * @returns Array of tag objects with value and label properties
   */
  const getAvailableTags = () => {
    if (customTags.trim()) {
      return customTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .map(tag => ({ value: tag, label: tag }))
    }
    return AVAILABLE_TAGS
  }

  // Get current available tags and selected operator
  const availableTags = getAvailableTags()
  const selectedOperator = OPERATORS.find(op => op.value === expression.operator)

  /**
   * Handle changes to custom tags configuration
   * Resets the expression when tags change to use the first available tag
   * @param newTags - Comma-separated string of new tags
   */
  const handleTagsChange = (newTags: string) => {
    setCustomTags(newTags)
    const parsedTags = newTags.trim() ? newTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []
    if (parsedTags.length > 0) {
      setExpression(prev => ({
        ...prev,
        leftTag: parsedTags[0],
        rightValue: '',
        calculation: {
          leftTag: parsedTags[0],
          operator: '+',
          rightValue: ''
        }
      }))
    }
  }

  /**
   * Modal action handlers for tag configuration
   */
  
  // Open configuration modal and initialize with current tags
  const handleOpenModal = () => {
    setTempCustomTags(customTags)
    setIsConfigModalOpen(true)
  }

  // Save changes and close modal
  const handleSaveTags = () => {
    handleTagsChange(tempCustomTags)
    setIsConfigModalOpen(false)
  }

  // Cancel changes and close modal
  const handleCancelTags = () => {
    setTempCustomTags(customTags)
    setIsConfigModalOpen(false)
  }

  // Reset to default industrial tags
  const handleResetTags = () => {
    setTempCustomTags(generateDefaultTags())
  }

  /**
   * Analyze the right value of an expression to determine its type and structure
   * Handles both simple values and nested calculations
   * @param value - The right value to analyze
   * @returns Analysis object with type and value information
   */
  const analyzeRightValue = (value: string) => {
    // If in calculation mode, return the calculation structure
    if (valueMode === 'calculation' && expression.calculation) {
      const calc = expression.calculation
      const calcRightAnalysis = analyzeSimpleValue(calc.rightValue)
      
      return {
        type: 'calculation',
        value: {
          left: { type: 'tag', value: calc.leftTag },
          operator: calc.operator,
          right: calcRightAnalysis
        }
      }
    }
    
    return analyzeSimpleValue(value)
  }

  /**
   * Analyze a simple value to determine if it's a tag, number, or string constant
   * @param value - The value to analyze
   * @returns Analysis object with type and parsed value
   */
  const analyzeSimpleValue = (value: string) => {
    // Check if it's an existing tag
    const tagExists = availableTags.some(tag => tag.value === value)
    if (tagExists) {
      return { type: 'tag', value: value }
    }
    
    // Check if it's a number
    const numValue = Number(value)
    if (!isNaN(numValue) && value.trim() !== '') {
      return { type: 'constant', value: numValue }
    }
    
    // Otherwise it's a string constant
    return { type: 'constant', value: value }
  }

  /**
   * Generate JSON representation of the current expression
   * @returns JSON object representing the expression structure
   */
  const generateJSON = () => {
    const rightAnalysis = analyzeRightValue(expression.rightValue)
    
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
   * JSONLogic is a data logic format for representing complex conditional logic
   * @returns JSONLogic object representing the expression structure
   */
  const generateJSONLogic = () => {
    const rightAnalysis = analyzeRightValue(expression.rightValue)
    
    // Map comparison operators to JSONLogic format
    const operatorMap: { [key: string]: string } = {
      '=': '==',
      '!=': '!=',
      '>': '>',
      '<': '<',
      '>=': '>=',
      '<=': '<='
    }
    
    const jsonLogicOperator = operatorMap[expression.operator] || expression.operator
    
    // Handle calculation in right value
    if (rightAnalysis.type === 'calculation' && rightAnalysis.value && typeof rightAnalysis.value === 'object' && 'operator' in rightAnalysis.value) {
      const calc = rightAnalysis.value as { left: { type: string; value: string }; operator: string; right: { type: string; value: string | number } }
      
      // Map mathematical operators to JSONLogic format
      const calcOperatorMap: { [key: string]: string } = {
        '+': '+',
        '-': '-',
        '*': '*',
        '/': '/'
      }
      
      const jsonLogicCalcOperator = calcOperatorMap[calc.operator] || calc.operator
      
      // Build the calculation part
      const calcRight = calc.right.type === 'tag' 
        ? { "var": calc.right.value }
        : calc.right.value
      
      const calculation = {
        [jsonLogicCalcOperator]: [
          { "var": calc.left.value },
          calcRight
        ]
      }
      
      // Return the comparison with calculation
      return {
        [jsonLogicOperator]: [
          { "var": expression.leftTag },
          calculation
        ]
      }
    }
    
    // Handle simple right value
    const rightValue = rightAnalysis.type === 'tag' 
      ? { "var": rightAnalysis.value }
      : rightAnalysis.value
    
    return {
      [jsonLogicOperator]: [
        { "var": expression.leftTag },
        rightValue
      ]
    }
  }

  // Note: generateNaturalLanguage function was never implemented - using generateStyledNaturalLanguage instead

  /**
   * Generate styled natural language description of the current expression
   * @returns JSX element with formatted natural language description
   */
  const generateStyledNaturalLanguage = () => {
    const operatorText = {
      '=': 'equals',
      '>': 'is greater than',
      '<': 'is less than',
      '!=': 'does not equal',
      '>=': 'is greater than or equal to',
      '<=': 'is less than or equal to'
    }[expression.operator] || expression.operator

    if (valueMode === 'calculation' && expression.calculation) {
      const calc = expression.calculation
      const calcOperatorText = {
        '+': 'plus',
        '-': 'minus',
        '*': 'times',
        '/': 'divided by'
      }[calc.operator] || calc.operator

      const calcRightAnalysis = analyzeSimpleValue(calc.rightValue)
      
      return (
        <span>
          <strong>Condition:</strong> When{' '}
          <em>{expression.leftTag || '___'}</em>{' '}
          {operatorText} the result of{' '}
          <em>{calc.leftTag || '___'}</em>{' '}
          {calcOperatorText}{' '}
          {calcRightAnalysis.type === 'tag' ? (
            <>
              the value of <em>{calc.rightValue}</em>
            </>
          ) : calcRightAnalysis.type === 'constant' && typeof calcRightAnalysis.value === 'number' ? (
            <>
              the number <strong>{calcRightAnalysis.value}</strong>
            </>
          ) : (
            <>
              <em>&quot;{calcRightAnalysis.value}&quot;</em>
            </>
          )}
        </span>
      )
    }

    const rightAnalysis = analyzeSimpleValue(expression.rightValue)
    
    return (
      <span>
        <strong>Condition:</strong> When{' '}
        <em>{expression.leftTag || '___'}</em>{' '}
        {operatorText}{' '}
        {rightAnalysis.type === 'tag' ? (
          <>
            the value of <em>{expression.rightValue}</em>
          </>
        ) : rightAnalysis.type === 'constant' && typeof rightAnalysis.value === 'number' ? (
          <>
            the number <strong>{rightAnalysis.value}</strong>
          </>
        ) : (
          <>
            <em>&quot;{rightAnalysis.value}&quot;</em>
          </>
        )}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-800">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
        {/* Application Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            Expression Builder
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            No-code expression builder with live JSON output
          </p>
        </div>


        {/* Main Expression Builder Interface */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-8 shadow-lg">
          {/* Header with configuration button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Define Condition
            </h2>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4" />
              Configure Tags
            </button>
          </div>

          {/* Live Expression Preview */}
          <div className="mb-6 p-3 bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              Preview:
            </h3>
            <div>
              <div className="text-sm font-mono font-medium">
                <span className="font-medium font-mono" style={{ color: '#5ebbef' }}>{expression.leftTag || '___'}</span>
                <span className="mx-1" style={{ color: '#ff7e5f' }}>{expression.operator}</span>
                {valueMode === 'calculation' && expression.calculation ? (
                  <span>
                    <span className="font-medium" style={{ color: '#000000' }}>(</span>
                    <span className="font-medium font-mono" style={{ color: '#5ebbef' }}>{expression.calculation.leftTag || '___'}</span>
                    <span className="mx-1" style={{ color: '#ff7e5f' }}>{expression.calculation.operator}</span>
                    <span className="font-medium font-mono" style={{ 
                      color: (() => {
                        const calcRightAnalysis = analyzeSimpleValue(expression.calculation.rightValue)
                        return calcRightAnalysis.type === 'tag' ? '#5ebbef' : '#9ac42f'
                      })()
                    }}>{expression.calculation.rightValue || '___'}</span>
                    <span className="font-medium" style={{ color: '#000000' }}>)</span>
                  </span>
                ) : (
                  <span className="font-medium font-mono" style={{ 
                    color: (() => {
                      const rightAnalysis = analyzeSimpleValue(expression.rightValue)
                      return rightAnalysis.type === 'tag' ? '#5ebbef' : '#9ac42f'
                    })()
                  }}>{expression.rightValue || '___'}</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Expression Input Controls */}
          <div className="flex items-end gap-4 flex-wrap">
            {/* Left Tag Selection */}
            <div className="flex flex-col gap-2 min-w-0">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Tag
              </label>
              <SmartComboBox
                options={availableTags}
                value={expression.leftTag}
                onChange={(value) => {
                  // Only allow tag selection - check if it's a valid tag
                  const isValidTag = availableTags.some(tag => tag.value === value)
                  if (isValidTag || value === '') {
                    setExpression(prev => ({ ...prev, leftTag: value }))
                  }
                }}
                onOpenChange={setLeftTagOpen}
                placeholder="Select tag..."
                className="w-auto min-w-[160px] transition-all duration-300 ease-out"
                style={{ width: leftTagOpen ? '200px' : `${Math.max(180, (expression.leftTag.length * 10) + 140)}px` }}
              />
            </div>

            {/* Comparison Operator Selection */}
            <div className="flex flex-col gap-2 min-w-0">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Operator
              </label>
              <OperatorComboBox
                options={OPERATORS}
                value={expression.operator}
                onChange={(value) => setExpression(prev => ({ ...prev, operator: value }))}
                onOpenChange={setOperatorOpen}
                placeholder="Search operators..."
                className="w-auto min-w-[60px] transition-all duration-300 ease-out"
                style={{ width: operatorOpen ? '160px' : `${Math.max(60, (selectedOperator?.display?.length || 2) * 12 + 60)}px` }}
              />
            </div>

            {/* Right Value Input with Mode Toggle */}
            <div className="flex flex-col gap-2 min-w-0">
              {/* Value Mode Toggle (Value vs Calculation) */}
              <div className="flex items-center gap-2">
                <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
                  <button
                    onClick={() => {
                      setValueMode('value')
                      setExpression(prev => ({ ...prev, rightValue: '' }))
                    }}
                    className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                      valueMode === 'value'
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    Value
                  </button>
                  <button
                    onClick={() => {
                      setValueMode('calculation')
                      setExpression(prev => ({ ...prev, rightValue: '' }))
                    }}
                    className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                      valueMode === 'calculation'
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    Calculation
                  </button>
                </div>
              </div>
              
              {/* Value Input Mode */}
              {valueMode === 'value' ? (
                <SmartComboBox
                  options={availableTags}
                  value={expression.rightValue}
                  onChange={(value) => setExpression(prev => ({ ...prev, rightValue: value }))}
                  onOpenChange={setRightValueOpen}
                  placeholder="Type value or select tag..."
                  className="w-auto min-w-[280px] transition-all duration-300 ease-out"
                  style={{ width: rightValueOpen ? '320px' : `${Math.max(280, (expression.rightValue.length * 10) + 140)}px` }}
                />
              ) : (
                /* Calculation Input Mode */
                <div className="flex items-center gap-2">
                  {/* Opening Parenthesis */}
                  <span className="text-2xl font-mono text-zinc-400 dark:text-zinc-500 select-none">
                    (
                  </span>
                  
                  {/* Calculation Left Tag */}
                  <SmartComboBox
                    options={availableTags}
                    value={expression.calculation?.leftTag || ''}
                    onChange={(value) => {
                      // Only allow tag selection - check if it's a valid tag
                      const isValidTag = availableTags.some(tag => tag.value === value)
                      if (isValidTag || value === '') {
                        setExpression(prev => ({ 
                          ...prev, 
                          calculation: { ...prev.calculation!, leftTag: value }
                        }))
                      }
                    }}
                    onOpenChange={setCalcLeftTagOpen}
                    placeholder="Select tag..."
                    className="w-auto min-w-[160px] transition-all duration-300 ease-out"
                    style={{ width: calcLeftTagOpen ? '200px' : `${Math.max(180, ((expression.calculation?.leftTag || '').length * 10) + 140)}px` }}
                  />
                  
                  {/* Calculation Mathematical Operator */}
                  <OperatorComboBox
                    options={CALC_OPERATORS}
                    value={expression.calculation?.operator || '+'}
                    onChange={(value) => setExpression(prev => ({ 
                      ...prev, 
                      calculation: { ...prev.calculation!, operator: value }
                    }))}
                    onOpenChange={setCalcOperatorOpen}
                    placeholder="Op..."
                    className="w-auto min-w-[50px] transition-all duration-300 ease-out"
                    style={{ width: calcOperatorOpen ? '200px' : `${Math.max(50, ((expression.calculation?.operator || '+').length * 12) + 50)}px` }}
                  />
                  
                  {/* Calculation Right Value */}
                  <SmartComboBox
                    options={availableTags}
                    value={expression.calculation?.rightValue || ''}
                    onChange={(value) => setExpression(prev => ({ 
                      ...prev, 
                      calculation: { ...prev.calculation!, rightValue: value }
                    }))}
                    onOpenChange={setCalcRightValueOpen}
                    placeholder="Type value or select tag..."
                    className="w-auto min-w-[280px] transition-all duration-300 ease-out"
                    style={{ width: calcRightValueOpen ? '320px' : `${Math.max(280, ((expression.calculation?.rightValue || '').length * 10) + 140)}px` }}
                  />
                  
                  {/* Closing Parenthesis */}
                  <span className="text-2xl font-mono text-zinc-400 dark:text-zinc-500 select-none">
                    )
                  </span>
                  
                  {/* Remove Calculation Mode Button */}
                  <button
                    onClick={() => setValueMode('value')}
                    className="ml-2 px-2 py-2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 border border-zinc-300 dark:border-zinc-600 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                    title="Remove calculation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Live Natural Language Description */}
          <div className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {(valueMode === 'value' && expression.rightValue) || 
             (valueMode === 'calculation' && expression.calculation?.rightValue) 
              ? generateStyledNaturalLanguage() 
              : 'Enter a value to see natural language description...'}
          </div>
        </div>

        {/* Tag Configuration Modal */}
        <Modal
          isOpen={isConfigModalOpen}
          onClose={handleCancelTags}
          title="Configure Available Tags"
        >
          <div className="space-y-6">
            {/* Tag Input Form */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Enter comma-separated tags:
              </label>
              <textarea
                value={tempCustomTags}
                onChange={(e) => setTempCustomTags(e.target.value)}
                placeholder="pressure, temperature, speed, altitude, status, mode"
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-500 focus:border-transparent resize-none"
                rows={4}
              />
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                💡 Tags are case-sensitive and should be descriptive names for your data fields.
              </div>
            </div>

            {/* Live Tag Preview */}
            <div>
              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Preview Available Tags:
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-600 min-h-[100px]">
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  {tempCustomTags.trim() ? (
                    (() => {
                      const tempTags = tempCustomTags
                        .split(',')
                        .map(tag => tag.trim())
                        .filter(tag => tag.length > 0)
                        .map(tag => ({ value: tag, label: tag }))
                      
                      return tempTags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {tempTags.map(tag => (
                            <span 
                              key={tag.value}
                              className="inline-block px-2 py-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded text-xs font-mono"
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-500 dark:text-zinc-400">No valid tags found</span>
                      )
                    })()
                  ) : (
                    <span className="text-zinc-500 dark:text-zinc-400">Using default tags: Tag1, Tag2, Tag3, Tag4, Tag5, Tag6</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetTags}
                  className="px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  Reset to Default
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancelTags}
                  className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTags}
                  className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 border border-zinc-300 dark:border-zinc-600 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Live Output Display with Tabs */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-8 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Generated Output
            </h2>
            
            {/* Tab Selector */}
            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setOutputTab('jsonlogic')}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  outputTab === 'jsonlogic'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                JSONLogic
              </button>
              <button
                onClick={() => setOutputTab('json')}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  outputTab === 'json'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                JSON
              </button>
            </div>
          </div>
          
          {/* Output Content */}
          <div className="space-y-2">
            {outputTab === 'json' ? (
              <div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  Standard JSON format
                </div>
                <pre className="bg-zinc-900 dark:bg-zinc-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
{JSON.stringify(generateJSON(), null, 2)}
                </pre>
              </div>
            ) : (
              <div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  JSONLogic format for conditional logic evaluation
                </div>
                <pre className="bg-zinc-900 dark:bg-zinc-950 text-blue-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
{JSON.stringify(generateJSONLogic(), null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>


        </div>
      </main>
    </div>
  )
}
