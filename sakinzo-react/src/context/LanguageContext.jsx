import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiBase } from "../lib/api.js";
import languageList from "../data/languages.json";
const rtl = new Set([
  "ar",
  "arc",
  "ckb",
  "dv",
  "fa",
  "he",
  "ks",
  "ps",
  "sd",
  "ug",
  "ur",
  "yi",
]);
const Context = createContext({
  language: "en",
  t: (value) => value,
  languages: languageList,
  setLanguage: async () => false,
});
const normalize = (value) => {
  try {
    return Intl.getCanonicalLocales(value)[0] || "en";
  } catch {
    return "en";
  }
};
export function LanguageProvider({ children }) {
  const location = useLocation(),
    navigate = useNavigate();
  const routeRef = useRef(location);
  routeRef.current = location;
  const [language, changeLanguage] = useState("en"),
    [languages, setLanguages] = useState(languageList);
  const [configured, setConfigured] = useState(false),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const [revision, updateRevision] = useState(0);
  const catalog = useRef(new Set()),
    dictionaries = useRef(new Map()),
    timer = useRef(),
    generation = useRef(0),
    languageRef = useRef("en");
  const pending = useRef(false),
    abort = useRef(null),
    mounted = useRef(true);
  useEffect(() => {
    const controller = new AbortController();
    mounted.current = true;
    fetch(`${apiBase()}/i18n/languages`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (controller.signal.aborted) return;
        setConfigured(Boolean(data?.configured));
        if (data?.configured && data.languages?.length)
          setLanguages(
            data.languages.map((item) => ({
              ...item,
              code: normalize(item.code),
            })),
          );
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setReady(true);
      });
    return () => {
      mounted.current = false;
      controller.abort();
      abort.current?.abort();
      clearTimeout(timer.current);
    };
  }, []);
  const translatePending = useCallback(async () => {
    const code = languageRef.current;
    if (code === "en" || pending.current || !configured) return;
    const dictionary = dictionaries.current.get(code) || new Map();
    dictionaries.current.set(code, dictionary);
    const texts = [...catalog.current].filter(
      (text) => /\p{L}/u.test(text) && !dictionary.has(text),
    );
    if (!texts.length) return;
    pending.current = true;
    const run = generation.current;
    const controller = new AbortController();
    abort.current = controller;
    setBusy(true);
    try {
      for (let index = 0; index < texts.length; ) {
        const batch = [];
        let size = 0;
        while (
          index < texts.length &&
          batch.length < 100 &&
          size + texts[index].length <= 18000
        ) {
          size += texts[index].length;
          batch.push(texts[index++]);
        }
        if (!batch.length) {
          dictionary.set(texts[index], texts[index]);
          index++;
          continue;
        }
        const response = await fetch(`${apiBase()}/i18n/translate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: code, texts: batch }),
          signal: controller.signal,
        });
        const data = await response.json();
        if (
          !response.ok ||
          !Array.isArray(data.translations) ||
          data.translations.length !== batch.length ||
          data.translations.some(
            (text) => typeof text !== "string" || !text.trim(),
          )
        )
          throw new Error(
            data.message || "Translation is unavailable. Please try again.",
          );
        if (run !== generation.current) return;
        batch.forEach((text, i) => dictionary.set(text, data.translations[i]));
      }
      if (mounted.current && run === generation.current) {
        updateRevision((value) => value + 1);
        setMessage("");
      }
    } catch (error) {
      if (
        !controller.signal.aborted &&
        mounted.current &&
        run === generation.current
      ) {
        languageRef.current = "en";
        changeLanguage("en");
        setMessage(error.message);
        try {
          localStorage.setItem("sakinzo.language", "en");
        } catch {}
        const route = routeRef.current,
          query = new URLSearchParams(route.search);
        query.delete("lang");
        navigate(
          {
            pathname: route.pathname,
            search: query.toString() ? "?" + query.toString() : "",
            hash: route.hash,
          },
          { replace: true },
        );
      }
    } finally {
      pending.current = false;
      if (mounted.current) {
        setBusy(false);
        if (
          languageRef.current !== "en" &&
          [...catalog.current].some(
            (text) =>
              /\p{L}/u.test(text) &&
              !dictionaries.current.get(languageRef.current)?.has(text),
          )
        )
          timer.current = setTimeout(translatePending, 80);
      }
    }
  }, [configured, navigate]);
  const t = useCallback(
    (value) => {
      if (typeof value !== "string" || !value.trim()) return value;
      const source = value.trim();
      if (!catalog.current.has(source)) {
        catalog.current.add(source);
        if (languageRef.current !== "en") {
          clearTimeout(timer.current);
          timer.current = setTimeout(translatePending, 30);
        }
      }
      const output = dictionaries.current.get(language)?.get(source);
      return output ? value.replace(source, output) : value;
    },
    [language, revision, translatePending],
  );
  const setLanguage = useCallback(
    async (code) => {
      code = normalize(code);
      if (!languages.some((item) => normalize(item.code) === code)) {
        setMessage("This language is not supported.");
        return false;
      }
      if (code !== "en" && !configured) {
        if (
          ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname)
        ) {
          setMessage(
            "Configure the backend translation API to translate a local website.",
          );
          return false;
        }
        const target = new URL("https://translate.google.com/translate");
        target.searchParams.set("sl", "en");
        target.searchParams.set("tl", code);
        target.searchParams.set("u", window.location.href);
        window.location.assign(target.href);
        return true;
      }
      generation.current++;
      abort.current?.abort();
      languageRef.current = code;
      changeLanguage(code);
      setMessage("");
      try {
        localStorage.setItem("sakinzo.language", code);
      } catch {}
      const query = new URLSearchParams(location.search);
      code === "en" ? query.delete("lang") : query.set("lang", code);
      const search = query.toString();
      navigate(
        {
          pathname: location.pathname,
          search: search ? "?" + search : "",
          hash: location.hash,
        },
        { replace: true },
      );
      clearTimeout(timer.current);
      timer.current = setTimeout(translatePending, 0);
      return true;
    },
    [configured, languages, location, navigate, translatePending],
  );
  useEffect(() => {
    if (!ready || location.pathname.startsWith("/admin")) return;
    let stored = "en";
    try {
      stored = localStorage.getItem("sakinzo.language") || "en";
    } catch {}
    const requested = normalize(
      new URLSearchParams(location.search).get("lang") || stored,
    );
    if (requested !== languageRef.current) setLanguage(requested);
  }, [ready, location.pathname, location.search, configured]);
  useEffect(() => {
    const admin = location.pathname.startsWith("/admin");
    document.documentElement.lang = admin ? "en" : language;
    document.documentElement.dir =
      !admin && rtl.has(language.split("-")[0]) ? "rtl" : "ltr";
  }, [language, location.pathname]);
  return (
    <Context.Provider
      value={useMemo(
        () => ({
          language,
          languages,
          configured,
          ready,
          busy,
          message,
          setLanguage,
          t,
        }),
        [language, languages, configured, ready, busy, message, setLanguage, t],
      )}
    >
      {children}
    </Context.Provider>
  );
}
export const useLanguage = () => useContext(Context);
const TranslationDisabled = createContext(false);
export function NoTranslate({ children }) {
  return (
    <TranslationDisabled.Provider value={true}>
      {children}
    </TranslationDisabled.Provider>
  );
}
export function T({ text, children }) {
  const { t } = useLanguage();
  const disabled = useContext(TranslationDisabled);
  return disabled ? (text ?? children) : t(text ?? children);
}
