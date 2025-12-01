import { useState } from 'react';
import { Flag, Send, Loader2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface LessonReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string | null;
  lessonTitle: string;
  dayNumber: number;
}

const reportTypes = [
  { value: 'typo', label: 'Typo or Grammar' },
  { value: 'incorrect_info', label: 'Incorrect Information' },
  { value: 'missing_media', label: 'Missing Media/Images' },
  { value: 'suggestion', label: 'Suggestion/Improvement' },
  { value: 'ux_issue', label: 'UX/Interface Issue' },
  { value: 'other', label: 'Other' },
];

export function LessonReportModal({ isOpen, onClose, lessonId, lessonTitle, dayNumber }: LessonReportModalProps) {
  const [reportType, setReportType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: 'Message required',
        description: 'Please provide a description of your feedback.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('lesson_reports').insert({
        lesson_id: lessonId,
        user_id: user?.id || null,
        report_type: reportType,
        message: message.trim(),
        day_number: dayNumber,
        lesson_title: lessonTitle,
      });

      if (error) throw error;

      toast({
        title: 'Feedback submitted',
        description: 'Thank you for helping us improve!',
      });
      
      setMessage('');
      setReportType('suggestion');
      onClose();
    } catch (err: any) {
      toast({
        title: 'Failed to submit',
        description: err.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-primary" />
            Report / Suggest
          </DialogTitle>
          <DialogDescription>
            Day {dayNumber}: {lessonTitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label>Type of feedback</Label>
            <RadioGroup value={reportType} onValueChange={setReportType} className="grid grid-cols-2 gap-2">
              {reportTypes.map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={value} />
                  <Label htmlFor={value} className="text-sm font-normal cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Description</Label>
            <Textarea
              id="message"
              placeholder="Describe the issue or your suggestion..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/1000
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 gap-2">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
