import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { useState, useEffect } from 'react'

export const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    setIsAuthenticated(!!token)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setIsAuthenticated(false)
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo with icon */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2 py-1 -ml-2"
            aria-label="TeamSearch home"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-accent"
            >
              <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
              <circle cx="15" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
              <path d="M11 9L13 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M7 9L5 14M17 14L19 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-xl font-bold tracking-tight">TeamSearch</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => navigate('/')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                isActive('/') || isActive('/opportunities')
                  ? 'text-foreground bg-surface-elevated'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface-elevated'
              }`}
            >
              Peluang
            </button>
            {isAuthenticated && (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                    isActive('/dashboard')
                      ? 'text-foreground bg-surface-elevated'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-elevated'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                    isActive('/profile') || location.pathname.startsWith('/profile/')
                      ? 'text-foreground bg-surface-elevated'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-elevated'
                  }`}
                >
                  Profil
                </button>
              </>
            )}
          </div>

          {/* Right Actions - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/opportunities/create')}>
                  Buat Peluang
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Keluar
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Masuk
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Daftar
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-md"
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
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/98 md:hidden overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeMobileMenu()
          }}
        >
          <div className="container mx-auto px-4 pt-20 pb-8">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate('/')
                  closeMobileMenu()
                }}
                className={`px-4 py-3 text-left text-base font-medium rounded-lg transition-colors ${
                  isActive('/') || isActive('/opportunities')
                    ? 'text-foreground bg-surface-elevated'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                }`}
              >
                Peluang
              </button>
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      navigate('/dashboard')
                      closeMobileMenu()
                    }}
                    className={`px-4 py-3 text-left text-base font-medium rounded-lg transition-colors ${
                      isActive('/dashboard')
                        ? 'text-foreground bg-surface-elevated'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      navigate('/profile')
                      closeMobileMenu()
                    }}
                    className={`px-4 py-3 text-left text-base font-medium rounded-lg transition-colors ${
                      isActive('/profile') || location.pathname.startsWith('/profile/')
                        ? 'text-foreground bg-surface-elevated'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                    }`}
                  >
                    Profil
                  </button>
                </>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-center"
                    onClick={() => {
                      navigate('/opportunities/create')
                      closeMobileMenu()
                    }}
                  >
                    Buat Peluang
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center"
                    onClick={() => {
                      handleLogout()
                      closeMobileMenu()
                    }}
                  >
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center"
                    onClick={() => {
                      navigate('/login')
                      closeMobileMenu()
                    }}
                  >
                    Masuk
                  </Button>
                  <Button
                    size="lg"
                    className="w-full justify-center"
                    onClick={() => {
                      navigate('/register')
                      closeMobileMenu()
                    }}
                  >
                    Daftar
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
