import { useEffect, useState } from "react";
import { getJson } from "../lib/api.js";
import { readPublicCache, savePublicCache, clearPublicCache } from "../lib/publicCache.js";
export default function useRemoteData(endpoint) {
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState(() => ({
    endpoint,
    data: readPublicCache(endpoint),
    loading: true,
    error: null,
  }));
  useEffect(() => {
    const controller = new AbortController();
    if (!endpoint) {
      setState({ endpoint, data: null, loading: false, error: null });
      return;
    }
    setState(previous => ({ endpoint, data: previous.endpoint === endpoint ? previous.data : readPublicCache(endpoint), loading: true, error: null }));
    getJson(endpoint, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          savePublicCache(endpoint, data);
          setState({ endpoint, data, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          if (error.status === 404) clearPublicCache(endpoint);
          setState(previous => ({ endpoint, data: error.status === 404 ? null : previous.data, loading: false, error }));
        }
      });
    return () => controller.abort();
  }, [endpoint, revision]);
  return { ...state, ...(state.endpoint !== endpoint ? { data: readPublicCache(endpoint), loading: true, error: null } : {}), refresh: () => setRevision((value) => value + 1) };
}
