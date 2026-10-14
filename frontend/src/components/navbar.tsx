import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Avatar } from './ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { cn } from './ui/cn'

interface NavbarProps {
  user?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  onLogout?: () => void
}

export const Navbar = ({ user, onLogout }: NavbarProps) => {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogoClick = () => {
    navigate('/')
  }

  const handleDashboardClick = () => {
    navigate('/dashboard')
  }

  const handleOpportunitiesClick = () => {
    navigate('/opportunities')
  }

  const handleSearchClick = () => {
    navigate('/search')
  }

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full border-b border-neutral-200 bg-white transition-shadow',
        isScrolled ? 'shadow-sm' : 'shadow-none'
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2" onClick={handleLogoClick} role="button" tabIndex={0}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <span className="text-xl font-bold text-neutral-900" onClick={handleLogoClick}>TeamSearch</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <Button variant="ghost" onClick={handleDashboardClick}>Dashboard</Button>
          <Button variant="ghost" onClick={handleOpportunitiesClick}>Opportunities</Button>
          <Button variant="ghost" onClick={handleSearchClick}>Search</Button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                  <Avatar src={user.avatar} fallback={user.name.charAt(0)} className="h-8 w-8" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                    <path d="M12.22 2h-.44a2 2 0 0 1-2-2v-.18a2 2 0 0 1-1-1.73l-.43-.25a2 2 0 0 1-1.27-.14l-.55-.26a2 2 0 0 1-1-1.73v-.17a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 1.27-.14l.55-.26a2 2 0 0 1 1.73 1l.25.43a2 2 0 0 1 .14 1.27v.44a2 2 0 0 1-2 2h-.18a2 2 0 0 1-1.73 1l-.25.43a2 2 0 0 1-.14 1.27l.26.55a2 2 0 0 1 1 1.73v.17a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-1.27.14l-.55.26a2 2 0 0 1-1.73-1l-.26-.43a2 2 0 0 1-.14-1.27v-.55a2 2 0 0 1 1-1.73l.25-.43a2 2 0 0 1 1.27-.14l.43-.25a2 2 0 0 1 1.73 1v.44a2 2 0 0 1 2 2h.18a2 2 0 0 1 1.73 1l.25.43a2 2 0 0 1 .14 1.27l-.26.55a2 2 0 0 1-1 1.73v.17a2 2 0 0 1 1 1.73l.43.25a2 2 0 0 1 1.27.14l.55.26a2 2 0 0 1 1.73-1l.26-.43a2 2 0 0 1 .14-1.27v-.44a2 2 0 0 1 2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
              <Button onClick={() => navigate('/register')}>Sign up</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
