import { Navbar } from '@/components/layout/Navbar';
import { ProgressChart } from '@/components/charts/ProgressChart';
import { ConceptDistributionChart } from '@/components/charts/ConceptDistributionChart';
import { PhaseProgressChart } from '@/components/charts/PhaseProgressChart';
import { ConceptLegendInline } from '@/components/curriculum/ConceptLegend';
import { NotificationModal } from '@/components/modals/NotificationModal';
import { Progress } from '@/components/ui/progress';
import { curriculumData, phaseInfo } from '@/data/curriculum';
import { getConceptDistribution, getPhaseProgress } from '@/utils/stats';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useState } from 'react';
import { Trophy, Target, Clock, Flame, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const TOTAL_DAYS = 121;
const ESTIMATED_HOURS = 20;

const ProgressPage = () => {
  const { completedCount } = useUserProgress();
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Calculate stats from Supabase progress
  const stats = {
    total: TOTAL_DAYS,
    completed: completedCount,
    remaining: TOTAL_DAYS - completedCount,
    percent: Math.round((completedCount / TOTAL_DAYS) * 100),
    estimatedHours: ESTIMATED_HOURS,
    hoursCompleted: Math.round((completedCount / TOTAL_DAYS) * ESTIMATED_HOURS),
  };

  const distribution = getConceptDistribution(curriculumData, []);
  const phaseProgress = getPhaseProgress([]);

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

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-bold text-foreground mb-2">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your Rust learning journey and see how far you've come.
          </p>
        </header>

        {/* Overall Progress Banner */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-accent/5 border border-primary/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className={cn(
                    "h-12 w-12",
                    stats.percent === 100 ? "text-yellow-500" : "text-primary"
                  )} />
                </div>
                {stats.percent === 100 && (
                  <span className="absolute -top-2 -right-2 text-2xl">🎉</span>
                )}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {stats.percent}% Complete
              </h2>
              <p className="text-muted-foreground mb-4">
                {stats.completed} of {stats.total} lessons completed • {stats.hoursCompleted}h of {stats.estimatedHours}h studied
              </p>
              <Progress value={stats.percent} className="h-3 max-w-md" />
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={Target} 
            label="Total Lessons" 
            value={stats.total}
            color="text-primary"
          />
          <StatCard 
            icon={Flame} 
            label="Completed" 
            value={stats.completed}
            color="text-primary"
          />
          <StatCard 
            icon={Clock} 
            label="Hours Studied" 
            value={stats.hoursCompleted}
            color="text-accent"
          />
          <StatCard 
            icon={TrendingUp} 
            label="Remaining" 
            value={stats.remaining}
            color="text-muted-foreground"
          />
        </section>

        {/* Charts Grid */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Overall Progress */}
          <div className="p-6 rounded-2xl border border-border bg-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="h-1 w-6 rounded-full bg-primary" />
              Completion Status
            </h3>
            <ProgressChart stats={stats} />
          </div>

          {/* Concept Distribution */}
          <div className="p-6 rounded-2xl border border-border bg-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="h-1 w-6 rounded-full bg-accent" />
              Topic Distribution
            </h3>
            <ConceptDistributionChart distribution={distribution} />
          </div>
        </section>

        {/* Phase Progress */}
        <section className="p-6 rounded-2xl border border-border bg-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="h-1 w-6 rounded-full bg-primary" />
            Phase Progress
          </h3>
          <PhaseProgressChart progress={phaseProgress} />
          
          {/* Phase Details */}
          <div className="mt-6 pt-6 border-t border-border grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {phaseProgress.map(p => (
              <div key={p.phase} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Phase {p.phase}</span>
                  <span className="text-xs text-muted-foreground">{p.percent}%</span>
                </div>
                <Progress value={p.percent} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {phaseInfo[p.phase as keyof typeof phaseInfo]?.name} • {p.completed}/{p.total}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Concept Legend */}
        <section>
          <ConceptLegendInline />
        </section>
      </main>
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-secondary">
          <Icon className={cn("h-4 w-4", color)} />
        </div>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export default ProgressPage;
