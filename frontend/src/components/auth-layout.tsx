import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export const AuthLayout = ({ children, title, description }: AuthLayoutProps) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border-subtle bg-surface/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-18 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-lg px-2 -mx-2"
          >
            TeamSearch
          </button>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Log in
            </Button>
            <Button variant="ghost" onClick={() => navigate('/register')}>
              Sign up
            </Button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-surface border border-border rounded-xl p-8 space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            {children}
          </div>

          {/* Additional info */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Looking for your campus? Contact us to add your institution.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2026 TeamSearch</p>
            <div className="flex items-center gap-6">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
