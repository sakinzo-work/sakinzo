import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getJson } from "../lib/api.js";
const empty = {
  projects: [],
  clients: [],
  stats: [],
  team: [],
  testimonials: [],
  mapLocations: [],
  contactOffices: [],
  contactPage: {},
  sections: {},
  whatWeDoServices: {},
  insights: [],
  blogs: [],
};
const Context = createContext({ site: empty, loading: true, error: null });
const record = value => value && typeof value === "object" && !Array.isArray(value);
const normalizeSite = data => Object.fromEntries(Object.entries(empty).map(([key, fallback]) =>
  [key, Array.isArray(fallback) ? (Array.isArray(data?.[key]) ? data[key].filter(record) : []) : record(data?.[key]) ? data[key] : {}]));
export function SiteDataProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const cached = JSON.parse(
        localStorage.getItem("sakinzo-site-data-v6") || "null",
      );
      return {
        site: normalizeSite(cached?.data),
        loading: true,
        error: null,
      };
    } catch {
      return { site: empty, loading: true, error: null };
    }
  });
  const refresh = useCallback(async (signal) => {
    setState((previous) => ({ ...previous, loading: true, error: null }));
    try {
      const data = await getJson("/public/site-data", signal);
      if (signal?.aborted) return;
      const site = normalizeSite(data);
      setState({ site, loading: false, error: null });
      try {
        localStorage.setItem(
          "sakinzo-site-data-v6",
          JSON.stringify({ data: site, savedAt: Date.now() }),
        );
      } catch {}
    } catch (error) {
      if (!signal?.aborted)
        setState((previous) => ({ ...previous, loading: false, error }));
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);
  return (
    <Context.Provider value={{ ...state, refresh }}>
      {children}
    </Context.Provider>
  );
}
export const useSiteData = () => useContext(Context);
export const visibleItems = (rows) =>
  (Array.isArray(rows) ? rows : [])
    .filter((row) => record(row) && row.visible !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
