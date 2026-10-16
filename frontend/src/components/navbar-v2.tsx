import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../contexts/ThemeContext'
import api from '../lib/api'

export const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    setIsAuthenticated(!!token)
    if (token) {
      api.get('/profile/me').then(({ data }) => {
        if (data?.namaTampilan) setDisplayName(data.namaTampilan)
      }).catch(() => {})
    } else {
      setDisplayName('')
    }
  }, [location])

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const label = displayName || 'Akun'
  const initial = label.trim().charAt(0).toUpperCase()

  // Lock body scroll when mobile menu open, restore on close
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setIsAuthenticated(false)
    setDisplayName('')
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
    navigate('/login')
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'id' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  const isActive = (path: string) => location.pathname === path
  const closeMobileMenu = () => setMobileMenuOpen(false)
  const go = (path: string) => {
    navigate(path)
    closeMobileMenu()
  }

  const navLink = (path: string, label: string, extraActive?: boolean) => {
    const active = isActive(path) || !!extraActive
    return (
      <button
        onClick={() => go(path)}
        aria-current={active ? 'page' : undefined}
        className={`relative rounded-md px-3 py-2 text-[15px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          active
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {label}
        <span
          aria-hidden="true"
          className={`absolute inset-x-3 -bottom-px h-0.5 origin-left rounded-full bg-primary transition-transform duration-200 ${
            active ? 'scale-x-100' : 'scale-x-0'
          }`}
        />
      </button>
    )
  }

  return (
    <>
      <nav data-fixed-navbar className="fixed inset-x-0 top-0 z-50 w-full border-b border-border-subtle bg-background backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Wordmark */}
          <button
            onClick={() => go('/')}
            className="flex items-center gap-2 rounded-md px-1 py-1 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="TeamSearch home"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-accent"
              aria-hidden="true"
            >
              <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
              <circle cx="15" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
              <path d="M11 9L13 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M7 9L5 14M17 14L19 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-[17px] font-bold tracking-tight">TeamSearch</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLink('/', t('nav.home'))}
            {navLink('/opportunities', t('nav.opportunities'), location.pathname.startsWith('/opportunities'))}
            {isAuthenticated && navLink('/dashboard', t('nav.dashboard'))}
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-1 md:flex">
            <button
              onClick={toggleLanguage}
              className="rounded-md px-2.5 py-2 text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Toggle language"
            >
              {i18n.language === 'en' ? 'EN' : 'ID'}
            </button>
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
            {isAuthenticated ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-elevated/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white" aria-hidden="true">
                    {initial}
                  </span>
                  <span className="max-w-28 truncate text-[15px] font-medium text-foreground">
                    {label}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`text-muted-foreground transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-lg border border-border bg-surface p-1.5 shadow-2xl">
                    <button
                      role="menuitem"
                      onClick={() => { setUserMenuOpen(false); go('/dashboard') }}
                      className="flex w-full items-center rounded-md px-3 py-2.5 text-left text-[15px] text-muted-foreground transition-colors hover:bg-surface-elevated/60 hover:text-foreground"
                    >
                      {t('nav.menu.myteams')}
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => { setUserMenuOpen(false); go('/opportunities') }}
                      className="flex w-full items-center rounded-md px-3 py-2.5 text-left text-[15px] text-muted-foreground transition-colors hover:bg-surface-elevated/60 hover:text-foreground"
                    >
                      {t('nav.menu.findteam')}
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => { setUserMenuOpen(false); go('/profile') }}
                      className="flex w-full items-center rounded-md px-3 py-2.5 text-left text-[15px] text-muted-foreground transition-colors hover:bg-surface-elevated/60 hover:text-foreground"
                    >
                      {t('nav.menu.profile')}
                    </button>
                    <div className="my-1 h-px bg-border" aria-hidden="true" />
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center rounded-md px-3 py-2.5 text-left text-[15px] text-destructive transition-colors hover:bg-destructive/10"
                    >
                      {t('nav.menu.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => go('/login')}
                  className="rounded-md px-3 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {t('nav.login')}
                </button>
                <Button size="sm" onClick={() => go('/register')}>
                  {t('nav.signup')}
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M3 12h18" />
                  <path d="M3 6h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile panel — dropdown, no overlay, no overflow */}
        {mobileMenuOpen && (
          <div className="w-full border-t border-border-subtle bg-background md:hidden">
            <div className="mx-auto w-full max-w-7xl space-y-1 px-6 py-4">
              <button
                onClick={() => go('/')}
                className={`block w-full rounded-md px-3 py-2.5 text-left text-base font-medium ${
                  isActive('/')
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {t('nav.home')}
              </button>
              <button
                onClick={() => go('/opportunities')}
                className={`block w-full rounded-md px-3 py-2.5 text-left text-base font-medium ${
                  location.pathname.startsWith('/opportunities')
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {t('nav.opportunities')}
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => go('/dashboard')}
                  className="block w-full rounded-md px-3 py-2.5 text-left text-base font-medium text-muted-foreground"
                >
                  {t('nav.dashboard')}
                </button>
              )}
              <div className="flex items-center gap-1 border-t border-border-subtle pt-3">
                <button
                  onClick={toggleLanguage}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground"
                  aria-label="Toggle language"
                >
                  {i18n.language === 'en' ? 'EN' : 'ID'}
                </button>
                <button
                  onClick={toggleTheme}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="5" />
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white" aria-hidden="true">
                      {initial}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-base font-medium text-foreground">
                      {label}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="shrink-0 rounded-md px-2 py-1.5 text-sm font-medium text-destructive"
                    >
                      {t('nav.menu.logout')}
                    </button>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" size="md" className="w-full" onClick={() => go('/login')}>
                      {t('nav.login')}
                    </Button>
                    <Button size="md" className="w-full" onClick={() => go('/register')}>
                      {t('nav.signup')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
