'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

/**
 * OperatorComboBox component for selecting mathematical and comparison operators
 * 
 * Features:
 * - Specialized for operator selection (+, -, *, /, =, >, <, etc.)
 * - Search functionality across value, label, and display text
 * - Keyboard navigation support
 * - Click outside to close
 * - Customizable styling
 */

// Type definitions for operator options and component props
type OperatorOption = {
  value: string    // Operator value (e.g., '+', '=', '>')
  label: string    // Full description (e.g., '+ (addition)')
  display: string  // Display symbol (e.g., '+')
}

type OperatorComboBoxProps = {
  options: OperatorOption[]        // Available operator options
  value: string                    // Currently selected operator value
  onChange: (value: string) => void // Callback when selection changes
  onOpenChange?: (isOpen: boolean) => void // Callback when dropdown opens/closes
  placeholder?: string             // Placeholder text
  className?: string               // Additional CSS classes
  style?: React.CSSProperties     // Inline styles
}

export function OperatorComboBox({ options, value, onChange, onOpenChange, placeholder = "Search...", className = "", style }: OperatorComboBoxProps) {
  // Component state management
  const [isOpen, setIsOpen] = useState(false)           // Dropdown open/closed state
  const [searchTerm, setSearchTerm] = useState('')      // Current search input
  const [highlightedIndex, setHighlightedIndex] = useState(-1) // Currently highlighted option index
  
  // Refs for DOM manipulation
  const inputRef = useRef<HTMLInputElement>(null)       // Input field reference
  const containerRef = useRef<HTMLDivElement>(null)     // Container reference for click outside detection

  // Filter options based on search term (searches value, label, and display text)
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.display.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Find the currently selected option
  const selectedOption = options.find(option => option.value === value)

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Reset highlight when search term changes
  useEffect(() => {
    setHighlightedIndex(-1)
  }, [searchTerm])

  /**
   * Handle click outside to close dropdown
   * Uses event delegation to detect clicks outside the component
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setIsOpen(false)
          setSearchTerm('')
          onOpenChange?.(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onOpenChange])

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
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        // Move highlight up, wrapping to bottom if needed
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        // Select highlighted option
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          onChange(filteredOptions[highlightedIndex].value)
          setIsOpen(false)
          setSearchTerm('')
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

  /**
   * Toggle dropdown open/closed state
   */
  const toggleOpen = () => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    onOpenChange?.(newIsOpen)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`} style={style}>
      {/* Main input/display area */}
      <div
        className="relative cursor-pointer"
        onClick={toggleOpen}
      >
        <div className={`flex items-center justify-between px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-transparent text-zinc-900 dark:text-zinc-100 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${isOpen ? 'min-w-[160px]' : ''}`}>
          {isOpen ? (
            /* Search input when dropdown is open */
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            /* Display selected operator or placeholder when closed */
            <span 
              className="flex-1 font-mono"
              style={{ 
                color: selectedOption ? '#ff7e5f' : undefined
              }}
            >
              {selectedOption ? selectedOption.display : placeholder}
            </span>
          )}
          {/* Dropdown arrow indicator */}
          <ChevronDown 
            className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* Dropdown options list */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-lg max-h-60 overflow-auto w-[190px]">
          <ul className="py-1">
            {filteredOptions.length === 0 ? (
              /* No operators found message */
              <li className="px-3 py-2 text-zinc-500 text-sm">No operators found</li>
            ) : (
              /* Render filtered operator options */
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
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
                    color: option.value === value ? '#ff7e5f' : undefined
                  }}
                >
                  <span>{option.label}</span>
                  {option.value === value && (
                    <Check className="h-4 w-4" />
                  )}
                </li>
              ))
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
          }}
        />
      )}
    </div>
  )
}
