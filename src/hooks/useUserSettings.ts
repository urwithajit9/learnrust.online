import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface UserSettings {
  id: string;
  user_id: string;
  start_date: string;
}

export function useUserSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) {
      setSettings(null);
      setIsLoading(false);
      return;
    }

    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    if (!user || !isSupabaseConfigured()) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      setError(error.message);
    } else {
      setSettings(data);
    }
    setIsLoading(false);
  };

  const saveStartDate = async (startDate: Date) => {
    if (!user || !isSupabaseConfigured()) return { error: new Error('Not authenticated or Supabase not configured') };

    const dateStr = startDate.toISOString().split('T')[0];

    if (settings) {
      // Update existing
      const { error } = await supabase
        .from('user_settings')
        .update({ start_date: dateStr })
        .eq('user_id', user.id);

      if (!error) {
        setSettings({ ...settings, start_date: dateStr });
      }
      return { error };
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('user_settings')
        .insert({ user_id: user.id, start_date: dateStr })
        .select()
        .single();

      if (!error && data) {
        setSettings(data);
      }
      return { error };
    }
  };

  return { settings, isLoading, error, saveStartDate, refetch: fetchSettings };
}
