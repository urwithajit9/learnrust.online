import { ReactNode } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { Loader2, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: ReactNode;
  requireStartDate?: boolean;
}

export function ProtectedRoute({ children, requireStartDate = false }: ProtectedRouteProps) {
  const { user, isLoading: authLoading, isConfigured } = useAuth();
  const { settings, isLoading: settingsLoading } = useUserSettings();
  const location = useLocation();

  // If Supabase is not configured, show an error message
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Configuration Required</h1>
          <p className="text-muted-foreground">
            Supabase is not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly.
          </p>
        </div>
      </div>
    );
  }

  if (authLoading || (user && settingsLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Only show schedule prompt if requireStartDate is true AND user has no start_date
  if (requireStartDate && !settings?.start_date) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Schedule Required</h1>
            <p className="text-muted-foreground">
              You need to set your learning schedule before accessing this feature. 
              This helps us personalize your curriculum.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/setup">
              <Button className="gap-2">
                <Calendar className="h-4 w-4" />
                Set Your Schedule
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
