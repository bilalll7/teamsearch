import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import api from '../lib/api';

interface DetailOpp {
  id: string;
  judul: string;
  deskripsi: string;
  jenis: string;
  kategori: string;
  mode: string;
  tenggat: string | null;
  status: string;
  owner: { id: string; profile: { namaTampilan: string; bio?: string | null } };
  positions: Array<{
    id: string;
    nama: string;
    jumlahSlot: number;
    deskripsi?: string | null;
    skillRequirements?: Array<{
      id: string;
      jenis: string;
      skill: { nama: string };
    }>;
  }>;
}

interface MyApplication {
  id: string;
  status: string;
  position: { id: string };
}

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [opp, setOpp] = useState<DetailOpp | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [myApplications, setMyApplications] = useState<MyApplication[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    Promise.allSettled([
      api.get(`/opportunities/${id}`),
      api.get('/profile/me').catch(() => null),
      api.get('/opportunities/applications/me').catch(() => null),
    ]).then(([pOpp, pMe, pApps]) => {
      if (cancelled) return;
      if (pOpp.status === 'fulfilled') {
        const data = pOpp.value.data as DetailOpp;
        setOpp(data);
        if (pMe.status === 'fulfilled' && pMe.value?.data) {
          const me = pMe.value.data as { userId?: string; id?: string };
          const myId = me.userId || me.id || '';
          setIsOwner(!!myId && !!data.owner && myId === data.owner.id);
        }
      } else if (pOpp.status === 'rejected') {
        if ((pOpp.reason as any)?.response?.status === 404) setNotFound(true);
      }
      if (pApps.status === 'fulfilled' && pApps.value?.data && Array.isArray(pApps.value.data)) {
        setMyApplications(pApps.value.data);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const appliedPositionIds = new Set(myApplications.map((a) => a.position.id));

  const handleApply = async (positionId: string) => {
    setApplyingId(positionId);
    setApplyError('');
    setApplySuccess('');
    try {
      const pesan = (messages[positionId] || '').trim().slice(0, 500);
      const { data } = await api.post(`/opportunities/positions/${positionId}/applications`, {
        ...(pesan ? { pesan } : {}),
      });
      setMyApplications((prev) => [...prev, data]);
      setApplySuccess(t('opp.applySuccess'));
    } catch (err: any) {
      const message = err.response?.data?.message;
      setApplyError(Array.isArray(message) ? message.join(', ') : message || t('opp.applyFailed'));
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-background text-foreground">
      <main className="w-full pt-16">
        <div className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
          <button
            onClick={() => navigate('/opportunities')}
            className="text-[15px] font-medium text-muted-foreground hover:text-foreground"
          >
            ← {i18n.language === 'id' ? 'Kembali ke papan' : 'Back to board'}
          </button>

          {loading ? (
            <div className="mt-8 flex items-center gap-3">
              <LoadingSpinner text={t('opp.loading')} />
            </div>
          ) : notFound || !opp ? (
            <div className="mt-8 rounded-xl border border-border bg-surface p-8 text-center">
              <h1 className="text-xl font-semibold">404</h1>
              <Button size="lg" className="mt-6" onClick={() => navigate('/opportunities')}>
                {t('opp.emptyTitle')}
              </Button>
            </div>
          ) : (
            <article className="mt-6">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {opp.jenis} · {opp.kategori} · {opp.mode}
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-[2.75rem] md:leading-[1.1]">
                {opp.judul}
              </h1>
              <p className="mt-3 text-[15px] text-muted-foreground">
                {t('opp.owner')}: {opp.owner.profile.namaTampilan} · {opp.status}
                {opp.tenggat && ` · ${new Date(opp.tenggat).toLocaleDateString()}`}
              </p>
              <div className="mt-8 rounded-xl border border-border bg-surface p-6 md:p-8">
                <p className="whitespace-pre-wrap text-[17px] leading-relaxed">{opp.deskripsi}</p>
              </div>

              {(applyError || applySuccess) && (
                <p
                  role={applyError ? 'alert' : 'status'}
                  className={`mt-4 rounded-lg border px-4 py-3 text-[15px] ${
                    applyError
                      ? 'border-destructive/40 bg-destructive/10 text-destructive'
                      : 'border-success/40 bg-success/10 text-success'
                  }`}
                >
                  {applyError || applySuccess}
                </p>
              )}

              {isOwner && (
                <p className="mt-4 rounded-lg border border-border bg-surface px-4 py-3 text-[15px] text-muted-foreground">
                  {t('opp.isOwner')}
                </p>
              )}

              {opp.positions.length > 0 && (
                <div className="mt-4 space-y-4">
                  {opp.positions.map((pos) => {
                    const applied = appliedPositionIds.has(pos.id);
                    const applying = applyingId === pos.id;
                    return (
                      <div key={pos.id} className="rounded-xl border border-border bg-surface p-6">
                        <h2 className="text-xl font-bold">
                          {pos.nama} <span className="text-sm font-medium text-muted-foreground">· {pos.jumlahSlot} slot</span>
                        </h2>
                        {pos.deskripsi && <p className="mt-2 text-[15px] text-muted-foreground">{pos.deskripsi}</p>}
                        {pos.skillRequirements && pos.skillRequirements.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {pos.skillRequirements.map((r) => (
                              <span key={r.id} className="rounded-md border border-border bg-background px-2.5 py-1 text-sm">
                                {r.skill.nama} · {r.jenis}
                              </span>
                            ))}
                          </div>
                        )}

                        {!isOwner && (
                          <div className="mt-5 border-t border-border-subtle pt-5">
                            {applied ? (
                              <p className="text-[15px] font-semibold text-success">{t('opp.applied')}</p>
                            ) : (
                              <>
                                <label className="block">
                                  <span className="mb-1.5 block text-sm font-medium">
                                    {t('opp.applyMessageLabel')}
                                  </span>
                                  <textarea
                                    value={messages[pos.id] || ''}
                                    onChange={(e) =>
                                      setMessages((prev) => ({ ...prev, [pos.id]: e.target.value }))
                                    }
                                    placeholder={t('opp.applyMessagePlaceholder')}
                                    rows={3}
                                    maxLength={500}
                                    className="w-full rounded-lg border border-border bg-background px-3.5 py-3 text-[15px] leading-relaxed placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  />
                                </label>
                                <Button
                                  size="md"
                                  className="mt-3"
                                  disabled={applying}
                                  onClick={() => handleApply(pos.id)}
                                >
                                  {applying ? (
                                    <span className="flex items-center gap-2.5">
                                      <LoadingSpinner size="sm" />
                                      {t('opp.applying')}
                                    </span>
                                  ) : (
                                    t('opp.apply')
                                  )}
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          )}
        </div>
      </main>
    </div>
  );
}
