import { useState } from 'react'
import type { ReactElement } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthLayout } from '../components/auth-layout'
import { Button } from '../components/ui/button'
import { LoadingSpinner } from '../components/LoadingSpinner'
import api from '../lib/api'

export const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const requestedFrom = (location.state as { from?: string } | null)?.from
  const from = requestedFrom?.startsWith('/') && !requestedFrom.startsWith('//') ? requestedFrom : '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title={t('auth.login.title')} description={t('auth.login.description')} type="login">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-foreground">
            {t('auth.email')}
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex h-12 w-full rounded-lg border border-border bg-background px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            required
          />
          <p className="text-[13px] text-muted-foreground">{t('auth.allowedHint')}</p>
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-semibold text-foreground">
            {t('auth.password')}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex h-12 w-full rounded-lg border border-border bg-background px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            required
            minLength={8}
          />
          <p className="text-[13px] text-muted-foreground">Gunakan akun yang sudah kamu daftarkan.</p>
        </div>
        <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2.5">
              <LoadingSpinner size="sm" />
              {t('common.loading')}
            </span>
          ) : (
            t('auth.signIn')
          )}
        </Button>
        <div className="text-center text-sm text-muted-foreground pt-2">
          {t('auth.noAccount')}{' '}
          <button
            type="button"
            onClick={() => navigate('/register', { state: { from } })}
            className="text-accent hover:text-accent-hover underline underline-offset-4"
          >
            {t('auth.signUp')}
          </button>
        </div>
      </form>
    </AuthLayout>
  )
}

export const RequireAuth = ({ children }: { children: ReactElement }) => {
  const location = useLocation()
  if (!localStorage.getItem('accessToken')) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}
