import { conceptColors, getConceptColor } from '@/styles/conceptColors';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const conceptCategories = {
  'Memory Management': ['Ownership', 'Borrowing', 'Lifetimes'],
  'Concurrency': ['Concurrency', 'Async'],
  'Type System': ['Traits', 'Generics', 'Smart Ptrs'],
  'Collections': ['Collection', 'Strings'],
  'Error Handling': ['Error', 'Robustness', 'Safety'],
  'Practice': ['Practice', 'Review'],
};

export function ConceptLegend() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info className="h-4 w-4" />
          Concept Legend
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Concept Color Guide</h4>
          {Object.entries(conceptCategories).map(([category, concepts]) => (
            <div key={category} className="space-y-2">
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {category}
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {concepts.map((concept) => {
                  const color = getConceptColor(concept);
                  return (
                    <span
                      key={concept}
                      className={cn(
                        'text-[10px] font-medium px-2 py-0.5 rounded-full text-primary-foreground',
                        color.bg
                      )}
                    >
                      {concept}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ConceptLegendInline() {
  const allConcepts = Object.keys(conceptColors);
  
  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
        <Info className="h-4 w-4 text-muted-foreground" />
        Concept Color Guide
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {allConcepts.slice(0, 20).map((concept) => {
          const color = getConceptColor(concept);
          return (
            <span
              key={concept}
              className={cn(
                'text-[10px] font-medium px-2 py-0.5 rounded-full text-primary-foreground',
                color.bg
              )}
            >
              {concept}
            </span>
          );
        })}
      </div>
    </div>
  );
}
