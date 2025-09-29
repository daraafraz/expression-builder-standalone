'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Check, Tag, Hash, Type, X } from 'lucide-react'

/**
 * SmartComboBox component with intelligent value analysis and lazy loading
 * 
 * Features:
 * - Smart value type detection (tag, number, string)
 * - Visual type indicators with icons
 * - Search/filter options as you type
 * - Lazy loading for large option lists
 * - Keyboard navigation (arrow keys, enter, escape)
 * - Click outside to close
 * - Clear button for selected values
 * - Customizable styling and behavior
 */

// Type definitions for component props and options
type ComboBoxOption = {
  value: string  // Unique identifier for the option
  label: string  // Display text for the option
}

type SmartComboBoxProps = {
  options: ComboBoxOption[]        // Array of available options
  value: string                    // Currently selected value
  onChange: (value: string) => void // Callback when selection changes
  onOpenChange?: (isOpen: boolean) => void // Callback when dropdown opens/closes
  placeholder?: string             // Placeholder text when no value selected
  className?: string               // Additional CSS classes
  style?: React.CSSProperties     // Inline styles
  showClear?: boolean              // Whether to show clear button
  enableLazyLoading?: boolean      // Enable lazy loading for large lists
  batchSize?: number               // Number of items to load per batch
}

export function SmartComboBox({ 
  options, 
  value, 
  onChange, 
  onOpenChange,
  placeholder = "Type or select...", 
  className = "", 
  style, 
  showClear = true,
  enableLazyLoading = true,
  batchSize = 20
}: SmartComboBoxProps) {
  // Component state management
  const [isOpen, setIsOpen] = useState(false)           // Dropdown open/closed state
  const [inputValue, setInputValue] = useState(value)   // Current input value
  const [highlightedIndex, setHighlightedIndex] = useState(-1) // Currently highlighted option index
  const [visibleCount, setVisibleCount] = useState(batchSize)  // Number of visible options (for lazy loading)
  const [isLoading, setIsLoading] = useState(false)     // Loading state for lazy loading
  
  // Refs for DOM manipulation and intersection observer
  const inputRef = useRef<HTMLInputElement>(null)       // Input field reference
  const observerRef = useRef<IntersectionObserver | null>(null) // Intersection observer for lazy loading

  // Filter options based on input value with smart matching
  const filteredOptions = options.filter(option => {
    // If inputValue exactly matches a selected option, show all options (for better UX)
    const exactMatch = options.some(opt => opt.value === inputValue)
    if (exactMatch && inputValue.length > 0) {
      return true
    }
    
    // Otherwise, filter based on input
    return option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
           option.value.toLowerCase().includes(inputValue.toLowerCase())
  })

  // Get visible options (either all or limited by lazy loading)
  const visibleOptions = enableLazyLoading 
    ? filteredOptions.slice(0, visibleCount)
    : filteredOptions

  // Check if there are more items to load
  const hasMoreItems = enableLazyLoading && visibleCount < filteredOptions.length

  /**
   * Analyze a value to determine its type and appropriate icon
   * @param val - The value to analyze
   * @returns Object with type and icon component
   */
  const analyzeValue = (val: string) => {
    const tagExists = options.some(option => option.value === val)
    if (tagExists) return { type: 'tag', icon: Tag }
    
    const isNumber = !isNaN(Number(val)) && val.trim() !== ''
    if (isNumber) return { type: 'number', icon: Hash }
    
    return { type: 'string', icon: Type }
  }

  // Analyze the current value for display purposes
  const valueAnalysis = analyzeValue(value)

  // Reset visible count and highlight when input value changes
  useEffect(() => {
    setVisibleCount(batchSize)
    setHighlightedIndex(-1)
  }, [inputValue, batchSize])

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  /**
   * Load more items for lazy loading
   * Simulates loading delay for better UX visibility
   */
  const loadMoreItems = useCallback(() => {
    if (hasMoreItems && !isLoading) {
      setIsLoading(true)
      // Simulate loading delay for better UX visibility
      setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + batchSize, filteredOptions.length))
        setIsLoading(false)
      }, 800)
    }
  }, [hasMoreItems, isLoading, batchSize, filteredOptions.length])

  /**
   * Intersection Observer callback for lazy loading
   * Triggers when the last visible item comes into view
   */
  const lastItemRef = useCallback((node: HTMLLIElement | null) => {
    if (observerRef.current) observerRef.current.disconnect()
    
    if (node && hasMoreItems) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMoreItems()
          }
        },
        { threshold: 1.0 }
      )
      observerRef.current.observe(node)
    }
  }, [hasMoreItems, loadMoreItems])

  // Cleanup intersection observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  /**
   * Handle input value changes
   * Updates both local state and calls onChange prop
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)
    setHighlightedIndex(-1)
  }

  /**
   * Handle keyboard navigation and interactions
   * Supports arrow keys, enter, and escape
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      // Open dropdown on arrow down
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setIsOpen(true)
        onOpenChange?.(true)
      }
      return
    }

    switch (e.key) {
      case 'Escape':
        // Close dropdown
        setIsOpen(false)
        onOpenChange?.(false)
        break
      case 'ArrowDown':
        e.preventDefault()
        // Move highlight down, wrapping to top if needed
        setHighlightedIndex(prev => {
          const newIndex = prev < visibleOptions.length - 1 ? prev + 1 : 0
          // Load more items if we're near the end and there are more to load
          if (newIndex >= visibleOptions.length - 3 && hasMoreItems) {
            loadMoreItems()
          }
          return newIndex
        })
        break
      case 'ArrowUp':
        e.preventDefault()
        // Move highlight up, wrapping to bottom if needed
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : visibleOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && visibleOptions[highlightedIndex]) {
          // Select highlighted option
          const selectedValue = visibleOptions[highlightedIndex].value
          setInputValue(selectedValue)
          onChange(selectedValue)
          setIsOpen(false)
          onOpenChange?.(false)
        } else {
          // Accept current input value and close
          setIsOpen(false)
          onOpenChange?.(false)
          if (inputRef.current) {
            inputRef.current.blur()
          }
        }
        break
    }
  }

  /**
   * Handle option selection via mouse click
   * @param optionValue - The value of the selected option
   */
  const handleOptionClick = (optionValue: string) => {
    setInputValue(optionValue)
    onChange(optionValue)
    setIsOpen(false)
    onOpenChange?.(false)
  }

  // Get the appropriate icon component for the current value type
  const IconComponent = valueAnalysis.icon

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Main input container with smart styling */}
      <div className="relative border border-zinc-300 dark:border-zinc-600 rounded-lg bg-transparent focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
        <div className="flex items-center px-3 py-2">
          {/* Smart input field with type-aware styling */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsOpen(true)
              onOpenChange?.(true)
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none min-w-0 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none border-0 invisible-input"
            style={{ 
              boxShadow: 'none', 
              border: 'none', 
              outline: 'none',
              color: valueAnalysis.type === 'tag' ? '#5ebbef' : valueAnalysis.type === 'number' ? '#9ac42f' : '#374151',
              fontFamily: value && (valueAnalysis.type === 'tag' || valueAnalysis.type === 'number') ? 'var(--font-geist-mono)' : 'var(--font-geist-sans)'
            }}
          />
          {/* Action buttons and type indicator */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Clear button */}
            {value && showClear && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setInputValue('')
                  onChange('')
                }}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
                title="Clear value"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {/* Type indicator badge */}
            {value && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono ${
                valueAnalysis.type === 'tag' 
                  ? ''
                  : valueAnalysis.type === 'number'
                  ? ''
                  : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`} style={{
                backgroundColor: valueAnalysis.type === 'tag' ? 'lab(81 -12.81 -22.77)' : valueAnalysis.type === 'number' ? '#e4f0c9' : undefined,
                color: valueAnalysis.type === 'tag' ? 'black' : valueAnalysis.type === 'number' ? 'black' : undefined
              }}>
                <IconComponent className="h-3 w-3" />
                <span>{valueAnalysis.type}</span>
              </div>
            )}
            {/* Dropdown toggle button */}
            <ChevronDown 
              className={`h-4 w-4 text-zinc-500 transition-transform duration-200 cursor-pointer ${
                isOpen ? 'rotate-180' : ''
              }`}
              onClick={() => {
                const newIsOpen = !isOpen
                setIsOpen(newIsOpen)
                onOpenChange?.(newIsOpen)
              }}
            />
          </div>
        </div>
      </div>

      {/* Dropdown options list */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {filteredOptions.length === 0 ? (
              /* No options found message */
              <li className="px-3 py-2 text-zinc-500 text-sm">
                Type a custom value or search tags...
              </li>
            ) : (
              /* Render visible options */
              visibleOptions.map((option, index) => (
                <li
                  key={option.value}
                  ref={index === visibleOptions.length - 1 ? lastItemRef : null}
                  onClick={() => handleOptionClick(option.value)}
                  className={`px-3 py-2 cursor-pointer flex items-center justify-between text-sm transition-colors ${
                    index === highlightedIndex
                      ? 'bg-blue-100 dark:bg-blue-900/50'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  } ${
                    option.value === value
                      ? 'font-medium'
                      : 'text-zinc-900 dark:text-zinc-100'
                  }`} style={{
                    color: option.value === value ? '#5ebbef' : undefined
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span>{option.label}</span>
                  </div>
                  {option.value === value && (
                    <Check className="h-4 w-4" />
                  )}
                </li>
              ))
            )}
            {/* Loading indicator for lazy loading */}
            {isLoading && (
              <li className="px-3 py-2 text-zinc-500 text-sm flex items-center gap-2 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-300 border-t-blue-600"></div>
                <span>Loading more...</span>
              </li>
            )}
            {/* Lazy loading status indicator */}
            {enableLazyLoading && filteredOptions.length > batchSize && !isLoading && (
              <li className="px-3 py-2 text-zinc-400 text-xs text-center border-t border-zinc-200 dark:border-zinc-700">
                Showing {visibleCount} of {filteredOptions.length}
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Click outside overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
