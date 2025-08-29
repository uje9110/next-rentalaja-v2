import { useEffect, useState } from "react";

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);

  // Load once (client-side only)
  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        setState(JSON.parse(storedValue));
      }
    } catch (err) {
      console.error(`Error reading localStorage key "${key}":`, err);
    }
  }, [key]);

  // Save whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.error(`Error setting localStorage key "${key}":`, err);
    }
  }, [key, state]);

  return [state, setState] as const; // make it tuple like useState
}
