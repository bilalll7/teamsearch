import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import api from '../lib/api';

interface MyOpportunity {
  id: string;
  judul: string;
  jenis: string;
  kategori: string;
  mode: string;
  status: string;
  tenggat: string | null;
  ownerId: string;
  positions: Array<{ id: string }>;
}

interface MySkill {
  id: string;
  level: number;
  skill: { nama: string };
}

interface Me {
  userId?: string;
  id?: string;
}

const Skeleton = () => (
  <div className="rounded-xl border border-border bg-surface p-6" aria-hidden="true">
    <div className="h-4 w-1/3 rounded bg-surface-elevated animate-pulse" />
    <div className="mt-3 h-6 w-2/3 rounded bg-surface-elevated animate-pulse" />
    <div className="mt-2 h-4 w-1/2 rounded bg-surface-elevated animate-pulse" />
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [myTeams, setMyTeams] = useState<MyOpportunity[]>([]);
  const [skills, setSkills] = useState<MySkill[]>([]);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [incomplete, setIncomplete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      api.get('/profile/me'),
      api.get('/opportunities'),
      api.get('/skills/me'),
      api.get('/profile/me/portfolio'),
    ]).then(([pProfile, pOpps, pSkills, pPort]) => {
      if (cancelled) return;
      let myId = '';
      if (pProfile.status === 'fulfilled') {
        const p = pProfile.value.data;
        const me = p as Me & { namaTampilan?: string; bio?: string | null; programStudi?: string | null; angkatan?: string | null };
        myId = me.userId || me.id || '';
        if (me.namaTampilan) setDisplayName(me.namaTampilan);
        setIncomplete(!me.bio || !me.programStudi || !me.angkatan);
      }
      if (pOpps.status === 'fulfilled' && Array.isArray(pOpps.value.data)) {
        const all = pOpps.value.data as MyOpportunity[];
        setMyTeams(myId ? all.filter((o) => o.ownerId === myId) : all.slice(0, 3));
      }
      if (pSkills.status === 'fulfilled' && Array.isArray(pSkills.value.data)) {
        setSkills(pSkills.value.data.slice(0, 6));
      }
      if (pPort.status === 'fulfilled' && Array.isArray(pPort.value.data)) {
        setPortfolioCount(pPort.value.data.length);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-background text-foreground">
      <main className="w-full pt-16">
        {/* Hero — siapa, di mana, mau apa */}
        <section className="w-full border-b border-border-subtle">
          <div className="mx-auto w-full max-w-7xl px-6 py-12 md:py-16 lg:px-8">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t('dash.eyebrow')}
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-[2.75rem] md:leading-[1.1]">
              {t('dash.greeting')}{displayName ? `, ${displayName}` : ''}
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t('dash.lead')}
            </p>

            {/* Angka ringkas: tim saya, skill, portfolio */}
            {loading ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-3" aria-hidden="true">
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </div>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-surface p-6">
                  <p className="text-3xl font-bold">{myTeams.length}</p>
                  <p className="mt-1 text-[15px] text-muted-foreground">{t('dash.myPosts')}</p>
                </div>
                <button
                  onClick={() => navigate('/profile/skills')}
                  className="rounded-xl border border-border bg-surface p-6 text-left transition-colors hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <p className="text-3xl font-bold">{skills.length}</p>
                  <p className="mt-1 text-[15px] text-muted-foreground">{t('dash.skills')}</p>
                </button>
                <button
                  onClick={() => navigate('/profile/portfolio')}
                  className="rounded-xl border border-border bg-surface p-6 text-left transition-colors hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <p className="text-3xl font-bold">{portfolioCount}</p>
                  <p className="mt-1 text-[15px] text-muted-foreground">{t('dash.portfolio')}</p>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Panduan dua halaman — biar nama jelas */}
        <section className="w-full border-b border-border-subtle">
          <div className="mx-auto w-full max-w-7xl px-6 py-10 md:py-12 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight">{t('dash.guideTitle')}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <button
                onClick={() => navigate('/opportunities')}
                className="rounded-xl border border-border bg-surface p-6 text-left transition-colors hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <p className="text-lg font-bold">{t('dash.guideFindTitle')}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                  {t('dash.guideFindDesc')}
                </p>
                <span className="mt-4 inline-block text-[15px] font-semibold text-primary">
                  {t('dash.guideCta')} →
                </span>
              </button>
              <div className="rounded-xl border border-primary/40 bg-primary/5 p-6">
                <p className="text-lg font-bold">{t('dash.guideMyTitle')}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                  {t('dash.guideMyDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tim saya + aksi */}
        <section className="w-full">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 md:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {t('dash.myPosts')}
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">{t('dash.recentTitle')}</h2>
              <p className="mt-2 text-[15px] text-muted-foreground">{t('dash.recentLead')}</p>

              {loading ? (
                <div className="mt-6 space-y-4" aria-hidden="true">
                  <Skeleton />
                  <Skeleton />
                </div>
              ) : myTeams.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-8 text-center md:p-10">
                  <h3 className="text-xl font-semibold">{t('dash.emptyPostsTitle')}</h3>
                  <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                    {t('dash.emptyPostsDescription')}
                  </p>
                  <Button size="lg" className="mt-6" onClick={() => navigate('/opportunities/create')}>
                    {t('dash.create')}
                  </Button>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {myTeams.map((opp) => (
                    <button
                      key={opp.id}
                      onClick={() => navigate(`/opportunities/${opp.id}`)}
                      className="group w-full rounded-xl border border-border bg-surface p-5 text-left transition-colors hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:p-6"
                    >
                      <span className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                        <span className="truncate">
                          {opp.jenis} · {opp.kategori} · {opp.mode}
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5 font-semibold text-success">
                          <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                          {opp.status} · {opp.positions.length} {t('dash.openRoles')}
                        </span>
                      </span>
                      <span className="mt-2 block text-lg font-bold leading-snug group-hover:text-primary md:text-xl">
                        {opp.judul}
                      </span>
                      {opp.tenggat && (
                        <span className="mt-2 block text-sm text-muted-foreground">
                          {new Date(opp.tenggat).toLocaleDateString()}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4 lg:pt-[4.5rem]">
              {incomplete && !loading && (
                <div className="rounded-xl border border-accent/40 bg-accent/10 p-6">
                  <h3 className="text-lg font-bold">{t('dash.completeProfile')}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                    {t('dash.completeProfileDesc')}
                  </p>
                  <Button size="md" variant="secondary" className="mt-4" onClick={() => navigate('/profile')}>
                    {t('dash.manage')}
                  </Button>
                </div>
              )}

              <div className="rounded-xl border border-border bg-surface p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold">{t('dash.skills')}</h3>
                  <button
                    onClick={() => navigate('/profile/skills')}
                    className="text-sm font-semibold text-muted-foreground hover:text-foreground"
                  >
                    {t('dash.manage')} →
                  </button>
                </div>
                {skills.length === 0 ? (
                  <p className="mt-3 text-[15px] text-muted-foreground">{t('dash.skillsEmpty')}</p>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span key={s.id} className="rounded-md border border-border bg-background px-2.5 py-1 text-sm">
                        {s.skill.nama} · Lv{s.level}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-3">
                <Button size="lg" className="w-full" onClick={() => navigate('/opportunities/create')}>
                  {t('dash.create')}
                </Button>
                <Button size="lg" variant="secondary" className="w-full" onClick={() => navigate('/opportunities')}>
                  {t('dash.browse')}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
