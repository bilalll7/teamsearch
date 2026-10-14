import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Navbar } from '../components/navbar-v2'

export const LandingPage = () => {
  const navigate = useNavigate()

  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Showcase your skills, experience, and what you bring to a team.',
    },
    {
      number: '02',
      title: 'Browse Opportunities',
      description: 'Find competitions, hackathons, and projects looking for teammates.',
    },
    {
      number: '03',
      title: 'Connect & Build',
      description: 'Join teams with complementary skills and start building together.',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section - Asymmetric Layout */}
      <section className="relative min-h-screen flex items-center pt-18">
        <div className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Find teammates who
                <span className="block text-accent mt-2">complete your team</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Connect with skilled students for competitions, hackathons, and projects. Match by expertise, not luck.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate('/opportunities')}>
                  View Opportunities
                </Button>
              </div>
            </div>

            {/* Right: Visual Element - Skill Match Preview */}
            <div className="relative lg:block hidden">
              <div className="space-y-4">
                {/* Card 1 - Active Match */}
                <div className="bg-surface border border-primary p-6 rounded-xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">UI/UX Designer Needed</h3>
                      <p className="text-sm text-muted-foreground">Hackathon • 2-4 members</p>
                    </div>
                    <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">
                      98% Match
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full">Figma</span>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full">Design Systems</span>
                    <span className="px-3 py-1 bg-surface-elevated text-muted-foreground text-sm rounded-full">React</span>
                  </div>
                </div>

                {/* Card 2 - Secondary Match */}
                <div className="bg-surface border border-border p-6 rounded-xl transform -rotate-1 hover:rotate-0 transition-transform duration-300 opacity-75 hover:opacity-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Backend Developer</h3>
                      <p className="text-sm text-muted-foreground">Startup Project • 3-5 members</p>
                    </div>
                    <span className="px-3 py-1 bg-surface-elevated text-muted-foreground text-sm font-medium rounded-full">
                      85% Match
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Node.js</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">PostgreSQL</span>
                    <span className="px-3 py-1 bg-surface-elevated text-muted-foreground text-sm rounded-full">AWS</span>
                  </div>
                </div>

                {/* Card 3 - Tertiary */}
                <div className="bg-surface border border-border p-6 rounded-xl opacity-50 hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Data Scientist</h3>
                      <p className="text-sm text-muted-foreground">Research • 2 members</p>
                    </div>
                    <span className="px-3 py-1 bg-surface-elevated text-muted-foreground text-sm font-medium rounded-full">
                      72% Match
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-surface-elevated text-muted-foreground text-sm rounded-full">Python</span>
                    <span className="px-3 py-1 bg-surface-elevated text-muted-foreground text-sm rounded-full">ML</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-t border-border-subtle">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border to-transparent"></div>
                )}
                
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-surface border border-border text-2xl font-bold text-accent">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 border-t border-border-subtle">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Ready to find your team?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join students building the next generation of projects, one team at a time.
            </p>
            <Button size="lg" onClick={() => navigate('/register')}>
              Create Your Profile
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-sm text-muted-foreground">
              © 2026 TeamSearch. Built for builders.
            </div>
            <div className="flex items-center gap-8">
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
