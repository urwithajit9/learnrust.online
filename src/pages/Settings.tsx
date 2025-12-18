import { useState, useEffect } from 'react';
import { Bell, Calendar, Trash2, Download, RotateCcw, ExternalLink, Send, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { NotificationModal } from '@/components/modals/NotificationModal';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useCompletedItems } from '@/hooks/useLocalStorage';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { useTelegramActivation } from '@/hooks/useTelegramActivation';
import { curriculumData } from '@/data/curriculum';
import { generateICS } from '@/utils/icsGenerator';
import { toast } from 'sonner';

const TOTAL_DAYS = 121;

const Settings = () => {
  const [completedItems, setCompletedItems] = useCompletedItems();
  const { completedCount } = useUserProgress();
  const { getChannelPreference, savePreference, isLoading: prefsLoading } = useNotificationPreferences();
  const { isConnected: telegramConnected } = useTelegramActivation();
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  
  // Local state for quick toggle
  const [telegramEnabled, setTelegramEnabled] = useState(false);

  // Sync with fetched preferences
  useEffect(() => {
    const telegramPref = getChannelPreference('telegram');
    if (telegramPref) {
      setTelegramEnabled(telegramPref.enabled);
    }
  }, [getChannelPreference]);
  
  const stats = {
    total: TOTAL_DAYS,
    completed: completedCount,
    percent: Math.round((completedCount / TOTAL_DAYS) * 100),
  };

  const handleExportCalendar = () => {
    generateICS(curriculumData);
    toast.success('Calendar exported!', {
      description: 'The .ics file has been downloaded.',
    });
  };

  const handleResetProgress = () => {
    setCompletedItems([]);
    toast.success('Progress reset', {
      description: 'All completed items have been cleared.',
    });
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    setTelegramEnabled(enabled);
    const telegramPref = getChannelPreference('telegram');
    const time = telegramPref?.delivery_time?.slice(0, 5) || '09:00';
    const tz = telegramPref?.timezone || 'UTC';
    await savePreference('telegram', enabled, time, tz);
    toast.success(enabled ? 'Notifications enabled' : 'Notifications disabled');
  };

  const telegramPref = getChannelPreference('telegram');

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        progress={stats.percent} 
        onNotificationClick={() => setNotificationModalOpen(true)} 
      />
      
      <NotificationModal 
        isOpen={notificationModalOpen} 
        onClose={() => setNotificationModalOpen(false)} 
      />

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your preferences and notification settings.
          </p>
        </header>

        {/* Notifications Section */}
        <section className="p-6 rounded-2xl border border-border bg-card space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">
                Configure your daily learning reminders
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Enable Telegram Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive daily lesson reminders via Telegram
              </p>
            </div>
            <Switch
              checked={telegramEnabled}
              onCheckedChange={handleToggleNotifications}
              disabled={prefsLoading}
            />
          </div>

          {/* Telegram Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium flex items-center gap-2">
                <Send className="h-4 w-4 text-blue-500" />
                Telegram Status
              </Label>
              <p className="text-sm text-muted-foreground">
                {telegramConnected ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Connected
                  </span>
                ) : (
                  'Not connected'
                )}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setNotificationModalOpen(true)}
            >
              {telegramConnected ? 'Manage' : 'Connect'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Delivery Time</Label>
              <p className="text-sm text-muted-foreground">
                {telegramPref?.delivery_time?.slice(0, 5) || '09:00'} ({telegramPref?.timezone || 'UTC'})
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setNotificationModalOpen(true)}
            >
              Configure
            </Button>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="p-6 rounded-2xl border border-border bg-card space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold">Calendar Integration</h2>
              <p className="text-sm text-muted-foreground">
                Sync your learning schedule with your calendar
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Export to Calendar</Label>
              <p className="text-sm text-muted-foreground">
                Download an .ics file for Google Calendar, Apple Calendar, etc.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2"
              onClick={handleExportCalendar}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </section>

        {/* Data Section */}
        <section className="p-6 rounded-2xl border border-border bg-card space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h2 className="font-semibold">Data Management</h2>
              <p className="text-sm text-muted-foreground">
                Manage your progress data
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Current Progress</Label>
              <p className="text-sm text-muted-foreground">
                {stats.completed} of {stats.total} lessons completed ({stats.percent}%)
              </p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2 w-full sm:w-auto">
                <RotateCcw className="h-4 w-4" />
                Reset All Progress
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear all your completed lessons. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetProgress}>
                  Reset Progress
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>

        {/* About Section */}
        <section className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <h2 className="font-semibold">About LearnRust</h2>
          <p className="text-sm text-muted-foreground">
            A 121-day structured learning journey to master Rust programming in 10 minutes a day.
            Track your progress, sync with your calendar, and stay consistent.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Version 1.0.0</span>
            <a 
              href="https://www.rust-lang.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              Rust Official Site
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
