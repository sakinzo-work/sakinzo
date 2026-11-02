import { useState } from "react";
import { humanLabel } from "./ResourceEditor.jsx";
import { labels } from "./config.js";
import { mediaUrl, safeUrl } from "../../lib/api.js";

const hiddenFields =
  /^(password|passwordHash|token|accessToken|refreshToken|secret|__v)$/i;
const imageFields =
  /^(profileImage|img|image|images|coverImage|logo|modelImage)$/i;
const fieldNames = {
  profileImage: "Profile picture",
  img: "Cover image",
  coverImage: "Cover image",
  modelImage: "Model photo",
  enabled: "Homepage visibility",
  visible: "Visibility",
  active: "Account access",
  items: "Project order",
};

function ImagePreview({ value, label }) {
  const [failed, setFailed] = useState(false);
  const src =
    typeof value === "string" &&
    (/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value) || safeUrl(value))
      ? mediaUrl(value)
      : "";
  return src && !failed ? (
    <img
      className="approval-image"
      src={src}
      alt={label}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <span className="muted">
      {value ? "Image preview unavailable" : "No image"}
    </span>
  );
}

function DetailValue({ name, value, depth = 0 }) {
  if (imageFields.test(name)) {
    const images = Array.isArray(value) ? value : [value];
    return (
      <div className="approval-images">
        {images.length ? (
          images.map((image, index) => (
            <ImagePreview
              key={index}
              value={image}
              label={`${fieldNames[name] || humanLabel(name)}${images.length > 1 ? ` ${index + 1}` : ""}`}
            />
          ))
        ) : (
          <span className="muted">No images</span>
        )}
      </div>
    );
  }
  if (typeof value === "boolean")
    return (
      <span className={`pill${value ? " on" : ""}`}>
        {["visible", "enabled"].includes(name)
          ? value
            ? "Visible"
            : "Hidden"
          : name === "active"
            ? value
              ? "Allowed"
              : "Blocked"
            : value
              ? "Yes"
              : "No"}
      </span>
    );
  if (value === null || value === undefined || value === "")
    return <span className="muted">Not set</span>;
  if (Array.isArray(value)) {
    if (!value.length) return <span className="muted">None</span>;
    if (name === "items")
      return (
        <ol className="approval-order">
          {value.map((item, index) => (
            <li key={index}>
              {item.title || item.name || `Project ${index + 1}`}
              <small className="muted">
                Position {Number(item.order ?? index) + 1}
              </small>
            </li>
          ))}
        </ol>
      );
    if (
      value.every(
        (item) => typeof item === "string" || typeof item === "number",
      )
    )
      return (
        <div className="access-pills">
          {value.map((item, index) => (
            <span className="pill" key={index}>
              {name === "permissions"
                ? labels[item] || humanLabel(String(item))
                : String(item).startsWith("data:")
                  ? "Attached file"
                  : String(item).slice(0, 500)}
            </span>
          ))}
        </div>
      );
    return (
      <div className="approval-nested">
        {value.map((item, index) => (
          <DetailValue
            key={index}
            name={String(index)}
            value={item}
            depth={depth + 1}
          />
        ))}
      </div>
    );
  }
  if (typeof value === "object")
    return depth < 3 ? (
      <DetailsList payload={value} depth={depth + 1} />
    ) : (
      <span className="muted">Additional details included</span>
    );
  const text = String(value);
  if (text.startsWith("data:"))
    return <span className="muted">Attached file</span>;
  const link = /^https?:\/\//i.test(text) && safeUrl(text);
  if (link)
    return (
      <a
        className="admin-text-link"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    );
  return <span className="approval-text">{text}</span>;
}

function DetailsList({ payload, depth = 0 }) {
  return (
    <dl className="approval-fields">
      {Object.entries(payload)
        .filter(([name]) => !hiddenFields.test(name))
        .map(([name, value]) => (
          <div className="approval-field" key={name}>
            <dt>{fieldNames[name] || humanLabel(name)}</dt>
            <dd>
              <DetailValue name={name} value={value} depth={depth} />
            </dd>
          </div>
        ))}
    </dl>
  );
}

export default function ApprovalDetails({ row, projects = [] }) {
  const payload =
    row.payload && typeof row.payload === "object" ? { ...row.payload } : {};
  if (row.action === "reorder" && Array.isArray(payload.items))
    payload.items = payload.items.map((item) => ({
      ...item,
      title:
        projects.find(
          (project) => String(project._id) === String(item.id || item._id),
        )?.title ||
        item.title ||
        `Project ${item.id || item._id || ""}`,
    }));
  const count = Object.keys(payload).filter(
    (name) => !hiddenFields.test(name),
  ).length;
  return (
    <details className="approval-details" open={row.status === "pending"}>
      <summary>
        Requested changes{" "}
        <span>
          {count
            ? `${count} ${count === 1 ? "field" : "fields"}`
            : row.action === "delete"
              ? "Delete record"
              : "Details"}
        </span>
      </summary>
      {count ? (
        <DetailsList payload={payload} />
      ) : (
        <p className="muted">
          {row.action === "delete"
            ? "This request will permanently remove the selected record."
            : "No field changes included in this request."}
        </p>
      )}
    </details>
  );
}
