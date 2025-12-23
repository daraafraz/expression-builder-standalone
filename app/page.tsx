/**
 * Expression Builder - Main Page Component
 * 
 * A no-code interface for building complex expressions with support for:
 * - Simple comparisons (Tag1 = Tag2)
 * - Nested calculations (Tag1 = (Tag2 + Tag3))
 * - Live JSON and JSONLogic output
 * - Custom tag configuration
 * - Natural language preview
 * 
 * @module app/page
 */

'use client'

import { useState, useMemo } from 'react'
import { Trash2, Settings } from 'lucide-react'
import { SmartComboBox } from '@/components/ui/smart-combobox'
import { OperatorComboBox } from '@/components/ui/operator-combobox'
import { Modal } from '@/components/ui/modal'
import { ExpressionPreview } from '@/components/expression/ExpressionPreview'
import { OutputDisplay } from '@/components/expression/OutputDisplay'

// Types
import type {
  ExpressionType,
  ValueMode,
  OutputFormat
} from '@/types'

// Constants
import {
  COMPARISON_OPERATORS,
  MATH_OPERATORS,
  generateDefaultTags
} from '@/constants'

// Utilities
import { parseTags, isValidTag, getFirstTag } from '@/lib/tag-parser'
import { analyzeRightValue } from '@/lib/expression-analyzer'
import { generateJSON, generateJSONLogic } from '@/lib/expression-generator'
import { generateStyledNaturalLanguage } from '@/lib/natural-language'

/**
 * Initial expression state
 */
const INITIAL_EXPRESSION: ExpressionType = {
  leftTag: '',
  operator: '=',
  rightValue: '',
  calculation: {
    leftTag: '',
    operator: '+',
    rightValue: ''
  }
}

/**
 * Main Expression Builder component
 * 
 * @returns JSX element with the expression builder interface
 */
