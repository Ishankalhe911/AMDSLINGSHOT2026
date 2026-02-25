import { useState, useCallback } from 'react';
import { Play, RotateCcw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ComparisonPanel from '../components/ComparisonPanel';
import type { DSType } from '../components/AlgorithmVisualizer';

const DS_OPTIONS: { value: DSType; label: string }[] = [
  { value: 'bst', label: 'Binary Search Tree' },
  { value: 'array', label: 'Flat Array (Linear)' },
  { value: 'hashmap', label: 'HashMap' },
  { value: 'linkedlist', label: 'Linked List' },
];

const DATASET = [42, 17, 63, 8, 29, 55, 71, 34];
const SEARCH_TARGET = 29;

export default function DataStructureVisualizer() {
  const [leftDS, setLeftDS] = useState<DSType>('bst');
  const [rightDS, setRightDS] = useState<DSType>('array');
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const completedCount = { current: 0 };

  const handleRun = () => {
    setCompleted(false);
    completedCount.current = 0;
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCompleted(false);
  };

  const handleComplete = useCallback(() => {
    completedCount.current += 1;
    if (completedCount.current >= 2) {
      setIsRunning(false);
      setCompleted(true);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-neon-green uppercase tracking-widest">Module 01</span>
        </div>
        <h1 className="text-2xl font-bold font-mono text-foreground">
          Data Structure <span className="text-neon-green">Visualizer</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Compare two data structures side-by-side with animated step-by-step traversal. Understand Big-O complexity and real-world trade-offs.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-surface-1 border border-border rounded-lg p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5 flex-1 min-w-[160px]">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Left Structure</label>
            <Select value={leftDS} onValueChange={(v) => { setLeftDS(v as DSType); handleReset(); }}>
              <SelectTrigger className="bg-surface-2 border-border font-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface-2 border-border">
                {DS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value} className="font-mono text-sm">{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 flex-1 min-w-[160px]">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Right Structure</label>
            <Select value={rightDS} onValueChange={(v) => { setRightDS(v as DSType); handleReset(); }}>
              <SelectTrigger className="bg-surface-2 border-border font-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface-2 border-border">
                {DS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value} className="font-mono text-sm">{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Dataset</label>
            <div className="flex items-center gap-1.5 bg-surface-2 border border-border rounded-md px-3 py-2 font-mono text-xs text-muted-foreground">
              [{DATASET.join(', ')}] → search <span className="text-neon-green ml-1">{SEARCH_TARGET}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleRun}
              disabled={isRunning}
              className="bg-neon-green text-background hover:bg-neon-green/90 font-mono text-sm gap-2"
            >
              <Play size={14} />
              Run Comparison
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-border font-mono text-sm gap-2"
            >
              <RotateCcw size={14} />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Comparison Panel */}
      <ComparisonPanel
        leftType={leftDS}
        rightType={rightDS}
        dataset={DATASET}
        searchTarget={SEARCH_TARGET}
        isRunning={isRunning}
        onComplete={handleComplete}
      />

      {/* Completion Banner */}
      {completed && (
        <div className="bg-neon-green/10 border border-neon-green/30 rounded-lg p-4 animate-fade-in-up">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-mono font-bold text-neon-green mb-1">Comparison Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Notice how the <span className="text-neon-green font-medium">BST</span> found the target in{' '}
                <span className="text-neon-green font-mono">O(log n)</span> steps by halving the search space at each node,
                while the <span className="text-neon-cyan font-medium">flat array</span> scanned linearly at{' '}
                <span className="text-neon-cyan font-mono">O(n)</span>. In a database with 1 million records, that's the
                difference between ~20 comparisons and 1,000,000.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Concept Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface-1 border border-border rounded-lg p-4">
          <h3 className="font-mono font-semibold text-neon-green text-sm mb-2">// When to use BST</h3>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {['Ordered data with frequent range queries', 'Database index structures (B-Trees)', 'Autocomplete / prefix search', 'Priority queues with ordering'].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-neon-green mt-0.5">▸</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-surface-1 border border-border rounded-lg p-4">
          <h3 className="font-mono font-semibold text-neon-cyan text-sm mb-2">// When to use HashMap</h3>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {['O(1) key-value lookups (caches, sessions)', 'Deduplication and frequency counting', 'DNS resolution tables', 'Language runtime symbol tables'].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-neon-cyan mt-0.5">▸</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
