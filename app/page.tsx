'use client'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { ComboBox } from '@/components/ui/combobox'
import { SmartComboBox } from '@/components/ui/smart-combobox'
import { OperatorComboBox } from '@/components/ui/operator-combobox'

type CalculationType = {
  leftTag: string
  operator: string
  rightValue: string
}

type ExpressionType = {
  leftTag: string
  operator: string
  rightValue: string
  calculation?: CalculationType
}

const AVAILABLE_TAGS = [
  { value: 'Tag1', label: 'Tag1' },
  { value: 'Tag2', label: 'Tag2' },
  { value: 'Tag3', label: 'Tag3' },
  { value: 'Tag4', label: 'Tag4' },
  { value: 'Tag5', label: 'Tag5' },
  { value: 'Tag6', label: 'Tag6' }
]

const OPERATORS = [
  { value: '=', label: '= (equals)', display: '=' },
  { value: '>', label: '> (greater than)', display: '>' },
  { value: '<', label: '< (less than)', display: '<' },
  { value: '!=', label: '!= (not equals)', display: '!=' },
  { value: '>=', label: '>= (greater than or equal)', display: '>=' },
  { value: '<=', label: '<= (less than or equal)', display: '<=' }
]

const CALC_OPERATORS = [
  { value: '+', label: '+ (addition)', display: '+' },
  { value: '-', label: '- (subtraction)', display: '-' },
  { value: '*', label: '* (multiplication)', display: '*' },
  { value: '/', label: '/ (division)', display: '/' }
]

const VALUE_TYPES = [
  { value: 'constant', label: 'Constant' },
  { value: 'tag', label: 'Tag' }
]

