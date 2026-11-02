import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
export default function LanguagePicker() {
  const { language, languages, configured, busy, message, setLanguage, t } =
    useLanguage();
  const [open, setOpen] = useState(false),
    [search, setSearch] = useState(""),
    [position, setPosition] = useState({ top: 80, right: 12 });
  const panelId = useId();
  const root = useRef(null),
    input = useRef(null),
    panel = useRef(null),
    trigger = useRef(null);
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(340, window.innerWidth - 24);
      const anchorBottom = Math.max(rect.bottom, trigger.current.closest("header")?.getBoundingClientRect().bottom || rect.bottom);
      const top = Math.min(anchorBottom + 12, Math.max(12, window.innerHeight - 180));
      setPosition({ top, left: Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12)),
        width, maxHeight: window.innerHeight - top - 12 });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);
  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);
  useEffect(() => {
    const outside = (event) => {
      if (!root.current?.contains(event.target) && !panel.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  const rows = languages.filter((item) =>
    `${item.name} ${item.code}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div
      className="language-picker notranslate"
      translate="no"
      ref={root}
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
    >
      <button
        ref={trigger}
        className="language-trigger"
        type="button"
        aria-label="Choose website language"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-haspopup="dialog"
        aria-busy={busy}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="language-code">{language.toUpperCase()}</span>
        <svg viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="m1 1 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && createPortal(
        <div className="language-panel notranslate" translate="no" ref={panel} id={panelId}
          role="dialog" aria-label="Choose website language" style={position}
          onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); close(); } }}>
          <label className="language-search-label">
            Search languages
            <input
              ref={input}
              className="language-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search languages"
            />
          </label>
          <p className="language-note">
            {configured
              ? "Translate this website"
              : "Powered by Google Translate"}
          </p>
          <div
            className="language-options"
            role="listbox"
            aria-label="Website language"
            onKeyDown={(event) => {
              if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
              const options = [...event.currentTarget.querySelectorAll('[role="option"]')];
              if (!options.length) return;
              event.preventDefault();
              const index = options.indexOf(document.activeElement);
              const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1
                : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
              options[next].focus();
            }}
          >
            {rows.map((item) => (
              <button
                key={item.code}
                type="button"
                className="language-option"
                role="option"
                aria-selected={language === item.code}
                onClick={async () => {
                  if (await setLanguage(item.code)) close();
                }}
              >
                <span>{item.name}</span>
                <small>{item.code.toUpperCase()}</small>
              </button>
            ))}
            {!rows.length && <p className="language-empty">No languages found.</p>}
          </div>
        </div>, document.body
      )}
      {message && createPortal(
        <p className="language-feedback notranslate" translate="no" role="status">
          {message}
        </p>, document.body
      )}
    </div>
  );
}
