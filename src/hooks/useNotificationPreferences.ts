import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface NotificationPreferences {
  id: string;
  user_id: string;
  channel: 'telegram' | 'email' | 'whatsapp';
  enabled: boolean;
  delivery_time: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export function useNotificationPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) {
      setPreferences([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', user.id);

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setPreferences(data || []);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const getChannelPreference = useCallback((channel: 'telegram' | 'email' | 'whatsapp') => {
    return preferences.find(p => p.channel === channel) || null;
  }, [preferences]);

  const savePreference = async (
    channel: 'telegram' | 'email' | 'whatsapp',
    enabled: boolean,
    deliveryTime: string,
    timezone: string = 'UTC'
  ) => {
    if (!user || !isSupabaseConfigured()) {
      return { error: new Error('Not authenticated or Supabase not configured') };
    }

    const existing = getChannelPreference(channel);

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('user_notifications')
        .update({
          enabled,
          delivery_time: deliveryTime,
          timezone,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (!error) {
        await fetchPreferences();
      }
      return { error };
    } else {
      // Insert new
      const { error } = await supabase
        .from('user_notifications')
        .insert({
          user_id: user.id,
          channel,
          enabled,
          delivery_time: deliveryTime,
          timezone
        });

      if (!error) {
        await fetchPreferences();
      }
      return { error };
    }
  };

  const deletePreference = async (channel: 'telegram' | 'email' | 'whatsapp') => {
    if (!user || !isSupabaseConfigured()) {
      return { error: new Error('Not authenticated or Supabase not configured') };
    }

    const { error } = await supabase
      .from('user_notifications')
      .delete()
      .eq('user_id', user.id)
      .eq('channel', channel);

    if (!error) {
      await fetchPreferences();
    }
    return { error };
  };

  return {
    preferences,
    isLoading,
    error,
    getChannelPreference,
    savePreference,
    deletePreference,
    refetch: fetchPreferences
  };
}