export default function ExpressionBuilder() {
  // Generate 50 example tags for testing lazy loading
  const generateExampleTags = () => {
    const tags = []
    for (let i = 1; i <= 50; i++) {
      tags.push(`ExampleTag${i}`)
    }
    return tags.join(', ')
  }
  
  const [customTags, setCustomTags] = useState(generateExampleTags())
  const [operatorOpen, setOperatorOpen] = useState(false)
  const [calcOperatorOpen, setCalcOperatorOpen] = useState(false)
  const [valueMode, setValueMode] = useState<'value' | 'calculation'>('value')
  const [expression, setExpression] = useState<ExpressionType>({
    leftTag: 'ExampleTag1',
    operator: '=',
    rightValue: '',
    calculation: {
      leftTag: 'ExampleTag1',
      operator: '+',
      rightValue: ''
    }
  })

  // Parse custom tags or fall back to default tags
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

  const availableTags = getAvailableTags()
  const selectedOperator = OPERATORS.find(op => op.value === expression.operator)

  // Reset expression when tags change
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

  const generateNaturalLanguage = () => {
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
      const calcRightText = calcRightAnalysis.type === 'tag' 
        ? `the value of ${calc.rightValue}`
        : calcRightAnalysis.type === 'constant' && typeof calcRightAnalysis.value === 'number'
        ? `the number ${calcRightAnalysis.value}`
        : `"${calcRightAnalysis.value}"`

      return `Condition: When ${expression.leftTag} ${operatorText} the result of ${calc.leftTag} ${calcOperatorText} ${calcRightText}`
    }

    const rightAnalysis = analyzeSimpleValue(expression.rightValue)
    const rightText = rightAnalysis.type === 'tag' 
      ? `the value of ${expression.rightValue}`
      : rightAnalysis.type === 'constant' && typeof rightAnalysis.value === 'number'
      ? `the number ${rightAnalysis.value}`
      : `"${rightAnalysis.value}"`

    return `Condition: When ${expression.leftTag} ${operatorText} ${rightText}`
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Expression Builder
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            No-code expression builder with live JSON output
          </p>
        </div>

        {/* Tag Configuration */}
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
            Configure Available Tags
          </h2>
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Enter comma-separated tags (e.g., "pressure, temperature, speed, altitude"):
            </label>
            <textarea
              value={customTags}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="pressure, temperature, speed, altitude, status, mode"
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={2}
            />
            <div className="text-xs text-zinc-500">
              {availableTags.length > 0 ? (
                <>Available tags: {availableTags.map(tag => tag.label).join(', ')}</>
              ) : (
                'Using default tags: Tag1, Tag2, Tag3, Tag4, Tag5, Tag6'
              )}
            </div>
          </div>
        </div>

        {/* Expression Builder */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100">
            Build Expression
          </h2>
          
          <div className="flex items-end gap-4 flex-wrap">
            {/* Left Tag */}
            <div className="flex flex-col gap-2 min-w-0">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Tag
              </label>
              <ComboBox
                options={availableTags}
                value={expression.leftTag}
                onChange={(value) => setExpression(prev => ({ ...prev, leftTag: value }))}
                placeholder="Search tags..."
                className="w-auto min-w-[160px] transition-all duration-300 ease-out"
                style={{ width: `${Math.max(160, (expression.leftTag.length * 8) + 60)}px` }}
              />
            </div>

            {/* Operator */}
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

            {/* Smart Value Field */}
            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Value
                </label>
                <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
                  <button
                    onClick={() => {
                      setValueMode('value')
                      setExpression(prev => ({ ...prev, rightValue: '' }))
                    }}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
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
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      valueMode === 'calculation'
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    Calculation
                  </button>
                </div>
              </div>
              
              {valueMode === 'value' ? (
                <SmartComboBox
                  options={availableTags}
                  value={expression.rightValue}
                  onChange={(value) => setExpression(prev => ({ ...prev, rightValue: value }))}
                  placeholder="Type value or select tag..."
                  className="w-[280px]"
                />
              ) : (
                <div className="flex items-center gap-2">
                  {/* Opening Parenthesis */}
                  <span className="text-2xl font-mono text-zinc-400 dark:text-zinc-500 select-none">
                    (
                  </span>
                  
                  {/* Calculation Tag */}
                  <ComboBox
                    options={availableTags}
                    value={expression.calculation?.leftTag || ''}
                    onChange={(value) => setExpression(prev => ({ 
                      ...prev, 
                      calculation: { ...prev.calculation!, leftTag: value }
                    }))}
                    placeholder="Search tags..."
                    className="w-auto min-w-[160px] transition-all duration-300 ease-out"
                    style={{ width: `${Math.max(160, ((expression.calculation?.leftTag || 'ExampleTag1').length * 8) + 60)}px` }}
                  />
                  
                  {/* Calculation Operator */}
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
                  
                  {/* Calculation Value */}
                  <SmartComboBox
                    options={availableTags}
                    value={expression.calculation?.rightValue || ''}
                    onChange={(value) => setExpression(prev => ({ 
                      ...prev, 
                      calculation: { ...prev.calculation!, rightValue: value }
                    }))}
                    placeholder="Type value or select tag..."
                    className="w-[280px]"
                  />
                  
                  {/* Closing Parenthesis */}
                  <span className="text-2xl font-mono text-zinc-400 dark:text-zinc-500 select-none">
                    )
                  </span>
                  
                  {/* Remove Calculation Button */}
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

          {/* Expression Preview */}
          <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
            <h3 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
              Expression Preview:
            </h3>
            <div className="font-mono text-purple-800 dark:text-purple-200 mb-3">
              {expression.leftTag} {expression.operator} {
                valueMode === 'calculation' && expression.calculation
                  ? `(${expression.calculation.leftTag} ${expression.calculation.operator} ${expression.calculation.rightValue || '___'})`
                  : (expression.rightValue || '___')
              }
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400 italic">
              {(valueMode === 'value' && expression.rightValue) || 
               (valueMode === 'calculation' && expression.calculation?.rightValue) 
                ? generateNaturalLanguage() 
                : 'Enter a value to see natural language...'}
            </div>
          </div>
        </div>

        {/* JSON Output */}
        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-8">
          <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
            Generated JSON
          </h2>
          <pre className="bg-zinc-900 dark:bg-zinc-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
{JSON.stringify(generateJSON(), null, 2)}
          </pre>
        </div>

        {/* Future Features Preview */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
            🚀 Coming Next (Phase 2)
          </h3>
          <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
            <li>• Multiple expressions with AND/OR logic</li>
            <li>• Nested parentheses grouping</li>
            <li>• Complex calculations with arithmetic operators</li>
            <li>• Visual connector lines and flow indicators</li>
            <li>• Drag-and-drop interface</li>
            <li>• Expression validation and error handling</li>
          </ul>
        </div>
        </div>
      </main>
    </div>
  )
}
