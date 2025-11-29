import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, BarChart3, Settings, Bell, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  progress: number;
  onNotificationClick: () => void;
}

const navLinks = [
  { path: '/', label: 'Home', icon: BookOpen },
  { path: '/curriculum', label: 'Calendar', icon: Calendar },
  { path: '/progress', label: 'Progress', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Navbar({ progress, onNotificationClick }: NavbarProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Learn<span className="text-primary">Rust</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button
                  variant={location.pathname === path ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'gap-2',
                    location.pathname === path && 'bg-secondary text-secondary-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-medium text-muted-foreground">Progress</span>
              <div className="flex items-center gap-2">
                <Progress value={progress} className="h-2 w-24" />
                <span className="text-sm font-bold">{progress}%</span>
              </div>
            </div>
            
            <div className="h-8 w-px bg-border" />
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onNotificationClick}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link 
                  key={path} 
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={location.pathname === path ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-3"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm text-muted-foreground">Progress: {progress}%</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    onNotificationClick();
                    setMobileMenuOpen(false);
                  }}
                  className="gap-2"
                >
                  <Bell className="h-4 w-4" />
                  Alerts
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
