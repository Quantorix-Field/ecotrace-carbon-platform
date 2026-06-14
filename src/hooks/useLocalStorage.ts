/**
 * Custom hook for persisting state to localStorage with automatic serialisation.
 * Falls back gracefully when localStorage is unavailable (private browsing, etc).
 */

import { useState, useEffect } from "react";

/**
 * Persists a state value to localStorage and restores it on mount.
 * API is identical to useState — drop-in replacement with persistence.
 * @param key - localStorage key to store the value under
 * @param initialValue - Default value if nothing is stored yet
 * @returns Stateful value and setter, identical to useState
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // localStorage unavailable — state still works in-memory
    }
  }, [key, storedValue]);

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      setStoredValue(
        value instanceof Function ? value(storedValue) : value
      );
    }
  };

  return [storedValue, setValue];
}
