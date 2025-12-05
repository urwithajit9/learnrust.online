// Updated Curriculum page with database-driven curriculum
import { useState, useMemo } from 'react';
import { Search, Download, SlidersHorizontal, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DayCard } from '@/components/curriculum/DayCard';
import { ConceptLegend } from '@/components/curriculum/ConceptLegend';
import { NotificationModal } from '@/components/modals/NotificationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useLessonAccess } from '@/hooks/useLessonAccess';
import { useCurriculum, phaseInfo } from '@/hooks/useCurriculum';
import { searchCurriculum, filterByPhase, filterByConcept } from '@/utils/search';
import { generateICS } from '@/utils/icsGenerator';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TOTAL_DAYS = 121;

const Curriculum = () => {
  console.log('[Curriculum] Component rendering');
  
  const { user } = useAuth();
  const { completedCount, isCompleted, markComplete, markIncomplete } = useUserProgress();
  const { currentDay, allowFutureLessons, setAllowFutureLessons, isLessonLocked } = useLessonAccess();
  const { curriculum, isLoading: isCurriculumLoading, error: curriculumError } = useCurriculum();
  
  console.log('[Curriculum] Hook results:', {
    curriculumLength: curriculum?.length || 0,
    isLoading: isCurriculumLoading,
    error: curriculumError,
    curriculumIsArray: Array.isArray(curriculum)
  });
  
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedConcept, setSelectedConcept] = useState('all');

  const percent = Math.round((completedCount / TOTAL_DAYS) * 100);

  // Filter curriculum data using generic search functions
  const filteredData = useMemo(() => {
    console.log('[Curriculum] Filtering data, curriculum:', curriculum?.length || 0);
    if (!curriculum || !Array.isArray(curriculum)) {
      console.error('[Curriculum] ERROR: curriculum is not a valid array!');
      return [];
    }
    let result = curriculum;
    result = searchCurriculum(result, searchQuery);
    result = filterByPhase(result, selectedPhase);
    result = filterByConcept(result, selectedConcept);
    console.log('[Curriculum] Filtered result:', result?.length || 0);
    return result;
  }, [searchQuery, selectedPhase, selectedConcept, curriculum]);

  // Toggle completion using dayIndex
  const toggleComplete = async (date: string, dayIndex: number) => {
    if (!user) {
      toast.error('Please log in to track your progress');
      return;
    }

    const curriculumItem = curriculum.find(c => c.dayIndex === dayIndex);
    if (!curriculumItem) return;

    // If item has lessonId from DB, use it directly
    if (curriculumItem.lessonId) {
      try {
        if (isCompleted(dayIndex)) {
          await markIncomplete(curriculumItem.lessonId);
          toast.success('Progress updated');
        } else {
          await markComplete(curriculumItem.lessonId);
          toast.success('Lesson marked as completed!');
        }
      } catch (error) {
        console.error('Error toggling completion:', error);
        toast.error('Failed to update progress');
      }
      return;
    }

    // Fallback: Query DB for lesson ID
    try {
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('id')
        .eq('day_index', dayIndex)
        .maybeSingle();

      if (!lessonData) {
        toast.error('Lesson not available yet');
        return;
      }

      if (isCompleted(dayIndex)) {
        await markIncomplete(lessonData.id);
        toast.success('Progress updated');
      } else {
        await markComplete(lessonData.id);
        toast.success('Lesson marked as completed!');
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
      toast.error('Failed to update progress');
    }
  };

  const handleExportCalendar = () => {
    // Convert enriched curriculum back to format expected by ICS generator
    const exportData = curriculum.map(item => ({
      date: item.date,
      day: item.day,
      topic: item.topic,
      concept: item.concept,
      phase: item.phase,
    }));
    generateICS(exportData);
    toast.success('Calendar exported!', {
      description: 'The .ics file has been downloaded.',
    });
  };

  // Mobile filter sidebar content
  const FilterContent = () => (
    <div className="space-y-6 p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Phases</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedPhase === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPhase('all')}
          >
            All
          </Button>
          {Object.entries(phaseInfo).map(([phase, info]) => (
            <Button
              key={phase}
              variant={selectedPhase === phase ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPhase(phase)}
            >
              Phase {phase}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        progress={percent} 
        onNotificationClick={() => setNotificationOpen(true)} 
      />
      
      <NotificationModal 
        isOpen={notificationOpen} 
        onClose={() => setNotificationOpen(false)} 
      />

      <div className="flex">
        {/* Sidebar - Desktop */}
        <AppSidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedPhase={selectedPhase}
          onPhaseChange={setSelectedPhase}
          selectedConcept={selectedConcept}
          onConceptChange={setSelectedConcept}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Daily Roadmap</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredData.length} lessons • {completedCount} completed
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <FilterContent />
                  </SheetContent>
                </Sheet>

                {/* Future lessons toggle */}
                <div className="hidden sm:flex items-center gap-2 p-2 rounded-lg bg-secondary/50 border border-border">
                  {allowFutureLessons ? (
                    <Eye className="h-4 w-4 text-primary" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Label htmlFor="future-toggle-curriculum" className="text-xs cursor-pointer">
                    Future
                  </Label>
                  <Switch
                    id="future-toggle-curriculum"
                    checked={allowFutureLessons}
                    onCheckedChange={setAllowFutureLessons}
                  />
                </div>

                <ConceptLegend />
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={handleExportCalendar}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </header>

            {/* Desktop Search & Filters */}
            <div className="lg:hidden mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Phase Filters - Desktop Quick Access */}
            <div className="hidden lg:flex flex-wrap gap-2 mb-6">
              {['all', '1', '2', '3', '4'].map(phase => (
                <Button
                  key={phase}
                  variant={selectedPhase === phase ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPhase(phase)}
                >
                  {phase === 'all' ? 'All Phases' : `Phase ${phase}`}
                </Button>
              ))}
            </div>

            {/* Loading State */}
            {isCurriculumLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : curriculumError ? (
              <div className="text-center py-20 rounded-2xl border border-dashed border-destructive bg-destructive/10">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-destructive mb-1">Error Loading Curriculum</h3>
                <p className="text-muted-foreground text-sm">{curriculumError}</p>
              </div>
            ) : filteredData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredData.map((item) => (
                  <DayCard
                    key={item.dayIndex}
                    item={item}
                    isCompleted={isCompleted(item.dayIndex)}
                    isToday={item.dayIndex === currentDay}
                    isLocked={isLessonLocked(item.dayIndex)}
                    onToggleComplete={toggleComplete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-muted/30">
                <div className="text-4xl mb-4">🦀</div>
                <h3 className="text-lg font-semibold text-foreground mb-1">No topics found</h3>
                <p className="text-muted-foreground text-sm">
                  Try adjusting your search or filters.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedPhase('all');
                    setSelectedConcept('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Curriculum;
