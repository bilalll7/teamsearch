import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Action,
  Brand,
  Empty,
  Feedback,
  Icon,
  Loading,
  PageHead,
  Status,
  errorMessage,
} from "../components/workspace";
import api from "../lib/api";
import type { Application, Opportunity, Profile, Team } from "../lib/models";

function useRemote<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api
      .get<T>(url)
      .then((r) => {
        if (active) setData(r.data);
      })
      .catch((e) => {
        if (active) setError(errorMessage(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [url, version]);
  return { data, error, loading, reload: () => setVersion((v) => v + 1) };
}
export function OpportunityCard({
  opportunity: o,
}: {
  opportunity: Opportunity;
}) {
  const skills = [
    ...new Set(
      o.positions.flatMap((p) =>
        p.skillRequirements.map((r) => r.skill?.nama).filter(Boolean),
      ),
    ),
  ];
  return (
    <article className="opportunity-card">
      <div className="card-top">
        <span className={`project-icon ${o.jenis}`}>
          {o.judul.charAt(0).toUpperCase()}
        </span>
        <Status value={o.status} />
      </div>
      <h3>
        <Link to={`/opportunities/${o.id}`}>{o.judul}</Link>
      </h3>
      <p className="description">{o.deskripsi}</p>
      <div className="tags">
        <span className="tag">
          {o.jenis === "lomba" ? "Kompetisi" : "Proyek"}
        </span>
        <span className="tag">{o.mode}</span>
        {skills.slice(0, 2).map((s) => (
          <span className="tag" key={s}>
            {s}
          </span>
        ))}
      </div>
      <p className="card-meta">
        {o.positions.length} posisi · {o.kategori}
      </p>
      <div className="card-footer">
        <span>{o.owner.profile?.namaTampilan || "Anggota TeamSearch"}</span>
        <Link className="text-link" to={`/opportunities/${o.id}`}>
          Lihat peluang <Icon name="arrow" size={14} />
        </Link>
      </div>
    </article>
  );
}
export function OverviewPage() {
  const profile = useRemote<Profile>("/profile/me");
  const opportunities = useRemote<Opportunity[]>("/opportunities?status=open");
  const applications = useRemote<Application[]>(
    "/opportunities/applications/me",
  );
  const teams = useRemote<Team[]>("/opportunities/teams/me");
  const checks = [
    !!profile.data?.bio && !!profile.data?.programStudi,
    !!profile.data?.userSkills.length,
    !!profile.data?.portfolioLinks.length,
  ];
  const progress = Math.round((checks.filter(Boolean).length / 3) * 100);
  const error =
    profile.error || opportunities.error || applications.error || teams.error;
  return (
    <>
      <PageHead
        eyebrow="RUANG KOLABORASIMU"
        title={`Halo, ${profile.data?.namaTampilan || "teman"} 👋`}
        description="Satu langkah lebih dekat ke kolaborasi berikutnya."
      >
        <Action to="/opportunities/create">
          <Icon name="plus" size={17} />
          Buat peluang
        </Action>
      </PageHead>
      <Feedback error={error} />
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">GREAT THINGS START WITH A TEAM</p>
          <h2>
            Keahlianmu punya tempat.
            <br />
            Temukan tim yang tepat.
          </h2>
          <p>
            Jelajahi proyek dan kompetisi, bertemu rekan baru, lalu wujudkan ide
            bersama.
          </p>
          <Action to="/opportunities">
            Jelajahi peluang <Icon name="arrow" size={16} />
          </Action>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <span>
            <Icon name="users" size={32} />
          </span>
          <i className="orbit-dot one">✦</i>
          <i className="orbit-dot two">↗</i>
          <i className="orbit-dot three">⌘</i>
        </div>
      </section>
      <div className="stats-grid">
        {[
          ["search", opportunities.data?.length, "Peluang terbuka"],
          [
            "file",
            applications.data?.filter((a) =>
              ["pending", "shortlisted"].includes(a.status),
            ).length,
            "Lamaran aktif",
          ],
          ["users", teams.data?.length, "Tim & rekrutmen"],
        ].map(([icon, count, label]) => (
          <div className="stat-card" key={String(icon)}>
            <span className="stat-icon">
              <Icon name={String(icon)} />
            </span>
            <div>
              <strong>{count ?? "—"}</strong>
              <small>{label}</small>
            </div>
          </div>
        ))}
      </div>
      <div className="content-columns">
        <section>
          <div className="panel-title">
            <div>
              <h2>Peluang terbaru</h2>
              <p className="muted">Temukan tantangan berikutnya untukmu.</p>
            </div>
            <Link className="text-link" to="/opportunities">
              Lihat semua <Icon name="arrow" size={15} />
            </Link>
          </div>
          {opportunities.loading ? (
            <Loading />
          ) : opportunities.data?.length ? (
            <div
              className="opportunity-grid"
              style={{
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(240px,100%),1fr))",
              }}
            >
              {opportunities.data.slice(0, 4).map((o) => (
                <OpportunityCard key={o.id} opportunity={o} />
              ))}
            </div>
          ) : (
            <Empty
              title="Ruang untuk ide pertamamu"
              text="Belum ada peluang terbuka. Mulai kolaborasi dengan membuat peluang baru."
            >
              <Action to="/opportunities/create">Buat peluang</Action>
            </Empty>
          )}
        </section>
        <aside className="stack">
          <section className="panel">
            <div className="panel-title">
              <h3>Siap berkolaborasi?</h3>
              <span className="text-link">{progress}%</span>
            </div>
            <p className="muted" style={{ fontSize: 12 }}>
              Bantu calon rekan mengenal keahlian dan karya terbaikmu.
            </p>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Kelengkapan profil"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${progress}%` }} />
            </div>
            <div className="checklist">
              {[
                ["/profile", "Lengkapi profil"],
                ["/profile/skills", "Tambahkan keahlian"],
                ["/profile/portfolio", "Tampilkan portofolio"],
              ].map(([to, label], i) => (
                <Link key={to} to={to}>
                  <span className={`check-dot ${checks[i] ? "done" : ""}`}>
                    {checks[i] ? <Icon name="check" size={12} /> : i + 1}
                  </span>
                  {label}
                </Link>
              ))}
            </div>
            <Action to="/profile" secondary>
              Kelola profil <Icon name="arrow" size={14} />
            </Action>
          </section>
          <section className="panel">
            <p className="eyebrow">LANGKAH BERIKUTNYA</p>
            <h3>Pantau perjalananmu</h3>
            <p
              className="muted"
              style={{ fontSize: 12, margin: "10px 0 18px" }}
            >
              Semua status lamaran dan kabar penerimaan ada di satu tempat.
            </p>
            <Link className="text-link" to="/applications">
              Buka lamaran saya <Icon name="arrow" size={14} />
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}
export function ExplorePage() {
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("");
  const [mode, setMode] = useState("");
  const { data, loading, error, reload } = useRemote<Opportunity[]>(
    "/opportunities?status=open",
  );
  const visible =
    data?.filter(
      (o) =>
        (!kind || o.jenis === kind) &&
        (!mode || o.mode === mode) &&
        `${o.judul} ${o.deskripsi} ${o.kategori} ${o.positions.flatMap((p) => p.skillRequirements.map((r) => r.skill?.nama)).join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    ) || [];
  return (
    <>
      <PageHead
        eyebrow="TEMUKAN KOLABORASI BERIKUTNYA"
        title="Peluang besar, dimulai bersama."
        description="Proyek dan kompetisi yang membutuhkan keahlian sepertimu."
      >
        <Action to="/opportunities/create">
          <Icon name="plus" size={17} />
          Buat peluang
        </Action>
      </PageHead>
      <div className="filter-bar">
        <div className="search-field">
          <Icon name="search" size={18} />
          <input
            aria-label="Cari peluang atau keahlian"
            className="field"
            placeholder="Cari proyek, kompetisi, atau keahlian…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="field"
          aria-label="Jenis peluang"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option value="">Semua jenis</option>
          <option value="proyek">Proyek</option>
          <option value="lomba">Kompetisi</option>
        </select>
        <select
          className="field"
          aria-label="Mode kolaborasi"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="">Semua mode</option>
          {["online", "offline", "hybrid"].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
      <Feedback error={error} />
      {error && (
        <button className="action secondary" onClick={reload}>
          Coba lagi
        </button>
      )}
      {loading ? (
        <Loading />
      ) : (
        !error && (
          <>
            <div className="panel-title">
              <p className="muted">{visible.length} peluang untuk dijelajahi</p>
              <span className="muted" style={{ fontSize: 11 }}>
                Terbaru lebih dulu
              </span>
            </div>
            {visible.length ? (
              <div className="opportunity-grid">
                {visible.map((o) => (
                  <OpportunityCard key={o.id} opportunity={o} />
                ))}
              </div>
            ) : (
              <Empty
                title="Belum menemukan yang cocok?"
                text="Coba kata kunci lain atau mulai peluangmu sendiri."
              >
                <button
                  className="action secondary"
                  onClick={() => {
                    setSearch("");
                    setKind("");
                    setMode("");
                  }}
                >
                  Reset pencarian
                </button>
              </Empty>
            )}
          </>
        )
      )}
    </>
  );
}
export function ApplicationsPage() {
  const { data, loading, error, reload } = useRemote<Application[]>(
    "/opportunities/applications/me",
  );
  const [tab, setTab] = useState("all");
  const [busy, setBusy] = useState("");
  const [failure, setFailure] = useState("");
  const [confirm, setConfirm] = useState("");
  const withdraw = async (id: string) => {
    setBusy(id);
    setFailure("");
    try {
      await api.patch(`/opportunities/applications/${id}`, {
        status: "withdrawn",
      });
      setConfirm("");
      reload();
    } catch (e) {
      setFailure(errorMessage(e));
    } finally {
      setBusy("");
    }
  };
  const visible =
    data?.filter(
      (a) =>
        tab === "all" ||
        (tab === "active"
          ? ["pending", "shortlisted"].includes(a.status)
          : a.status === tab),
    ) || [];
  return (
    <>
      <PageHead
        title="Setiap langkah, tercatat."
        eyebrow="LAMARAN SAYA"
        description="Pantau lamaranmu, dari perkenalan pertama sampai menjadi bagian tim."
      >
        <Action to="/opportunities" secondary>
          Temukan peluang <Icon name="arrow" size={16} />
        </Action>
      </PageHead>
      <div className="tabs-row" aria-label="Filter lamaran">
        {[
          ["all", "Semua"],
          ["active", "Aktif"],
          ["accepted", "Diterima"],
          ["rejected", "Belum cocok"],
          ["withdrawn", "Ditarik"],
        ].map(([key, label]) => (
          <button
            aria-pressed={tab === key}
            className={`tab-button ${tab === key ? "active" : ""}`}
            key={key}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <Feedback error={error || failure} />
      {loading ? (
        <Loading />
      ) : visible.length ? (
        <section className="panel">
          {visible.map((a) => (
            <article key={a.id} className="application-row">
              <div>
                <Status value={a.status} />
                <h3 style={{ marginTop: 9 }}>
                  <Link to={`/opportunities/${a.position.opportunity.id}`}>
                    {a.position.opportunity.judul}
                  </Link>
                </h3>
                <p>
                  {a.position.nama} · Dikirim{" "}
                  {new Date(a.createdAt).toLocaleDateString("id-ID")}
                </p>
                {a.pesan && <p>“{a.pesan}”</p>}
                {a.status === "accepted" && (
                  <Link className="text-link" to="/teams">
                    Lihat tim kamu →
                  </Link>
                )}
              </div>
              <div className="row-actions">
                {["pending", "shortlisted"].includes(a.status) &&
                  (confirm === a.id ? (
                    <>
                      <span className="muted" style={{ fontSize: 11 }}>
                        Tarik lamaran ini?
                      </span>
                      <button
                        disabled={!!busy}
                        className="action danger"
                        onClick={() => withdraw(a.id)}
                      >
                        Ya, tarik
                      </button>
                      <button
                        disabled={!!busy}
                        className="action secondary"
                        onClick={() => setConfirm("")}
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <button
                      className="action secondary"
                      onClick={() => setConfirm(a.id)}
                    >
                      Tarik lamaran
                    </button>
                  ))}
              </div>
            </article>
          ))}
        </section>
      ) : (
        !error && (
          <Empty
            title="Perjalananmu dimulai di sini"
            text="Lamaran sesuai filter ini akan muncul setelah kamu melamar sebuah posisi."
          >
            <Action to="/opportunities">Jelajahi peluang</Action>
          </Empty>
        )
      )}
    </>
  );
}
export function TeamsPage() {
  const { data, loading, error, reload } = useRemote<Team[]>(
    "/opportunities/teams/me",
  );
  const profile = useRemote<Profile>("/profile/me");
  return (
    <>
      <PageHead
        eyebrow="TIM & REKRUTMEN"
        title="Tempat ide menjadi nyata."
        description="Kelola peluang yang kamu buat dan tim yang sudah kamu ikuti."
      >
        <Action to="/opportunities/create">
          <Icon name="plus" size={16} />
          Buat peluang
        </Action>
      </PageHead>
      <Feedback error={error || profile.error} />
      {error && (
        <button className="action secondary" onClick={reload}>
          Coba lagi
        </button>
      )}
      {loading ? (
        <Loading />
      ) : data?.length ? (
        <div className="opportunity-grid">
          {data.map((team) => {
            const owner = team.ownerId === profile.data?.userId;
            return (
              <article key={team.id} className="panel">
                <div className="card-top">
                  <span className="project-icon">
                    <Icon name="users" />
                  </span>
                  <Status value={team.status} />
                </div>
                <h3 style={{ margin: "18px 0 7px" }}>{team.judul}</h3>
                <span className="tag">
                  {owner ? "Pemilik peluang" : "Anggota tim"}
                </span>
                <div className="member-row">
                  <span className="avatar">
                    {team.owner.profile.namaTampilan.charAt(0)}
                  </span>
                  <div>
                    {team.owner.profile.namaTampilan}
                    <small>Pemilik</small>
                  </div>
                </div>
                {team.teamMembers.map((m) => (
                  <div className="member-row" key={m.id}>
                    <span className="avatar">{m.namaTampilan.charAt(0)}</span>
                    <div>
                      {m.namaTampilan}
                      <small>{m.peran}</small>
                    </div>
                  </div>
                ))}
                <p className="card-meta">
                  {team.teamMembers.length + 1} orang · {team.positions.length}{" "}
                  posisi
                </p>
                <Action
                  to={`/opportunities/${team.id}${owner ? "/manage" : ""}`}
                  secondary
                >
                  {owner ? "Kelola rekrutmen" : "Lihat peluang"}
                  <Icon name="arrow" size={15} />
                </Action>
              </article>
            );
          })}
        </div>
      ) : (
        !error && (
          <Empty
            title="Tim hebat dimulai dari satu orang"
            text="Buat peluang untuk mencari rekan, atau bergabung lewat lamaran yang diterima."
          >
            <Action to="/opportunities/create">Mulai rekrutmen</Action>
          </Empty>
        )
      )}
    </>
  );
}
export function WelcomePage() {
  const signedIn = !!localStorage.getItem("accessToken");
  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const targetId = event.currentTarget.getAttribute("href")?.slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <>
      <header className="public-header">
        <div className="public-header-inner">
          <Brand />
          <nav className="public-links" aria-label="Navigasi halaman utama">
            <a href="#cara-kerja" onClick={scrollToSection}>Cara kerja</a>
            <a href="#kenapa-teamsearch" onClick={scrollToSection}>
              Kenapa TeamSearch
            </a>
            <Link to="/opportunities">Jelajahi peluang</Link>
            <Action to={signedIn ? "/dashboard" : "/login"} secondary>
              {signedIn ? "Workspace" : "Masuk"}
            </Action>
            <Action to={signedIn ? "/opportunities/create" : "/register"}>
              {signedIn ? "Buat peluang" : "Mulai sekarang"}
              <Icon name="arrow" size={15} />
            </Action>
          </nav>
        </div>
      </header>
      <main className="landing-main">
        <section className="landing-hero" aria-labelledby="landing-title">
          <div>
            <p className="eyebrow">KOMUNITAS KOLABORASI MAHASISWA</p>
            <h1 id="landing-title">
              Ide besarmu.
              <br />
              Tim yang tepat.
              <br />
              <em>Mulai bersama.</em>
            </h1>
            <p className="muted">
              Temukan rekan dengan keahlian yang saling melengkapi. Dari proyek
              pertama sampai kompetisi berikutnya, semuanya dimulai dari
              koneksi.
            </p>
            <div className="row-actions">
              <Action to={signedIn ? "/dashboard" : "/register"}>
                Temukan timmu <Icon name="arrow" size={17} />
              </Action>
              <Action to="/opportunities" secondary>
                Jelajahi peluang
              </Action>
            </div>
            <p className="landing-proof">
              <span>
                <Icon name="check" size={14} /> Profil berbasis keahlian
              </span>
              <span>
                <Icon name="check" size={14} /> Tim yang saling melengkapi
              </span>
            </p>
          </div>
          <div
            className="landing-visual"
            aria-label="Ilustrasi alur kolaborasi"
          >
            <div className="panel">
              <div className="card-top">
                <span className="project-icon">
                  <Icon name="spark" />
                </span>
                <span className="tag">Dari ide menjadi karya</span>
              </div>
              <h2 style={{ margin: "20px 0 10px" }}>
                Satu visi.
                <br />
                Beragam keahlian.
              </h2>
              <p className="muted" style={{ fontSize: 12 }}>
                Ruang untuk setiap peran dalam timmu.
              </p>
              {[
                ["D", "Desainer", "Membentuk pengalaman"],
                ["F", "Frontend developer", "Menghidupkan ide"],
                ["B", "Backend developer", "Membangun fondasi"],
              ].map(([i, n, d]) => (
                <div key={i} className="member-row">
                  <span className="avatar">{i}</span>
                  <div>
                    <strong>{n}</strong>
                    <small>{d}</small>
                  </div>
                  <span style={{ marginLeft: "auto", color: "#238161" }}>
                    <Icon name="check" size={16} />
                  </span>
                </div>
              ))}
              <div className="progress-track">
                <span style={{ width: "80%" }} />
              </div>
              <span className="muted" style={{ fontSize: 10 }}>
                Contoh komposisi tim yang beragam.
              </span>
            </div>
          </div>
        </section>
        <section
          id="kenapa-teamsearch"
          className="landing-features"
          aria-labelledby="features-title"
        >
          <div className="landing-section-heading">
            <p className="eyebrow">RUANG KOLABORASI YANG LEBIH TERARAH</p>
            <h2 id="features-title">
              Cari rekan berdasarkan hal yang bisa kalian bangun bersama.
            </h2>
            <p className="muted">
              Temukan peluang dan orang yang selaras dengan keterampilan, minat,
              dan tujuan tim.
            </p>
          </div>
          <div className="landing-feature-grid">
            {[
              [
                "01",
                "Keahlian yang terlihat",
                "Susun profil keahlian dan portofolio supaya rekan tim tahu kontribusi yang kamu bawa.",
              ],
              [
                "02",
                "Peluang lebih terarah",
                "Jelajahi posisi di proyek dan kompetisi berdasarkan kebutuhan tim yang dijelaskan dengan jelas.",
              ],
              [
                "03",
                "Perjalanan yang transparan",
                "Kirim perkenalan, lihat perkembangan lamaran, dan ketahui kapan kamu bergabung dengan tim.",
              ],
            ].map(([n, title, text]) => (
              <article className="landing-feature panel" key={n}>
                <span className="feature-number">{n}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="feature-symbol" aria-hidden="true">
                  {n === "01" ? "✳" : n === "02" ? "↗" : "◎"}
                </span>
              </article>
            ))}
          </div>
        </section>
        <section
          id="cara-kerja"
          className="landing-steps-section"
          aria-labelledby="steps-title"
        >
          <div className="landing-section-heading">
            <p className="eyebrow">TIGA LANGKAH UNTUK MULAI</p>
            <h2 id="steps-title">Dari “aku punya ide” jadi “kita berhasil”.</h2>
          </div>
          <div className="landing-steps">
            {[
              [
                "01",
                "Tunjukkan siapa kamu",
                "Lengkapi profil, pilih keahlian, dan bagikan karya yang kamu banggakan.",
              ],
              [
                "02",
                "Temukan yang sejalan",
                "Jelajahi posisi dalam proyek dan kompetisi sesuai minatmu.",
              ],
              [
                "03",
                "Bangun sesuatu bersama",
                "Kirim lamaran, pantau status, dan bergabung dengan tim barumu.",
              ],
            ].map(([n, t, d]) => (
              <div key={n} className="panel">
                <span className="step-number">{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="landing-callout">
          <div className="landing-callout-art" aria-hidden="true">
            <span>R</span>
            <span>D</span>
            <span>P</span>
            <span>✦</span>
          </div>
          <div>
            <p className="eyebrow">SETIAP PERAN PUNYA ARTI</p>
            <h2>Jangan bangun semuanya sendirian.</h2>
            <p>
              Temukan desainer, developer, peneliti, dan penggerak yang punya
              tujuan serupa. Mulai dari proyek kecil, tumbuh sebagai tim.
            </p>
            <Action to={signedIn ? "/opportunities" : "/register"}>
              Temukan rekanmu <Icon name="arrow" size={16} />
            </Action>
          </div>
        </section>
        <section className="landing-faq" aria-labelledby="faq-title">
          <div className="landing-section-heading">
            <p className="eyebrow">MULAI DENGAN YAKIN</p>
            <h2 id="faq-title">Yang sering ditanyakan.</h2>
          </div>
          <div className="landing-faq-list">
            <details>
              <summary>Bagaimana cara melamar ke peluang?</summary>
              <p>
                Buka peluang yang menarik, pilih posisi yang tersedia, tulis
                perkenalan singkat bila perlu, lalu tekan “Kirim lamaran”.
                Perkembangannya bisa dipantau di menu Lamaran Saya.
              </p>
            </details>
            <details>
              <summary>Apakah saya harus punya tim sebelum mendaftar?</summary>
              <p>
                Tidak. Kamu dapat mendaftar untuk satu posisi yang tersedia.
                Pemilik peluang akan meninjau lamaran sebelum mengundangmu
                bergabung.
              </p>
            </details>
            <details>
              <summary>Bagaimana caranya mencari rekan untuk ide saya?</summary>
              <p>
                Buat peluang, ceritakan tujuan proyek, tambahkan posisi dan
                keahlian yang dicari, lalu tinjau lamaran di halaman Tim &
                Rekrutmen.
              </p>
            </details>
          </div>
        </section>
        <section className="landing-final-cta">
          <p className="eyebrow">LANGKAH BESARMU BISA DIMULAI HARI INI</p>
          <h2>Temukan orang yang tepat untuk membuat sesuatu yang berarti.</h2>
          <p>Lengkapi keahlianmu. Jelajahi peluang. Mulai bersama.</p>
          <div className="row-actions">
            <Action to={signedIn ? "/dashboard" : "/register"}>
              Mulai perjalananmu <Icon name="arrow" size={16} />
            </Action>
            <Action to="/opportunities" secondary>
              Lihat peluang terbuka
            </Action>
          </div>
        </section>
      </main>
      <footer className="workspace-footer landing-footer">
        <span>TeamSearch · Ruang untuk tumbuh bersama.</span>
        <Link to="/register">Mulai perjalananmu →</Link>
      </footer>
    </>
  );
}
