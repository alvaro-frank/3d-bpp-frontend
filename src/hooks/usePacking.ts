/**
 * @file usePacking.ts
 * @description Custom React hook to manage the state and side-effects of the packing algorithm requests.
 */

import { useState, useCallback } from 'react';
import type { PackRequest, PackResponse } from '../types';
import { fetchPackingPlan } from '../services/api';

interface UsePackingResult {
  data: PackResponse | null;
  isLoading: boolean;
  error: Error | null;
  executePacking: (payload: PackRequest) => Promise<void>;
  resetPacking: () => void;
}

/**
 * Manages loading state, error handling, and data storage for the 3D bin packing process.
 * * @returns {UsePackingResult} An object containing the current operation state, execution, and reset triggers.
 */
export const usePacking = (): UsePackingResult => {
  const [data, setData] = useState<PackResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Triggers the API call to fetch the packing plan, updating the state accordingly.
   * * @param {PackRequest} payload - The request data required by the backend.
   * @returns {Promise<void>}
   */
  const executePacking = useCallback(async (payload: PackRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchPackingPlan(payload);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clears the current packing data and any existing errors, resetting to the initial state.
   * * @returns {void}
   */
  const resetPacking = useCallback((): void => {
    setData(null);
    setError(null);
  }, []);

  return { data, isLoading, error, executePacking, resetPacking };
};