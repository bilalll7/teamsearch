import type { ReactNode } from "react";
import { Brand, Icon } from "./workspace";
export function AuthLayout({
  children,
  title,
  description,
  type,
}: {
  children: ReactNode;
  title: string;
  description: string;
  type: "login" | "register";
}) {
  return (
    <div className="auth-shell">
      <aside className="auth-story">
        <Brand />
        <div>
          <p className="eyebrow" style={{ color: "#bcb3ff" }}>
            KOLABORASI DIMULAI DARI SINI
          </p>
          <h2>
            Keahlian berbeda.
            <br />
            Satu tujuan
            <br />
            yang sama.
          </h2>
          <p>
            Temukan orang yang melengkapi idemu. Bangun sesuatu yang berarti,
            bersama.
          </p>
          <div className="hero-orbit" aria-hidden="true">
            <span>
              <Icon name="users" size={32} />
            </span>
            <i className="orbit-dot one">✦</i>
            <i className="orbit-dot two">↗</i>
            <i className="orbit-dot three">⌘</i>
          </div>
        </div>
        <small style={{ color: "#a69ebf" }}>
          TeamSearch · Ruang untuk tumbuh bersama.
        </small>
      </aside>
      <main className="auth-form">
        <div className="auth-form-inner">
          <div className="auth-mobile-brand">
            <Brand />
          </div>
          <p className="eyebrow">
            {type === "login"
              ? "SELAMAT DATANG KEMBALI"
              : "LANGKAH PERTAMA MENUJU TIMMU"}
          </p>
          <h1>{title}</h1>
          <p className="muted">{description}</p>
          {children}
          <p
            className="field-note"
            style={{ marginTop: 26, textAlign: "center" }}
          >
            Gunakan email kampus yang terdaftar untuk memulai.
          </p>
        </div>
      </main>
    </div>
  );
}