export default function ExpressionBuilder() {
  // State management
  const [customTags, setCustomTags] = useState(generateDefaultTags())
  const [leftTagOpen, setLeftTagOpen] = useState(false)
  const [operatorOpen, setOperatorOpen] = useState(false)
  const [calcLeftTagOpen, setCalcLeftTagOpen] = useState(false)
  const [calcOperatorOpen, setCalcOperatorOpen] = useState(false)
  const [rightValueOpen, setRightValueOpen] = useState(false)
  const [calcRightValueOpen, setCalcRightValueOpen] = useState(false)
  const [valueMode, setValueMode] = useState<ValueMode>('value')
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [tempCustomTags, setTempCustomTags] = useState('')
  const [outputTab, setOutputTab] = useState<OutputFormat>('jsonlogic')
  const [expression, setExpression] = useState<ExpressionType>(INITIAL_EXPRESSION)

  // Computed values
  const availableTags = useMemo(() => parseTags(customTags), [customTags])
  const selectedOperator = useMemo(
    () => COMPARISON_OPERATORS.find(op => op.value === expression.operator),
    [expression.operator]
  )

  // Expression analysis and generation
  const rightAnalysis = useMemo(
    () => analyzeRightValue(expression, valueMode, availableTags),
    [expression, valueMode, availableTags]
  )

  const jsonOutput = useMemo(
    () => JSON.stringify(generateJSON(expression, rightAnalysis), null, 2),
    [expression, rightAnalysis]
  )

  const jsonLogicOutput = useMemo(
    () => JSON.stringify(generateJSONLogic(expression, rightAnalysis), null, 2),
    [expression, rightAnalysis]
  )

  // Event handlers
  const handleTagsChange = (newTags: string) => {
    setCustomTags(newTags)
    const parsedTags = parseTags(newTags)
    if (parsedTags.length > 0) {
      const firstTag = getFirstTag(parsedTags)
      setExpression(prev => ({
        ...prev,
        leftTag: firstTag,
        rightValue: '',
        calculation: {
          leftTag: firstTag,
          operator: '+',
          rightValue: ''
        }
      }))
    }
  }

  const handleOpenModal = () => {
    setTempCustomTags(customTags)
    setIsConfigModalOpen(true)
  }

  const handleSaveTags = () => {
    handleTagsChange(tempCustomTags)
    setIsConfigModalOpen(false)
  }

  const handleCancelTags = () => {
    setTempCustomTags(customTags)
    setIsConfigModalOpen(false)
  }

  const handleResetTags = () => {
    setTempCustomTags(generateDefaultTags())
  }

  const handleLeftTagChange = (value: string) => {
    if (isValidTag(value, availableTags) || value === '') {
      setExpression(prev => ({ ...prev, leftTag: value }))
    }
  }

  const handleCalcLeftTagChange = (value: string) => {
    if (isValidTag(value, availableTags) || value === '') {
      setExpression(prev => ({
        ...prev,
        calculation: { ...prev.calculation!, leftTag: value }
      }))
    }
  }

  const handleValueModeChange = (mode: ValueMode) => {
    setValueMode(mode)
    setExpression(prev => ({ ...prev, rightValue: '' }))
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
              No-code expression builder with live JSON and JSONLogic output
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
                aria-label="Configure tags"
              >
                <Settings className="h-4 w-4" />
                Configure Tags
              </button>
            </div>

            {/* Live Expression Preview */}
            <ExpressionPreview
              expression={expression}
              valueMode={valueMode}
              availableTags={availableTags}
            />

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
                  onChange={handleLeftTagChange}
                  onOpenChange={setLeftTagOpen}
                  placeholder="Select tag..."
                  className="w-auto min-w-[160px] transition-all duration-300 ease-out"
                  style={{
                    width: leftTagOpen
                      ? '200px'
                      : `${Math.max(180, expression.leftTag.length * 10 + 140)}px`
                  }}
                />
              </div>

              {/* Comparison Operator Selection */}
              <div className="flex flex-col gap-2 min-w-0">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Operator
                </label>
                <OperatorComboBox
                  options={COMPARISON_OPERATORS}
                  value={expression.operator}
                  onChange={value =>
                    setExpression(prev => ({ ...prev, operator: value }))
                  }
                  onOpenChange={setOperatorOpen}
                  placeholder="Search operators..."
                  className="w-auto min-w-[60px] transition-all duration-300 ease-out"
                  style={{
                    width: operatorOpen
                      ? '160px'
                      : `${Math.max(60, (selectedOperator?.display?.length || 2) * 12 + 60)}px`
                  }}
                />
              </div>

              {/* Right Value Input with Mode Toggle */}
              <div className="flex flex-col gap-2 min-w-0">
                {/* Value Mode Toggle */}
                <div className="flex items-center gap-2">
                  <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
                    <button
                      onClick={() => handleValueModeChange('value')}
                      className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                        valueMode === 'value'
                          ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                      }`}
                      aria-label="Value mode"
                    >
                      Value
                    </button>
                    <button
                      onClick={() => handleValueModeChange('calculation')}
                      className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                        valueMode === 'calculation'
                          ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                      }`}
                      aria-label="Calculation mode"
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
                    onChange={value =>
                      setExpression(prev => ({ ...prev, rightValue: value }))
                    }
                    onOpenChange={setRightValueOpen}
                    placeholder="Type value or select tag..."
                    className="w-auto min-w-[280px] transition-all duration-300 ease-out"
                    style={{
                      width: rightValueOpen
                        ? '320px'
                        : `${Math.max(280, expression.rightValue.length * 10 + 140)}px`
                    }}
                  />
                ) : (
                  /* Calculation Input Mode */
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-mono text-zinc-400 dark:text-zinc-500 select-none">
                      (
                    </span>

                    {/* Calculation Left Tag */}
                    <SmartComboBox
                      options={availableTags}
                      value={expression.calculation?.leftTag || ''}
                      onChange={handleCalcLeftTagChange}
                      onOpenChange={setCalcLeftTagOpen}
                      placeholder="Select tag..."
                      className="w-auto min-w-[160px] transition-all duration-300 ease-out"
                      style={{
                        width: calcLeftTagOpen
                          ? '200px'
                          : `${Math.max(180, (expression.calculation?.leftTag || '').length * 10 + 140)}px`
                      }}
                    />

                    {/* Calculation Mathematical Operator */}
                    <OperatorComboBox
                      options={MATH_OPERATORS}
                      value={expression.calculation?.operator || '+'}
                      onChange={value =>
                        setExpression(prev => ({
                          ...prev,
                          calculation: { ...prev.calculation!, operator: value }
                        }))
                      }
                      onOpenChange={setCalcOperatorOpen}
                      placeholder="Op..."
                      className="w-auto min-w-[50px] transition-all duration-300 ease-out"
                      style={{
                        width: calcOperatorOpen
                          ? '200px'
                          : `${Math.max(50, (expression.calculation?.operator || '+').length * 12 + 50)}px`
                      }}
                    />

                    {/* Calculation Right Value */}
                    <SmartComboBox
                      options={availableTags}
                      value={expression.calculation?.rightValue || ''}
                      onChange={value =>
                        setExpression(prev => ({
                          ...prev,
                          calculation: { ...prev.calculation!, rightValue: value }
                        }))
                      }
                      onOpenChange={setCalcRightValueOpen}
                      placeholder="Type value or select tag..."
                      className="w-auto min-w-[280px] transition-all duration-300 ease-out"
                      style={{
                        width: calcRightValueOpen
                          ? '320px'
                          : `${Math.max(280, (expression.calculation?.rightValue || '').length * 10 + 140)}px`
                      }}
                    />

                    <span className="text-2xl font-mono text-zinc-400 dark:text-zinc-500 select-none">
                      )
                    </span>

                    {/* Remove Calculation Mode Button */}
                    <button
                      onClick={() => handleValueModeChange('value')}
                      className="ml-2 px-2 py-2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 border border-zinc-300 dark:border-zinc-600 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                      title="Remove calculation"
                      aria-label="Remove calculation"
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
                ? generateStyledNaturalLanguage(
                    expression,
                    valueMode,
                    availableTags
                  )
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
                  onChange={e => setTempCustomTags(e.target.value)}
                  placeholder="pressure, temperature, speed, altitude, status, mode"
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-500 focus:border-transparent resize-none"
                  rows={4}
                  aria-label="Tag input"
                />
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                  💡 Tags are case-sensitive and should be descriptive names for
                  your data fields.
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
                        const tempTags = parseTags(tempCustomTags)
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
                          <span className="text-zinc-500 dark:text-zinc-400">
                            No valid tags found
                          </span>
                        )
                      })()
                    ) : (
                      <span className="text-zinc-500 dark:text-zinc-400">
                        Using default tags: Tag1, Tag2, Tag3, Tag4, Tag5, Tag6
                      </span>
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

          {/* Output Display */}
          <OutputDisplay
            outputTab={outputTab}
            onTabChange={setOutputTab}
            jsonOutput={jsonOutput}
            jsonLogicOutput={jsonLogicOutput}
          />
        </div>
      </main>
    </div>
  )
}
