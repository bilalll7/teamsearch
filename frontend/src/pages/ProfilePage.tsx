import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import api from '../lib/api';

interface Profile {
  id: string;
  namaTampilan: string;
  bio: string | null;
  programStudi: string | null;
  angkatan: string | null;
  ketersediaan: boolean;
}

interface PortfolioLink {
  id: string;
  label: string;
  url: string;
  tipe: string;
}

interface UserSkill {
  id: string;
  level: number;
  skill: {
    id: string;
    nama: string;
    kategori: { nama: string };
  };
}

const inputCls =
  'h-12 w-full rounded-lg border border-border bg-background px-3.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring';
const labelCls = 'mb-1.5 block text-sm font-medium text-foreground';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioLink[]>([]);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [formData, setFormData] = useState({
    namaTampilan: '',
    bio: '',
    programStudi: '',
    angkatan: '',
  });
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    loadProfile();
    loadPortfolio();
    loadSkills();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await api.get('/profile/me');
      setProfile(data);
      setFormData({
        namaTampilan: data.namaTampilan || '',
        bio: data.bio || '',
        programStudi: data.programStudi || '',
        angkatan: data.angkatan || '',
      });
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPortfolio = async () => {
    try {
      const { data } = await api.get('/profile/me/portfolio');
      setPortfolio(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load portfolio', err);
    }
  };

  const loadSkills = async () => {
    try {
      const { data } = await api.get('/skills/me');
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load skills', err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setUpdateError('');
    try {
      const payload = {
        namaTampilan: formData.namaTampilan.trim(),
        bio: formData.bio.trim() || undefined,
        programStudi: formData.programStudi.trim() || undefined,
        angkatan: formData.angkatan.trim() || undefined,
      };
      await api.patch('/profile/me', payload);
      await loadProfile();
      setEditing(false);
    } catch (err: any) {
      const message = err.response?.data?.message;
      setUpdateError(Array.isArray(message) ? message.join(', ') : message || t('profile.updateFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="pt-16">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-center px-6 py-24">
            <LoadingSpinner text={t('profile.loading')} />
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="pt-16">
          <div className="mx-auto w-full max-w-4xl px-6 py-24 text-center">
            <p className="text-destructive">{t('profile.notFound')}</p>
          </div>
        </main>
      </div>
    );
  }

  const initial = (profile.namaTampilan || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-background text-foreground">
      <main className="w-full pt-16">
        <section className="w-full border-b border-border-subtle">
          <div className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t('profile.eyebrow')}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white" aria-hidden="true">
                {initial}
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-3xl font-bold tracking-tight md:text-4xl">
                  {profile.namaTampilan}
                </h1>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-muted-foreground">
                  {profile.programStudi && <span>{profile.programStudi}</span>}
                  {profile.angkatan && <span>· {profile.angkatan}</span>}
                  <span className={`flex items-center gap-1.5 font-medium ${profile.ketersediaan ? 'text-success' : 'text-muted-foreground'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${profile.ketersediaan ? 'bg-success' : 'bg-border'}`} aria-hidden="true" />
                    {profile.ketersediaan ? t('profile.available') : t('profile.unavailable')}
                  </span>
                </p>
              </div>
              <Button size="md" variant="secondary" onClick={() => { setUpdateError(''); setEditing(!editing) }}>
                {editing ? t('profile.cancel') : t('profile.edit')}
              </Button>
            </div>
            {profile.bio && !editing && (
              <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
                {profile.bio}
              </p>
            )}
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground">{t('profile.lead')}</p>
          </div>
        </section>

        <section className="w-full">
          <div className="mx-auto w-full max-w-4xl space-y-4 px-6 py-10 md:py-12">
            {editing && (
              <form onSubmit={handleUpdateProfile} className="rounded-xl border border-border bg-surface p-6 md:p-8">
                {updateError && (
                  <p role="alert" className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-[15px] text-destructive">
                    {updateError}
                  </p>
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className={labelCls}>{t('profile.nameLabel')}</span>
                    <input
                      type="text"
                      value={formData.namaTampilan}
                      onChange={(e) => setFormData({ ...formData, namaTampilan: e.target.value })}
                      required
                      className={inputCls}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className={labelCls}>{t('profile.bioLabel')}</span>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder={t('profile.bioPlaceholder')}
                      rows={4}
                      maxLength={300}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-3 text-[15px] leading-relaxed placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <span className="mt-1.5 block text-[13px] text-muted-foreground">
                      {formData.bio.length}/300
                    </span>
                  </label>
                  <label className="block">
                    <span className={labelCls}>{t('profile.majorLabel')}</span>
                    <input
                      type="text"
                      value={formData.programStudi}
                      onChange={(e) => setFormData({ ...formData, programStudi: e.target.value })}
                      placeholder={t('profile.majorPlaceholder')}
                      className={inputCls}
                    />
                  </label>
                  <label className="block">
                    <span className={labelCls}>{t('profile.batchLabel')}</span>
                    <input
                      type="text"
                      value={formData.angkatan}
                      onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
                      placeholder={t('profile.batchPlaceholder')}
                      className={inputCls}
                    />
                  </label>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button size="lg" type="submit" disabled={saving}>
                    {saving ? (
                      <span className="flex items-center gap-2.5">
                        <LoadingSpinner size="sm" />
                        {t('profile.saving')}
                      </span>
                    ) : (
                      t('profile.save')
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="rounded-xl border border-border bg-surface p-6 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold tracking-tight">{t('profile.skillsTitle')}</h2>
                <button
                  onClick={() => navigate('/profile/skills')}
                  className="text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  {t('dash.manage')} →
                </button>
              </div>
              {skills.length === 0 ? (
                <p className="mt-3 text-[15px] text-muted-foreground">{t('profile.skillsEmpty')}</p>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((us) => (
                    <span key={us.id} className="rounded-md border border-border bg-background px-3 py-1.5 text-sm">
                      {us.skill.nama}
                      <span className="ml-2 text-muted-foreground">Lv{us.level} · {us.skill.kategori.nama}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-surface p-6 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold tracking-tight">{t('profile.portfolioTitle')}</h2>
                <button
                  onClick={() => navigate('/profile/portfolio')}
                  className="text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  {t('dash.manage')} →
                </button>
              </div>
              {portfolio.length === 0 ? (
                <p className="mt-3 text-[15px] text-muted-foreground">{t('profile.portfolioEmpty')}</p>
              ) : (
                <div className="mt-4 space-y-2">
                  {portfolio.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-4 py-3 transition-colors hover:border-primary"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{link.label}</span>
                        <span className="block text-sm text-muted-foreground">{link.tipe}</span>
                      </span>
                      <svg className="h-5 w-5 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
