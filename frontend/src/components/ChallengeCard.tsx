import { Clock, ChevronRight, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Challenge } from '../backend';

interface ChallengeCardProps {
  challenge: Challenge;
  onClick: () => void;
}

function getDifficultyLabel(difficulty: bigint): { label: string; className: string } {
  const d = Number(difficulty);
  if (d <= 1) return { label: 'Beginner', className: 'bg-neon-green/10 text-neon-green border-neon-green/30' };
  if (d <= 2) return { label: 'Intermediate', className: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30' };
  return { label: 'Advanced', className: 'bg-neon-purple/10 text-neon-purple border-neon-purple/30' };
}

function getCategoryFromId(id: string): string {
  if (id.includes('url') || id.includes('shortener')) return 'System Design';
  if (id.includes('db') || id.includes('database')) return 'Database';
  if (id.includes('cache') || id.includes('redis')) return 'Caching';
  if (id.includes('api') || id.includes('rest')) return 'API Design';
  if (id.includes('algo') || id.includes('sort')) return 'Algorithms';
  if (id.includes('git') || id.includes('version')) return 'DevOps';
  return 'Architecture';
}

export default function ChallengeCard({ challenge, onClick }: ChallengeCardProps) {
  const diff = getDifficultyLabel(challenge.difficulty);
  const category = getCategoryFromId(challenge.id);
  const estimatedMins = Number(challenge.estimatedTime);

  return (
    <div
      className="glow-card bg-surface-1 rounded-lg p-5 cursor-pointer group flex flex-col gap-3 animate-fade-in-up"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Tags row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-surface-2 border border-border text-muted-foreground flex items-center gap-1">
          <Tag size={10} /> {category}
        </span>
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${diff.className}`}>
          {diff.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-foreground text-sm leading-snug group-hover:text-neon-green transition-colors">
        {challenge.description.split('\n')[0].replace(/^#+\s*/, '')}
      </h3>

      {/* Description preview */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {challenge.description.split('\n').slice(1).join(' ').trim() || challenge.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
          <Clock size={12} />
          ~{estimatedMins} min
        </div>
        <span className="flex items-center gap-1 text-xs font-mono text-neon-green group-hover:gap-2 transition-all">
          Start Challenge <ChevronRight size={12} />
        </span>
      </div>
    </div>
  );
}
