interface MergedOutputEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MergedOutputEditor({ value, onChange }: MergedOutputEditorProps) {
  return (
    <div className="bg-surface-1 border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface-2">
        <span className="text-xs font-mono text-neon-green font-bold uppercase tracking-wider">
          ✏ Merged Output (edit to resolve)
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          Remove conflict markers (&lt;&lt;&lt;&lt;&lt;&lt;&lt;, =======, &gt;&gt;&gt;&gt;&gt;&gt;&gt;)
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-1 text-foreground font-mono text-xs p-3 resize-none outline-none min-h-[200px] leading-relaxed"
        spellCheck={false}
        placeholder="Edit the conflict markers to produce the correct merged output..."
      />
    </div>
  );
}
