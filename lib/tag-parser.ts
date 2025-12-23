/**
 * Tag parsing and validation utilities
 * 
 * @module lib/tag-parser
 */

import type { Option } from '@/types'
import { DEFAULT_TAGS } from '@/constants'

/**
 * Parse a comma-separated string of tags into an array of Option objects
 * 
 * @param tagsString - Comma-separated string of tags
 * @returns Array of tag options with value and label properties
 * 
 * @example
 * ```typescript
 * parseTags("tag1, tag2, tag3")
 * // Returns: [{ value: "tag1", label: "tag1" }, ...]
 * ```
 */
export function parseTags(tagsString: string): Option[] {
  if (!tagsString || !tagsString.trim()) {
    return DEFAULT_TAGS
  }

  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .map(tag => ({ value: tag, label: tag }))
}

/**
 * Validate if a tag exists in the available tags list
 * 
 * @param tag - Tag value to validate
 * @param availableTags - Array of available tag options
 * @returns True if tag exists, false otherwise
 */
export function isValidTag(tag: string, availableTags: Option[]): boolean {
  return availableTags.some(option => option.value === tag)
}

/**
 * Get the first available tag from a list
 * 
 * @param availableTags - Array of available tag options
 * @returns First tag value or empty string if no tags available
 */
export function getFirstTag(availableTags: Option[]): string {
  return availableTags.length > 0 ? availableTags[0].value : ''
}

