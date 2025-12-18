import { useState, useEffect } from 'react';
import { Bell, Mail, Send, MessageCircle, Clock, Check, Lock, Copy, RefreshCw, CheckCircle2, AlertCircle, Globe } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { useTelegramActivation } from '@/hooks/useTelegramActivation';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (US)' },
  { value: 'America/Chicago', label: 'Central Time (US)' },
  { value: 'America/Denver', label: 'Mountain Time (US)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
];

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const { user } = useAuth();
  const { 
    getChannelPreference, 
    savePreference, 
    isLoading: prefsLoading,
    refetch: refetchPrefs
  } = useNotificationPreferences();
  
  const {
    telegramStatus,
    isConnected,
    isPending,
    activationCode,
    generateActivationCode,
    disconnectTelegram,
    isLoading: telegramLoading,
    refetch: refetchTelegram
  } = useTelegramActivation();

  // Local state
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState('09:00');
  const [timezone, setTimezone] = useState('UTC');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);

  const userEmail = user?.email || '';
  const isLoading = prefsLoading || telegramLoading;

  // Load preferences on open
  useEffect(() => {
    if (isOpen) {
      refetchPrefs();
      refetchTelegram();
    }
  }, [isOpen, refetchPrefs, refetchTelegram]);

  // Sync local state with fetched preferences
  useEffect(() => {
    const telegramPref = getChannelPreference('telegram');
    const emailPref = getChannelPreference('email');
    const whatsappPref = getChannelPreference('whatsapp');

    if (telegramPref) {
      setTelegramEnabled(telegramPref.enabled);
      setDeliveryTime(telegramPref.delivery_time?.slice(0, 5) || '09:00');
      setTimezone(telegramPref.timezone || 'UTC');
    }
    if (emailPref) {
      setEmailEnabled(emailPref.enabled);
      if (!telegramPref) {
        setDeliveryTime(emailPref.delivery_time?.slice(0, 5) || '09:00');
        setTimezone(emailPref.timezone || 'UTC');
      }
    }
    if (whatsappPref) {
      setWhatsappEnabled(whatsappPref.enabled);
    }
  }, [getChannelPreference]);

  const handleGenerateCode = async () => {
    setGeneratingCode(true);
    const { error } = await generateActivationCode();
    setGeneratingCode(false);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate activation code. Please try again.',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Activation Code Generated',
        description: 'Send this code to our Telegram bot to connect your account.',
      });
    }
  };

  const handleCopyCode = () => {
    if (activationCode) {
      navigator.clipboard.writeText(activationCode.toString());
      toast({
        title: 'Copied!',
        description: 'Activation code copied to clipboard.',
      });
    }
  };

  const handleDisconnectTelegram = async () => {
    const { error } = await disconnectTelegram();
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect Telegram. Please try again.',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Telegram Disconnected',
        description: 'Your Telegram account has been disconnected.',
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Save Telegram preferences
      if (telegramEnabled || getChannelPreference('telegram')) {
        await savePreference('telegram', telegramEnabled, deliveryTime, timezone);
      }

      // Save Email preferences
      if (emailEnabled || getChannelPreference('email')) {
        await savePreference('email', emailEnabled, deliveryTime, timezone);
      }

      // Save WhatsApp preferences (if number provided)
      if (whatsappEnabled || getChannelPreference('whatsapp')) {
        await savePreference('whatsapp', whatsappEnabled, deliveryTime, timezone);
      }

      toast({
        title: 'Settings Saved',
        description: 'Your notification preferences have been updated.',
      });

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Settings
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading settings...
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Telegram Section */}
            <div className="space-y-4 p-4 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-blue-500" />
                  <Label className="font-medium">Telegram Notifications</Label>
                </div>
                <Switch
                  checked={telegramEnabled}
                  onCheckedChange={setTelegramEnabled}
                />
              </div>

              {telegramEnabled && (
                <div className="space-y-3 pt-2">
                  {/* Connection Status */}
                  {isConnected ? (
                    <div className="flex items-center justify-between p-3 rounded-md bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Telegram Connected</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDisconnectTelegram}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : isPending ? (
                    <div className="space-y-3 p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-2 text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Pending Activation</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 bg-background rounded-md border border-border text-center">
                          <span className="text-2xl font-mono font-bold tracking-wider">
                            {activationCode}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopyCode}
                          title="Copy code"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleGenerateCode}
                          disabled={generatingCode}
                          title="Generate new code"
                        >
                          <RefreshCw className={cn("h-4 w-4", generatingCode && "animate-spin")} />
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Send this code to our Telegram bot <strong>@LearnRustBot</strong> to connect your account.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Generate an activation code and send it to our Telegram bot to receive daily lessons.
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleGenerateCode}
                        disabled={generatingCode}
                        className="w-full"
                      >
                        {generatingCode ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Generate Activation Code
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Email Section */}
            <div className="space-y-3 p-4 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label className="font-medium">Email Notifications</Label>
                </div>
                <Switch
                  checked={emailEnabled}
                  onCheckedChange={setEmailEnabled}
                />
              </div>

              {emailEnabled && (
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="email"
                      value={userEmail}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Using your account email
                  </p>
                </div>
              )}
            </div>

            {/* WhatsApp Section */}
            <div className="space-y-3 p-4 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-500" />
                  <Label className="font-medium">WhatsApp Notifications</Label>
                  <span className="text-xs text-muted-foreground">(Coming Soon)</span>
                </div>
                <Switch
                  checked={whatsappEnabled}
                  onCheckedChange={setWhatsappEnabled}
                  disabled
                />
              </div>

              {whatsappEnabled && (
                <div className="pt-2">
                  <Input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Delivery Time & Timezone */}
            <div className="space-y-4 p-4 rounded-lg bg-secondary/30 border border-border">
              <Label className="flex items-center gap-2 font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Delivery Schedule
              </Label>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Time</Label>
                  <Input
                    type="time"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Timezone
                  </Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Info Note */}
            <p className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
              <strong className="text-primary">Note:</strong> Daily lessons will be sent at your 
              scheduled time. Make sure to complete the Telegram activation to receive messages.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving || isLoading}
            className="gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
