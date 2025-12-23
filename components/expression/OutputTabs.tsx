/**
 * Output format tabs component
 * 
 * Provides tabbed interface for switching between JSON and JSONLogic output formats
 * 
 * @module components/expression/OutputTabs
 */

import type { OutputFormat } from '@/types'

interface OutputTabsProps {
  /** Currently selected output format */
  currentTab: OutputFormat
  /** Callback when tab changes */
  onTabChange: (tab: OutputFormat) => void
}

/**
 * Output format tabs component
 * 
 * @param props - Component props
 * @returns JSX element with tab selector
 */
export function OutputTabs({ currentTab, onTabChange }: OutputTabsProps) {
  return (
    <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
      <button
        onClick={() => onTabChange('jsonlogic')}
        className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
          currentTab === 'jsonlogic'
            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
        }`}
      >
        JSONLogic
      </button>
      <button
        onClick={() => onTabChange('json')}
        className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
          currentTab === 'json'
            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
        }`}
      >
        JSON
      </button>
    </div>
  )
}

