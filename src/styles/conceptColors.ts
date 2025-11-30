export interface ConceptColorConfig {
  bg: string;
  text: string;
  border: string;
  hex: string;
}

export const conceptColors: Record<string, ConceptColorConfig> = {
  // Memory Management (Orange spectrum)
  'Ownership': { bg: 'bg-orange-600', text: 'text-orange-600', border: 'border-orange-600', hex: '#ea580c' },
  'Borrowing': { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', hex: '#f97316' },
  'Lifetimes': { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', hex: '#f59e0b' },
  
  // Concurrency (Red spectrum)
  'Concurrency': { bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-600', hex: '#e11d48' },
  'Async': { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500', hex: '#ef4444' },
  
  // Type System (Teal spectrum)
  'Traits': { bg: 'bg-teal-600', text: 'text-teal-600', border: 'border-teal-600', hex: '#0d9488' },
  'Generics': { bg: 'bg-teal-500', text: 'text-teal-500', border: 'border-teal-500', hex: '#14b8a6' },
  
  // Practice & Review (Green spectrum)
  'Practice': { bg: 'bg-lime-500', text: 'text-lime-500', border: 'border-lime-500', hex: '#84cc16' },
  'Review': { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500', hex: '#10b981' },
  
  // Basics (Stone spectrum)
  'Variables': { bg: 'bg-stone-500', text: 'text-stone-500', border: 'border-stone-500', hex: '#78716c' },
  'Structs': { bg: 'bg-stone-600', text: 'text-stone-600', border: 'border-stone-600', hex: '#57534e' },
  'Enums': { bg: 'bg-stone-500', text: 'text-stone-500', border: 'border-stone-500', hex: '#78716c' },
  'Methods': { bg: 'bg-stone-600', text: 'text-stone-600', border: 'border-stone-600', hex: '#57534e' },
  
  // Collections (Blue spectrum)
  'Collection': { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', hex: '#2563eb' },
  'Strings': { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500', hex: '#3b82f6' },
  
  // Error Handling (Pink spectrum)
  'Error': { bg: 'bg-pink-600', text: 'text-pink-600', border: 'border-pink-600', hex: '#db2777' },
  'Robustness': { bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500', hex: '#ec4899' },
  'Safety': { bg: 'bg-pink-400', text: 'text-pink-400', border: 'border-pink-400', hex: '#f472b6' },
  
  // Environment & Setup
  'Environment': { bg: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-500', hex: '#6366f1' },
  'Execution': { bg: 'bg-indigo-400', text: 'text-indigo-400', border: 'border-indigo-400', hex: '#818cf8' },
  
  // Control Flow
  'Flow': { bg: 'bg-violet-500', text: 'text-violet-500', border: 'border-violet-500', hex: '#8b5cf6' },
  'Loops': { bg: 'bg-violet-600', text: 'text-violet-600', border: 'border-violet-600', hex: '#7c3aed' },
  
  // Functional
  'Functional': { bg: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-500', hex: '#06b6d4' },
  'Iterators': { bg: 'bg-cyan-600', text: 'text-cyan-600', border: 'border-cyan-600', hex: '#0891b2' },
  
  // Organization
  'Organization': { bg: 'bg-slate-500', text: 'text-slate-500', border: 'border-slate-500', hex: '#64748b' },
  'Cargo': { bg: 'bg-slate-600', text: 'text-slate-600', border: 'border-slate-600', hex: '#475569' },
  'Testing': { bg: 'bg-green-600', text: 'text-green-600', border: 'border-green-600', hex: '#16a34a' },
  
  // Advanced
  'Smart Ptrs': { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500', hex: '#a855f7' },
  'Metaprogramming': { bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-600', hex: '#9333ea' },
  'Advanced': { bg: 'bg-fuchsia-600', text: 'text-fuchsia-600', border: 'border-fuchsia-600', hex: '#c026d3' },
  
  // Misc
  'Scalars': { bg: 'bg-sky-500', text: 'text-sky-500', border: 'border-sky-500', hex: '#0ea5e9' },
  'Compounds': { bg: 'bg-sky-600', text: 'text-sky-600', border: 'border-sky-600', hex: '#0284c7' },
  'Functions': { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', hex: '#059669' },
  'I/O': { bg: 'bg-amber-600', text: 'text-amber-600', border: 'border-amber-600', hex: '#d97706' },
  'CLI': { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', hex: '#f59e0b' },
  'Planning': { bg: 'bg-blue-400', text: 'text-blue-400', border: 'border-blue-400', hex: '#60a5fa' },
  'Implementation': { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500', hex: '#22c55e' },
  'Exploration': { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500', hex: '#eab308' },
  'Next Steps': { bg: 'bg-gradient-to-r from-orange-500 to-rose-500', text: 'text-orange-500', border: 'border-orange-500', hex: '#f97316' },
};

export const getConceptColor = (concept: string): ConceptColorConfig => {
  return conceptColors[concept] || { 
    bg: 'bg-stone-400', 
    text: 'text-stone-400', 
    border: 'border-stone-400',
    hex: '#a8a29e'
  };
};

export const getConceptHex = (concept: string): string => {
  return getConceptColor(concept).hex;
};
