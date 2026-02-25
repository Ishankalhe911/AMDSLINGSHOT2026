import { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, RotateCcw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DiffPanel from '../components/DiffPanel';
import MergedOutputEditor from '../components/MergedOutputEditor';

interface ConflictScenario {
  id: string;
  title: string;
  description: string;
  base: string;
  ours: string;
  theirs: string;
  conflictMarkers: string;
  expected: string;
  hints: string[];
  explanation: string;
}

const SCENARIOS: ConflictScenario[] = [
  {
    id: 'variable-rename',
    title: 'Variable Rename Conflict',
    description: 'Two developers renamed the same variable differently in their branches.',
    base: `function calculateTotal(items) {
  let sum = 0;
  for (const item of items) {
    sum += item.price;
  }
  return sum;
}`,
    ours: `function calculateTotal(items) {
-  let sum = 0;
+  let total = 0;
  for (const item of items) {
-    sum += item.price;
+    total += item.price;
  }
-  return sum;
+  return total;
}`,
    theirs: `function calculateTotal(items) {
-  let sum = 0;
+  let accumulator = 0;
  for (const item of items) {
-    sum += item.price;
+    accumulator += item.price;
  }
-  return sum;
+  return accumulator;
}`,
    conflictMarkers: `function calculateTotal(items) {
<<<<<<< HEAD (ours)
  let total = 0;
  for (const item of items) {
    total += item.price;
  }
  return total;
=======
  let accumulator = 0;
  for (const item of items) {
    accumulator += item.price;
  }
  return accumulator;
>>>>>>> feature/rename-vars
}`,
    expected: `function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    total += item.price;
  }
  return total;
}`,
    hints: [
      'Hint 1: Both branches renamed the same variable — you need to pick ONE name consistently.',
      'Hint 2: Remove all conflict markers (<<<<<<, =======, >>>>>>>) and keep only one version of the variable name throughout.',
      'Hint 3: The team agreed on "total" as the preferred name. Keep the HEAD (ours) version and remove the incoming changes.',
    ],
    explanation: 'Variable naming conflicts are resolved by team convention. The HEAD branch used "total" which is more descriptive than "accumulator" for a price sum. Always remove ALL conflict markers and ensure the chosen name is used consistently throughout the function.',
  },
  {
    id: 'logic-divergence',
    title: 'Logic Divergence Conflict',
    description: 'Two developers added different validation logic to the same function.',
    base: `function validateAge(age) {
  if (age < 0) {
    throw new Error('Invalid age');
  }
  return true;
}`,
    ours: `function validateAge(age) {
  if (age < 0) {
    throw new Error('Invalid age');
  }
+  if (age > 150) {
+    throw new Error('Age too large');
+  }
  return true;
}`,
    theirs: `function validateAge(age) {
  if (age < 0) {
    throw new Error('Invalid age');
  }
+  if (typeof age !== 'number') {
+    throw new Error('Age must be a number');
+  }
  return true;
}`,
    conflictMarkers: `function validateAge(age) {
  if (age < 0) {
    throw new Error('Invalid age');
  }
<<<<<<< HEAD (ours)
  if (age > 150) {
    throw new Error('Age too large');
  }
=======
  if (typeof age !== 'number') {
    throw new Error('Age must be a number');
  }
>>>>>>> feature/type-check
  return true;
}`,
    expected: `function validateAge(age) {
  if (typeof age !== 'number') {
    throw new Error('Age must be a number');
  }
  if (age < 0) {
    throw new Error('Invalid age');
  }
  if (age > 150) {
    throw new Error('Age too large');
  }
  return true;
}`,
    hints: [
      'Hint 1: Both validations are useful and non-conflicting — you should KEEP BOTH, not choose one.',
      'Hint 2: The type check should come FIRST (before numeric comparisons) since comparing a non-number to 0 is undefined behavior.',
      'Hint 3: Order: type check → negative check → upper bound check. Remove conflict markers and include all three validations.',
    ],
    explanation: 'Logic divergence conflicts often require MERGING both changes, not choosing one. The type check must come first (guard clause pattern) since numeric comparisons on non-numbers produce NaN. This is a classic case where both developers added valid, complementary validations.',
  },
  {
    id: 'structural-refactor',
    title: 'Structural Refactor Conflict',
    description: 'One developer refactored a class while another added a new method to the original structure.',
    base: `class UserService {
  constructor(db) {
    this.db = db;
  }

  getUser(id) {
    return this.db.find(id);
  }
}`,
    ours: `class UserService {
  #db;
  constructor(db) {
-    this.db = db;
+    this.#db = db;
  }

  getUser(id) {
-    return this.db.find(id);
+    return this.#db.find(id);
  }
}`,
    theirs: `class UserService {
  constructor(db) {
    this.db = db;
  }

  getUser(id) {
    return this.db.find(id);
  }

+  async createUser(data) {
+    return this.db.insert(data);
+  }
}`,
    conflictMarkers: `class UserService {
<<<<<<< HEAD (ours)
  #db;
  constructor(db) {
    this.#db = db;
  }

  getUser(id) {
    return this.#db.find(id);
  }
=======
  constructor(db) {
    this.db = db;
  }

  getUser(id) {
    return this.db.find(id);
  }

  async createUser(data) {
    return this.db.insert(data);
  }
>>>>>>> feature/add-create
}`,
    expected: `class UserService {
  #db;
  constructor(db) {
    this.#db = db;
  }

  getUser(id) {
    return this.#db.find(id);
  }

  async createUser(data) {
    return this.#db.insert(data);
  }
}`,
    hints: [
      'Hint 1: The HEAD branch used private class fields (#db) — a modern JS feature. The incoming branch added a new method. You need BOTH.',
      'Hint 2: Keep the private field refactor from HEAD, but also include the createUser method from the incoming branch.',
      'Hint 3: Update createUser to use this.#db instead of this.db to be consistent with the private field refactor.',
    ],
    explanation: 'Structural refactors require careful integration. The private field (#db) is a security improvement that prevents external access to the database connection. The new createUser method must be updated to use #db for consistency. This is why code reviews and small, focused PRs reduce conflict complexity.',
  },
];

type ValidationState = 'idle' | 'success' | 'error';

export default function GitConflictSimulator() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [mergedOutput, setMergedOutput] = useState(SCENARIOS[0].conflictMarkers);
  const [hintsShown, setHintsShown] = useState(0);
  const [validation, setValidation] = useState<ValidationState>('idle');

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;

  const handleScenarioChange = (id: string) => {
    const s = SCENARIOS.find((sc) => sc.id === id)!;
    setScenarioId(id);
    setMergedOutput(s.conflictMarkers);
    setHintsShown(0);
    setValidation('idle');
  };

  const handleCheck = () => {
    const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
    if (normalize(mergedOutput) === normalize(scenario.expected)) {
      setValidation('success');
    } else {
      setValidation('error');
    }
  };

  const handleReset = () => {
    setMergedOutput(scenario.conflictMarkers);
    setHintsShown(0);
    setValidation('idle');
  };

  const handleHint = () => {
    if (hintsShown < scenario.hints.length) {
      setHintsShown((h) => h + 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-mono text-neon-cyan uppercase tracking-widest">Module 02</span>
        <h1 className="text-2xl font-bold font-mono text-foreground mt-1">
          Git Conflict <span className="text-neon-cyan">Simulator</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Resolve realistic merge conflicts across 3 scenarios. Edit the merged output to remove conflict markers and produce the correct resolution.
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Scenario</label>
          <Select value={scenarioId} onValueChange={handleScenarioChange}>
            <SelectTrigger className="w-64 bg-surface-2 border-border font-mono text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface-2 border-border">
              {SCENARIOS.map((s) => (
                <SelectItem key={s.id} value={s.id} className="font-mono text-sm">{s.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="bg-surface-1 border border-border rounded-md px-3 py-2 text-xs text-muted-foreground max-w-sm">
          {scenario.description}
        </div>
      </div>

      {/* Diff Panel */}
      <DiffPanel base={scenario.base} ours={scenario.ours} theirs={scenario.theirs} />

      {/* Merged Output Editor */}
      <MergedOutputEditor value={mergedOutput} onChange={setMergedOutput} />

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={handleCheck}
          className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-mono text-sm gap-2"
        >
          <CheckCircle size={14} />
          Check Resolution
        </Button>
        <Button
          variant="outline"
          onClick={handleHint}
          disabled={hintsShown >= scenario.hints.length}
          className="border-border font-mono text-sm gap-2"
        >
          <Lightbulb size={14} />
          {hintsShown >= scenario.hints.length ? 'All hints shown' : `Hint ${hintsShown + 1}/${scenario.hints.length}`}
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

      {/* Hints */}
      {hintsShown > 0 && (
        <div className="space-y-2 animate-fade-in-up">
          {scenario.hints.slice(0, hintsShown).map((hint, i) => (
            <div key={i} className="flex items-start gap-2 bg-yellow-400/5 border border-yellow-400/20 rounded-md px-3 py-2.5">
              <Lightbulb size={14} className="text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/80 font-mono">{hint}</p>
            </div>
          ))}
        </div>
      )}

      {/* Validation Result */}
      {validation === 'success' && (
        <div className="bg-neon-green/10 border border-neon-green/30 rounded-lg p-5 animate-fade-in-up">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-neon-green shrink-0 mt-0.5" />
            <div>
              <h3 className="font-mono font-bold text-neon-green mb-2">🎉 Conflict Resolved Correctly!</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{scenario.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {validation === 'error' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 animate-fade-in-up">
          <div className="flex items-start gap-3">
            <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-mono font-bold text-red-400 mb-1">Not quite right</h3>
              <p className="text-xs text-muted-foreground">
                Check for remaining conflict markers (&lt;&lt;&lt;&lt;&lt;&lt;&lt;, =======, &gt;&gt;&gt;&gt;&gt;&gt;&gt;) or incorrect code. Use a hint if you're stuck.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
