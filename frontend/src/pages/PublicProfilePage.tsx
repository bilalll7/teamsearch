import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Empty, Loading, PageHead } from "../components/workspace";
import api from "../lib/api";
import type { Profile } from "../lib/models";

export default function PublicProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get<Profile>(`/profile/${userId}`).then((r) => setProfile(r.data)).finally(() => setLoading(false)); }, [userId]);
  if (loading) return <Loading />;
  if (!profile) return <Empty title="Profil tidak ditemukan" text="Profil kandidat ini belum tersedia." />;
  return <>
    <PageHead eyebrow="PROFIL KANDIDAT" title={profile.namaTampilan} description={profile.headline || profile.bio || "Profil anggota TeamSearch."}>
      <Link className="action secondary" to="/opportunities">← Kembali</Link>
    </PageHead>
    <div className="content-columns">
      <div className="stack">
        <section className="panel"><h2>Tentang</h2><p className="detail-description">{profile.bio || "Belum ada ringkasan profil."}</p><div className="tags">{profile.programStudi && <span className="tag">{profile.programStudi}</span>}{profile.angkatan && <span className="tag">Angkatan {profile.angkatan}</span>}{profile.lokasi && <span className="tag">{profile.lokasi}</span>}</div></section>
        <section className="panel"><h2>Pengalaman</h2>{profile.pengalaman?.length ? profile.pengalaman.map((x, i) => <article className="application-row" key={x.id || i}><h3>{x.role}</h3><p>{x.company} · {x.mulai} – {x.selesai || "Sekarang"}</p><p>{x.deskripsi}</p></article>) : <p className="muted">Belum ada pengalaman.</p>}</section>
        <section className="panel"><h2>Pendidikan</h2>{profile.pendidikan?.length ? profile.pendidikan.map((x, i) => <article className="application-row" key={x.id || i}><h3>{x.program}</h3><p>{x.institusi} · {x.mulai} – {x.selesai}</p><p>{x.deskripsi}</p></article>) : <p className="muted">Belum ada pendidikan yang ditambahkan.</p>}</section>
      </div>
      <aside className="stack"><section className="panel"><h2>Keahlian</h2><div className="tags">{profile.userSkills.map((x) => <span className="tag" key={x.id}>{x.skill.nama} · Lv{x.level}</span>)}</div>{profile.resumeUrl && <a className="action" href={profile.resumeUrl} target="_blank" rel="noreferrer">Buka CV / profil</a>}</section></aside>
    </div>
  </>;
}
