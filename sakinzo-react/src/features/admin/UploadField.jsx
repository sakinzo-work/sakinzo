import { useState } from "react";

export default function UploadField({ id, label, hint, accept, multiple = false, disabled = false, busy = false, onChange }) {
  const [names, setNames] = useState([]);
  return <div className={`admin-file-control${disabled ? " is-disabled" : ""}`}>
    <label className="admin-file-picker" htmlFor={id}>
      <span className="admin-file-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 16V4m-4 4 4-4 4 4M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" /></svg></span>
      <span className="admin-file-copy"><strong>{label}</strong><small>{busy ? "Uploading…" : hint}</small></span>
      <span className="admin-file-browse" aria-hidden="true">{busy ? "Uploading…" : "Browse"}</span>
      <input id={id} className="admin-file-input" type="file" accept={accept} multiple={multiple}
        aria-label={label} disabled={disabled} aria-describedby={`${id}-selection`}
        onChange={event => {
          setNames([...event.target.files].map(file => file.name));
          onChange?.(event);
          event.target.value = "";
        }} />
    </label>
    <p className="admin-file-selection" id={`${id}-selection`} role="status">
      {names.length ? names.join(", ") : "No file selected"}
    </p>
  </div>;
}
