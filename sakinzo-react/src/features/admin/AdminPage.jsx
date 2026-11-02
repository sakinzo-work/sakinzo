import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { AdminProvider, useAdmin } from "./AdminContext.jsx";
import { labels, navGroups } from "./config.js";
import {
  Approvals,
  Avatar,
  ConfirmDialog,
  ContactSettings,
  Dashboard,
  Employees,
  Profile,
  ResourceList,
  Submissions,
  VisibilitySettings,
} from "./AdminViews.jsx";
import ResourceEditor from "./ResourceEditor.jsx";

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminScreen />
    </AdminProvider>
  );
}
function Login() {
  const { login, loading, error } = useAdmin(),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [show, setShow] = useState(false);
  return (
    <div className="login" id="login">
      <form
        className="login-card"
        id="loginForm"
        onSubmit={(event) => {
          event.preventDefault();
          login(email, password);
        }}
      >
        <div className="login-brand">
          <span className="login-brand-name">
            Sakin<span>.zo</span>
          </span>
        </div>
        <h1>Welcome back</h1>
        <p>Sign in to securely manage your website.</p>
        <div className="field">
          <label htmlFor="loginEmail">Email address</label>
          <input
            id="loginEmail"
            type="email"
            name="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            placeholder="admin@sakinzo.local"
          />
        </div>
        <div className="field">
          <label htmlFor="loginPassword">Password</label>
          <div className="password-wrap">
            <input
              id="loginPassword"
              name="password"
              type={show ? "text" : "password"}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
            />
            <button
              className="password-eye"
              type="button"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((value) => !value)}
            >
              {show ? "◉" : "◎"}
            </button>
          </div>
        </div>
        {error && (
          <div className="login-error show" id="loginError" role="alert">
            {error}
          </div>
        )}
        <button
          className="btn primary"
          id="loginButton"
          style={{ width: "100%", padding: 13 }}
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in securely"}
        </button>
        <Link to="/" className="admin-home-link">
          ← Return to website
        </Link>
      </form>
    </div>
  );
}
function useAdminPwa() {
  const [install, setInstall] = useState(null),
    [standalone, setStandalone] = useState(
      () => window.matchMedia("(display-mode: standalone)").matches,
    );
  useEffect(() => {
    const prompt = (event) => {
        event.preventDefault();
        setInstall(event);
      },
      installed = () => {
        setInstall(null);
        setStandalone(true);
      };
    window.addEventListener("beforeinstallprompt", prompt);
    window.addEventListener("appinstalled", installed);
    if (import.meta.env.PROD && "serviceWorker" in navigator)
      navigator.serviceWorker
        .register(`${import.meta.env.BASE_URL}admin-sw.js`)
        .catch(() => {});
    return () => {
      window.removeEventListener("beforeinstallprompt", prompt);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);
  return {
    available: Boolean(install) && !standalone,
    install: async () => {
      await install?.prompt();
      await install?.userChoice;
      setInstall(null);
    },
  };
}
function AdminScreen() {
  const admin = useAdmin(),
    {
      token,
      user,
      data,
      loading,
      error,
      notice,
      synced,
      logout,
      refresh,
      setEditing,
      canView,
    } = admin;
  const params = useParams(),
    { section = "dashboard" } = params,
    navigate = useNavigate(),
    [collapsed, setCollapsed] = useState(
      () => localStorage.getItem("sakinzo_admin_sidebar_collapsed") === "true",
    ),
    [theme, setTheme] = useState(
      () => localStorage.getItem("sakinzo_admin_theme") || "dark",
    ),
    [more, setMore] = useState(false),
    [query, setQuery] = useState(""),
    [searchOpen, setSearchOpen] = useState(false);
  const search = useRef(null),
    pwa = useAdminPwa();
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("sakinzo_admin_theme", theme);
    } catch {}
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);
  useEffect(() => {
    try {
      localStorage.setItem(
        "sakinzo_admin_sidebar_collapsed",
        String(collapsed),
      );
    } catch {}
  }, [collapsed]);
  useEffect(() => {
    setMore(false);
    setSearchOpen(false);
  }, [section]);
  useEffect(() => {
    const close = (event) => {
      if (!search.current?.contains(event.target)) setSearchOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);
  useEffect(() => {
    if (user && !params.section && !canView("dashboard")) {
      const first = navGroups.flatMap(([, keys]) => keys).find(canView);
      if (first) navigate("/admin/" + first, { replace: true });
    }
  }, [user?.id, params.section]);
  if (!token) return <Login />;
  if (!user || !synced)
    return (
      <main className="admin-startup">
        <div
          className="admin-startup-card"
          role={error && !loading ? "alert" : "status"}
        >
          <div className="login-brand-name">
            Sakin<span>.zo</span>
          </div>
          {loading && (
            <span className="admin-startup-spinner" aria-hidden="true" />
          )}
          <h1>
            {error && !loading
              ? "Couldn't open the admin console"
              : "Opening admin console"}
          </h1>
          <p>
            {error && !loading
              ? error
              : "Connecting securely and loading your workspace. This can take a moment if the server is starting."}
          </p>
          <div className="admin-startup-actions">
            {error && !loading && (
              <button
                type="button"
                className="btn primary"
                onClick={() => refresh()}
              >
                Try again
              </button>
            )}
            <button type="button" className="btn secondary" onClick={logout}>
              Sign out
            </button>
          </div>
        </div>
      </main>
    );
  const groups = navGroups
    .map(([label, keys]) => [label, keys.filter(canView)])
    .filter(([, keys]) => keys.length);
  const allowed = canView(section),
    matches = query.trim()
      ? Object.entries(data)
          .filter(([key, value]) => Array.isArray(value) && canView(key))
          .flatMap(([type, rows]) =>
            rows
              .filter((row) =>
                [
                  row.title,
                  row.name,
                  row.label,
                  row.email,
                  row.category,
                  row.desc,
                  row.employeeId,
                ]
                  .filter(Boolean)
                  .join(" ")
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .map((item) => ({ type, item })),
          )
          .slice(0, 8)
      : [];
  const openSearch = ({ type, item }) => {
    navigate(`/admin/${type === "contactOffices" ? "contactPage" : type}`);
    if (
      !["submissions", "approvals", "sections", "whatWeDoServices"].includes(
        type,
      )
    )
      setEditing({ type, item });
    setQuery("");
    setSearchOpen(false);
  };
  const render = () => {
    if (!allowed)
      return (
        <div className="empty" role="alert">
          You do not have access to this section.
        </div>
      );
    switch (section) {
      case "dashboard":
        return <Dashboard />;
      case "admins":
        return <Employees />;
      case "approvals":
        return <Approvals />;
      case "profile":
        return <Profile />;
      case "contactPage":
        return <ContactSettings />;
      case "sections":
        return <VisibilitySettings />;
      case "whatWeDoServices":
        return <VisibilitySettings services />;
      case "submissions":
        return <Submissions />;
      default:
        return [
          "projects",
          "blogs",
          "insights",
          "clients",
          "team",
          "testimonials",
          "stats",
          "mapLocations",
          "contactOffices",
        ].includes(section) ? (
          <ResourceList type={section} />
        ) : (
          <div className="empty">Section not found.</div>
        );
    }
  };
  return (
    <div className={`layout${collapsed ? " sidebar-collapsed" : ""}`} id="app">
      <aside className="sidebar">
        <div className="brand">
          <Link to="/" className="brand-name">
            Sakin<span>.zo</span>
          </Link>
          <small>ADMIN CONSOLE</small>
          <button
            type="button"
            className="btn secondary brand-close"
            aria-label="Close sidebar"
            onClick={() => setCollapsed(true)}
          >
            ✕
          </button>
        </div>
        <nav className="nav" id="nav" aria-label="Admin navigation">
          {groups.map(([label, keys]) => (
            <div className="nav-group" key={label}>
              <div className="nav-group-label">{label}</div>
              {keys.map((key) => (
                <NavLink
                  key={key}
                  to={`/admin/${key}`}
                  className={({ isActive }) =>
                    isActive || section === key ? "active" : ""
                  }
                  data-page={key}
                >
                  {labels[key]}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidefoot">
          <Link to="/" className="btn secondary">
            Preview Site ↗
          </Link>
          <button type="button" className="btn danger" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="topbar-title">
            <button
              className="btn secondary sidebar-toggle"
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => setCollapsed((value) => !value)}
            >
              ☰
            </button>
            <h2 id="pageTitle">{labels[section] || section}</h2>
          </div>
          <div className="topbar-actions">
            <div className="global-search" ref={search}>
              <input
                id="globalSearch"
                aria-label="Search admin content"
                type="search"
                autoComplete="off"
                value={query}
                placeholder="Search anything…"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setSearchOpen(false);
                  if (event.key === "Enter" && matches[0]) {
                    event.preventDefault();
                    openSearch(matches[0]);
                  }
                }}
              />
              {searchOpen && query && (
                <div className="search-results open" id="searchResults">
                  {matches.length ? (
                    matches.map(({ type, item }) => (
                      <button
                        type="button"
                        key={`${type}-${item._id}`}
                        onClick={() => openSearch({ type, item })}
                      >
                        <strong>{item.title || item.name || item.label}</strong>
                        <small>{labels[type]}</small>
                      </button>
                    ))
                  ) : (
                    <p>No matching content.</p>
                  )}
                </div>
              )}
            </div>
            <button
              className="btn secondary theme-toggle"
              id="themeToggle"
              type="button"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              onClick={() =>
                setTheme((value) => (value === "dark" ? "light" : "dark"))
              }
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
            <div className="topbar-user" id="topbarUser">
              <Avatar user={user} className="topbar-avatar" />
              <div>
                <strong>{user.name}</strong>
                <span>
                  {user.email} · {user.role}
                </span>
              </div>
            </div>
            <span className="sync-status" id="syncStatus">
              ●{" "}
              {synced
                ? `Live · ${synced.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}`
                : "Connecting…"}
            </span>
            {pwa.available && (
              <button
                type="button"
                className="btn secondary install-app-btn"
                id="adminInstallButton"
                onClick={pwa.install}
              >
                Install app
              </button>
            )}
            <button
              type="button"
              className="btn green"
              onClick={() => refresh()}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </header>
        <div className="content" id="pages">
          {error && (
            <div role="alert" className="form-error">
              {error}
              <button
                type="button"
                className="btn secondary"
                onClick={() => refresh()}
              >
                Retry
              </button>
            </div>
          )}
          {render()}
        </div>
      </main>
      <nav
        className="bottom-nav"
        id="bottomNav"
        aria-label="Mobile admin navigation"
      >
        {["dashboard", "projects", "blogs", "contactPage"]
          .filter(canView)
          .map((key) => (
            <NavLink
              key={key}
              to={`/admin/${key}`}
              data-page={key}
              className={section === key ? "active" : ""}
            >
              <span aria-hidden="true">
                {
                  {
                    dashboard: "⌂",
                    projects: "▣",
                    blogs: "▤",
                    contactPage: "✉",
                  }[key]
                }
              </span>
              {key === "dashboard"
                ? "Home"
                : key === "contactPage"
                  ? "Contact"
                  : labels[key]}
            </NavLink>
          ))}
        <button
          type="button"
          className={more ? "active" : ""}
          aria-expanded={more}
          onClick={() => setMore((value) => !value)}
        >
          ☰ More
        </button>
      </nav>
      {more && (
        <div className="mobile-more-panel open" id="mobileMorePanel">
          {groups
            .flatMap(([, keys]) => keys)
            .map((key) => (
              <Link key={key} to={`/admin/${key}`}>
                {labels[key]}
              </Link>
            ))}
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      )}
      <ResourceEditor />
      <ConfirmDialog />
      {notice && (
        <div className="notif show" id="notif" role="status">
          {notice}
        </div>
      )}
    </div>
  );
}
