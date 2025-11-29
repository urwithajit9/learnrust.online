import { useNavigate } from 'react-router-dom';
import { Calendar, Download, Clock, Target, Zap, BookOpen } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { TodayTask } from '@/components/curriculum/TodayTask';
import { ProgressChart } from '@/components/charts/ProgressChart';
import { ConceptDistributionChart } from '@/components/charts/ConceptDistributionChart';
import { NotificationModal } from '@/components/modals/NotificationModal';
import { Button } from '@/components/ui/button';
import { useCompletedItems } from '@/hooks/useLocalStorage';
import { curriculumData, getTodayItem } from '@/data/curriculum';
import { calculateStats, getConceptDistribution } from '@/utils/stats';
import { generateICS } from '@/utils/icsGenerator';
import { useState } from 'react';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const [completedItems, setCompletedItems] = useCompletedItems();
  const [notificationOpen, setNotificationOpen] = useState(false);

  const todayItem = getTodayItem();
  const stats = calculateStats(completedItems);
  const distribution = getConceptDistribution(curriculumData, completedItems);

  const toggleComplete = (date: string) => {
    setCompletedItems(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const handleExportCalendar = () => {
    generateICS(curriculumData);
    toast.success('Calendar exported!', {
      description: 'The .ics file has been downloaded.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        progress={stats.percent} 
        onNotificationClick={() => setNotificationOpen(true)} 
      />
      
      <NotificationModal 
        isOpen={notificationOpen} 
        onClose={() => setNotificationOpen(false)} 
      />

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Hero Section */}
        <header className="text-center max-w-2xl mx-auto space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            <Zap className="h-4 w-4" />
            121-Day Learning Journey
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            Master Rust in{' '}
            <span className="text-primary">10 Minutes</span>{' '}
            a Day
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A structured journey from "Hello World" to Async Concurrency. 
            Track your progress, sync with your calendar, and stay consistent.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Button onClick={() => navigate('/curriculum')} size="lg" className="gap-2">
              <BookOpen className="h-5 w-5" />
              Start Learning
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-2"
              onClick={handleExportCalendar}
            >
              <Download className="h-5 w-5" />
              Export Calendar
            </Button>
          </div>
        </header>

        {/* Today's Task */}
        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <TodayTask
            item={todayItem}
            isCompleted={todayItem ? completedItems.includes(todayItem.date) : false}
            onToggleComplete={toggleComplete}
            onViewCurriculum={() => navigate('/curriculum')}
          />
        </section>

        {/* Stats Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <StatCard 
            icon={Target} 
            label="Total Days" 
            value={stats.total.toString()} 
            sublabel="Micro-lessons"
          />
          <StatCard 
            icon={Clock} 
            label="Est. Hours" 
            value={stats.estimatedHours.toString()} 
            sublabel="Total study time"
          />
          <StatCard 
            icon={Calendar} 
            label="Completed" 
            value={stats.completed.toString()} 
            sublabel={`${stats.hoursCompleted}h studied`}
            highlight
          />
          <StatCard 
            icon={Zap} 
            label="Remaining" 
            value={stats.remaining.toString()} 
            sublabel="Days left"
          />
        </section>

        {/* Charts Section */}
        <section className="grid md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="p-6 rounded-2xl border border-border bg-card shadow-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="h-1 w-6 rounded-full bg-primary" />
              Your Progress
            </h3>
            <ProgressChart stats={stats} />
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.remaining}</p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card shadow-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="h-1 w-6 rounded-full bg-accent" />
              Topic Distribution
            </h3>
            <ConceptDistributionChart distribution={distribution} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-card to-accent/5 border border-border">
            <h2 className="text-xl font-semibold mb-2">Ready to continue?</h2>
            <p className="text-muted-foreground mb-4">
              Pick up where you left off or explore the full curriculum.
            </p>
            <Button onClick={() => navigate('/curriculum')} className="gap-2">
              View Full Curriculum
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sublabel: string;
  highlight?: boolean;
}

function StatCard({ icon: Icon, label, value, sublabel, highlight }: StatCardProps) {
  return (
    <div className={`p-4 rounded-xl border transition-all ${
      highlight 
        ? 'bg-primary/5 border-primary/20' 
        : 'bg-card border-border'
    }`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${highlight ? 'bg-primary/10' : 'bg-secondary'}`}>
          <Icon className={`h-4 w-4 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{sublabel}</p>
    </div>
  );
}

export default Index;
