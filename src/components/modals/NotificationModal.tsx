import { useState, useEffect } from 'react';
import { Bell, Mail, Send, MessageCircle, Clock, X, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useNotificationSettings } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [settings, setSettings] = useNotificationSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  const handleSave = () => {
    setSettings(localSettings);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  const updateField = (field: keyof typeof localSettings, value: string | boolean) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
            <div className="space-y-0.5">
              <Label className="font-medium">Enable Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive daily learning reminders
              </p>
            </div>
            <Switch
              checked={localSettings.enabled}
              onCheckedChange={(checked) => updateField('enabled', checked)}
            />
          </div>

          <div className={cn(
            'space-y-4 transition-opacity',
            !localSettings.enabled && 'opacity-50 pointer-events-none'
          )}>
            {/* Email */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Address
              </Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={localSettings.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </div>

            {/* Telegram */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Send className="h-4 w-4 text-muted-foreground" />
                Telegram Username
              </Label>
              <Input
                type="text"
                placeholder="@username"
                value={localSettings.telegram}
                onChange={(e) => updateField('telegram', e.target.value)}
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                WhatsApp Number
              </Label>
              <Input
                type="tel"
                placeholder="+1 234 567 8900"
                value={localSettings.whatsapp}
                onChange={(e) => updateField('whatsapp', e.target.value)}
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Daily Reminder Time
              </Label>
              <Input
                type="time"
                value={localSettings.time}
                onChange={(e) => updateField('time', e.target.value)}
              />
            </div>
          </div>

          {/* Note */}
          <p className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
            <strong className="text-primary">Note:</strong> This is a frontend demo. 
            A backend server would be required to send actual notifications.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className={cn(
              'gap-2 transition-all',
              saved && 'bg-accent hover:bg-accent'
            )}
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : (
              'Save Preferences'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
