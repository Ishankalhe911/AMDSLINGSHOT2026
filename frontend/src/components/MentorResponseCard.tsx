import { Lightbulb, Scale, Globe, Sparkles } from 'lucide-react';
import type { MentorResponse } from '../backend';

interface MentorResponseCardProps {
  response: MentorResponse;
}

const sections = [
  {
    key: 'approach' as keyof MentorResponse,
    label: 'Approach Chosen',
    icon: Lightbulb,
    color: 'text-neon-green',
    borderColor: 'border-neon-green/30',
    bgColor: 'bg-neon-green/5',
  },
  {
    key: 'tradeOffs' as keyof MentorResponse,
    label: 'Trade-offs',
    icon: Scale,
    color: 'text-neon-cyan',
    borderColor: 'border-neon-cyan/30',
    bgColor: 'bg-neon-cyan/5',
  },
  {
    key: 'realWorldAnalogy' as keyof MentorResponse,
    label: 'Real-world Analogy',
    icon: Globe,
    color: 'text-neon-purple',
    borderColor: 'border-neon-purple/30',
    bgColor: 'bg-neon-purple/5',
  },
  {
    key: 'betterAlternative' as keyof MentorResponse,
    label: 'Better Alternative',
    icon: Sparkles,
    color: 'text-yellow-400',
    borderColor: 'border-yellow-400/30',
    bgColor: 'bg-yellow-400/5',
  },
];

export default function MentorResponseCard({ response }: MentorResponseCardProps) {
  return (
    <div className="ml-8 space-y-2">
      {sections.map(({ key, label, icon: Icon, color, borderColor, bgColor }) => (
        <div
          key={key}
          className={`rounded-md border ${borderColor} ${bgColor} px-3 py-2.5`}
        >
          <div className={`flex items-center gap-1.5 mb-1 ${color}`}>
            <Icon size={12} />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">{label}</span>
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed">{response[key]}</p>
        </div>
      ))}
    </div>
  );
}
