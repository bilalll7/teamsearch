import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthLayout } from '../components/auth-layout'
import { Button } from '../components/ui/button'
import { LoadingSpinner } from '../components/LoadingSpinner'
import api from '../lib/api'

export const RegisterPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: string } | null)?.from ?? '/profile'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter');
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { email, password })
      if (data?.accessToken) {
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        navigate(from, { replace: true })
      } else {
        navigate('/login', { state: { from } })
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title={t('auth.register.title')} description={t('auth.register.description')} type="register">
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
        </div>
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
            Konfirmasi kata sandi
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="flex h-12 w-full rounded-lg border border-border bg-background px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            required
          />
        </div>
        <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2.5">
              <LoadingSpinner size="sm" />
              {t('common.loading')}
            </span>
          ) : (
            t('auth.createAccount')
          )}
        </Button>
        <div className="text-center text-sm text-muted-foreground pt-2">
          {t('auth.hasAccount')}{' '}
          <button
            type="button"
            onClick={() => navigate('/login', { state: { from } })}
            className="text-accent hover:text-accent-hover underline underline-offset-4"
          >
            {t('auth.signInLink')}
          </button>
        </div>
      </form>
    </AuthLayout>
  )
}
