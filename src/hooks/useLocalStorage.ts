import { useState, useEffect } from 'react';
import { Folder } from '../types';

// Function to sanitize folders data for backward compatibility
const sanitizeFolders = (folders: Folder[]): Folder[] => {
  return folders.map((folder, index) => ({
    ...folder,
    index: folder.index !== undefined ? folder.index : index,
    sections: folder.sections.map(section => ({
      ...section,
      items: section.items.map(item => ({
        ...item,
        sensitive: item.sensitive !== undefined ? item.sensitive : true // Default to sensitive
      }))
    }))
  }));
};

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Get stored value from localStorage or use initialValue
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsedItem = JSON.parse(item);

      // If this is the folders data, sanitize it for backward compatibility
      if (key === 'saver-folders' && Array.isArray(parsedItem)) {
        return sanitizeFolders(parsedItem) as unknown as T;
      }

      return parsedItem;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));

        // Dispatch a custom event so other tabs can update
        window.dispatchEvent(new StorageEvent('storage', {
          key,
          newValue: JSON.stringify(valueToStore),
        }));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to this localStorage key in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    // Listen for storage events (works across tabs)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
