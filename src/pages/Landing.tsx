import { Link } from 'react-router-dom';
import { BookOpen, Calendar, BarChart3, CheckCircle, Clock, Target, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  {
    icon: Calendar,
    title: '121-Day Curriculum',
    description: 'Structured day-by-day learning path from basics to advanced Rust concepts.',
  },
  {
    icon: CheckCircle,
    title: 'Progress Tracking',
    description: 'Mark lessons complete and visualize your learning journey.',
  },
  {
    icon: Clock,
    title: 'Flexible Schedule',
    description: 'Set your own start date and learn at your own pace.',
  },
  {
    icon: Target,
    title: 'Hands-on Challenges',
    description: 'Practice with code challenges and real-world examples.',
  },
];

const phases = [
  { phase: 1, title: 'Foundations', days: '1-30', color: 'bg-emerald-500' },
  { phase: 2, title: 'Intermediate', days: '31-60', color: 'bg-blue-500' },
  { phase: 3, title: 'Advanced', days: '61-100', color: 'bg-purple-500' },
  { phase: 4, title: 'Capstone', days: '101-121', color: 'bg-orange-500' },
];

export default function Landing() {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Learn<span className="text-primary">Rust</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="h-9 w-20 animate-pulse bg-muted rounded-md" />
              ) : user ? (
                <Link to="/dashboard">
                  <Button className="gap-2">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth?mode=login">
                    <Button variant="ghost" className="gap-2">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth?mode=signup">
                    <Button className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span className="text-lg">🦀</span>
            121 Days to Rust Mastery
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Learn Rust the <span className="text-primary">Right Way</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A structured, day-by-day curriculum that takes you from beginner to advanced Rust programmer 
            with hands-on challenges and progress tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 text-lg px-8">
                  Continue Learning
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="gap-2 text-lg px-8">
                    Start Learning Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth?mode=login">
                  <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Everything You Need to Learn Rust
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="p-6 rounded-xl bg-card border border-border">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-4">
            Your Learning Path
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Progress through four phases, from Rust fundamentals to building a capstone project.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {phases.map(({ phase, title, days, color }) => (
              <div key={phase} className="p-5 rounded-xl bg-card border border-border text-center">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${color} text-white font-bold mb-3`}>
                  {phase}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">Days {days}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Start Your Rust Journey?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of developers learning Rust with our structured curriculum.
          </p>
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                Go to Dashboard
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gap-2">
                Create Free Account
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} LearnRust. Built with 🦀</p>
        </div>
      </footer>
    </div>
  );
}
