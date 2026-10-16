import { useEffect, useState } from "react";
import { Feedback, errorMessage } from "./workspace";
import api from "../lib/api";
import type { Opportunity, Skill } from "../lib/models";

export function RecruitmentSettings({
  opportunity,
  onSaved,
}: {
  opportunity: Opportunity;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(opportunity.judul);
  const [description, setDescription] = useState(opportunity.deskripsi);
  const [name, setName] = useState("");
  const [slots, setSlots] = useState(1);
  const [roleDescription, setRoleDescription] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    api
      .get<Skill[]>("/skills")
      .then((r) => setSkills(r.data))
      .catch((e) => setError(errorMessage(e)));
  }, []);
  const save = async (operation: () => Promise<unknown>, message: string) => {
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await operation();
      setSuccess(message);
      onSaved();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="panel">
      <h2>Pengaturan rekrutmen</h2>
      <Feedback error={error} success={success} />
      <details style={{ marginTop: 18 }}>
        <summary className="text-link" style={{ cursor: "pointer" }}>
          Ubah cerita peluang
        </summary>
        <form
          className="form-stack"
          style={{ marginTop: 18 }}
          onSubmit={(e) => {
            e.preventDefault();
            save(
              () =>
                api.patch(`/opportunities/${opportunity.id}`, {
                  judul: title.trim(),
                  deskripsi: description.trim(),
                }),
              "Peluang diperbarui.",
            );
          }}
        >
          <label>
            <span className="field-label">Judul peluang</span>
            <input
              className="field"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label>
            <span className="field-label">Deskripsi peluang</span>
            <textarea
              className="field"
              required
              maxLength={2000}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <button
            className="action"
            disabled={busy || !title.trim() || !description.trim()}
          >
            Simpan perubahan
          </button>
        </form>
      </details>
      <details
        style={{ marginTop: 18 }}
        open={!opportunity.positions.length || undefined}
      >
        <summary className="text-link" style={{ cursor: "pointer" }}>
          Tambahkan posisi baru
        </summary>
        <form
          className="form-stack"
          style={{ marginTop: 18 }}
          onSubmit={(e) => {
            e.preventDefault();
            save(
              () =>
                api.post(`/opportunities/${opportunity.id}/positions`, {
                  nama: name.trim(),
                  jumlahSlot: slots,
                  deskripsi: roleDescription,
                  requirements: selected.map((skillId) => ({
                    skillId,
                    jenis: "must_have",
                    levelMinimum: 1,
                  })),
                }),
              "Posisi baru ditambahkan.",
            );
          }}
        >
          <div className="form-grid">
            <label>
              <span className="field-label">Nama posisi baru</span>
              <input
                className="field"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              <span className="field-label">Slot posisi baru</span>
              <input
                className="field"
                required
                type="number"
                min={1}
                max={100}
                value={slots}
                onChange={(e) => setSlots(Number(e.target.value))}
              />
            </label>
            <label className="full">
              <span className="field-label">Tanggung jawab posisi</span>
              <textarea
                className="field"
                rows={2}
                maxLength={500}
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
              />
            </label>
          </div>
          <label>
            <span className="field-label">Keahlian utama (opsional)</span>
            <select
              className="field"
              aria-label="Tambahkan keahlian posisi baru"
              value=""
              disabled={selected.length >= 20}
              onChange={(e) => {
                if (e.target.value) setSelected((s) => [...s, e.target.value]);
              }}
            >
              <option value="">Pilih keahlian</option>
              {skills
                .filter((s) => !selected.includes(s.id))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama}
                  </option>
                ))}
            </select>
          </label>
          <div className="tags">
            {selected.map((id) => (
              <button
                type="button"
                className="tag"
                key={id}
                onClick={() => setSelected((s) => s.filter((v) => v !== id))}
                aria-label={`Hapus ${skills.find((s) => s.id === id)?.nama}`}
              >
                {skills.find((s) => s.id === id)?.nama} ×
              </button>
            ))}
          </div>
          <p className="field-note">
            Keahlian tambahan ini menjadi persyaratan utama dengan level dasar.
          </p>
          <button className="action" disabled={busy || !name.trim()}>
            Simpan posisi
          </button>
        </form>
      </details>
    </section>
  );
}
