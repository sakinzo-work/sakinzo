import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { adminRequest } from "./api.js";
import { endpoints, managerAccess, mayView, ownerAccess } from "./config.js";
import { useSiteData } from "../../context/SiteDataContext.jsx";
const Context = createContext(null);
const empty = {
  projects: [],
  blogs: [],
  insights: [],
  clients: [],
  team: [],
  testimonials: [],
  stats: [],
  mapLocations: [],
  contactOffices: [],
  contactPage: {},
  sections: [],
  whatWeDoServices: [],
  submissions: [],
  admins: [],
  approvals: [],
};
export function AdminProvider({ children }) {
  const [token, setToken] = useState(
      () => sessionStorage.getItem("sakinzo_admin_token") || "",
    ),
    [user, setUser] = useState(null),
    [data, setData] = useState(empty),
    [loading, setLoading] = useState(Boolean(token)),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [editing, setEditing] = useState(null),
    [synced, setSynced] = useState(null);
  const { refresh: refreshPublic } = useSiteData();
  const [confirmation, setConfirmation] = useState(null);
  const ask = (options) =>
    new Promise((resolve) => setConfirmation({ ...options, resolve, returnFocus: document.activeElement }));
  const generation = useRef(0),
    syncRequest = useRef(null),
    hasSynced = useRef(false),
    editRef = useRef(editing),
    noticeTimer = useRef();
  editRef.current = editing;
  const logout = useCallback(() => {
    generation.current++;
    syncRequest.current?.abort();
    syncRequest.current = null;
    hasSynced.current = false;
    sessionStorage.removeItem("sakinzo_admin_token");
    setToken("");
    setUser(null);
    setData(empty);
    setEditing(null);
    setSynced(null);
    setLoading(false);
    setError("");
  }, []);
  const request = useCallback(
    async (path, options) => {
      try {
        return await adminRequest(path, token, options);
      } catch (failure) {
        if (failure.status === 401 && path !== "/auth/login" && !options?.signal?.aborted) logout();
        throw failure;
      }
    },
    [token, logout],
  );
  const notify = useCallback((message) => {
    setNotice(message);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 3500);
  }, []);
  useEffect(() => () => clearTimeout(noticeTimer.current), []);
  const refresh = useCallback(
    async (silent = false) => {
      if (!token) return;
      syncRequest.current?.abort();
      const controller = new AbortController();
      syncRequest.current = controller;
      const run = ++generation.current;
      if (!silent) { setLoading(true); setError(""); }
      try {
        const get = path => request(path, { signal: controller.signal });
        const me = await get("/auth/me");
        const current = me.admin;
        if (!current || typeof current !== "object" || Array.isArray(current))
          throw new Error("Your session couldn't be verified. Try again or sign out and sign in again.");
        const optional = async (key, path, fallback = []) => {
          if (!mayView(current, key)) return fallback;
          try {
            return await get(path);
          } catch (failure) {
            if (failure.status === 403 || failure.status === 404)
              return fallback;
            throw failure;
          }
        };
        const [results, extras] = await Promise.all([Promise.all(
          Object.entries(endpoints)
            .filter(([key]) => key !== "admins" && key !== "submissions")
            .map(async ([key, path]) => [
              key,
              await optional(key, `/${path}/admin/all`),
            ]),
        ), Promise.all([
          optional("contactPage", "/contact-page", {}),
          optional("sections", "/sections"),
          optional("whatWeDoServices", "/what-we-do-services"),
          optional("contactPage", "/submissions"),
          get("/approvals"),
          get("/admins").catch((failure) => {
            if (failure.status === 403 || failure.status === 404) return [];
            throw failure;
          }),
        ])]);
        if (run !== generation.current) return;
        hasSynced.current = true;
        setUser(current);
        setData({
          ...empty,
          ...Object.fromEntries(results),
          contactPage: extras[0],
          sections: extras[1],
          whatWeDoServices: extras[2],
          submissions: extras[3],
          approvals: extras[4],
          admins: extras[5],
        });
        setSynced(new Date());
        setError("");
      } catch (failure) {
        if (run === generation.current && !controller.signal.aborted) setError(failure.message);
      } finally {
        if (run === generation.current) {
          syncRequest.current = null;
          setLoading(false);
        }
        controller.abort();
      }
    },
    [token, request],
  );
  useEffect(() => {
    if (!token) return;
    refresh();
    const timer = setInterval(() => {
      if (hasSynced.current && !syncRequest.current && !editRef.current && document.visibilityState === "visible")
        refresh(true);
    }, 15000);
    return () => {
      clearInterval(timer);
      generation.current++;
      syncRequest.current?.abort();
      syncRequest.current = null;
    };
  }, [refresh, token]);
  const login = async (email, password) => {
    setError("");
    setLoading(true);
    try {
      const result = await adminRequest("/auth/login", "", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      sessionStorage.setItem("sakinzo_admin_token", result.token);
      setUser(result.admin);
      setToken(result.token);
    } catch (failure) {
      setError(failure.message);
      setLoading(false);
    }
  };
  const approval = async (
    resourceType,
    action,
    payload = {},
    resourceId = "",
    title = "",
  ) =>
    request("/approvals", {
      method: "POST",
      body: JSON.stringify({
        resourceType,
        action,
        payload,
        resourceId,
        title,
      }),
    });
  const mutate = async (type, action, payload = {}, id = "", title = "") => {
    if (!ownerAccess(user) && type !== "admins") {
      await approval(type, action, payload, id, title);
      notify("Approval request sent");
    } else {
      const path =
        type === "contactPage"
          ? "/contact-page"
          : type === "sections"
            ? `/sections/${id}`
            : type === "whatWeDoServices"
              ? `/what-we-do-services/${id}`
              : `/${endpoints[type]}${id ? "/" + id : ""}`;
      const saved = await request(path, {
        method:
          action === "delete"
            ? "DELETE"
            : id || type === "contactPage"
              ? "PUT"
              : "POST",
        ...(action === "delete" ? {} : { body: JSON.stringify(payload) }),
      });
      if (type === "projects" && action !== "delete") {
        if (
          "creatorName" in payload &&
          (saved.creatorName !== payload.creatorName ||
            saved.creatorPortfolio !== payload.creatorPortfolio)
        )
          throw new Error("Creator details were not saved by the backend.");
        if (
          "previewDevice" in payload &&
          (saved.previewDevice || "auto") !== (payload.previewDevice || "auto")
        )
          throw new Error(
            "Preview device was not saved. Please update the backend and try again.",
          );
      }
      notify("Saved");
    }
    await refresh(true);
    refreshPublic();
  };
  return (
    <Context.Provider
      value={{
        token,
        user,
        data,
        setData,
        loading,
        error,
        setError,
        notice,
        editing,
        setEditing,
        synced,
        login,
        logout,
        request,
        refresh,
        notify,
        approval,
        mutate,
        ask,
        confirmation,
        setConfirmation,
        isOwner: ownerAccess(user),
        isManager: managerAccess(user),
        canView: (key) => mayView(user, key),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useAdmin = () => useContext(Context);
