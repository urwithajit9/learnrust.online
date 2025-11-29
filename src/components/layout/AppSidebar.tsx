import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Filter, Layers } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { phaseInfo, getAllConcepts } from '@/data/curriculum';
import { getConceptColor } from '@/styles/conceptColors';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPhase: string;
  onPhaseChange: (phase: string) => void;
  selectedConcept: string;
  onConceptChange: (concept: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function AppSidebar({
  searchQuery,
  onSearchChange,
  selectedPhase,
  onPhaseChange,
  selectedConcept,
  onConceptChange,
  isOpen,
  onToggle,
}: AppSidebarProps) {
  const [phasesOpen, setPhasesOpen] = useState(true);
  const [conceptsOpen, setConceptsOpen] = useState(false);
  const concepts = getAllConcepts();

  if (!isOpen) return null;

  return (
    <aside className="w-72 border-r border-border bg-sidebar shrink-0 hidden lg:block">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Phases */}
          <Collapsible open={phasesOpen} onOpenChange={setPhasesOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between px-2 font-semibold">
                <span className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Phases
                </span>
                {phasesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-2">
              <Button
                variant={selectedPhase === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => onPhaseChange('all')}
              >
                All Phases
              </Button>
              {Object.entries(phaseInfo).map(([phase, info]) => (
                <Button
                  key={phase}
                  variant={selectedPhase === phase ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => onPhaseChange(phase)}
                >
                  <div className={cn('h-2 w-2 rounded-full', info.color)} />
                  <span>Phase {phase}: {info.name}</span>
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Concepts */}
          <Collapsible open={conceptsOpen} onOpenChange={setConceptsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between px-2 font-semibold">
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Concepts
                </span>
                {conceptsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-2 max-h-64 overflow-y-auto">
              <Button
                variant={selectedConcept === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => onConceptChange('all')}
              >
                All Concepts
              </Button>
              {concepts.map((concept) => {
                const color = getConceptColor(concept);
                return (
                  <Button
                    key={concept}
                    variant={selectedConcept === concept ? 'secondary' : 'ghost'}
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => onConceptChange(concept)}
                  >
                    <div className={cn('h-2 w-2 rounded-full', color.bg)} />
                    <span className="truncate">{concept}</span>
                  </Button>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </aside>
  );
}
