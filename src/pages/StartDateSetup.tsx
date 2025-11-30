import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { useUserSettings } from '@/hooks/useUserSettings';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function StartDateSetup() {
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveStartDate } = useUserSettings();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { error } = await saveStartDate(date);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save start date. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Start date set!',
        description: `Your learning journey begins ${format(date, 'MMMM d, yyyy')}.`,
      });
      navigate('/');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="inline-flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl">
            <BookOpen className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold text-foreground">
            Learn<span className="text-primary">Rust</span>
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            When do you want to start?
          </h1>
          <p className="text-muted-foreground">
            Choose your learning journey start date. We'll calculate your daily lessons from this date.
          </p>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border space-y-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal h-12',
                  !date && 'text-muted-foreground'
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, 'MMMM d, yyyy') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <CalendarPicker
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="text-sm text-muted-foreground">
            <p>💡 Tip: Choose today to start immediately, or pick a future date if you need time to prepare.</p>
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Start My Journey'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
