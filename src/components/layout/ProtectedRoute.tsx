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
  const { user, isLoading: authLoading } = useAuth();
  const { settings, isLoading: settingsLoading } = useUserSettings();

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
