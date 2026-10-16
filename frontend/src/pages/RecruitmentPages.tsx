import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Action,
  Empty,
  Feedback,
  Icon,
  Loading,
  PageHead,
  Status,
  errorMessage,
} from "../components/workspace";
import api from "../lib/api";
import { RecruitmentSettings } from "../components/RecruitmentSettings";
import type {
  Application,
  Opportunity,
  Profile,
  Requirement,
  Skill,
} from "../lib/models";

interface RoleDraft {
  key: string;
  nama: string;
  jumlahSlot: number;
  deskripsi: string;
  requirements: Requirement[];
}
const newRole = (): RoleDraft => ({
  key: crypto.randomUUID(),
  nama: "",
  jumlahSlot: 1,
  deskripsi: "",
  requirements: [],
});
export function CreateRecruitmentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    jenis: "proyek",
    kategori: "",
    mode: "online",
    tenggat: "",
  });
  const [roles, setRoles] = useState<RoleDraft[]>([newRole()]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api
      .get("/skills")
      .then((r) => setSkills(r.data))
      .catch((e) => setError(errorMessage(e)));
  }, []);
  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));
  const updateRole = (key: string, values: Partial<RoleDraft>) =>
    setRoles((r) =>
      r.map((role) => (role.key === key ? { ...role, ...values } : role)),
    );
  const next = () => {
    setError("");
    if (
      step === 0 &&
      (!form.judul.trim() || !form.deskripsi.trim() || !form.kategori.trim())
    ) {
      setError("Lengkapi judul, deskripsi, dan kategori terlebih dahulu.");
      return;
    }
    if (form.tenggat && new Date(form.tenggat) <= new Date()) {
      setError("Pilih tenggat di masa depan.");
      return;
    }
    if (
      step === 1 &&
      roles.some(
        (r) =>
          !r.nama.trim() ||
          !Number.isInteger(r.jumlahSlot) ||
          r.jumlahSlot < 1 ||
          r.requirements.some((s) => !s.skillId),
      )
    ) {
      setError(
        "Setiap posisi membutuhkan nama, minimal satu slot, dan pilihan keahlian yang valid.",
      );
      return;
    }
    setStep((s) => s + 1);
  };
  const publish = async () => {
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/opportunities", {
        ...form,
        judul: form.judul.trim(),
        deskripsi: form.deskripsi.trim(),
        kategori: form.kategori.trim(),
        tenggat: form.tenggat
          ? new Date(form.tenggat).toISOString()
          : undefined,
        positions: roles.map(
          ({ nama, jumlahSlot, deskripsi, requirements }) => ({
            nama: nama.trim(),
            jumlahSlot,
            deskripsi,
            requirements,
          }),
        ),
      });
      navigate(`/opportunities/${data.id}/manage`, { replace: true });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <Link className="back-link" to="/teams">
        ← Kembali ke tim & rekrutmen
      </Link>
      <PageHead
        eyebrow="MULAI KOLABORASI"
        title="Beri ruang untuk ide besarmu."
        description="Ceritakan idenya, tentukan perannya, lalu undang keahlian yang tepat."
      />
      <div className="content-columns">
        <section className="panel">
          <div className="stepper">
            {["Tentang peluang", "Posisi & keahlian", "Tinjau & terbitkan"].map(
              (label, i) => (
                <div
                  key={label}
                  className={`step ${i <= step ? "active" : ""}`}
                  aria-current={i === step ? "step" : undefined}
                >
                  <span>{i < step ? "✓" : i + 1}</span>
                  {label}
                </div>
              ),
            )}
          </div>
          <Feedback error={error} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 2) next();
              else publish();
            }}
          >
            {step === 0 && (
              <div className="form-grid">
                <label className="full">
                  <span className="field-label">Nama peluang *</span>
                  <input
                    className="field"
                    autoFocus
                    required
                    maxLength={200}
                    placeholder="Contoh: Tim kompetisi aplikasi pendidikan"
                    value={form.judul}
                    onChange={(e) => update("judul", e.target.value)}
                  />
                </label>
                <label className="full">
                  <span className="field-label">Ceritakan idemu *</span>
                  <textarea
                    className="field"
                    required
                    rows={5}
                    maxLength={2000}
                    placeholder="Apa yang ingin kamu bangun? Ceritakan tujuan, rencana, dan harapan untuk timmu."
                    value={form.deskripsi}
                    onChange={(e) => update("deskripsi", e.target.value)}
                  />
                  <p className="field-note">
                    {form.deskripsi.length}/2000 karakter
                  </p>
                </label>
                <label>
                  <span className="field-label">Jenis peluang</span>
                  <select
                    className="field"
                    value={form.jenis}
                    onChange={(e) => update("jenis", e.target.value)}
                  >
                    <option value="proyek">Proyek</option>
                    <option value="lomba">Kompetisi</option>
                  </select>
                </label>
                <label>
                  <span className="field-label">Kategori *</span>
                  <input
                    className="field"
                    required
                    maxLength={100}
                    placeholder="Teknologi, desain, bisnis…"
                    value={form.kategori}
                    onChange={(e) => update("kategori", e.target.value)}
                  />
                </label>
                <label>
                  <span className="field-label">Mode kolaborasi</span>
                  <select
                    className="field"
                    value={form.mode}
                    onChange={(e) => update("mode", e.target.value)}
                  >
                    {["online", "offline", "hybrid"].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="field-label">
                    Tenggat lamaran (opsional)
                  </span>
                  <input
                    className="field"
                    type="datetime-local"
                    value={form.tenggat}
                    onChange={(e) => update("tenggat", e.target.value)}
                  />
                </label>
              </div>
            )}
            {step === 1 && (
              <>
                <h2>Siapa yang kamu butuhkan?</h2>
                <p
                  className="muted"
                  style={{ fontSize: 12, margin: "8px 0 20px" }}
                >
                  Tambahkan posisi dan keahlian agar calon rekan tahu perannya.
                </p>
                {roles.map((role, index) => (
                  <div className="role-editor" key={role.key}>
                    <div className="panel-title">
                      <h3>Posisi {index + 1}</h3>
                      {roles.length > 1 && (
                        <button
                          type="button"
                          className="text-link"
                          onClick={() =>
                            setRoles((r) => r.filter((v) => v.key !== role.key))
                          }
                        >
                          Hapus posisi
                        </button>
                      )}
                    </div>
                    <div className="form-grid">
                      <label>
                        <span className="field-label">Nama posisi *</span>
                        <input
                          className="field"
                          required
                          maxLength={100}
                          placeholder="Frontend developer"
                          value={role.nama}
                          onChange={(e) =>
                            updateRole(role.key, { nama: e.target.value })
                          }
                        />
                      </label>
                      <label>
                        <span className="field-label">Jumlah orang *</span>
                        <input
                          className="field"
                          required
                          type="number"
                          min={1}
                          max={100}
                          value={role.jumlahSlot}
                          onChange={(e) =>
                            updateRole(role.key, {
                              jumlahSlot: Number(e.target.value),
                            })
                          }
                        />
                      </label>
                      <label className="full">
                        <span className="field-label">
                          Tanggung jawab (opsional)
                        </span>
                        <textarea
                          className="field"
                          rows={2}
                          maxLength={500}
                          value={role.deskripsi}
                          onChange={(e) =>
                            updateRole(role.key, { deskripsi: e.target.value })
                          }
                        />
                      </label>
                    </div>
                    <p className="field-label" style={{ marginTop: 18 }}>
                      Keahlian yang dicari
                    </p>
                    {role.requirements.map((r, i) => (
                      <div className="requirement-row" key={i}>
                        <select
                          required
                          className="field"
                          aria-label={`Keahlian ${i + 1} posisi ${index + 1}`}
                          value={r.skillId}
                          onChange={(e) =>
                            updateRole(role.key, {
                              requirements: role.requirements.map((v, j) =>
                                j === i ? { ...v, skillId: e.target.value } : v,
                              ),
                            })
                          }
                        >
                          <option value="">Pilih keahlian</option>
                          {skills
                            .filter(
                              (s) =>
                                s.id === r.skillId ||
                                !role.requirements.some(
                                  (v) => v.skillId === s.id,
                                ),
                            )
                            .map((s) => (
                              <option value={s.id} key={s.id}>
                                {s.nama}
                              </option>
                            ))}
                        </select>
                        <select
                          className="field"
                          aria-label="Prioritas keahlian"
                          value={r.jenis}
                          onChange={(e) =>
                            updateRole(role.key, {
                              requirements: role.requirements.map((v, j) =>
                                j === i ? { ...v, jenis: e.target.value } : v,
                              ),
                            })
                          }
                        >
                          <option value="must_have">Utama</option>
                          <option value="nice_to_have">Nilai tambah</option>
                        </select>
                        <select
                          className="field"
                          aria-label="Level minimum"
                          value={r.levelMinimum}
                          onChange={(e) =>
                            updateRole(role.key, {
                              requirements: role.requirements.map((v, j) =>
                                j === i
                                  ? {
                                      ...v,
                                      levelMinimum: Number(e.target.value),
                                    }
                                  : v,
                              ),
                            })
                          }
                        >
                          <option value={1}>Dasar</option>
                          <option value={2}>Menengah</option>
                          <option value={3}>Mahir</option>
                        </select>
                        <button
                          type="button"
                          className="icon-button"
                          aria-label="Hapus keahlian"
                          onClick={() =>
                            updateRole(role.key, {
                              requirements: role.requirements.filter(
                                (_, j) => j !== i,
                              ),
                            })
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      className="text-link"
                      type="button"
                      disabled={!skills.length}
                      style={{ marginTop: 12 }}
                      onClick={() =>
                        updateRole(role.key, {
                          requirements: [
                            ...role.requirements,
                            {
                              skillId: "",
                              jenis: "must_have",
                              levelMinimum: 1,
                            },
                          ],
                        })
                      }
                    >
                      + Tambah keahlian
                    </button>
                  </div>
                ))}
                <button
                  className="action secondary"
                  type="button"
                  disabled={roles.length >= 20}
                  onClick={() => setRoles((r) => [...r, newRole()])}
                >
                  <Icon name="plus" size={16} />
                  Tambah posisi
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <p className="eyebrow">SIAP MENEMUKAN REKAN?</p>
                <h2>{form.judul}</h2>
                <div className="tags" style={{ marginTop: 12 }}>
                  {[form.jenis, form.kategori, form.mode].map((v, i) => (
                    <span className="tag" key={i}>
                      {v}
                    </span>
                  ))}
                </div>
                <p className="detail-description">{form.deskripsi}</p>
                <h3 style={{ marginTop: 25 }}>Posisi yang dibuka</h3>
                {roles.map((role) => (
                  <div key={role.key} className="info-row">
                    <strong>{role.nama}</strong>
                    <span>
                      {role.jumlahSlot} orang · {role.requirements.length}{" "}
                      keahlian
                    </span>
                  </div>
                ))}
                <p className="field-note" style={{ marginTop: 18 }}>
                  Setelah diterbitkan, peluang dapat ditemukan dan dilamar. Kamu
                  bisa menutup rekrutmen dari halaman pengelolaan.
                </p>
              </>
            )}
            <div className="form-actions">
              <button
                className="action secondary"
                type="button"
                disabled={busy}
                onClick={() =>
                  step ? setStep((s) => s - 1) : navigate("/teams")
                }
              >
                {step ? "Kembali" : "Batal"}
              </button>
              <button className="action" type="submit" disabled={busy}>
                {busy
                  ? "Menerbitkan…"
                  : step === 2
                    ? "Terbitkan peluang"
                    : "Lanjutkan"}
                <Icon name="arrow" size={16} />
              </button>
            </div>
          </form>
        </section>
        <aside className="panel">
          <p className="eyebrow">REKRUTMEN YANG LEBIH JELAS</p>
          <h3>Tim yang tepat dimulai dari ekspektasi yang jelas.</h3>
          <div className="checklist">
            <p className="muted">
              01 — Ceritakan tujuan dan hasil yang ingin dicapai.
            </p>
            <p className="muted">
              02 — Pisahkan keahlian utama dan nilai tambah.
            </p>
            <p className="muted">
              03 — Tinjau lamaran sebelum menerima anggota.
            </p>
          </div>
          <p className="field-note">
            Peluang dan seluruh posisi disimpan bersama saat kamu
            menerbitkannya.
          </p>
        </aside>
      </div>
    </>
  );
}

export function RecruitmentDetailPage({
  manage = false,
}: {
  manage?: boolean;
}) {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mine, setMine] = useState<Application[]>([]);
  const [applicants, setApplicants] = useState<Record<string, Application[]>>(
    {},
  );
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState("");
  const [version, setVersion] = useState(0);
  const [decision, setDecision] = useState<{
    id: string;
    status: string;
  } | null>(null);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([
      api.get<Opportunity>(`/opportunities/${id}`),
      api.get<Profile>("/profile/me"),
      api.get<Application[]>("/opportunities/applications/me"),
    ])
      .then(async ([o, p, a]) => {
        let rows: Record<string, Application[]> = {};
        if (manage && o.data.ownerId === p.data.userId) {
          const results = await Promise.all(
            o.data.positions.map(
              async (pos) =>
                [
                  pos.id,
                  (
                    await api.get(
                      `/opportunities/positions/${pos.id}/applications`,
                    )
                  ).data,
                ] as const,
            ),
          );
          rows = Object.fromEntries(results);
        }
        if (active) {
          setOpportunity(o.data);
          setProfile(p.data);
          setMine(a.data);
          setApplicants(rows);
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
  }, [id, manage, version]);
  const owner = opportunity?.ownerId === profile?.userId;
  const isOpen =
    opportunity?.status === "open" &&
    (!opportunity.tenggat || new Date(opportunity.tenggat) > new Date());
  const act = async (
    key: string,
    operation: () => Promise<unknown>,
    message: string,
  ) => {
    setBusy(key);
    setError("");
    setSuccess("");
    try {
      await operation();
      setSuccess(message);
      setDecision(null);
      setVersion((v) => v + 1);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy("");
    }
  };
  if (loading) return <Loading />;
  if (!opportunity)
    return (
      <>
        <Feedback error={error} />
        <Empty
          title="Peluang belum dapat ditampilkan"
          text="Peluang mungkin sudah dihapus atau koneksi sedang bermasalah."
        >
          <button
            className="action secondary"
            onClick={() => setVersion((v) => v + 1)}
          >
            Coba lagi
          </button>
          <Action to="/opportunities">Kembali ke peluang</Action>
        </Empty>
      </>
    );
  if (manage && !owner)
    return (
      <Empty
        title="Halaman ini untuk pemilik peluang"
        text="Kamu tetap bisa melihat detail dan melamar posisi yang tersedia."
      >
        <Action to={`/opportunities/${id}`}>Lihat peluang</Action>
      </Empty>
    );
  return (
    <>
      <Link className="back-link" to={manage ? "/teams" : "/opportunities"}>
        ← {manage ? "Tim & rekrutmen" : "Semua peluang"}
      </Link>
      <PageHead
        eyebrow={manage ? "KELOLA REKRUTMEN" : "KENALI TIM BERIKUTNYA"}
        title={opportunity.judul}
        description={
          manage
            ? "Tinjau setiap perkenalan dan pilih rekan yang tepat untuk timmu."
            : `Oleh ${opportunity.owner.profile?.namaTampilan || "Anggota TeamSearch"} · ${opportunity.kategori}`
        }
      >
        <Status value={opportunity.status} />
        {owner && (
          <Action
            to={`/opportunities/${id}${manage ? "" : "/manage"}`}
            secondary
          >
            {manage ? "Lihat halaman peluang" : "Kelola rekrutmen"}
          </Action>
        )}
      </PageHead>
      <Feedback error={error} success={success} />
      <div className="content-columns">
        <div className="stack">
          {!manage && (
            <section className="panel">
              <div className="detail-cover" />
              <div className="tags">
                {[
                  opportunity.jenis,
                  opportunity.mode,
                  opportunity.kategori,
                ].map((v, i) => (
                  <span className="tag" key={i}>
                    {v}
                  </span>
                ))}
              </div>
              <h2 style={{ marginTop: 20 }}>Tentang kolaborasi ini</h2>
              <p className="detail-description">{opportunity.deskripsi}</p>
            </section>
          )}
          {manage && (
            <RecruitmentSettings
              opportunity={opportunity}
              onSaved={() => {
                setSuccess("Pengaturan rekrutmen berhasil disimpan.");
                setVersion((v) => v + 1);
              }}
            />
          )}
          <div className="panel-title">
            <h2>{manage ? "Posisi & pelamar" : "Temukan peranmu"}</h2>
            <span className="muted" style={{ fontSize: 12 }}>
              {opportunity.positions.length} posisi
            </span>
          </div>
          {!manage && !owner && (
            <aside className="apply-guide" aria-label="Cara melamar">
              <span className="apply-guide-icon">
                <Icon name="file" size={19} />
              </span>
              <div>
                <strong>Cara melamar</strong>
                <p>
                  Pilih posisi yang cocok, tulis perkenalan singkat, lalu kirim
                  lamaran. Lihat kabarnya di menu{" "}
                  <Link to="/applications">Lamaran Saya</Link>.
                </p>
              </div>
            </aside>
          )}
          {!opportunity.positions.length && (
            <Empty
              title="Posisi belum tersedia"
              text="Peluang ini belum memiliki posisi untuk dilamar."
            />
          )}
          {opportunity.positions.map((pos) => {
            const application = mine.find((a) => a.position.id === pos.id);
            const rows = applicants[pos.id] || [];
            return (
              <section className="panel" key={pos.id}>
                <div className="panel-title">
                  <h3>{pos.nama}</h3>
                  <span className="tag">{pos.jumlahSlot} slot</span>
                </div>
                {pos.deskripsi && (
                  <p className="detail-description">{pos.deskripsi}</p>
                )}
                <div className="tags" style={{ margin: "15px 0" }}>
                  {pos.skillRequirements.map((r, i) => (
                    <span className="tag" key={r.id || i}>
                      {r.skill?.nama} ·{" "}
                      {r.jenis === "must_have" ? "Utama" : "Nilai tambah"} · Lv{" "}
                      {r.levelMinimum}
                    </span>
                  ))}
                </div>
                {manage ? (
                  <>
                    {rows.length ? (
                      rows.map((a) => (
                        <article className="application-row" key={a.id}>
                          <div>
                            <Status value={a.status} />
                            <h3 style={{ marginTop: 8 }}>
                              {a.applicant ? <Link className="text-link" to={`/profile/${a.applicant.id}`}>{a.applicant.profile?.namaTampilan || "Kandidat"}</Link> : "Kandidat"}
                            </h3>
                            <p>
                              {a.applicant?.profile?.programStudi ||
                                "Program studi belum diisi"}
                            </p>
                            {a.pesan && <p>“{a.pesan}”</p>}
                            <span className="tag">
                              {a.skorKecocokkanSaatLamar === null
                                ? "Tanpa skor kecocokan"
                                : `${a.skorKecocokkanSaatLamar}% kecocokan keahlian`}
                            </span>
                          </div>
                          {["pending", "shortlisted"].includes(a.status) && (
                            <div className="row-actions">
                              {decision?.id === a.id ? (
                                <>
                                  <span className="muted">
                                    {decision.status === "accepted"
                                      ? "Terima ke dalam tim?"
                                      : "Tolak lamaran ini?"}
                                  </span>
                                  <button
                                    className="action"
                                    disabled={!!busy}
                                    onClick={() =>
                                      act(
                                        a.id,
                                        () =>
                                          api.patch(
                                            `/opportunities/applications/${a.id}`,
                                            { status: decision.status },
                                          ),
                                        "Status lamaran diperbarui.",
                                      )
                                    }
                                  >
                                    Konfirmasi
                                  </button>
                                  <button
                                    className="action secondary"
                                    disabled={!!busy}
                                    onClick={() => setDecision(null)}
                                  >
                                    Batal
                                  </button>
                                </>
                              ) : (
                                <>
                                  {a.status === "pending" && (
                                    <button
                                      className="action secondary"
                                      disabled={!!busy}
                                      onClick={() =>
                                        act(
                                          a.id,
                                          () =>
                                            api.patch(
                                              `/opportunities/applications/${a.id}`,
                                              { status: "shortlisted" },
                                            ),
                                          "Kandidat ditandai untuk dipertimbangkan.",
                                        )
                                      }
                                    >
                                      Pertimbangkan
                                    </button>
                                  )}
                                  <button
                                    className="action"
                                    disabled={!!busy}
                                    onClick={() =>
                                      setDecision({
                                        id: a.id,
                                        status: "accepted",
                                      })
                                    }
                                  >
                                    Terima
                                  </button>
                                  <button
                                    className="action secondary"
                                    disabled={!!busy}
                                    onClick={() =>
                                      setDecision({
                                        id: a.id,
                                        status: "rejected",
                                      })
                                    }
                                  >
                                    Tolak
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </article>
                      ))
                    ) : (
                      <p className="muted" style={{ fontSize: 12 }}>
                        Belum ada lamaran untuk posisi ini. Bagikan halaman
                        peluang untuk mengundang calon rekan.
                      </p>
                    )}
                  </>
                ) : (
                  !owner && (
                    <>
                      {application ? (
                        <div className="row-actions">
                          <Status value={application.status} />
                          <Link className="text-link" to="/applications">
                            Pantau lamaran →
                          </Link>
                        </div>
                      ) : isOpen ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            act(
                              pos.id,
                              () =>
                                api.post(
                                  `/opportunities/positions/${pos.id}/applications`,
                                  { pesan: messages[pos.id] || "" },
                                ),
                              "Lamaran terkirim. Pantau perkembangannya di Lamaran Saya.",
                            );
                          }}
                        >
                          <label
                            className="field-label"
                            htmlFor={`message-${pos.id}`}
                          >
                            Perkenalkan dirimu (opsional)
                          </label>
                          <textarea
                            id={`message-${pos.id}`}
                            className="field"
                            rows={3}
                            maxLength={500}
                            placeholder="Ceritakan mengapa kamu tertarik dan apa yang bisa kamu kontribusikan."
                            value={messages[pos.id] || ""}
                            onChange={(e) =>
                              setMessages((m) => ({
                                ...m,
                                [pos.id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            className="action"
                            disabled={!!busy}
                            style={{ marginTop: 12 }}
                          >
                            {busy === pos.id ? "Mengirim…" : "Kirim lamaran"}
                            <Icon name="arrow" size={15} />
                          </button>
                        </form>
                      ) : (
                        <p className="muted">
                          Rekrutmen untuk peluang ini sudah ditutup atau
                          melewati tenggat.
                        </p>
                      )}
                    </>
                  )
                )}
              </section>
            );
          })}
        </div>
        <aside className="stack">
          <section className="panel">
            <h3>Ringkasan peluang</h3>
            <div className="info-row">
              <span>Kolaborasi</span>
              <strong>{opportunity.mode}</strong>
            </div>
            <div className="info-row">
              <span>Jenis</span>
              <strong>
                {opportunity.jenis === "lomba" ? "Kompetisi" : "Proyek"}
              </strong>
            </div>
            <div className="info-row">
              <span>Tenggat</span>
              <strong>
                {opportunity.tenggat
                  ? new Date(opportunity.tenggat).toLocaleDateString("id-ID")
                  : "Tidak dibatasi"}
              </strong>
            </div>
            <div className="info-row">
              <span>Total kebutuhan</span>
              <strong>
                {opportunity.positions.reduce((s, p) => s + p.jumlahSlot, 0)}{" "}
                orang
              </strong>
            </div>
            {manage && (
              <button
                className="action secondary"
                style={{ marginTop: 20, width: "100%" }}
                disabled={
                  !!busy ||
                  !!(
                    opportunity.tenggat &&
                    new Date(opportunity.tenggat) <= new Date()
                  )
                }
                onClick={() =>
                  act(
                    "status",
                    () =>
                      api.patch(`/opportunities/${id}`, {
                        status:
                          opportunity.status === "open" ? "closed" : "open",
                      }),
                    "Status rekrutmen diperbarui.",
                  )
                }
              >
                {opportunity.status === "open"
                  ? "Tutup rekrutmen"
                  : "Buka rekrutmen"}
              </button>
            )}
          </section>
          <section className="panel">
            <p className="eyebrow">
              {manage ? "SATU TEMPAT UNTUK TIMMU" : "SEBELUM MELAMAR"}
            </p>
            <h3>
              {manage ? "Kenali calon rekanmu" : "Buat kesan pertama yang baik"}
            </h3>
            <p
              className="muted"
              style={{ fontSize: 12, margin: "12px 0 18px" }}
            >
              {manage
                ? "Skor membantu melihat kecocokan keahlian. Baca juga perkenalan kandidat sebelum memutuskan."
                : "Lengkapi profil dan keahlianmu agar pemilik peluang lebih mudah mengenal kontribusimu."}
            </p>
            <Action to={manage ? "/teams" : "/profile"} secondary>
              {manage ? "Lihat anggota tim" : "Lengkapi profil"}
            </Action>
          </section>
        </aside>
      </div>
    </>
  );
}
