import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Action,
  Empty,
  Feedback,
  Icon,
  Loading,
  PageHead,
  errorMessage,
} from "../components/workspace";
import api from "../lib/api";
import type { Profile, ProfileEducation, ProfileExperience, Skill } from "../lib/models";

export default function ProfileWorkspacePage() {
  const location = useLocation();
  const tab = location.pathname.endsWith("/skills")
    ? "skills"
    : location.pathname.endsWith("/portfolio")
      ? "portfolio"
      : "profile";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState({
    namaTampilan: "",
    bio: "",
    programStudi: "",
    angkatan: "",
    headline: "",
    lokasi: "",
    avatarUrl: "",
    resumeUrl: "",
    ketersediaan: true,
  });
  const [pengalaman, setPengalaman] = useState<ProfileExperience[]>([]);
  const [pendidikan, setPendidikan] = useState<ProfileEducation[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [level, setLevel] = useState(1);
  const [portfolio, setPortfolio] = useState({
    label: "",
    url: "",
    tipe: "github",
  });
  const [editing, setEditing] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([api.get<Profile>("/profile/me"), api.get<Skill[]>("/skills")])
      .then(([p, s]) => {
        if (active) {
          setProfile(p.data);
          setForm({
            namaTampilan: p.data.namaTampilan,
            bio: p.data.bio || "",
            programStudi: p.data.programStudi || "",
            angkatan: p.data.angkatan || "",
            headline: p.data.headline || "",
            lokasi: p.data.lokasi || "",
            avatarUrl: p.data.avatarUrl || "",
            resumeUrl: p.data.resumeUrl || "",
            ketersediaan: p.data.ketersediaan,
          });
          setPengalaman(p.data.pengalaman || []);
          setPendidikan(p.data.pendidikan || []);
          setSkills(s.data);
        }
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
  }, [version]);
  useEffect(() => {
    setError("");
    setSuccess("");
    setConfirm("");
  }, [tab]);
  const mutate = async (
    operation: () => Promise<unknown>,
    message: string,
    done?: () => void,
  ) => {
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await operation();
      done?.();
      setConfirm("");
      setSuccess(message);
      setVersion((v) => v + 1);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  const checks = [
    !!profile?.bio && !!profile?.programStudi,
    !!profile?.userSkills.length,
    !!profile?.portfolioLinks.length,
  ];
  const progress = Math.round((checks.filter(Boolean).length / 3) * 100);
  const catalog = skills.filter(
    (s) =>
      !profile?.userSkills.some((u) => u.skillId === s.id) &&
      s.nama.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHead
        eyebrow="PROFIL SAYA"
        title="Kenalkan versi terbaikmu."
        description="Keahlian, cerita, dan karya yang membuatmu menjadi rekan yang tepat."
      >
        <Action to="/opportunities" secondary>
          Temukan peluang <Icon name="arrow" size={15} />
        </Action>
      </PageHead>
      <div className="tabs-row">
        {[
          ["/profile", "Tentang saya"],
          ["/profile/skills", "Keahlian"],
          ["/profile/portfolio", "Portofolio"],
        ].map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `tab-button ${isActive ? "active" : ""}`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
      <Feedback error={error} success={success} />
      {loading ? (
        <Loading />
      ) : profile ? (
        <div className="content-columns">
          <section className="panel">
            {tab === "profile" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  mutate(
                    () =>
                      api.patch("/profile/me", {
                        ...form,
                        namaTampilan: form.namaTampilan.trim(),
                        avatarUrl: form.avatarUrl.trim() || undefined,
                        resumeUrl: form.resumeUrl.trim() || undefined,
                        pengalaman,
                        pendidikan,
                      }),
                    "Profil berhasil diperbarui.",
                  );
                }}
              >
                <div className="panel-title">
                  <div>
                    <h2>Cerita di balik keahlianmu</h2>
                    <p className="muted">
                      Bantu calon rekan mengenalmu lebih dekat.
                    </p>
                  </div>
                </div>
                <div className="form-grid">
                  <label className="full">
                    <span className="field-label">Nama tampilan *</span>
                    <input
                      className="field"
                      required
                      maxLength={100}
                      value={form.namaTampilan}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, namaTampilan: e.target.value }))
                      }
                    />
                  </label>
                  <label>
                    <span className="field-label">Headline profesional</span>
                    <input className="field" maxLength={160} placeholder="Frontend developer · UI enthusiast" value={form.headline} onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))} />
                  </label>
                  <label>
                    <span className="field-label">Lokasi</span>
                    <input className="field" maxLength={120} placeholder="Jakarta, Indonesia" value={form.lokasi} onChange={(e) => setForm((f) => ({ ...f, lokasi: e.target.value }))} />
                  </label>
                  <label className="full">
                    <span className="field-label">Foto profil (URL HTTPS)</span>
                    <input className="field" type="url" placeholder="https://.../foto.jpg" value={form.avatarUrl} onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))} />
                  </label>
                  <label className="full">
                    <span className="field-label">CV / profil lengkap (URL HTTPS)</span>
                    <input className="field" type="url" placeholder="https://.../cv.pdf" value={form.resumeUrl} onChange={(e) => setForm((f) => ({ ...f, resumeUrl: e.target.value }))} />
                    <span className="field-note">Unggah CV atau profil ke penyimpanan pilihanmu, lalu tempel tautannya di sini.</span>
                  </label>
                  <div className="full profile-history-editor">
                    <div className="panel-title"><div><h3>Pengalaman</h3><p className="muted">Tambahkan proyek, organisasi, atau pekerjaan.</p></div><button type="button" className="action secondary" onClick={() => setPengalaman((items) => [...items, { role: "", company: "", mulai: "", selesai: "", deskripsi: "" }])}>Tambah</button></div>
                    {pengalaman.map((item, index) => <div className="history-row" key={item.id || index}><input className="field" placeholder="Peran" value={item.role} onChange={(e) => setPengalaman((xs) => xs.map((x, i) => i === index ? { ...x, role: e.target.value } : x))} /><input className="field" placeholder="Organisasi / perusahaan" value={item.company} onChange={(e) => setPengalaman((xs) => xs.map((x, i) => i === index ? { ...x, company: e.target.value } : x))} /><input className="field" placeholder="2023" value={item.mulai || ""} onChange={(e) => setPengalaman((xs) => xs.map((x, i) => i === index ? { ...x, mulai: e.target.value } : x))} /><input className="field" placeholder="Sekarang" value={item.selesai || ""} onChange={(e) => setPengalaman((xs) => xs.map((x, i) => i === index ? { ...x, selesai: e.target.value } : x))} /><textarea className="field full" rows={2} placeholder="Ceritakan kontribusimu" value={item.deskripsi || ""} onChange={(e) => setPengalaman((xs) => xs.map((x, i) => i === index ? { ...x, deskripsi: e.target.value } : x))} /><button type="button" className="action danger" onClick={() => setPengalaman((xs) => xs.filter((_, i) => i !== index))}>Hapus</button></div>)}
                  </div>
                  <div className="full profile-history-editor">
                    <div className="panel-title"><div><h3>Pendidikan</h3><p className="muted">Tampilkan kampus, program studi, atau pendidikan lain.</p></div><button type="button" className="action secondary" onClick={() => setPendidikan((items) => [...items, { institusi: "", program: "", mulai: "", selesai: "", deskripsi: "" }])}>Tambah</button></div>
                    {pendidikan.map((item, index) => <div className="history-row" key={item.id || index}><input className="field" placeholder="Institusi" value={item.institusi} onChange={(e) => setPendidikan((xs) => xs.map((x, i) => i === index ? { ...x, institusi: e.target.value } : x))} /><input className="field" placeholder="Program studi" value={item.program} onChange={(e) => setPendidikan((xs) => xs.map((x, i) => i === index ? { ...x, program: e.target.value } : x))} /><input className="field" placeholder="2021" value={item.mulai || ""} onChange={(e) => setPendidikan((xs) => xs.map((x, i) => i === index ? { ...x, mulai: e.target.value } : x))} /><input className="field" placeholder="2025" value={item.selesai || ""} onChange={(e) => setPendidikan((xs) => xs.map((x, i) => i === index ? { ...x, selesai: e.target.value } : x))} /><textarea className="field full" rows={2} placeholder="Kegiatan atau pencapaian" value={item.deskripsi || ""} onChange={(e) => setPendidikan((xs) => xs.map((x, i) => i === index ? { ...x, deskripsi: e.target.value } : x))} /><button type="button" className="action danger" onClick={() => setPendidikan((xs) => xs.filter((_, i) => i !== index))}>Hapus</button></div>)}
                  </div>
                  <label className="full">
                    <span className="field-label">Tentang saya</span>
                    <textarea
                      className="field"
                      rows={4}
                      maxLength={300}
                      placeholder="Ceritakan minat, pengalaman, dan hal yang ingin kamu bangun."
                      value={form.bio}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, bio: e.target.value }))
                      }
                    />
                    <p className="field-note">{form.bio.length}/300 karakter</p>
                  </label>
                  <label>
                    <span className="field-label">Program studi</span>
                    <input
                      className="field"
                      maxLength={100}
                      placeholder="Teknik Informatika"
                      value={form.programStudi}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, programStudi: e.target.value }))
                      }
                    />
                  </label>
                  <label>
                    <span className="field-label">Angkatan</span>
                    <input
                      className="field"
                      maxLength={20}
                      placeholder="2024"
                      value={form.angkatan}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, angkatan: e.target.value }))
                      }
                    />
                  </label>
                  <label
                    className="full"
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      fontSize: 12,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.ketersediaan}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          ketersediaan: e.target.checked,
                        }))
                      }
                    />
                    Saya terbuka untuk kolaborasi baru
                  </label>
                </div>
                <div className="form-actions">
                  <span className="field-note">
                    Profil dapat diperbarui kapan saja.
                  </span>
                  <button className="action" disabled={busy}>
                    {busy ? "Menyimpan…" : "Simpan profil"}
                  </button>
                </div>
              </form>
            )}
            {tab === "skills" && (
              <>
                <div className="panel-title">
                  <div>
                    <h2>Keahlian yang kamu bawa</h2>
                    <p className="muted">
                      Pilih dari katalog dan tentukan level yang sesuai.
                    </p>
                  </div>
                  <span className="tag">{profile.userSkills.length}/20</span>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    mutate(
                      () =>
                        api.post("/skills/me", {
                          skillId: selectedSkill,
                          level,
                        }),
                      "Keahlian ditambahkan.",
                      () => {
                        setSelectedSkill("");
                        setSearch("");
                      },
                    );
                  }}
                >
                  <label className="field-label" htmlFor="skill-search">
                    Cari keahlian
                  </label>
                  <input
                    id="skill-search"
                    className="field"
                    placeholder="React, Figma, manajemen proyek…"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSelectedSkill("");
                    }}
                  />
                  <div className="requirement-row">
                    <select
                      className="field"
                      aria-label="Pilih keahlian"
                      required
                      value={selectedSkill}
                      onChange={(e) => setSelectedSkill(e.target.value)}
                    >
                      <option value="">
                        {catalog.length
                          ? "Pilih keahlian"
                          : "Tidak ada keahlian yang cocok"}
                      </option>
                      {catalog.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nama}
                        </option>
                      ))}
                    </select>
                    <select
                      className="field"
                      aria-label="Level keahlian baru"
                      value={level}
                      onChange={(e) => setLevel(Number(e.target.value))}
                    >
                      <option value={1}>Dasar</option>
                      <option value={2}>Menengah</option>
                      <option value={3}>Mahir</option>
                    </select>
                    <button
                      className="action"
                      disabled={
                        busy ||
                        !selectedSkill ||
                        profile.userSkills.length >= 20
                      }
                    >
                      Tambahkan
                    </button>
                  </div>
                </form>
                <div className="section-gap">
                  {profile.userSkills.length ? (
                    profile.userSkills.map((s) => (
                      <div className="application-row" key={s.id}>
                        <div>
                          <h3>{s.skill.nama}</h3>
                          <p>{s.skill.kategori?.nama}</p>
                        </div>
                        <div className="row-actions">
                          <select
                            className="field"
                            style={{ width: 130 }}
                            aria-label={`Level ${s.skill.nama}`}
                            value={s.level}
                            disabled={busy}
                            onChange={(e) =>
                              mutate(
                                () =>
                                  api.patch(`/skills/me/${s.id}`, {
                                    level: Number(e.target.value),
                                  }),
                                "Level keahlian diperbarui.",
                              )
                            }
                          >
                            <option value={1}>Dasar</option>
                            <option value={2}>Menengah</option>
                            <option value={3}>Mahir</option>
                          </select>
                          <button
                            className="icon-button"
                            aria-label={`Hapus ${s.skill.nama}`}
                            disabled={busy}
                            onClick={() =>
                              mutate(
                                () => api.delete(`/skills/me/${s.id}`),
                                "Keahlian dihapus.",
                              )
                            }
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Empty
                      title="Keahlian pertamamu menunggu"
                      text="Tambahkan keahlian agar kecocokanmu dengan posisi dapat dihitung."
                    />
                  )}
                </div>
              </>
            )}
            {tab === "portfolio" && (
              <>
                <div className="panel-title">
                  <div>
                    <h2>Biarkan karyamu bercerita</h2>
                    <p className="muted">
                      Bagikan tautan karya atau profil profesionalmu.
                    </p>
                  </div>
                </div>
                <form
                  className="form-grid"
                  onSubmit={(e) => {
                    e.preventDefault();
                    mutate(
                      () =>
                        editing
                          ? api.patch(
                              `/profile/me/portfolio/${editing}`,
                              portfolio,
                            )
                          : api.post("/profile/me/portfolio", portfolio),
                      "Portofolio disimpan.",
                      () => {
                        setPortfolio({ label: "", url: "", tipe: "github" });
                        setEditing("");
                      },
                    );
                  }}
                >
                  <label>
                    <span className="field-label">Judul *</span>
                    <input
                      className="field"
                      required
                      maxLength={50}
                      placeholder="Proyek pilihan saya"
                      value={portfolio.label}
                      onChange={(e) =>
                        setPortfolio((p) => ({ ...p, label: e.target.value }))
                      }
                    />
                  </label>
                  <label>
                    <span className="field-label">Platform</span>
                    <select
                      className="field"
                      value={portfolio.tipe}
                      onChange={(e) =>
                        setPortfolio((p) => ({ ...p, tipe: e.target.value }))
                      }
                    >
                      {["github", "linkedin", "behance", "lainnya"].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  <label className="full">
                    <span className="field-label">URL *</span>
                    <input
                      className="field"
                      required
                      type="url"
                      pattern="https://.*"
                      maxLength={500}
                      placeholder="https://github.com/username"
                      value={portfolio.url}
                      onChange={(e) =>
                        setPortfolio((p) => ({ ...p, url: e.target.value }))
                      }
                    />
                    <p className="field-note">
                      Gunakan tautan HTTPS yang bisa diakses calon rekanmu.
                    </p>
                  </label>
                  <div className="full row-actions">
                    <button className="action" disabled={busy}>
                      {editing ? "Simpan perubahan" : "Tambahkan karya"}
                    </button>
                    {editing && (
                      <button
                        type="button"
                        className="action secondary"
                        onClick={() => {
                          setEditing("");
                          setPortfolio({ label: "", url: "", tipe: "github" });
                        }}
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </form>
                <div className="section-gap">
                  {profile.portfolioLinks.length ? (
                    profile.portfolioLinks.map((p) => (
                      <div className="application-row" key={p.id}>
                        <div>
                          <h3>
                            <a
                              href={/^https:\/\//i.test(p.url) ? p.url : "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {p.label} ↗
                            </a>
                          </h3>
                          <p>{p.tipe}</p>
                        </div>
                        <div className="row-actions">
                          <button
                            className="action secondary"
                            disabled={busy}
                            onClick={() => {
                              setEditing(p.id);
                              setPortfolio({
                                label: p.label,
                                url: p.url,
                                tipe: p.tipe,
                              });
                              setConfirm("");
                            }}
                          >
                            Ubah
                          </button>
                          {confirm === p.id ? (
                            <>
                              <button
                                className="action danger"
                                disabled={busy}
                                onClick={() =>
                                  mutate(
                                    () =>
                                      api.delete(
                                        `/profile/me/portfolio/${p.id}`,
                                      ),
                                    "Portofolio dihapus.",
                                    () => {
                                      if (editing === p.id) {
                                        setEditing("");
                                        setPortfolio({
                                          label: "",
                                          url: "",
                                          tipe: "github",
                                        });
                                      }
                                    },
                                  )
                                }
                              >
                                Ya, hapus
                              </button>
                              <button
                                className="action secondary"
                                onClick={() => setConfirm("")}
                              >
                                Batal
                              </button>
                            </>
                          ) : (
                            <button
                              className="action secondary"
                              disabled={busy}
                              onClick={() => setConfirm(p.id)}
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <Empty
                      title="Ruang untuk karya terbaikmu"
                      text="Tambahkan proyek, desain, atau profil profesional yang ingin kamu bagikan."
                    />
                  )}
                </div>
              </>
            )}
          </section>
          <aside className="stack">
            <section className="panel">
              <div className="member-row" style={{ marginTop: 0 }}>
                <span
                  className="avatar"
                  style={{ width: 52, height: 52, fontSize: 22 }}
                >
                  {profile.namaTampilan.charAt(0)}
                </span>
                <div>
                  <h3>{profile.namaTampilan}</h3>
                  <small>{profile.programStudi || "Mahasiswa"}</small>
                </div>
              </div>
              <div className="section-gap">
                <span className="tag">
                  {profile.ketersediaan
                    ? "Terbuka untuk kolaborasi"
                    : "Sedang fokus pada tim saat ini"}
                </span>
              </div>
              <div className="info-row">
                <span>Keahlian</span>
                <strong>{profile.userSkills.length}</strong>
              </div>
              <div className="info-row">
                <span>Portofolio</span>
                <strong>{profile.portfolioLinks.length}</strong>
              </div>
            </section>
            <section className="panel">
              <div className="panel-title">
                <h3>Kelengkapan profil</h3>
                <span className="text-link">{progress}%</span>
              </div>
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
              <p className="muted" style={{ fontSize: 12 }}>
                Profil yang lengkap membantu pemilik peluang memahami
                kontribusimu.
              </p>
            </section>
          </aside>
        </div>
      ) : (
        <Empty
          title="Profil belum dapat dimuat"
          text="Periksa koneksi lalu coba sekali lagi."
        >
          <button className="action" onClick={() => setVersion((v) => v + 1)}>
            Coba lagi
          </button>
        </Empty>
      )}
    </>
  );
}
