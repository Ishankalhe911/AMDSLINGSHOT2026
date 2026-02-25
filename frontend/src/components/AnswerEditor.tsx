interface AnswerEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function AnswerEditor({ value, onChange, placeholder }: AnswerEditorProps) {
  return (
    <div className="bg-surface-1 border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-surface-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-neon-green/60" />
        </div>
        <span className="text-xs font-mono text-muted-foreground">answer.md</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Write your solution here. Explain your approach, trade-offs, and reasoning...'}
        className="w-full bg-surface-1 text-foreground font-mono text-sm p-4 resize-none outline-none min-h-[300px] leading-relaxed placeholder:text-muted-foreground/50"
        spellCheck={false}
      />
    </div>
  );
}
