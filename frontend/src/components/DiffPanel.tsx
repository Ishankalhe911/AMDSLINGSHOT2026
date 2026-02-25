interface DiffPanelProps {
  base: string;
  ours: string;
  theirs: string;
}

function DiffView({ title, code, color }: { title: string; code: string; color: string }) {
  const lines = code.split('\n');
  return (
    <div className="flex-1 min-w-0">
      <div className={`text-xs font-mono font-bold uppercase tracking-wider px-3 py-2 border-b border-border ${color}`}>
        {title}
      </div>
      <div className="overflow-auto max-h-64">
        <pre className="text-xs font-mono p-3 leading-relaxed">
          {lines.map((line, i) => {
            const isAdded = line.startsWith('+');
            const isRemoved = line.startsWith('-');
            return (
              <div
                key={i}
                className={`px-1 rounded-sm ${isAdded ? 'bg-neon-green/10 text-neon-green' : isRemoved ? 'bg-red-500/10 text-red-400' : 'text-muted-foreground'}`}
              >
                <span className="select-none text-surface-3 mr-2 w-5 inline-block text-right">{i + 1}</span>
                {line}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}

export default function DiffPanel({ base, ours, theirs }: DiffPanelProps) {
  return (
    <div className="bg-surface-1 border border-border rounded-lg overflow-hidden">
      <div className="text-xs font-mono text-muted-foreground px-3 py-2 border-b border-border bg-surface-2">
        Three-way diff view
      </div>
      <div className="flex divide-x divide-border overflow-auto">
        <DiffView title="BASE (common ancestor)" code={base} color="text-muted-foreground" />
        <DiffView title="OURS (current branch)" code={ours} color="text-neon-green" />
        <DiffView title="THEIRS (incoming)" code={theirs} color="text-neon-cyan" />
      </div>
    </div>
  );
}
