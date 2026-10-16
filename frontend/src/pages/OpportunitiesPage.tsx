import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Dropdown } from '../components/Dropdown';
import api from '../lib/api';

interface Opportunity {
  id: string;
  judul: string;
  deskripsi: string;
  jenis: string;
  kategori: string;
  mode: string;
  tenggat: string | null;
  status: string;
  owner: {
    profile: {
      namaTampilan: string;
    };
  };
  positions: Array<{
    id: string;
    nama: string;
    jumlahSlot: number;
  }>;
}

const SkeletonCard = () => (
  <div className="rounded-xl border border-border bg-surface p-6" aria-hidden="true">
    <div className="h-4 w-1/3 rounded bg-surface-elevated animate-pulse" />
    <div className="mt-3 h-6 w-3/4 rounded bg-surface-elevated animate-pulse" />
    <div className="mt-2 h-4 w-full rounded bg-surface-elevated animate-pulse" />
    <div className="mt-2 h-4 w-2/3 rounded bg-surface-elevated animate-pulse" />
  </div>
);

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterJenis, setFilterJenis] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams();
    if (filterJenis) params.append('jenis', filterJenis);
    if (filterKategori) params.append('kategori', filterKategori);
    params.append('status', 'open');

    api
      .get(`/opportunities?${params}`)
      .then(({ data }) => {
        if (!cancelled) setOpportunities(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) console.error('Failed to load opportunities', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filterJenis, filterKategori]);

  const visible = search.trim()
    ? opportunities.filter((o) =>
        `${o.judul} ${o.deskripsi}`.toLowerCase().includes(search.trim().toLowerCase())
      )
    : opportunities;

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-background text-foreground">
      <main className="w-full pt-16">
        {/* Header */}
        <section className="w-full border-b border-border-subtle">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-6 px-6 py-12 md:py-16 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {t('opp.eyebrow')}
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-[2.75rem] md:leading-[1.1]">
                {t('opp.title')}
              </h1>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {t('opp.lead')}
              </p>
            </div>
            <Button size="lg" onClick={() => navigate('/opportunities/create')}>
              {t('opp.create')}
            </Button>
          </div>
        </section>

        {/* Filters */}
        <section className="w-full border-b border-border-subtle">
          <div className="mx-auto grid w-full max-w-7xl gap-4 px-6 py-6 sm:grid-cols-3 lg:px-8">
            <label className="block sm:col-span-1">
              <span className="mb-1.5 block text-sm font-medium text-muted-foreground">
                {t('opp.filterJenis')}
              </span>
              <Dropdown
                value={filterJenis}
                onChange={setFilterJenis}
                ariaLabel={t('opp.filterJenis')}
                placeholder={t('opp.all')}
                options={[
                  { value: '', label: t('opp.all') },
                  { value: 'lomba', label: 'Lomba' },
                  { value: 'proyek', label: 'Proyek' },
                ]}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-muted-foreground">
                {t('opp.filterKategori')}
              </span>
              <input
                type="text"
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                placeholder={t('opp.categoryPlaceholder')}
                className="h-12 w-full rounded-lg border border-border bg-surface px-3.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-muted-foreground">
                Search
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('opp.searchPlaceholder')}
                className="h-12 w-full rounded-lg border border-border bg-surface px-3.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
          </div>
        </section>

        {/* List */}
        <section className="w-full">
          <div className="mx-auto w-full max-w-7xl px-6 py-10 md:py-14 lg:px-8">
            {!loading && visible.length > 0 && (
              <p className="mb-6 text-sm text-muted-foreground">
                {visible.length} {t('opp.openRoles')}
              </p>
            )}

            {loading ? (
              <div>
                <div className="flex items-center justify-center gap-3 py-10">
                  <LoadingSpinner text={t('opp.loading')} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </div>
            ) : visible.length === 0 ? (
              <div className="rounded-xl border border-border bg-surface p-8 text-center md:p-12">
                <h2 className="text-xl font-semibold">{t('opp.emptyTitle')}</h2>
                <p className="mx-auto mt-2 max-w-md text-[15px] text-muted-foreground">
                  {t('opp.emptyDescription')}
                </p>
                <Button size="lg" className="mt-6" onClick={() => navigate('/opportunities/create')}>
                  {t('opp.create')}
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {visible.map((opp) => (
                  <button
                    key={opp.id}
                    onClick={() => navigate(`/opportunities/${opp.id}`)}
                    className="flex flex-col rounded-xl border border-border bg-surface p-6 text-left transition-colors hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                      <span className="truncate">
                        {opp.jenis} · {opp.kategori} · {opp.mode}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5 font-semibold text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                        {opp.status}
                      </span>
                    </span>
                    <span className="mt-2 text-xl font-bold leading-snug">{opp.judul}</span>
                    <span className="mt-1.5 line-clamp-2 text-[15px] leading-relaxed text-muted-foreground">
                      {opp.deskripsi}
                    </span>
                    <span className="mt-3 flex flex-wrap gap-2">
                      {opp.positions.slice(0, 3).map((pos) => (
                        <span
                          key={pos.id}
                          className="rounded-md border border-border bg-background px-2.5 py-1 text-sm text-foreground"
                        >
                          {pos.nama}
                        </span>
                      ))}
                      {opp.positions.length > 3 && (
                        <span className="rounded-md border border-border bg-background px-2.5 py-1 text-sm text-muted-foreground">
                          +{opp.positions.length - 3}
                        </span>
                      )}
                    </span>
                    <span className="mt-4 flex items-center justify-between gap-3 border-t border-border-subtle pt-4 text-sm text-muted-foreground">
                      <span className="truncate">
                        {t('opp.owner')}: {opp.owner.profile.namaTampilan}
                      </span>
                      {opp.tenggat && (
                        <span className="shrink-0">
                          {new Date(opp.tenggat).toLocaleDateString()}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
