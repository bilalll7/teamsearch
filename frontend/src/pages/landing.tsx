import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { useTranslation } from 'react-i18next'
import api from '../lib/api'

interface LiveOpportunity {
  id: string
  judul: string
  jenis: string
  kategori: string
  mode: string
  owner: { profile: { namaTampilan: string } }
  positions: Array<{ id: string; nama: string; jumlahSlot: number }>
}

export const LandingPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [live, setLive] = useState<LiveOpportunity[]>([])
  const [liveLoading, setLiveLoading] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    let cancelled = false
    api
      .get('/opportunities?status=open')
      .then(({ data }) => {
        if (!cancelled) setLive(Array.isArray(data) ? data.slice(0, 6) : [])
      })
      .catch(() => {
        if (!cancelled) setLive([])
      })
      .finally(() => {
        if (!cancelled) setLiveLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const faqs = [
    { q: t('landing.faq.q1'), a: t('landing.faq.a1') },
    { q: t('landing.faq.q2'), a: t('landing.faq.a2') },
    { q: t('landing.faq.q3'), a: t('landing.faq.a3') },
    { q: t('landing.faq.q4'), a: t('landing.faq.a4') },
  ]

  const steps = [
    {
      number: '01',
      title: t('landing.howItWorks.step1.title'),
      description: t('landing.howItWorks.step1.description'),
    },
    {
      number: '02',
      title: t('landing.howItWorks.step2.title'),
      description: t('landing.howItWorks.step2.description'),
    },
    {
      number: '03',
      title: t('landing.howItWorks.step3.title'),
      description: t('landing.howItWorks.step3.description'),
    },
  ]

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-background text-foreground">
      <main className="w-full pt-16">
        {/* Hero — full viewport height, How It Works pushed below fold */}
        <section className="flex w-full items-center border-b border-border-subtle lg:min-h-[calc(100vh-4rem)]">
          <div className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              {/* Left: headline + CTA */}
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  {t('landing.hero.eyebrow')}
                </p>
                <h1 className="mt-5 text-[2.75rem] font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4rem]">
                  {t('landing.hero.title')}
                  <span className="mt-1 block text-accent">{t('landing.hero.subtitle')}</span>
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  {t('landing.hero.description')}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button size="lg" onClick={() => navigate('/register')}>
                    {t('landing.hero.getStarted')}
                  </Button>
                  <Button size="lg" variant="secondary" onClick={() => navigate('/opportunities')}>
                    {t('landing.hero.viewOpportunities')}
                  </Button>
                </div>
              </div>

              {/* Right: product preview panel */}
              <div className="w-full min-w-0 overflow-hidden rounded-xl border border-border bg-surface">
                {/* Window bar */}
                <div className="flex items-center gap-3 border-b border-border-subtle px-5 py-3.5">
                  <div className="flex gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                  </div>
                  <span className="truncate font-mono text-[13px] text-muted-foreground">
                    teamsearch.app/{t('landing.preview.path')}
                  </span>
                  <span className="ml-auto shrink-0 text-[13px] font-medium text-muted-foreground">
                    {t('landing.preview.badge')}
                  </span>
                </div>

                {/* Example listing */}
                <div className="p-6 md:p-7">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {t('landing.preview.exampleLabel')}
                  </p>
                  <div className="mt-2.5 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-[22px] font-bold tracking-tight">UI/UX Designer</h2>
                      <p className="mt-1 text-[15px] text-muted-foreground">
                        {t('landing.preview.meta')}
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 text-[15px] font-semibold text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                      {t('landing.preview.neededBadge')}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <span className="text-[15px] text-muted-foreground">
                      {t('landing.preview.slots')}
                    </span>
                    <span className="flex items-center gap-2.5">
                      <span className="flex gap-1.5" aria-hidden="true">
                        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        <span className="h-2.5 w-2.5 rounded-full border border-border" />
                      </span>
                      <span className="text-[15px] font-semibold">3/4</span>
                    </span>
                  </div>

                  <hr className="my-5 border-border-subtle" />

                  <p className="text-[15px] font-medium">{t('landing.preview.skillsLabel')}</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <span className="rounded-md border border-border bg-background px-2.5 py-1 text-sm text-foreground">
                      Figma
                    </span>
                    <span className="rounded-md border border-border bg-background px-2.5 py-1 text-sm text-foreground">
                      Design System
                    </span>
                    <span className="rounded-md border border-border bg-background px-2.5 py-1 text-sm text-muted-foreground">
                      Prototyping
                    </span>
                  </div>
                </div>

                {/* Preview footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle px-6 py-4 md:px-7">
                  <p className="text-[15px] text-muted-foreground">
                    {t('landing.preview.footerNote')}{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="font-semibold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {t('landing.preview.footerAction')}
                    </button>
                  </p>
                  <button
                    onClick={() => navigate('/opportunities')}
                    className="shrink-0 text-[15px] font-semibold text-foreground hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {t('landing.preview.viewAll')} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works — content-height section */}
        <section className="w-full border-b border-border-subtle">
          <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-12 md:pt-20 md:pb-16 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {t('landing.howItWorks.eyebrow')}
              </p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-[2.75rem] md:leading-[1.1]">
                {t('landing.howItWorks.title')}
              </h2>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {t('landing.howItWorks.lead')}
              </p>
            </div>

            <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-3 md:gap-8 lg:gap-12">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`border-t-2 pt-6 ${
                    index === 0 ? 'border-primary' : 'border-border'
                  }`}
                >
                  <span className="font-mono text-sm font-semibold text-muted-foreground">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Paths — two functional entry points */}
        <section className="w-full border-b border-border-subtle">
          <div className="mx-auto w-full max-w-7xl px-6 py-16 md:py-20 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {t('landing.paths.eyebrow')}
              </p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-[2.75rem] md:leading-[1.1]">
                {t('landing.paths.title')}
              </h2>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {t('landing.paths.lead')}
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2 md:gap-8">
              <div className="flex flex-col rounded-xl border border-border bg-surface p-6 md:p-8">
                <h3 className="text-xl font-semibold tracking-tight">{t('landing.paths.create.title')}</h3>
                <p className="mt-2 flex-1 text-[17px] leading-relaxed text-muted-foreground">
                  {t('landing.paths.create.description')}
                </p>
                <Button size="lg" className="mt-6 self-start" onClick={() => navigate('/opportunities/create')}>
                  {t('landing.paths.create.action')}
                </Button>
              </div>
              <div className="flex flex-col rounded-xl border border-border bg-surface p-6 md:p-8">
                <h3 className="text-xl font-semibold tracking-tight">{t('landing.paths.join.title')}</h3>
                <p className="mt-2 flex-1 text-[17px] leading-relaxed text-muted-foreground">
                  {t('landing.paths.join.description')}
                </p>
                <Button size="lg" variant="secondary" className="mt-6 self-start" onClick={() => navigate('/opportunities')}>
                  {t('landing.paths.join.action')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Live board — real data, no mock */}
        <section className="w-full border-b border-border-subtle">
          <div className="mx-auto w-full max-w-7xl px-6 py-16 md:py-20 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-3xl">
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t('landing.live.eyebrow')}
                </p>
                <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-[2.75rem] md:leading-[1.1]">
                  {t('landing.live.title')}
                </h2>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  {t('landing.live.lead')}
                </p>
              </div>
              <button
                onClick={() => navigate('/opportunities')}
                className="shrink-0 text-[15px] font-semibold text-foreground hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t('landing.live.viewAll')} →
              </button>
            </div>

            <div className="mt-8 md:mt-10">
              {liveLoading ? (
                <div className="flex items-center gap-3">
                  <LoadingSpinner text={t('landing.live.loading')} />
                </div>
              ) : live.length === 0 ? (
                <div className="rounded-xl border border-border bg-surface p-8 text-center md:p-10">
                  <h3 className="text-xl font-semibold">{t('landing.live.emptyTitle')}</h3>
                  <p className="mx-auto mt-2 max-w-md text-[15px] text-muted-foreground">
                    {t('landing.live.emptyDescription')}
                  </p>
                  <Button size="lg" className="mt-6" onClick={() => navigate('/opportunities/create')}>
                    {t('landing.live.create')}
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {live.map((opp) => (
                    <button
                      key={opp.id}
                      onClick={() => navigate(`/opportunities/${opp.id}`)}
                      className="flex flex-col rounded-xl border border-border bg-surface p-6 text-left transition-colors hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="text-sm text-muted-foreground">
                        {opp.jenis} · {opp.kategori} · {opp.mode}
                      </span>
                      <span className="mt-2 text-lg font-bold leading-snug">{opp.judul}</span>
                      <span className="mt-1 text-sm text-muted-foreground">{opp.owner.profile.namaTampilan}</span>
                      <span className="mt-4 border-t border-border-subtle pt-4 text-sm font-medium text-muted-foreground">
                        {opp.positions.length} {t('landing.live.roles')}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ — short, scannable */}
        <section className="w-full border-b border-border-subtle">
          <div className="mx-auto w-full max-w-7xl px-6 py-16 md:py-20 lg:px-8">
            <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t('landing.faq.eyebrow')}
                </p>
                <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-[2.75rem] md:leading-[1.1]">
                  {t('landing.faq.title')}
                </h2>
                <p className="mt-3 max-w-md text-lg leading-relaxed text-muted-foreground">
                  {t('landing.faq.lead')}
                </p>
              </div>
              <div className="divide-y divide-border-subtle border-y border-border-subtle">
                {faqs.map((item, i) => {
                  const open = openFaq === i
                  return (
                    <div key={i}>
                      <button
                        onClick={() => setOpenFaq(open ? null : i)}
                        aria-expanded={open}
                        className="flex w-full items-center justify-between gap-4 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="text-[17px] font-semibold">{item.q}</span>
                        <span className={`shrink-0 text-xl text-muted-foreground transition-transform duration-200 ${open ? 'rotate-45' : ''}`} aria-hidden="true">
                          +
                        </span>
                      </button>
                      {open && (
                        <p className="pb-5 text-[15px] leading-relaxed text-muted-foreground">{item.a}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="w-full">
          <div className="mx-auto w-full max-w-7xl px-6 py-16 md:py-20 lg:px-8">
            <div className="grid gap-8 rounded-2xl border border-border bg-surface p-8 sm:p-10 md:grid-cols-[1fr_auto] md:items-center md:p-12">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t('landing.cta.eyebrow')}
                </p>
                <h2 className="mt-3 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                  {t('landing.cta.title')}
                </h2>
                <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  {t('landing.cta.description')}
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center md:flex-col">
                <Button size="lg" onClick={() => navigate('/register')}>
                  {t('landing.cta.button')}
                </Button>
                <button
                  onClick={() => navigate('/opportunities')}
                  className="text-center text-[15px] font-semibold text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {t('landing.hero.viewOpportunities')} →
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer — full-width */}
      <footer className="w-full border-t border-border-subtle">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-muted-foreground">
              {t('landing.footer.copyright')}
            </div>
            <div className="flex items-center gap-6">
              <button className="text-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {t('landing.footer.about')}
              </button>
              <button className="text-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {t('landing.footer.privacy')}
              </button>
              <button className="text-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {t('landing.footer.terms')}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
