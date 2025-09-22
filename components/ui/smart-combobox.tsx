'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Check, Tag, Hash, Type, X } from 'lucide-react'

type ComboBoxOption = {
  value: string
  label: string
}

type SmartComboBoxProps = {
  options: ComboBoxOption[]
  value: string
  onChange: (value: string) => void
  onOpenChange?: (isOpen: boolean) => void
  placeholder?: string
  className?: string
  style?: React.CSSProperties
  showClear?: boolean
  enableLazyLoading?: boolean
  batchSize?: number
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
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [visibleCount, setVisibleCount] = useState(batchSize)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const filteredOptions = options.filter(option => {
    // If inputValue exactly matches a selected option, show all options
    const exactMatch = options.some(opt => opt.value === inputValue)
    if (exactMatch && inputValue.length > 0) {
      return true
    }
    
    // Otherwise, filter based on input
    return option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
           option.value.toLowerCase().includes(inputValue.toLowerCase())
  })

  const visibleOptions = enableLazyLoading 
    ? filteredOptions.slice(0, visibleCount)
    : filteredOptions

  const hasMoreItems = enableLazyLoading && visibleCount < filteredOptions.length

  const analyzeValue = (val: string) => {
    const tagExists = options.some(option => option.value === val)
    if (tagExists) return { type: 'tag', icon: Tag }
    
    const isNumber = !isNaN(Number(val)) && val.trim() !== ''
    if (isNumber) return { type: 'number', icon: Hash }
    
    return { type: 'string', icon: Type }
  }

  const valueAnalysis = analyzeValue(value)

  // Reset visible count when input value changes
  useEffect(() => {
    setVisibleCount(batchSize)
    setHighlightedIndex(-1)
  }, [inputValue, batchSize])

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Load more items when scrolling to bottom
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

  // Intersection Observer for lazy loading
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

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setIsOpen(true)
        onOpenChange?.(true)
      }
      return
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false)
        onOpenChange?.(false)
        break
      case 'ArrowDown':
        e.preventDefault()
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

  const handleOptionClick = (optionValue: string) => {
    setInputValue(optionValue)
    onChange(optionValue)
    setIsOpen(false)
    onOpenChange?.(false)
  }

  const IconComponent = valueAnalysis.icon

  return (
    <div className={`relative ${className}`} style={style}>
      <div className="relative border border-zinc-300 dark:border-zinc-600 rounded-lg bg-transparent focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
        <div className="flex items-center px-3 py-2">
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
          <div className="flex items-center gap-1 flex-shrink-0">
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

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-zinc-500 text-sm">
                Type a custom value or search tags...
              </li>
            ) : (
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
            {isLoading && (
              <li className="px-3 py-2 text-zinc-500 text-sm flex items-center gap-2 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-300 border-t-blue-600"></div>
                <span>Loading more...</span>
              </li>
            )}
            {enableLazyLoading && filteredOptions.length > batchSize && !isLoading && (
              <li className="px-3 py-2 text-zinc-400 text-xs text-center border-t border-zinc-200 dark:border-zinc-700">
                Showing {visibleCount} of {filteredOptions.length}
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
