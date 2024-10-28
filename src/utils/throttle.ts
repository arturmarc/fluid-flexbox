/* eslint-disable @typescript-eslint/no-explicit-any */

// Simple throttle function - throttled function does not return a result
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
) {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
