/**
 * Formats a number with Arabic thousands separators
 * @param num The number to format
 * @returns Formatted string with Arabic number separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Formats a large number into a compact representation (e.g., 1.2K, 3.4M)
 * @param num The number to format
 * @returns Formatted compact number string
 */
export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(num);
}
