import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Dropdown } from '../components/Dropdown';
import api from '../lib/api';

const inputCls =
  'h-12 w-full rounded-lg border border-border bg-surface px-3.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring';

const labelCls = 'mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground';
const hintCls = 'mt-1.5 text-[13px] text-muted-foreground';

export default function CreateOpportunityPage() {
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    jenis: 'lomba',
    kategori: '',
    mode: 'online',
    tenggat: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const set = (key: keyof typeof formData) => (value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        judul: formData.judul.trim(),
        deskripsi: formData.deskripsi.trim(),
        jenis: formData.jenis,
        kategori: formData.kategori.trim(),
        mode: formData.mode,
        ...(formData.tenggat ? { tenggat: new Date(formData.tenggat).toISOString() } : {}),
      };
      const { data } = await api.post('/opportunities', payload);
      navigate(data?.id ? `/opportunities/${data.id}` : '/opportunities');
    } catch (err: any) {
      const message = err.response?.data?.message;
      setError(Array.isArray(message) ? message.join(', ') : message || t('create.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-background text-foreground">
      <main className="w-full pt-16">
        <section className="w-full border-b border-border-subtle">
          <div className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
            <button
              onClick={() => navigate('/opportunities')}
              className="text-[15px] font-medium text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              ← {t('create.back')}
            </button>
            <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t('create.eyebrow')}
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-[2.75rem] md:leading-[1.1]">
              {t('create.title')}
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t('create.lead')}
            </p>

            <form onSubmit={handleSubmit} className="mt-10 rounded-xl border border-border bg-surface p-6 md:p-8">
              {error && (
                <p role="alert" className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-[15px] text-destructive">
                  {error}
                </p>
              )}

              <div className="space-y-6">
                <label className="block">
                  <span className={labelCls}>
                    {t('create.titleLabel')} <span className="text-destructive">*</span>
                  </span>
                  <input
                    type="text"
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    placeholder={t('create.titlePlaceholder')}
                    maxLength={200}
                    required
                    className={inputCls}
                  />
                </label>

                <label className="block">
                  <span className={labelCls}>
                    {t('create.descLabel')} <span className="text-destructive">*</span>
                  </span>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    placeholder={t('create.descPlaceholder')}
                    rows={6}
                    maxLength={2000}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3.5 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <span className={hintCls}>{formData.deskripsi.length}/2000</span>
                </label>

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelCls}>
                      {t('create.jenisLabel')} <span className="text-destructive">*</span>
                    </span>
                    <Dropdown
                      value={formData.jenis}
                      onChange={set('jenis')}
                      ariaLabel={t('create.jenisLabel')}
                      options={[
                        { value: 'lomba', label: 'Lomba' },
                        { value: 'proyek', label: 'Proyek' },
                      ]}
                    />
                  </label>
                  <label className="block">
                    <span className={labelCls}>
                      {t('create.modeLabel')} <span className="text-destructive">*</span>
                    </span>
                    <Dropdown
                      value={formData.mode}
                      onChange={set('mode')}
                      ariaLabel={t('create.modeLabel')}
                      options={[
                        { value: 'online', label: 'Online' },
                        { value: 'offline', label: 'Offline' },
                        { value: 'hybrid', label: 'Hybrid' },
                      ]}
                    />
                  </label>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelCls}>
                      {t('create.kategoriLabel')} <span className="text-destructive">*</span>
                    </span>
                    <input
                      type="text"
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                      placeholder={t('create.kategoriPlaceholder')}
                      maxLength={100}
                      required
                      className={inputCls}
                    />
                  </label>
                  <label className="block">
                    <span className={labelCls}>{t('create.tenggatLabel')}</span>
                    <input
                      type="date"
                      value={formData.tenggat}
                      onChange={(e) => setFormData({ ...formData, tenggat: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className={inputCls}
                    />
                  </label>
                </div>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border-subtle pt-6 sm:flex-row sm:justify-end">
                <Button size="lg" variant="secondary" type="button" onClick={() => navigate('/opportunities')}>
                  {t('create.cancel')}
                </Button>
                <Button size="lg" type="submit" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2.5">
                      <LoadingSpinner size="sm" />
                      {t('create.submitting')}
                    </span>
                  ) : (
                    t('create.submit')
                  )}
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
