import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { useAdmin } from "./AdminContext.jsx";
import {
  contactDefaults,
  labels,
  managerAccess,
  sortRecords,
} from "./config.js";
import { Field, humanLabel } from "./ResourceEditor.jsx";
import { mediaUrl, safeUrl } from "../../lib/api.js";
import { uploadMedia } from "./api.js";
import UploadField from "./UploadField.jsx";
import ApprovalDetails from "./ApprovalDetails.jsx";
import BlogImage from "../../components/BlogImage.jsx";
import { contentPath } from "../../lib/content-slugs.js";
export function useAction() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const run = async (action) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, run };
}
export function Avatar({ user, className = "profile-avatar" }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [user.profileImage]);
  return user.profileImage && !failed ? (
    <img
      className={className}
      src={mediaUrl(user.profileImage)}
      alt={user.name || ""}
      onError={() => setFailed(true)}
    />
  ) : (
    <span
      className={`${className} avatar-initials`}
      aria-label={user.name || "Profile"}
    >
      {(user.name || "?")
        .trim()
        .split(/\s+/)
        .map((value) => value[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()}
    </span>
  );
}
export function ConfirmDialog() {
  const { confirmation, setConfirmation } = useAdmin(),
    [note, setNote] = useState(""),
    dialog = useRef(null);
  useEffect(() => {
    setNote("");
    if (!confirmation) return;
    const trigger = confirmation.returnFocus;
    return () => {
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [confirmation]);
  if (!confirmation) return null;
  const close = (accepted) => {
    confirmation.resolve(accepted ? { note } : null);
    setConfirmation(null);
  };
  return createPortal(
    <div
      className="modal open"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      onKeyDown={(event) => {
        if (event.key === "Escape") close(false);
        if (event.key === "Tab") {
          const controls = dialog.current?.querySelectorAll(
            "button:not(:disabled),textarea:not(:disabled)",
          );
          if (!controls?.length) return;
          const first = controls[0],
            last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }}
    >
      <div className="modal-card" style={{ maxWidth: 480 }} ref={dialog}>
        <h2 id="confirm-title">{confirmation.title || "Confirm action"}</h2>
        <p id="confirm-message" style={{ margin: "16px 0" }}>
          {confirmation.message}
        </p>
        {confirmation.note && (
          <label className="field">
            Review note
            <textarea
              autoFocus
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>
        )}
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button
            type="button"
            className="btn secondary"
            onClick={() => close(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            autoFocus={!confirmation.note}
            className="btn primary"
            onClick={() => close(true)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
export function Dashboard() {
  const { data, user, setEditing, canView } = useAdmin(),
    [range, setRange] = useState("7D");
  const categories = [
      "projects",
      "insights",
      "clients",
      "team",
      "testimonials",
    ],
    total = categories.reduce((sum, key) => sum + data[key].length, 0);
  const days = { "7D": 7, "30D": 30, "3M": 90, "1Y": 365 }[range];
  const records = categories.flatMap((key) => data[key]),
    bins = Array.from({ length: 7 }, (_, index) => {
      const start = Date.now() - (((7 - index) * days) / 7) * 86400000,
        end = Date.now() - (((6 - index) * days) / 7) * 86400000;
      return records.filter((row) => {
        const time = new Date(row.createdAt || 0).getTime();
        return time >= start && time < end;
      }).length;
    });
  const max = Math.max(1, ...bins),
    points = bins
      .map((value, index) => `${30 + index * 95},${170 - (value / max) * 130}`)
      .join(" ");
  return (
    <div className="dashboard-shell">
      <div className="dash-hero">
        <div>
          <h1 className="dash-title">
            Welcome back, {(user.name || "Sakin").split(" ")[0]}!
          </h1>
          <p className="dash-kicker">
            Here is what is happening with your platform today.
          </p>
        </div>
        <div className="dash-date">
          {new Date().toLocaleDateString("en", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>
      <div className="dash-metrics">
        {categories.filter(canView).map((key, index) => (
          <div
            className="dash-metric"
            key={key}
            style={{
              "--accent": [
                "#2f7bff",
                "#7c3aed",
                "#14b8a6",
                "#f59e0b",
                "#ec4899",
              ][index],
            }}
          >
            <span className="muted">{labels[key]}</span>
            <strong>{data[key].length}</strong>
            <small>
              {data[key].filter((row) => row.visible !== false).length} visible
            </small>
          </div>
        ))}
      </div>
      <div className="dash-main-grid">
        <section className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <h3>Website Stats</h3>
              <p>Content published over time</p>
            </div>
            <div className="dash-tabs">
              {["7D", "30D", "3M", "1Y"].map((value) => (
                <button
                  type="button"
                  key={value}
                  className={range === value ? "active" : ""}
                  onClick={() => setRange(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <svg
            className="dash-chart"
            viewBox="0 0 640 210"
            role="img"
            aria-label={`${range} content activity`}
          >
            <path
              d="M30 40H610M30 100H610M30 170H610"
              stroke="#64748b33"
              fill="none"
            />
            <polyline
              points={points}
              stroke="#3b82f6"
              strokeWidth="4"
              fill="none"
            />
            {bins.map((value, index) => (
              <circle
                key={index}
                cx={30 + index * 95}
                cy={170 - (value / max) * 130}
                r="5"
                fill="#3b82f6"
              />
            ))}
          </svg>
        </section>
        <section className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <h3>Content Distribution</h3>
              <p>{total} records across categories</p>
            </div>
          </div>
          <div className="dash-legend">
            {categories.map((key, index) => (
              <div key={key}>
                <i
                  style={{
                    background: [
                      "#2f7bff",
                      "#7c3aed",
                      "#14b8a6",
                      "#f59e0b",
                      "#ec4899",
                    ][index],
                  }}
                />
                {labels[key]} <strong>{data[key].length}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="dash-main-grid">
        <section className="dash-panel">
          <h3>Recent projects</h3>
          <div className="dash-list">
            {sortRecords(data.projects)
              .slice(0, 4)
              .map((project) => (
                <div className="dash-list-row" key={project._id}>
                  <strong>{project.title}</strong>
                  <span className="muted">{project.category}</span>
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() =>
                      setEditing({ type: "projects", item: project })
                    }
                  >
                    Edit
                  </button>
                </div>
              ))}
          </div>
        </section>
        <section className="dash-panel">
          <h3>Quick actions</h3>
          <div className="dash-actions">
            {["projects", "blogs", "clients", "team"]
              .filter(canView)
              .map((key) => (
                <button
                  key={key}
                  className="dash-action"
                  type="button"
                  onClick={() => setEditing({ type: key })}
                >
                  + Add {labels[key]}
                </button>
              ))}
          </div>
          <Link to="/" className="btn primary">
            Preview website ↗
          </Link>
        </section>
      </div>
    </div>
  );
}
export function ResourceList({ type, embedded = false }) {
  const {
      data,
      setData,
      setEditing,
      mutate,
      isOwner,
      ask,
      request,
      approval,
      refresh,
      notify,
    } = useAdmin(),
    action = useAction(),
    [dragged, setDragged] = useState(null);
  const rows = sortRecords(data[type]);
  const remove = async (row) => {
    if (
      await ask({
        title: `Delete ${labels[type]}`,
        message: isOwner
          ? "Delete this record permanently?"
          : "Send this deletion for approval?",
      })
    )
      await mutate(
        type,
        "delete",
        {},
        row._id,
        `Delete ${row.title || row.name || labels[type]}`,
      );
  };
  const reorder = async (from, to) => {
    if (from === to) return;
    const reordered = [...rows],
      moved = reordered.splice(from, 1)[0];
    reordered.splice(to, 0, moved);
    const items = reordered.map((row, index) => ({
      id: row._id,
      order: index,
    }));
    if (isOwner) {
      await request("/projects/reorder", {
        method: "POST",
        body: JSON.stringify({ items }),
      });
      setData((previous) => ({
        ...previous,
        projects: reordered.map((row, index) => ({ ...row, order: index })),
      }));
      notify("Project order saved");
    } else {
      await approval("projects", "reorder", { items }, "", "Project order");
      notify("Approval request sent");
    }
    await refresh(true);
  };
  return (
    <>
      <div className={`toolbar${embedded ? " embedded-toolbar" : ""}`}>
        <div>
          {embedded ? <h3>{labels[type]}</h3> : <h2>{labels[type]}</h2>}
          <p className="muted">
            {isOwner
              ? embedded
                ? "Manage your office locations."
                : `Manage ${labels[type].toLowerCase()} and control what appears on your website.`
              : "Submit changes for admin approval before anything goes live."}
          </p>
        </div>
        <button
          className="btn primary"
          type="button"
          onClick={() => setEditing({ type })}
        >
          + {isOwner ? "Add" : "Request"} {labels[type]}
        </button>
      </div>
      {type === "projects" && (
        <p className="project-sort-note">
          Top 3 projects appear first on the homepage. Drag cards or use the
          arrows to change their order.
        </p>
      )}
      {action.error && (
        <p role="alert" className="form-error">
          {action.error}
        </p>
      )}
      <div
        className={type === "projects" ? "project-sort-grid" : "cards"}
        id={type === "projects" ? "projectSortGrid" : undefined}
      >
        {rows.map((row, index) => {
          const image = row.img || row.logo || row.coverImage || row.image;
          return (
            <article
              key={row._id}
              className={`card resource-card${type === "projects" ? " project-sort-card" : ""}`}
              draggable={type === "projects" && !action.busy}
              onDragStart={() => setDragged(index)}
              onDragOver={(event) => {
                if (type === "projects") event.preventDefault();
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (dragged !== null) action.run(() => reorder(dragged, index));
                setDragged(null);
              }}
            >
              <div className="row" style={{ justifyContent: "space-between" }}>
                {type === "projects" && (
                  <span className="pill">Top #{index + 1}</span>
                )}
                <span className={`pill${row.visible !== false ? " on" : ""}`}>
                  {row.visible !== false ? "Visible" : "Hidden"}
                </span>
              </div>
              {type === "blogs" ? (
                <BlogImage
                  className="thumb"
                  src={image}
                  category={row.category}
                  alt={row.title || "Blog cover"}
                  loading="lazy"
                />
              ) : (
                image && (
                  <img
                    className="thumb"
                    src={mediaUrl(image)}
                    alt={row.title || row.name || ""}
                  />
                )
              )}
              <h3>
                {row.title ||
                  row.name ||
                  row.label ||
                  row.value ||
                  labels[type]}
              </h3>
              <p className="muted resource-description">
                {row.category ||
                  row.role ||
                  row.desc ||
                  row.text ||
                  row.address ||
                  row.country ||
                  row.email ||
                  row.value ||
                  ""}
              </p>
              {type === "projects" && (
                <div className="row">
                  <Link to={contentPath("project", row, rows)} className="btn secondary">
                    View project page
                  </Link>
                  {row.videoUrl && <span className="pill on">Video added</span>}
                </div>
              )}
              {type === "blogs" && (
                <Link
                  to={contentPath("blog", row, rows)}
                  className="btn secondary"
                >
                  View blog
                </Link>
              )}
              <div className="row resource-actions">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setEditing({ type, item: row })}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn secondary"
                  disabled={action.busy}
                  onClick={() =>
                    action.run(() =>
                      mutate(
                        type,
                        "update",
                        { visible: row.visible === false },
                        row._id,
                        `${row.visible === false ? "Show" : "Hide"} ${labels[type]}`,
                      ),
                    )
                  }
                >
                  {row.visible !== false ? "Hide" : "Show"}
                </button>
                <button
                  type="button"
                  className="btn danger"
                  disabled={action.busy}
                  onClick={() => action.run(() => remove(row))}
                >
                  Delete
                </button>
                {type === "projects" && (
                  <>
                    <button
                      type="button"
                      className="btn secondary"
                      aria-label={`Move ${row.title} up`}
                      disabled={index === 0 || action.busy}
                      onClick={() =>
                        action.run(() => reorder(index, index - 1))
                      }
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn secondary"
                      aria-label={`Move ${row.title} down`}
                      disabled={index === rows.length - 1 || action.busy}
                      onClick={() =>
                        action.run(() => reorder(index, index + 1))
                      }
                    >
                      ↓
                    </button>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {!rows.length && (
        <div className="empty">No {labels[type]} added yet.</div>
      )}
    </>
  );
}
export function Employees() {
  const { data, user, setEditing, isManager, request, refresh, ask, notify } =
      useAdmin(),
    [query, setQuery] = useState(""),
    action = useAction();
  const rows = data.admins.filter((row) =>
    [
      row.name,
      row.email,
      row.employeeId,
      row.position,
      row.role,
      ...(row.permissions || []),
    ]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const change = async (row, remove = false) => {
    if (
      !(await ask({
        title: remove ? "Remove employee" : "Change employee access",
        message: remove
          ? "Remove this employee permanently?"
          : `${row.active === false ? "Allow" : "Block"} access for ${row.name}?`,
      }))
    )
      return;
    await request(`/admins/${row._id}`, {
      method: remove ? "DELETE" : "PUT",
      ...(!remove
        ? { body: JSON.stringify({ active: row.active === false }) }
        : {}),
    });
    await refresh(true);
    notify("Employee access updated");
  };
  return (
    <>
      <div className="toolbar">
        <div>
          <h2>Employees</h2>
          <p className="muted">Manage employee profiles and section access.</p>
        </div>
        {isManager && (
          <button
            className="btn primary"
            type="button"
            onClick={() => setEditing({ type: "admins" })}
          >
            + Add Employee
          </button>
        )}
      </div>
      <div className="field">
        <label htmlFor="employeeSearch">Search employee</label>
        <input
          id="employeeSearch"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, email, employee ID or role"
        />
      </div>
      {action.error && <p role="alert">{action.error}</p>}
      <div className="cards employee-grid">
        {rows.map((row) => {
          const protectedUser =
            row.email === "alishafaq@gmail.com" ||
            String(row._id) === String(user.id);
          return (
            <article className="card employee-card" key={row._id}>
              <div className="admin-account-card">
                <Avatar user={row} />
                <div>
                  <h3>{row.name}</h3>
                  <p className="muted">
                    {row.position || humanLabel(row.role || "employee")}
                  </p>
                </div>
              </div>
              <dl className="employee-info">
                <div>
                  <dt>Employee ID</dt>
                  <dd>{row.employeeId || "Not assigned"}</dd>
                </div>
                <div>
                  <dt>Email address</dt>
                  <dd>{row.email || "Not provided"}</dd>
                </div>
              </dl>
              <div className="row">
                <span className={`pill${row.active !== false ? " on" : ""}`}>
                  {row.active !== false ? "Access allowed" : "Blocked"}
                </span>
                <span className="pill">{row.role}</span>
              </div>
              <details className="employee-permissions">
                <summary>
                  Section access{" "}
                  <span>
                    {managerAccess(row)
                      ? "Full access"
                      : `${(row.permissions || []).length} sections`}
                  </span>
                </summary>
                <div className="access-pills">
                  {managerAccess(row) ? (
                    <p className="muted">
                      This account can access all admin sections.
                    </p>
                  ) : (
                    (row.permissions || []).map((key) => (
                      <span key={key} className="pill">
                        {labels[key] || key}
                      </span>
                    ))
                  )}
                </div>
              </details>
              {isManager && (
                <div className="row resource-actions">
                  <button
                    className="btn secondary"
                    type="button"
                    onClick={() => setEditing({ type: "admins", item: row })}
                  >
                    Edit
                  </button>
                  {!protectedUser && (
                    <>
                      <button
                        className="btn secondary"
                        type="button"
                        disabled={action.busy}
                        onClick={() => action.run(() => change(row))}
                      >
                        {row.active === false ? "Allow" : "Block"}
                      </button>
                      <button
                        className="btn danger"
                        type="button"
                        disabled={action.busy}
                        onClick={() => action.run(() => change(row, true))}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
      {!rows.length && <div className="empty">No employees found.</div>}
    </>
  );
}
export function Approvals() {
  const { data, user, isOwner, isManager, ask, request, refresh, notify } =
      useAdmin(),
    action = useAction(),
    [filter, setFilter] = useState("all");
  const statuses = ["all", "pending", "approved", "rejected"];
  const counts = Object.fromEntries(
    statuses.map((status) => [
      status,
      data.approvals.filter((row) => status === "all" || row.status === status)
        .length,
    ]),
  );
  const rows = data.approvals.filter(
    (row) => filter === "all" || row.status === filter,
  );
  const dateLabel = (value) =>
    value && !Number.isNaN(new Date(value).getTime())
      ? new Intl.DateTimeFormat("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(value))
      : "";
  const review = async (row, decision) => {
    const result = await ask({
      title: decision === "approve" ? "Approve request" : "Reject request",
      message: row.title || row.resourceType,
      note: true,
    });
    if (!result) return;
    await request(`/approvals/${row._id}/${decision}`, {
      method: "PUT",
      body: JSON.stringify({ reviewNote: result.note }),
    });
    await refresh(true);
    notify(decision === "approve" ? "Request approved" : "Request rejected");
  };
  return (
    <>
      <div className="toolbar">
        <div>
          <h2>{isManager ? "Approvals" : "My Approvals"}</h2>
          <p className="muted">
            Review requested changes and keep track of every decision.
          </p>
        </div>
      </div>
      <div className="admin-summary-strip" aria-label="Approval overview">
        <div>
          <span>Awaiting review</span>
          <strong>{counts.pending}</strong>
        </div>
        <div>
          <span>Approved</span>
          <strong>{counts.approved}</strong>
        </div>
        <div>
          <span>Rejected</span>
          <strong>{counts.rejected}</strong>
        </div>
      </div>
      <div
        className="admin-filter-bar"
        role="group"
        aria-label="Filter approval requests"
      >
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            aria-pressed={filter === status}
            onClick={() => setFilter(status)}
          >
            {status === "all" ? "All requests" : humanLabel(status)}
            <span>{counts[status]}</span>
          </button>
        ))}
      </div>
      {action.error && <p role="alert">{action.error}</p>}
      <div className="approval-list">
        {rows.map((row) => (
          <article className="card approval-card" key={row._id}>
            <div className="approval-heading">
              <div>
                <span className="admin-eyebrow">
                  {labels[row.resourceType] ||
                    humanLabel(row.resourceType || "Content")}{" "}
                  · {humanLabel(row.action || "update")}
                </span>
                <h3>{row.title || row.resourceType}</h3>
                <p className="muted">
                  Requested by {row.requesterName || "Employee"}
                  {dateLabel(row.createdAt) && (
                    <>
                      {" "}
                      ·{" "}
                      <time dateTime={row.createdAt}>
                        {dateLabel(row.createdAt)}
                      </time>
                    </>
                  )}
                </p>
              </div>
              <span className={`pill approval-status status-${row.status}`}>
                {humanLabel(row.status || "pending")}
              </span>
            </div>
            <ApprovalDetails row={row} projects={data.projects} />
            {(row.reviewNote || row.reviewedByName || row.reviewedAt) && (
              <div className="approval-review">
                <strong>
                  {row.reviewedByName
                    ? `Reviewed by ${row.reviewedByName}`
                    : "Review note"}
                </strong>
                {row.reviewedAt && (
                  <time dateTime={row.reviewedAt}>
                    {dateLabel(row.reviewedAt)}
                  </time>
                )}
                {row.reviewNote && <p>{row.reviewNote}</p>}
              </div>
            )}
            {isManager &&
              row.status === "pending" &&
              (isOwner || String(row.requester) !== String(user.id)) && (
                <div className="row approval-actions">
                  <span className="muted">
                    Review the changes before making a decision.
                  </span>
                  <button
                    type="button"
                    className="btn green"
                    disabled={action.busy}
                    onClick={() => action.run(() => review(row, "approve"))}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn danger"
                    disabled={action.busy}
                    onClick={() => action.run(() => review(row, "reject"))}
                  >
                    Reject
                  </button>
                </div>
              )}
          </article>
        ))}
      </div>
      {!rows.length && (
        <div className="empty admin-empty">
          <strong>
            {filter === "pending"
              ? "You're all caught up"
              : "No requests to show"}
          </strong>
          <p>
            {filter === "all"
              ? "New approval requests will appear here."
              : `There are no ${filter} requests.`}
          </p>
        </div>
      )}
    </>
  );
}
export function VisibilitySettings({ services = false }) {
  const { data, mutate } = useAdmin(),
    action = useAction();
  const sectionInfo = {
    hero: [
      "Hero banner",
      "The headline and cover at the top of your homepage.",
    ],
    why: ["Why choose us", "Reasons to work with Sakinzo."],
    clients: ["Our clients", "Logos of the clients you work with."],
    whatwedo: ["What we do", "An overview of your areas of expertise."],
    projects: ["Projects", "Featured work and project categories."],
    services: [
      "Services",
      "Your service offering and development capabilities.",
    ],
    cases: ["Success stories", "Selected case studies and results."],
    map: ["Client map", "Locations of your clients on the map."],
    feedback: ["Testimonials", "Feedback and reviews from your clients."],
    insights: ["Insights", "Recent articles and updates from your team."],
  };
  const rows = services
    ? data.whatWeDoServices
    : [
        "hero",
        "why",
        "clients",
        "whatwedo",
        "projects",
        "services",
        "cases",
        "map",
        "feedback",
        "insights",
      ].map((key) => ({
        key,
        label: sectionInfo[key][0],
        description: sectionInfo[key][1],
        enabled:
          data.sections.find((row) => row.key === key)?.enabled !== false,
      }));
  return (
    <>
      <div className="toolbar">
        <div>
          <h2>{services ? "What We Do Services" : "Homepage sections"}</h2>
          <p className="muted">
            Control which content appears on the homepage.
          </p>
        </div>
        <span className="admin-count">
          {rows.filter((row) => row.enabled !== false).length} of {rows.length}{" "}
          visible
        </span>
      </div>
      {action.error && <p role="alert">{action.error}</p>}
      <div className="cards visibility-grid">
        {rows.map((row) => (
          <article
            className={`card visibility-card${row.enabled === false ? " is-hidden" : ""}`}
            key={row.key}
          >
            <div className="visibility-card-top">
              <span className="admin-section-symbol" aria-hidden="true">
                {services ? "◇" : "▤"}
              </span>
              <button
                type="button"
                className="admin-switch"
                role="switch"
                aria-checked={row.enabled !== false}
                aria-label={`Show ${row.label || row.key} on homepage`}
                disabled={action.busy}
                onClick={() =>
                  action.run(() =>
                    mutate(
                      services ? "whatWeDoServices" : "sections",
                      "update",
                      { enabled: row.enabled === false },
                      row.key,
                      row.label || row.key,
                    ),
                  )
                }
              >
                <span />
              </button>
            </div>
            <h3>{row.label || row.key}</h3>
            <p className="muted">
              {row.description ||
                "Control whether this service appears in What We Do on the homepage."}
            </p>
            <span className={`pill${row.enabled !== false ? " on" : ""}`}>
              {row.enabled !== false ? "Visible" : "Hidden"}
            </span>
          </article>
        ))}
      </div>
      {!rows.length && (
        <div className="empty admin-empty">
          <strong>No services available</strong>
          <p>Your services will appear here when they are available.</p>
        </div>
      )}
    </>
  );
}
export function Submissions() {
  const { data, isOwner, mutate, ask } = useAdmin(),
    action = useAction();
  return (
    <>
      <h2>Contact Leads</h2>
      {action.error && <p role="alert">{action.error}</p>}
      {data.submissions.length ? (
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                {[
                  "Date",
                  "Source",
                  "Name",
                  "Email",
                  "Phone",
                  "Company",
                  "Message",
                  "Attachment",
                  "Reply",
                  "Action",
                ].map((label) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.submissions.map((row) => (
                <tr key={row._id}>
                  <td>
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleString()
                      : ""}
                  </td>
                  <td>{row.source}</td>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.phone}</td>
                  <td>{row.company}</td>
                  <td>{row.desc}</td>
                  <td>
                    {safeUrl(mediaUrl(row.attachmentUrl || "")) && (
                      <a
                        href={mediaUrl(row.attachmentUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open
                      </a>
                    )}
                  </td>
                  <td>
                    <div className="row">
                      <a
                        className="btn secondary"
                        href={`mailto:${encodeURIComponent(row.email || "")}?subject=${encodeURIComponent("Reply from Sakinzo")}`}
                      >
                        Email
                      </a>
                      {row.phone && (
                        <a
                          className="btn green"
                          href={`https://wa.me/${row.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn danger"
                      disabled={action.busy}
                      onClick={() =>
                        action.run(async () => {
                          if (
                            await ask({
                              title: "Delete submission",
                              message: isOwner
                                ? "Delete this contact lead permanently?"
                                : "Send deletion for approval?",
                            })
                          )
                            await mutate(
                              "submissions",
                              "delete",
                              {},
                              row._id,
                              "Delete submission",
                            );
                        })
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty">No submissions yet.</div>
      )}
    </>
  );
}
export function ContactSettings() {
  const { data, mutate, isOwner } = useAdmin(),
    [values, setValues] = useState(() => ({
      ...contactDefaults,
      ...data.contactPage,
    })),
    action = useAction();
  return (
    <>
      <div className="toolbar">
        <div>
          <h2>Contact Page</h2>
          <p className="muted">
            Manage page copy, office locations and contact methods.
          </p>
        </div>
        <Link className="btn secondary" to="/contact">
          Preview Contact Page
        </Link>
      </div>
      <div className="contact-admin-grid">
        <form
          className="card"
          id="contactSettingsForm"
          onSubmit={(event) => {
            event.preventDefault();
            action.run(() =>
              mutate(
                "contactPage",
                "update",
                values,
                "main",
                "Contact page content",
              ),
            );
          }}
        >
          <h3>Page content</h3>
          <p className="muted admin-form-intro">
            Update the words visitors see on your contact page.
          </p>
          {[
            [
              "Contact form",
              "The heading and introduction above your enquiry form.",
              ["formTitle", "formSubtitle"],
            ],
            [
              "Team & sidebar",
              "Introduce your team and let visitors know when to expect a reply.",
              ["sidebarLabel", "teamTitle", "teamSubtitle", "teamStatus"],
            ],
            [
              "Contact methods",
              "Headings, email and social links shown beside the form.",
              [
                "officesTitle",
                "methodsTitle",
                "email",
                "emailLabel",
                "linkedinUrl",
                "linkedinLabel",
              ],
            ],
            [
              "Footer invitation",
              "Encourage visitors to start a conversation.",
              ["footerCtaTitle", "footerCtaSubtitle", "footerCtaButton"],
            ],
          ].map(([title, description, names]) => (
            <fieldset className="admin-form-group" key={title}>
              <legend>{title}</legend>
              <p className="muted">{description}</p>
              <div className="grid2">
                {names.map((name) => (
                  <Field
                    key={name}
                    field={{ name, type: "String" }}
                    value={values[name]}
                    disabled={action.busy}
                    onChange={(value) =>
                      setValues((previous) => ({ ...previous, [name]: value }))
                    }
                  />
                ))}
              </div>
            </fieldset>
          ))}
          {action.error && <p role="alert">{action.error}</p>}
          <div className="admin-form-footer">
            <button className="btn primary" disabled={action.busy}>
              {action.busy
                ? "Saving…"
                : isOwner
                  ? "Save Contact Page"
                  : "Send for approval"}
            </button>
            <span className="muted">
              {isOwner
                ? "Changes appear on your website after saving."
                : "Your changes will be reviewed before publishing."}
            </span>
          </div>
        </form>
        <aside className="card contact-offices-panel">
          <ResourceList type="contactOffices" embedded />
        </aside>
      </div>
      <div className="contact-leads-panel">
        <Submissions />
      </div>
    </>
  );
}
export function Profile() {
  const { user, isOwner, token, request, approval, refresh, notify } =
      useAdmin(),
    [values, setValues] = useState(() =>
      Object.fromEntries(
        ["name", "email", "profileImage", "phone", "bio"].map((key) => [
          key,
          user[key] || "",
        ]),
      ),
    ),
    action = useAction();
  const submit = (event) => {
    event.preventDefault();
    action.run(async () => {
      if (isOwner)
        await request(`/admins/${user.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        });
      else
        await approval(
          "admins",
          "profile-update",
          values,
          user.id,
          "Profile update",
        );
      await refresh(true);
      notify(isOwner ? "Profile saved" : "Approval request sent");
    });
  };
  return (
    <>
      <div className="toolbar">
        <div>
          <h2>My profile</h2>
          <p className="muted">
            Keep your account details and profile picture up to date.
          </p>
        </div>
      </div>
      <div className="profile-grid">
        <div className="card profile-card">
          <Avatar user={{ ...user, ...values }} />
          <h3>{values.name || user.name}</h3>
          <p className="muted">{user.position || "Sakinzo team"}</p>
          <span className="pill on">{humanLabel(user.role || "employee")}</span>
          <dl className="employee-info">
            <div>
              <dt>Email address</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Employee ID</dt>
              <dd>{user.employeeId || "Not assigned"}</dd>
            </div>
          </dl>
        </div>
        <form className="card profile-form" id="profileForm" onSubmit={submit}>
          <h3>Personal details</h3>
          <p className="muted admin-form-intro">
            Your team uses these details to recognise and reach you.
          </p>
          <div className="grid2">
            {["name", "email", "phone", "bio"].map((name) => (
              <Field
                key={name}
                field={{ name, type: "String" }}
                value={values[name]}
                required={["name", "email"].includes(name)}
                disabled={action.busy}
                onChange={(value) =>
                  setValues((previous) => ({ ...previous, [name]: value }))
                }
              />
            ))}
          </div>
          <fieldset className="admin-form-group">
            <legend>Profile picture</legend>
            <p className="muted">
              Choose a clear photo so your team can recognise you.
            </p>
            <div className="profile-picture-preview">
              <Avatar user={{ ...user, ...values }} />
              <div>
                <strong>
                  {values.profileImage
                    ? "Current picture"
                    : "Using your initials"}
                </strong>
                <p className="muted">
                  Your picture is saved with your profile.
                </p>
                {values.profileImage && (
                  <button
                    type="button"
                    className="btn secondary"
                    disabled={action.busy}
                    onClick={() =>
                      setValues((previous) => ({
                        ...previous,
                        profileImage: "",
                      }))
                    }
                  >
                    Remove picture
                  </button>
                )}
              </div>
            </div>
            <UploadField
              id="upload-profile-picture"
              label="Upload profile picture"
              hint="Choose an image for your profile."
              accept="image/*"
              disabled={action.busy}
              busy={action.busy}
              onChange={(event) => {
                const file = event.target.files[0];
                if (file)
                  action.run(async () => {
                    const url = await uploadMedia(file, token);
                    setValues((previous) => ({
                      ...previous,
                      profileImage: url,
                    }));
                  });
              }}
            />
            <details className="profile-image-link">
              <summary>Use an image URL</summary>
              <label className="field" htmlFor="profile-picture-url">
                <span>Image URL</span>
                <input
                  id="profile-picture-url"
                  inputMode="url"
                  disabled={action.busy}
                  value={
                    values.profileImage.startsWith("data:")
                      ? ""
                      : values.profileImage
                  }
                  placeholder={
                    values.profileImage.startsWith("data:")
                      ? "A picture is already uploaded. Paste a URL to replace it."
                      : "https://example.com/photo.jpg"
                  }
                  onChange={(event) =>
                    setValues((previous) => ({
                      ...previous,
                      profileImage: event.target.value,
                    }))
                  }
                />
              </label>
            </details>
          </fieldset>
          {action.error && <p role="alert">{action.error}</p>}
          <div className="admin-form-footer">
            <button className="btn primary" disabled={action.busy}>
              {action.busy
                ? "Saving…"
                : isOwner
                  ? "Save profile"
                  : "Send for approval"}
            </button>
            <span className="muted">
              {isOwner
                ? "Only saved changes update your account."
                : "Profile changes need approval before they appear."}
            </span>
          </div>
        </form>
      </div>
    </>
  );
}
