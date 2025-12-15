import { useState } from 'react';
import { Play, RotateCcw, CheckCircle, XCircle, Loader2, Lightbulb, Wrench, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChallengeEditorProps {
  template: string;
  task?: string;
  instructions?: string; // legacy support
  hint?: string;
  toolsUsed?: string;
  expectedOutput: string;
  className?: string;
}

type ExecutionStatus = 'idle' | 'running' | 'success' | 'error';

export function ChallengeEditor({ 
  template, 
  task,
  instructions,
  hint,
  toolsUsed,
  expectedOutput,
  className 
}: ChallengeEditorProps) {
  const [code, setCode] = useState(template);
  const [output, setOutput] = useState<string>('');
  const [status, setStatus] = useState<ExecutionStatus>('idle');
  const [showHint, setShowHint] = useState(false);
  const [showTools, setShowTools] = useState(false);

  // Use task if available, fallback to instructions for legacy data
  const displayTask = task || instructions || '';

  const handleRun = async () => {
    setStatus('running');
    setOutput('');
    
    // Simulate code execution (replace with actual Rust execution backend)
    setTimeout(() => {
      if (code.includes('mut value') || code.includes('mut ')) {
        setOutput('Final value: 50');
        setStatus('success');
      } else {
        setOutput('error[E0384]: cannot assign twice to immutable variable `value`');
        setStatus('error');
      }
    }, 1000);
  };

  const handleReset = () => {
    setCode(template);
    setOutput('');
    setStatus('idle');
  };

  const isCorrect = status === 'success' && output.trim() === expectedOutput.trim();

  return (
    <div className={cn('rounded-xl border border-border bg-card overflow-hidden', className)}>
      {/* Task/Instructions Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <h4 className="font-semibold text-foreground mb-2">Challenge</h4>
        {displayTask && (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{displayTask}</p>
        )}
      </div>
      
      {/* Code Editor */}
      <div className="border-b border-border">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-48 p-4 font-mono text-sm bg-[hsl(220,13%,18%)] text-[hsl(220,14%,71%)] resize-none focus:outline-none"
          spellCheck={false}
        />
      </div>
      
      {/* Action Bar */}
      <div className="p-3 border-b border-border bg-muted/20 flex flex-wrap items-center gap-2">
        <Button 
          onClick={handleRun} 
          disabled={status === 'running'}
          size="sm"
          className="gap-2"
        >
          {status === 'running' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Run Code
        </Button>
        <Button 
          onClick={handleReset} 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-muted-foreground hidden sm:inline">Expected:</span>
          <code className="px-2 py-1 bg-muted rounded text-xs font-mono">{expectedOutput}</code>
        </div>
      </div>

      {/* Hint & Tools Section */}
      {(hint || toolsUsed) && (
        <div className="border-b border-border bg-muted/10">
          <div className="flex flex-wrap gap-2 p-3">
            {hint && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
              >
                <Lightbulb className="h-4 w-4" />
                {showHint ? 'Hide Hint' : 'Show Hint'}
                {showHint ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            )}
            {toolsUsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTools(!showTools)}
                className="gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-500/10"
              >
                <Wrench className="h-4 w-4" />
                {showTools ? 'Hide Tools' : 'Tools Used'}
                {showTools ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            )}
          </div>
          
          {showHint && hint && (
            <div className="px-4 pb-3">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-700 dark:text-amber-400 whitespace-pre-wrap">
                  <strong>Hint:</strong> {hint}
                </p>
              </div>
            </div>
          )}
          
          {showTools && toolsUsed && (
            <div className="px-4 pb-3">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-700 dark:text-blue-400 whitespace-pre-wrap">
                  <strong>Tools/Concepts:</strong> {toolsUsed}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Output Section */}
      {output && (
        <div className={cn(
          'p-4 font-mono text-sm',
          status === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'
        )}>
          <div className="flex items-start gap-2">
            {status === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            )}
            <div>
              <pre className={cn(
                'whitespace-pre-wrap',
                status === 'success' ? 'text-green-600' : 'text-red-600'
              )}>
                {output}
              </pre>
              {isCorrect && (
                <p className="mt-2 text-green-600 font-sans font-medium">
                  Excellent! Your solution is correct.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}