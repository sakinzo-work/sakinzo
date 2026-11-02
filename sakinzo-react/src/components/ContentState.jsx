import { T } from "../context/LanguageContext.jsx";

export function RefreshIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20 7v5h-5M4 17v-5h5M5.6 8a7 7 0 0 1 11.6-2L20 9M4 15l2.8 3A7 7 0 0 0 18.4 16" />
  </svg>;
}

export default function ContentState({
  title, description, state = "empty", compact = false,
  onAction, actionLabel = "Try again", busy = false, className = "", heading: Heading = "h3",
}) {
  return <div className={`content-state content-state--${state}${compact ? " content-state--compact" : ""} ${className}`}
    role="status" aria-live="polite" aria-atomic="true" data-state={state}>
    <span className="content-state-icon" aria-hidden="true">
      {state === "loading" ? <span className="content-spinner" /> :
        <svg viewBox="0 0 24 24" fill="none">
          {state === "error" ? <><path d="M8 18H6a4 4 0 0 1-.4-8A6.5 6.5 0 0 1 18 8.5a4.5 4.5 0 0 1 .2 9.4" /><path d="M12 11v4m0 3h.01" /></> :
            <><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M8 5V3m8 2V3M8 10h8m-8 4h5" /></>}
        </svg>}
    </span>
    <div className="content-state-copy">
      <Heading><T text={title} /></Heading>
      {description && <p><T text={description} /></p>}
    </div>
    {onAction && <button type="button" className="content-state-action" disabled={busy} onClick={onAction}>
      <span className={busy ? "is-spinning" : ""}>{state === "empty" ? <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg> : <RefreshIcon />}</span>
      <T text={busy ? "Refreshing…" : actionLabel} />
    </button>}
  </div>;
}

export function ProjectSkeletons() {
  return <>
    {[0, 1, 2].map(index => <div className="project-skeleton" key={index} aria-hidden="true">
      <div className="project-skeleton-media" />
      <div className="project-skeleton-copy"><span /><span /><span /></div>
    </div>)}
    <p className="projects-loading-label" role="status"><span className="content-spinner" aria-hidden="true" /><T>Loading projects…</T></p>
  </>;
}
