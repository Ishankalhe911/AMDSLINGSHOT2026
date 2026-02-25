import { useState, useEffect, useRef } from 'react';
import AlgorithmVisualizer, { DSType } from './AlgorithmVisualizer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface DSInfo {
  type: DSType;
  label: string;
  bigO: { search: string; insert: string; delete: string };
  industryContext: string;
  color: string;
}

const DS_INFO: Record<DSType, DSInfo> = {
  bst: {
    type: 'bst',
    label: 'Binary Search Tree',
    bigO: { search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)' },
    industryContext: 'Used in database indexes (B-Trees), file systems, and autocomplete engines. PostgreSQL uses B-Tree indexes by default for ordered data.',
    color: 'text-neon-green',
  },
  array: {
    type: 'array',
    label: 'Flat Array (Linear)',
    bigO: { search: 'O(n)', insert: 'O(1) end / O(n) mid', delete: 'O(n)' },
    industryContext: 'Best for small datasets or when cache locality matters. Used in GPU shaders, image pixel buffers, and fixed-size lookup tables.',
    color: 'text-neon-cyan',
  },
  hashmap: {
    type: 'hashmap',
    label: 'HashMap',
    bigO: { search: 'O(1) avg', insert: 'O(1) avg', delete: 'O(1) avg' },
    industryContext: 'Used everywhere: Redis key-value store, DNS caches, session stores, and language runtime symbol tables. O(1) is the gold standard for lookups.',
    color: 'text-neon-purple',
  },
  linkedlist: {
    type: 'linkedlist',
    label: 'Linked List',
    bigO: { search: 'O(n)', insert: 'O(1) head', delete: 'O(1) known node' },
    industryContext: 'Used in LRU cache implementations, undo/redo stacks, and OS process scheduling queues. Excellent for frequent insertions/deletions at known positions.',
    color: 'text-yellow-400',
  },
};

interface ComparisonPanelProps {
  leftType: DSType;
  rightType: DSType;
  dataset: number[];
  searchTarget: number;
  isRunning: boolean;
  onComplete: () => void;
}

export default function ComparisonPanel({
  leftType,
  rightType,
  dataset,
  searchTarget,
  isRunning,
  onComplete,
}: ComparisonPanelProps) {
  const [step, setStep] = useState(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxSteps = dataset.length + 2;

  useEffect(() => {
    if (isRunning) {
      setStep(0);
      intervalRef.current = setInterval(() => {
        setStep((s) => {
          if (s >= maxSteps - 1) {
            clearInterval(intervalRef.current!);
            onComplete();
            return s;
          }
          return s + 1;
        });
      }, 600);
    } else {
      setStep(-1);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, maxSteps, onComplete]);

  const leftInfo = DS_INFO[leftType];
  const rightInfo = DS_INFO[rightType];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[{ info: leftInfo }, { info: rightInfo }].map(({ info }) => (
          <div key={info.type} className="bg-surface-1 border border-border rounded-lg p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${info.color}`}>
                  {info.label}
                </span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Info size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-surface-2 border-border text-xs">
                  <p className="font-mono font-semibold mb-1">Industry Context</p>
                  <p>{info.industryContext}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Visualizer */}
            <AlgorithmVisualizer
              dsType={info.type}
              dataset={dataset}
              searchTarget={searchTarget}
              currentStep={Math.max(0, step)}
              isRunning={isRunning}
            />

            {/* Big-O Table */}
            <div className="grid grid-cols-3 gap-1.5">
              {Object.entries(info.bigO).map(([op, complexity]) => (
                <div key={op} className="bg-surface-2 rounded-md px-2 py-1.5 text-center">
                  <div className="text-xs text-muted-foreground capitalize">{op}</div>
                  <div className={`text-xs font-mono font-bold ${info.color}`}>{complexity}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
