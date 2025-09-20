'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

type OperatorOption = {
  value: string
  label: string
  display: string
}

type OperatorComboBoxProps = {
  options: OperatorOption[]
  value: string
  onChange: (value: string) => void
  onOpenChange?: (isOpen: boolean) => void
  placeholder?: string
  className?: string
  style?: React.CSSProperties
}

export function OperatorComboBox({ options, value, onChange, onOpenChange, placeholder = "Search...", className = "", style }: OperatorComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.display.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    setHighlightedIndex(-1)
  }, [searchTerm])

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
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          onChange(filteredOptions[highlightedIndex].value)
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
    onOpenChange?.(false)
  }

  const toggleOpen = () => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    onOpenChange?.(newIsOpen)
  }

  return (
    <div className={`relative ${className}`} style={style}>
      <div
        className="relative cursor-pointer"
        onClick={toggleOpen}
      >
        <div className={`flex items-center justify-between px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent ${isOpen ? 'min-w-[160px]' : ''}`}>
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="flex-1 font-mono">
              {selectedOption ? selectedOption.display : placeholder}
            </span>
          )}
          <ChevronDown 
            className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-lg max-h-60 overflow-auto w-[190px]">
          <ul className="py-1">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-zinc-500 text-sm">No operators found</li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
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
