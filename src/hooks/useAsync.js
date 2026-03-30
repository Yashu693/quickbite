import { useState, useEffect } from 'react';

/**
 * Manage async operations with loading, error, and success states.
 *
 * @param {Function} asyncFn - Async function to execute
 * @param {Array} deps - Dependencies (runs when deps change)
 * @param {Object} options - { skip, onSuccess, onError }
 * @returns {{ data, loading, error, refetch }}
 */
export function useAsync(asyncFn, deps = [], options = {}) {
  const { skip = false, onSuccess, onError } = options;

  const [state, setState] = useState({
    data: null,
    loading: !skip,
    error: null,
  });

  useEffect(() => {
    if (skip) return;

    let isMounted = true;

    const execute = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const result = await asyncFn();
        if (isMounted) {
          setState({ data: result, loading: false, error: null });
          onSuccess?.(result);
        }
      } catch (error) {
        if (isMounted) {
          setState({ data: null, loading: false, error });
          onError?.(error);
        }
      }
    };

    execute();

    return () => { isMounted = false; };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await asyncFn();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      setState({ data: null, loading: false, error });
      throw error;
    }
  };

  return { ...state, refetch };
}
