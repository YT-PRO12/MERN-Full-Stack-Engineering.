import { useEffect, useState } from 'react';
import { api } from './api.js';
export function useResource(path) {
  const [state, setState] = useState({ data: null, error: '', loading: true, path: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, error: '', loading: true, path });
    api(path, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, error: '', loading: false, path });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({ data: null, error: error.message, loading: false, path });
      });
    return () => controller.abort();
  }, [path, attempt]);
  return {
    ...state,
    loading: state.loading || state.path !== path,
    retry: () => setAttempt((n) => n + 1),
  };
}
