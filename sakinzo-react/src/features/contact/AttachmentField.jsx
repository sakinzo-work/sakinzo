import { useState } from "react";
import { T, useLanguage } from "../../context/LanguageContext.jsx";

const sizeLabel = (bytes) => bytes >= 1024 * 1024
  ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  : `${Math.max(1, Math.ceil(bytes / 1024))} KB`;

export default function AttachmentField({ form, footer = false }) {
  const { t } = useLanguage();
  const [dragging, setDragging] = useState(false);
  const inputId = footer ? "indexAttachment" : "fileIn";
  return (
    <div className={`attachment-field${footer ? " attachment-field--footer" : ""}${dragging ? " is-dragging" : ""}${form.attachment ? " has-file" : ""}`}>
      <label className="attachment-picker" htmlFor={inputId} id={footer ? undefined : "attachZone"}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files[0]) form.setAttachment(event.dataTransfer.files[0]);
        }}>
        <input className="attachment-input" key={form.fileKey} id={inputId} type="file"
          aria-label={t(form.attachment ? "Change attachment" : "Add an attachment")}
          onChange={(event) => {
            if (event.target.files[0]) form.setAttachment(event.target.files[0]);
          }} />
        <span className="attachment-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="m8 12 6-6a3 3 0 0 1 4 4l-8 8a5 5 0 0 1-7-7l9-9a2 2 0 0 1 3 3l-9 9a1 1 0 0 1-1-1l8-8" />
          </svg>
        </span>
        <span className="attachment-copy" aria-live="polite">
          <strong id={footer ? "indexAttachLabel" : "attachLbl"}>{form.attachment?.name || t("Add an attachment")}</strong>
          <small>{form.attachment ? `${sizeLabel(form.attachment.size)} · ${t("Click to change")}` : t("Browse or drag and drop · Max 10 MB")}</small>
        </span>
        {!form.attachment && <span className="attachment-browse"><T>Browse</T></span>}
      </label>
      {form.attachment && <button className="attachment-remove" type="button" aria-label={t("Remove attachment")}
        onClick={() => form.setAttachment(null)}>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" /></svg>
      </button>}
    </div>
  );
}
