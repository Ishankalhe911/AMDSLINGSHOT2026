import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, LucideIcon } from 'lucide-react';
import ProgressRing from './ProgressRing';

interface ModuleCardProps {
  title: string;
  description: string;
  progress: number;
  icon: LucideIcon;
  to: string;
  tag: string;
  color?: 'green' | 'cyan' | 'purple';
  accentClass?: string;
}

export default function ModuleCard({
  title,
  description,
  progress,
  icon: Icon,
  to,
  tag,
  color = 'green',
  accentClass = 'text-neon-green',
}: ModuleCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="glow-card bg-surface-1 rounded-lg p-5 cursor-pointer group flex flex-col gap-4 animate-fade-in-up"
      onClick={() => navigate({ to })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate({ to })}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md bg-surface-2 ${accentClass}`}>
            <Icon size={20} />
          </div>
          <div>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{tag}</span>
            <h3 className="font-semibold text-foreground text-base leading-tight mt-0.5">{title}</h3>
          </div>
        </div>
        <ProgressRing percentage={progress} size={56} strokeWidth={5} color={color} />
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 w-32 bg-surface-3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${color === 'green' ? 'bg-neon-green' : color === 'cyan' ? 'bg-neon-cyan' : 'bg-neon-purple'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-mono">{progress}% done</span>
        </div>
        <span className={`flex items-center gap-1 text-xs font-mono ${accentClass} group-hover:gap-2 transition-all`}>
          Open <ArrowRight size={12} />
        </span>
      </div>
    </div>
  );
}
