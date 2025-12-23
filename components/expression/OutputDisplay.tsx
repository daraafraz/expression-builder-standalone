/**
 * Output display component
 * 
 * Displays generated JSON or JSONLogic output with formatting
 * 
 * @module components/expression/OutputDisplay
 */

import type { OutputFormat } from '@/types'
import { OutputTabs } from './OutputTabs'

interface OutputDisplayProps {
  /** Currently selected output format */
  outputTab: OutputFormat
  /** Callback when tab changes */
  onTabChange: (tab: OutputFormat) => void
  /** JSON output string */
  jsonOutput: string
  /** JSONLogic output string */
  jsonLogicOutput: string
}

/**
 * Output display component with tabbed interface
 * 
 * @param props - Component props
 * @returns JSX element with output display
 */
export function OutputDisplay({
  outputTab,
  onTabChange,
  jsonOutput,
  jsonLogicOutput
}: OutputDisplayProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-8 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Generated Output
        </h2>
        <OutputTabs currentTab={outputTab} onTabChange={onTabChange} />
      </div>

      <div className="space-y-2">
        {outputTab === 'json' ? (
          <div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
              Standard JSON format
            </div>
            <pre className="bg-zinc-900 dark:bg-zinc-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
              {jsonOutput}
            </pre>
          </div>
        ) : (
          <div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
              JSONLogic format for conditional logic evaluation
            </div>
            <pre className="bg-zinc-900 dark:bg-zinc-950 text-blue-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
              {jsonLogicOutput}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

