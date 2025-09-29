'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'

/**
 * ComboBox component with lazy loading and search functionality
 * 
 * Features:
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

type ComboBoxProps = {
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

export function ComboBox({ 
  options, 
  value, 
  onChange, 
  onOpenChange,
  placeholder = "Search...", 
  className = "", 
  style, 
  showClear = true,
  enableLazyLoading = true,
  batchSize = 20
}: ComboBoxProps) {
  // Component state management
  const [isOpen, setIsOpen] = useState(false)           // Dropdown open/closed state
  const [searchTerm, setSearchTerm] = useState('')      // Current search input
  const [highlightedIndex, setHighlightedIndex] = useState(-1) // Currently highlighted option index
  const [visibleCount, setVisibleCount] = useState(batchSize)  // Number of visible options (for lazy loading)
  const [isLoading, setIsLoading] = useState(false)     // Loading state for lazy loading
  
  // Refs for DOM manipulation and intersection observer
  const inputRef = useRef<HTMLInputElement>(null)       // Input field reference
  const listRef = useRef<HTMLUListElement>(null)        // Options list reference
  const observerRef = useRef<IntersectionObserver | null>(null) // Intersection observer for lazy loading

  // Filter options based on search term (case-insensitive)
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get visible options (either all or limited by lazy loading)
  const visibleOptions = enableLazyLoading 
    ? filteredOptions.slice(0, visibleCount)
    : filteredOptions

  // Check if there are more items to load
  const hasMoreItems = enableLazyLoading && visibleCount < filteredOptions.length

  // Find the currently selected option
  const selectedOption = options.find(option => option.value === value)

  // Reset visible count and highlight when search term changes
  useEffect(() => {
    setVisibleCount(batchSize)
    setHighlightedIndex(-1)
  }, [searchTerm, batchSize])

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
   * Handle keyboard navigation and interactions
   * Supports arrow keys, enter, escape, and space
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      // Open dropdown on enter, space, or arrow down
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        setIsOpen(true)
        setSearchTerm('')
      }
      return
    }

    switch (e.key) {
      case 'Escape':
        // Close dropdown and clear search
        setIsOpen(false)
        setSearchTerm('')
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
        // Select highlighted option or accept current input
        if (highlightedIndex >= 0 && visibleOptions[highlightedIndex]) {
          onChange(visibleOptions[highlightedIndex].value)
          setIsOpen(false)
          setSearchTerm('')
          onOpenChange?.(false)
        }
        break
    }
  }

  /**
   * Handle option selection via mouse click
   * @param optionValue - The value of the selected option
   */
  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchTerm('')
    onOpenChange?.(false)
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Main input/display area */}
      <div
        className="relative cursor-pointer"
        onClick={() => {
          const newIsOpen = !isOpen
          setIsOpen(newIsOpen)
          onOpenChange?.(newIsOpen)
        }}
      >
        <div className="flex items-center px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-transparent text-zinc-900 dark:text-zinc-100 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
          {isOpen ? (
            /* Search input when dropdown is open */
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none min-w-0"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            /* Display selected value or placeholder when closed */
            <span 
              className={`flex-1 min-w-0 truncate ${selectedOption ? 'font-mono' : ''}`}
              style={{ 
                color: selectedOption ? '#5ebbef' : undefined,
                fontFamily: selectedOption ? 'var(--font-geist-mono)' : 'var(--font-geist-sans)'
              }}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          )}
          {/* Action buttons (clear and dropdown arrow) */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {value && showClear && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onChange('')
                  setSearchTerm('')
                }}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
                title="Clear value"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronDown 
              className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {/* Dropdown options list */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          <ul ref={listRef} className="py-1">
            {filteredOptions.length === 0 ? (
              /* No options found message */
              <li className="px-3 py-2 text-zinc-500 text-sm">No options found</li>
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
                  <span>{option.label}</span>
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
          onClick={() => {
            setIsOpen(false)
            setSearchTerm('')
            onOpenChange?.(false)
          }}
        />
      )}
    </div>
  )
}
