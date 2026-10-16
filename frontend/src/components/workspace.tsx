import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import type { ReactNode } from "react";
import { useTheme } from "../contexts/ThemeContext";
import api, { logout } from "../lib/api";

export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="7" />
        <path d="m16 16 5 5" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v3" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H5v20h14V7zM14 2v5h5M8 12h8M8 16h6" />
      </>
    ),
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 22v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1" />
      </>
    ),
    out: (
      <>
        <path d="M9 4H3v16h6m5-14 6 6-6 6M8 12h12" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.grid}
    </svg>
  );
}

export function Brand() {
  return (
    <Link className="brand" to="/">
      <span className="brand-mark">
        <Icon name="users" />
      </span>
      team<span>search</span>
      <span className="brand-dot">.</span>
    </Link>
  );
}
export function Action({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link to={to} className={`action ${secondary ? "secondary" : ""}`}>
      {children}
    </Link>
  );
}
export function PageHead({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-head">
      <div>
        <p className="eyebrow">{eyebrow || "WORKSPACE / TEAMSEARCH"}</p>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
      </div>
      <div className="head-actions">{children}</div>
    </header>
  );
}
export function Empty({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name="spark" size={28} />
      </span>
      <h3>{title}</h3>
      <p className="muted">{text}</p>
      {children}
    </div>
  );
}
export function Feedback({
  error,
  success,
}: {
  error?: string;
  success?: string;
}) {
  return error || success ? (
    <div
      role={error ? "alert" : "status"}
      className={`feedback ${error ? "error" : "success"}`}
    >
      {error || success}
    </div>
  ) : null;
}
export function Loading() {
  return (
    <div role="status" aria-label="Memuat data" className="skeleton-grid">
      {[1, 2, 3].map((i) => (
        <div className="skeleton-card" key={i} />
      ))}
    </div>
  );
}
export const statusLabels: Record<string, string> = {
  pending: "Menunggu ulasan",
  shortlisted: "Dipertimbangkan",
  accepted: "Diterima",
  rejected: "Belum cocok",
  withdrawn: "Ditarik",
  open: "Rekrutmen dibuka",
  closed: "Ditutup",
  expired: "Berakhir",
  draft: "Draf",
};
export function Status({ value }: { value: string }) {
  return (
    <span className={`status status-${value}`}>
      <i />
      {statusLabels[value] || value}
    </span>
  );
}
export function errorMessage(error: unknown) {
  const message = (
    error as { response?: { data?: { message?: string | string[] } } }
  )?.response?.data?.message;
  return Array.isArray(message)
    ? message.join(", ")
    : message || "Tidak dapat terhubung. Coba lagi sebentar.";
}

const links = [
  ["/dashboard", "grid", "Ringkasan"],
  ["/opportunities", "search", "Jelajahi peluang"],
  ["/applications", "file", "Lamaran saya"],
  ["/teams", "users", "Tim & rekrutmen"],
  ["/profile", "user", "Profil saya"],
];
export function Workspace() {
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState("Mahasiswa");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    api
      .get("/profile/me")
      .then((r) => {
        if (active) setName(r.data.namaTampilan);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [location.pathname]);
  const signOut = async () => {
    setBusy(true);
    setError("");
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="workspace">
      <a className="skip-link" href="#workspace-content">
        Lewati navigasi
      </a>
      <aside className="sidebar">
        <Brand />
        <p className="nav-caption">RUANG KOLABORASI</p>
        <nav aria-label="Navigasi utama">
          {links.map(([to, icon, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon name={icon} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-prompt">
          <span className="eyebrow">PUNYA IDE BESAR?</span>
          <h3>Mulai dari tim yang tepat.</h3>
          <p>Temukan orang yang melengkapi keahlianmu.</p>
          <Action to="/opportunities/create">
            <Icon name="plus" size={16} />
            Buat peluang
          </Action>
        </div>
        <div className="sidebar-bottom">
          <button onClick={toggleTheme} className="nav-item">
            <Icon name="sun" />
            {theme === "light" ? "Mode gelap" : "Mode terang"}
          </button>
          <button onClick={signOut} disabled={busy} className="nav-item">
            <Icon name="out" />
            {busy ? "Keluar…" : "Keluar akun"}
          </button>
          <Feedback error={error} />
        </div>
      </aside>
      <div className="workspace-body">
        <div className="workspace-topbar">
          <span className="topbar-context">
            Ruang untuk ide. Orang untuk mewujudkannya.
          </span>
          <div className="mobile-theme">
            <button
              className="icon-button"
              aria-label="Ganti tema"
              onClick={toggleTheme}
            >
              <Icon name="sun" size={17} />
            </button>
            <button
              className="icon-button"
              aria-label="Keluar akun"
              disabled={busy}
              onClick={signOut}
            >
              <Icon name="out" size={17} />
            </button>
          </div>
          <Link to="/profile" className="account-chip">
            <span className="avatar">{name.charAt(0).toUpperCase()}</span>
            <span>
              {name}
              <small>Member TeamSearch</small>
            </span>
          </Link>
        </div>
        <main id="workspace-content" className="workspace-content">
          <Feedback error={error} />
          <Outlet />
        </main>
        <footer className="workspace-footer">
          <span>TeamSearch · Dibangun untuk kolaborasi.</span>
          <span>Ide bagus tumbuh bersama.</span>
        </footer>
      </div>
    </div>
  );
}
