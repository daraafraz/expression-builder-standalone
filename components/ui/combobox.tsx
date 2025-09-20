'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'

type ComboBoxOption = {
  value: string
  label: string
}

type ComboBoxProps = {
  options: ComboBoxOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  style?: React.CSSProperties
  showClear?: boolean
  enableLazyLoading?: boolean
  batchSize?: number
}

export function ComboBox({ 
  options, 
  value, 
  onChange, 
  placeholder = "Search...", 
  className = "", 
  style, 
  showClear = true,
  enableLazyLoading = true,
  batchSize = 20
}: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [visibleCount, setVisibleCount] = useState(batchSize)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const visibleOptions = enableLazyLoading 
    ? filteredOptions.slice(0, visibleCount)
    : filteredOptions

  const hasMoreItems = enableLazyLoading && visibleCount < filteredOptions.length

  const selectedOption = options.find(option => option.value === value)

  // Reset visible count when search term changes
  useEffect(() => {
    setVisibleCount(batchSize)
    setHighlightedIndex(-1)
  }, [searchTerm, batchSize])

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        setIsOpen(true)
        setSearchTerm('')
      }
      return
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false)
        setSearchTerm('')
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
          onChange(visibleOptions[highlightedIndex].value)
          setIsOpen(false)
          setSearchTerm('')
        }
        break
    }
  }

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className={`relative ${className}`} style={style}>
      <div
        className="relative cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="flex-1">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          )}
          {value && showClear && !isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onChange('')
                setSearchTerm('')
              }}
              className="p-0.5 mr-1 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
              title="Clear value"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <ChevronDown 
            className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          <ul ref={listRef} className="py-1">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-zinc-500 text-sm">No options found</li>
            ) : (
              visibleOptions.map((option, index) => (
                <li
                  key={option.value}
                  ref={index === visibleOptions.length - 1 ? lastItemRef : null}
                  onClick={() => handleOptionClick(option.value)}
                  className={`px-3 py-2 cursor-pointer flex items-center justify-between text-sm transition-colors ${
                    index === highlightedIndex
                      ? 'bg-purple-100 dark:bg-purple-900/50'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  } ${
                    option.value === value
                      ? 'text-purple-600 dark:text-purple-400 font-medium'
                      : 'text-zinc-900 dark:text-zinc-100'
                  }`}
                >
                  <span>{option.label}</span>
                  {option.value === value && (
                    <Check className="h-4 w-4" />
                  )}
                </li>
              ))
            )}
            {isLoading && (
              <li className="px-3 py-2 text-zinc-500 text-sm flex items-center gap-2 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-300 border-t-purple-600"></div>
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
          onClick={() => {
            setIsOpen(false)
            setSearchTerm('')
          }}
        />
      )}
    </div>
  )
}
