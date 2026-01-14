import { useCallback, useEffect, useMemo, useRef } from 'react';

interface UseAutoSaveDraftOptions<T> {
  key: string;
  data: T;
  enabled?: boolean;
  debounceMs?: number;
}

interface UseAutoSaveDraftReturn {
  saveDraft: () => void;
  loadDraft: <T>() => T | null;
  clearDraft: () => void;
  hasDraft: () => boolean;
}

/**
 * Custom hook for auto-saving form data to localStorage with debouncing
 * Automatically saves data when it changes, with configurable debounce delay
 *
 * @param options - Configuration options
 * @param options.key - Unique localStorage key for this draft
 * @param options.data - The data object to auto-save
 * @param options.enabled - Whether auto-save is enabled (default: true)
 * @param options.debounceMs - Debounce delay in milliseconds (default: 10000)
 */
export function useAutoSaveDraft<T>({
  key,
  data,
  enabled = true,
  debounceMs = 10000,
}: UseAutoSaveDraftOptions<T>): UseAutoSaveDraftReturn {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  /**
   * Serialize data for storage
   * Converts File objects to metadata that can be stored
   */
  const serializeData = useCallback((obj: any): any => {
    if (obj === null || obj === undefined) return obj;

    // Handle File objects - store metadata instead of the file itself
    if (obj instanceof File || obj instanceof Blob) {
      return {
        __fileMetadata: true,
        name: obj instanceof File ? obj.name : 'blob',
        type: obj.type,
        size: obj.size,
      };
    }

    if (Array.isArray(obj)) {
      return obj.map(serializeData);
    }

    if (typeof obj === 'object') {
      const serialized: any = {};
      for (const [k, v] of Object.entries(obj)) {
        serialized[k] = serializeData(v);
      }
      return serialized;
    }

    return obj;
  }, []);

  /**
   * Save draft to localStorage
   */
  const saveDraft = useCallback(() => {
    try {
      const serializedData = serializeData(data);
      const draftData = {
        data: serializedData,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(key, JSON.stringify(draftData));
      console.log('Draft saved successfully');
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [key, data, serializeData]);

  /**
   * Load draft from localStorage
   */
  const loadDraft = useCallback(<T>(): T | null => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return parsed.data as T;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  }, [key]);

  /**
   * Clear draft from localStorage
   */
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(key);
      console.log('Draft cleared');
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, [key]);

  /**
   * Check if draft exists
   */
  const hasDraft = useCallback((): boolean => {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Failed to check draft:', error);
      return false;
    }
  }, [key]);

  /**
   * Auto-save effect with debouncing
   */
  const dataString = useMemo(() => {
    try {
      return JSON.stringify(serializeData(data));
    } catch {
      return '';
    }
  }, [data, serializeData]);

  useEffect(() => {
    // Skip auto-save on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!enabled || !dataString) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      saveDraft();
    }, debounceMs);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [dataString, enabled, debounceMs, saveDraft]);

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
  };
}
