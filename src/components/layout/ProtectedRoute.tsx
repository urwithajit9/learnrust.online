import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/hooks/useUserSettings';

interface ProtectedRouteProps {
  children: ReactNode;
  requireStartDate?: boolean;
}

export function ProtectedRoute({ children, requireStartDate = true }: ProtectedRouteProps) {
  const { user, isLoading: authLoading, isConfigured } = useAuth();
  const { settings, isLoading: settingsLoading } = useUserSettings();

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
    return <Navigate to="/auth" replace />;
  }

  if (requireStartDate && !settings?.start_date) {
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
}
