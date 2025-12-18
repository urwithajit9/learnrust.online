import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface TelegramStatus {
  id: string;
  user_id: string;
  telegram_chat_id: number | null;
  activation_code: number;
  status: 'pending' | 'connected';
  created_at: string;
  updated_at: string;
}

export function useTelegramActivation() {
  const { user } = useAuth();
  const [telegramStatus, setTelegramStatus] = useState<TelegramStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTelegramStatus = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) {
      setTelegramStatus(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('user_telegram')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setTelegramStatus(data);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTelegramStatus();
  }, [fetchTelegramStatus]);

  const generateActivationCode = async (): Promise<{ code: number | null; error: Error | null }> => {
    if (!user || !isSupabaseConfigured()) {
      return { code: null, error: new Error('Not authenticated or Supabase not configured') };
    }

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000);

    if (telegramStatus) {
      // Update existing record with new code
      const { error } = await supabase
        .from('user_telegram')
        .update({
          activation_code: code,
          status: 'pending',
          telegram_chat_id: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        return { code: null, error };
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('user_telegram')
        .insert({
          user_id: user.id,
          activation_code: code,
          status: 'pending'
        });

      if (error) {
        return { code: null, error };
      }
    }

    await fetchTelegramStatus();
    return { code, error: null };
  };

  const disconnectTelegram = async () => {
    if (!user || !isSupabaseConfigured()) {
      return { error: new Error('Not authenticated or Supabase not configured') };
    }

    const { error } = await supabase
      .from('user_telegram')
      .delete()
      .eq('user_id', user.id);

    if (!error) {
      setTelegramStatus(null);
    }
    return { error };
  };

  return {
    telegramStatus,
    isLoading,
    error,
    isConnected: telegramStatus?.status === 'connected',
    isPending: telegramStatus?.status === 'pending',
    activationCode: telegramStatus?.activation_code || null,
    generateActivationCode,
    disconnectTelegram,
    refetch: fetchTelegramStatus
  };
}
