import { useState, useMemo } from 'react';
import { Search, Filter, Download, SlidersHorizontal } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DayCard } from '@/components/curriculum/DayCard';
import { ConceptLegend } from '@/components/curriculum/ConceptLegend';
import { NotificationModal } from '@/components/modals/NotificationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCompletedItems } from '@/hooks/useLocalStorage';
import { useUserProgress } from '@/hooks/useUserProgress';
import { curriculumData, getTodayItem, phaseInfo } from '@/data/curriculum';
import { searchCurriculum, filterByPhase, filterByConcept } from '@/utils/search';
import { generateICS } from '@/utils/icsGenerator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TOTAL_DAYS = 121;

const Curriculum = () => {
  const [completedItems, setCompletedItems] = useCompletedItems();
  const { completedCount } = useUserProgress();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedConcept, setSelectedConcept] = useState('all');

  const percent = Math.round((completedCount / TOTAL_DAYS) * 100);
  const todayItem = getTodayItem();

  const filteredData = useMemo(() => {
    let result = curriculumData;
    result = searchCurriculum(result, searchQuery);
    result = filterByPhase(result, selectedPhase);
    result = filterByConcept(result, selectedConcept);
    return result;
  }, [searchQuery, selectedPhase, selectedConcept]);

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
                  {filteredData.length} lessons • {completedItems.length} completed
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

            {/* Grid */}
            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredData.map((item) => (
                  <DayCard
                    key={item.date}
                    item={item}
                    isCompleted={completedItems.includes(item.date)}
                    isToday={todayItem?.date === item.date}
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
