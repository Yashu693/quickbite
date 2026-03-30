import { useState, useEffect } from 'react';

/**
 * Like useState, but automatically syncs to localStorage.
 * Survives page refreshes and tab closures.
 * Supports functional updaters: setValue(prev => ({...prev, key: val}))
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - fallback if localStorage is empty
 * @returns {[value, setValue]} - same interface as useState
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error writing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
