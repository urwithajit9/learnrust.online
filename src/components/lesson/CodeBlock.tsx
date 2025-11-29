import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-rust';
import 'prismjs/themes/prism-tomorrow.css';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showCopy?: boolean;
  className?: string;
}

export function CodeBlock({ 
  code, 
  language = 'rust', 
  title,
  showCopy = true,
  className 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('rounded-xl overflow-hidden border border-border', className)}>
      {(title || showCopy) && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
          {title && (
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          )}
          {showCopy && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 px-2 text-muted-foreground hover:text-foreground ml-auto"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      )}
      <pre className="p-4 overflow-x-auto !m-0 !bg-[#2d2d2d]">
        <code ref={codeRef} className={`language-${language} text-sm`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
