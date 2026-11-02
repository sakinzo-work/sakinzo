import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAdmin } from "./AdminContext.jsx";
import schema from "./schema.json";
import { labels, normalizeRecord, permissionKeys } from "./config.js";
import { uploadMedia, validateVideo } from "./api.js";
import { mediaUrl } from "../../lib/api.js";
import { cleanList, projectCategories } from "../../lib/project.js";
import UploadField from "./UploadField.jsx";
export const fieldLabels = {
  img: "Cover image URL",
  images: "Gallery image URLs",
  desc: "Description",
  demoUrl: "Live demo / app / dashboard URL",
  previewDevice: "Live preview device",
  creatorName: "Creator name",
  creatorPortfolio: "Creator portfolio URL",
  modelImage: "IoT model photo URL",
  videoUrl: "Video link",
  coverImage: "Cover image URL",
  articleUrl: "Full article URL",
  readTime: "Reading time (minutes)",
  profileImage: "Profile picture URL",
  employeeId: "Employee ID",
  clientsCount: "Clients count",
  lat: "Latitude",
  lng: "Longitude",
  github: "GitHub",
  linkedinUrl: "LinkedIn URL",
};
export const humanLabel = (name) =>
  fieldLabels[name] ||
  name.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
const textareas = new Set([
  "desc",
  "text",
  "body",
  "excerpt",
  "bio",
  "address",
  "notes",
  "images",
  "formSubtitle",
  "teamSubtitle",
  "footerCtaSubtitle",
]);
const mediaFields = {
  projects: ["img", "modelImage"],
  clients: ["logo"],
  blogs: ["coverImage"],
  insights: ["image"],
  admins: ["profileImage"],
};
function initialValues(type, item, count) {
  const values = {};
  for (const field of schema[type] || []) {
    let value =
      item[field.name] ??
      field.default ??
      (field.type === "Boolean"
        ? true
        : field.type === "Number"
          ? 0
          : field.type === "Array"
            ? []
            : "");
    if (field.name === "password") value = "";
    if (field.name === "order" && item.order === undefined) value = count;
    if (field.type === "Date")
      value = value
        ? new Date(value).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);
    values[field.name] =
      Array.isArray(value) && field.name !== "permissions"
        ? value.join(field.name === "images" ? "\n" : ", ")
        : value;
  }
  return values;
}
export function Field({
  field,
  value,
  onChange,
  required,
  children,
  ...props
}) {
  const label = humanLabel(field.name),
    id = props.id || `field-${field.name}`;
  return (
    <div className={`field${textareas.has(field.name) ? " full" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required ? " *" : ""}
      </label>
      {children ||
        (field.type === "Boolean" ? (
          <select
            {...props}
            id={id}
            name={field.name}
            value={String(value !== false && value !== "false")}
            onChange={(event) => onChange(event.target.value === "true")}
          >
            <option value="true">
              {field.name === "active" ? "Allowed" : "Visible"}
            </option>
            <option value="false">
              {field.name === "active" ? "Blocked" : "Hidden"}
            </option>
          </select>
        ) : field.options?.length ? (
          <select
            {...props}
            id={id}
            name={field.name}
            value={value}
            required={required}
            onChange={(event) => onChange(event.target.value)}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : textareas.has(field.name) ? (
          <textarea
            disabled={props.disabled}
            id={id}
            name={field.name}
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            required={required}
            maxLength={field.maxLength}
            rows={field.name === "body" ? 12 : 4}
          />
        ) : (
          <input
            {...props}
            id={id}
            name={field.name}
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            required={required}
            type={
              props.type ||
              (field.type === "Number"
                ? "number"
                : field.type === "Date"
                  ? "date"
                  : field.name === "email"
                    ? "email"
                    : field.name === "password"
                      ? "password"
                      : field.name === "color"
                        ? "color"
                        : "text")
            }
            min={field.min}
            max={field.max}
            minLength={field.minLength}
            maxLength={field.maxLength}
            step={field.type === "Number" ? "any" : undefined}
          />
        ))}
    </div>
  );
}
export default function ResourceEditor() {
  const admin = useAdmin(),
    { editing } = admin;
  if (!editing) return null;
  return (
    <Editor
      key={`${editing.type}:${editing.item?._id || "new"}`}
      {...editing}
    />
  );
}
function Editor({ type, item = {} }) {
  const { token, data, mutate, setEditing, isOwner, isManager } = useAdmin();
  const [values, setValues] = useState(() =>
    initialValues(type, item, data[type]?.length || 0),
  );
  const [uploads, setUploads] = useState({}),
    [video, setVideo] = useState(null),
    [fileKeys, setFileKeys] = useState({}),
    [saving, setSaving] = useState(false),
    [uploading, setUploading] = useState(false),
    [error, setError] = useState(""),
    [showPassword, setShowPassword] = useState(false);
  const panel = useRef(null),
    previousFocus = useRef(document.activeElement);
  const update = (name, value) =>
    setValues((previous) => ({ ...previous, [name]: value }));
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const keydown = (event) => {
      if (event.key === "Escape" && !saving) setEditing(null);
      if (event.key === "Tab") {
        const elements = panel.current?.querySelectorAll(
          "button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href]",
        );
        if (!elements?.length) return;
        const first = elements[0],
          last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", keydown);
      previousFocus.current?.focus();
    };
  }, [saving, setEditing]);
  const selectVideo = (file) => {
    try {
      validateVideo(file);
      setVideo(file || null);
      setError("");
    } catch (failure) {
      setError(failure.message);
      setVideo(null);
      setFileKeys((previous) => ({
        ...previous,
        video: (previous.video || 0) + 1,
      }));
    }
  };
  const gallery = async (files) => {
    setUploading(true);
    setError("");
    try {
      const urls = await Promise.all(
        [...files].map((file) => uploadMedia(file, token)),
      );
      update("images", [...cleanList(values.images), ...urls].join("\n"));
    } catch (failure) {
      setError(failure.message);
    } finally {
      setUploading(false);
      setFileKeys((previous) => ({
        ...previous,
        gallery: (previous.gallery || 0) + 1,
      }));
    }
  };
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = normalizeRecord(type, values);
      for (const [name, file] of Object.entries(uploads)) {
        if (!file) continue;
        const url = await uploadMedia(file, token);
        payload[name] = url;
        update(name, url);
        setUploads((previous) => {
          const copy = { ...previous };
          delete copy[name];
          return copy;
        });
        setFileKeys((previous) => ({
          ...previous,
          [name]: (previous[name] || 0) + 1,
        }));
      }
      if (video) {
        const url = await uploadMedia(video, token, true);
        payload.videoUrl = url;
        update("videoUrl", url);
        setVideo(null);
        setFileKeys((previous) => ({
          ...previous,
          video: (previous.video || 0) + 1,
        }));
      }
      if (type === "projects") {
        payload.img = cleanList(payload.img)[0] || "";
        payload.modelImage = cleanList(payload.modelImage)[0] || "";
        payload.images = cleanList(payload.images);
        if (payload.category === "IoT" && !payload.videoUrl)
          throw new Error("Add a demo video for the IoT project.");
      }
      await mutate(
        type,
        item._id ? "update" : "create",
        payload,
        item._id || "",
        payload.title || payload.name || labels[type],
      );
      setEditing(null);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setSaving(false);
    }
  };
  const fields = (schema[type] || []).filter(
    (field) =>
      field.name !== "permissions" &&
      (field.name !== "modelImage" || values.category === "IoT"),
  );
  const direct = type === "admins" ? isManager : isOwner;
  return createPortal(
    <div
      className="modal open"
      id="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      onClick={(event) => {
        if (event.target === event.currentTarget && !saving) setEditing(null);
      }}
    >
      <div
        className={`modal-card${["projects", "blogs", "admins"].includes(type) ? " modal-wide" : ""}`}
        ref={panel}
        tabIndex={-1}
      >
        <div className="modal-head">
          <h2 id="modalTitle">
            {item._id ? "Edit" : "Add"} {labels[type]}
          </h2>
          <button
            type="button"
            className="btn secondary"
            onClick={() => setEditing(null)}
            disabled={saving}
            aria-label="Close editor"
          >
            ✕
          </button>
        </div>
        <form id="modalForm" onSubmit={submit}>
          <div className="form-section">
            <div className="form-section-title">
              <span>01</span>
              {labels[type]} details
            </div>
            <div className="grid2">
              {fields.map((field) => {
                const name = field.name;
                let options = field.options;
                if (type === "projects" && name === "category")
                  options = [
                    ...new Set(
                      [
                        ...projectCategories,
                        ...(data.projects || []).map(
                          (project) => project.category,
                        ),
                        item.category,
                      ].filter(
                        (value) => typeof value === "string" && value.trim(),
                      ),
                    ),
                  ];
                if (name === "role" && !isOwner)
                  options = (options || []).filter(
                    (role) => role !== "owner" || item.role === "owner",
                  );
                const required =
                  name === "password"
                    ? !item._id
                    : name === "videoUrl"
                      ? values.category === "IoT" && !video
                      : field.required;
                const help =
                  name === "previewDevice"
                    ? "Auto uses a phone for Android, iOS and mobile projects."
                    : name === "videoUrl"
                      ? "YouTube, Vimeo or a direct video link."
                      : name === "tags"
                        ? "Separate technologies or tags with commas."
                        : "";
                return (
                  <div
                    key={name}
                    className={
                      textareas.has(name) ? "field-group full" : "field-group"
                    }
                  >
                    <Field
                      field={{ ...field, options }}
                      value={values[name]}
                      onChange={(value) => update(name, value)}
                      required={required}
                      disabled={
                        saving || (name === "videoUrl" && Boolean(video))
                      }
                      type={
                        name === "password"
                          ? showPassword
                            ? "text"
                            : "password"
                          : undefined
                      }
                      id={
                        name === "videoUrl"
                          ? "videoUrl"
                          : name === "previewDevice"
                            ? "previewDevice"
                            : name === "modelImage"
                              ? "modelImage"
                              : undefined
                      }
                    />
                    {name === "password" && (
                      <button
                        type="button"
                        className="btn secondary"
                        onClick={() => setShowPassword((value) => !value)}
                      >
                        {showPassword ? "Hide" : "Show"} password
                      </button>
                    )}
                    {help && <small className="field-help">{help}</small>}
                    {mediaFields[type]?.includes(name) && (
                      <>
                        <UploadField
                          key={fileKeys[name] || 0}
                          label={
                            name === "modelImage"
                              ? "Upload model photo"
                              : "Upload image"
                          }
                          hint="Choose an image. Uploads when you save."
                          id={
                            name === "img"
                              ? "upload-projects"
                              : `upload-${type}-${name}`
                          }
                          accept="image/*"
                          disabled={saving}
                          onChange={(event) => {
                            const file = event.target.files[0] || null;
                            setUploads((previous) => ({
                              ...previous,
                              [name]: file,
                            }));
                          }}
                        />
                        {values[name] && (
                          <img
                            className="thumb"
                            src={mediaUrl(values[name])}
                            alt="Current upload"
                          />
                        )}
                      </>
                    )}
                    {name === "images" && (
                      <UploadField
                        key={fileKeys.gallery || 0}
                        label="Upload gallery images"
                        hint="Select one or more images to add to the gallery."
                        id="projectGalleryUpload"
                        multiple
                        accept="image/*"
                        disabled={uploading || saving}
                        busy={uploading}
                        onChange={(event) => gallery(event.target.files)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {type === "projects" && (
            <div className="form-section">
              <div className="form-section-title">
                <span>02</span>Project video
              </div>
              <UploadField
                key={fileKeys.video || 0}
                label="Upload video from device"
                hint="MP4, WebM or Ogg, up to 50 MB. Uploads when you save."
                id="upload-project-video"
                accept="video/mp4,video/webm,video/ogg,.mp4,.webm,.ogv"
                onChange={(event) => selectVideo(event.target.files[0])}
                disabled={saving}
              />
              <div className="row admin-video-status">
                <span id="projectVideoStatus" role="status">
                  {video
                    ? `${video.name} selected. Uploads when you save.`
                    : values.videoUrl
                      ? "Video link configured."
                      : "No video added."}
                </span>
                <button
                  type="button"
                  className="btn secondary"
                  disabled={saving || (!video && !values.videoUrl)}
                  onClick={() => {
                    update("videoUrl", "");
                    setVideo(null);
                    setFileKeys((previous) => ({
                      ...previous,
                      video: (previous.video || 0) + 1,
                    }));
                  }}
                >
                  Remove video
                </button>
              </div>
            </div>
          )}
          {type === "admins" && (
            <div className="form-section">
              <div className="form-section-title">
                <span>02</span>Employee section access
              </div>
              <div className="access-grid">
                {permissionKeys
                  .filter((key) => key !== "dashboard")
                  .map((key) => (
                    <label className="access-check" key={key}>
                      <input
                        type="checkbox"
                        name="permissions"
                        value={key}
                        checked={values.permissions?.includes(key) || false}
                        onChange={(event) =>
                          update(
                            "permissions",
                            event.target.checked
                              ? [...(values.permissions || []), key]
                              : (values.permissions || []).filter(
                                  (value) => value !== key,
                                ),
                          )
                        }
                      />
                      <span>{labels[key]}</span>
                    </label>
                  ))}
              </div>
            </div>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="project-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() => setEditing(null)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn primary"
              disabled={saving || uploading}
            >
              {saving
                ? "Saving…"
                : !direct
                  ? "Send for approval"
                  : item._id
                    ? "Save changes"
                    : type === "projects"
                      ? "Create project"
                      : `Create ${labels[type]}`}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
