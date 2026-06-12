import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using `clsx` and merges conflicting Tailwind CSS classes
 * using `twMerge`.
 *
 * @param inputs - An array of class values, arrays, or objects to join.
 * @returns A string of merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
