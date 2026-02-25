import { Link } from '@tanstack/react-router';
import { Zap, GitMerge, BookOpen, Brain, TrendingUp, Award, Clock, Target } from 'lucide-react';
import ModuleCard from '../components/ModuleCard';

const modules = [
  {
    title: 'Data Structure Visualizer',
    description: 'Compare BST vs flat arrays, understand Big-O complexity with animated step-by-step traversals and real-world context.',
    progress: 35,
    icon: Zap,
    to: '/data-structures',
    tag: 'Module 01',
    color: 'green' as const,
    accentClass: 'text-neon-green',
  },
  {
    title: 'Git Conflict Simulator',
    description: 'Resolve realistic merge conflicts across 3 scenarios. Learn when to merge vs rebase with guided hints and validation.',
    progress: 20,
    icon: GitMerge,
    to: '/git-conflicts',
    tag: 'Module 02',
    color: 'cyan' as const,
    accentClass: 'text-neon-cyan',
  },
  {
    title: 'Industry Challenges',
    description: 'Tackle real-world system design tasks: URL shorteners, ride-sharing DBs, caching strategies, and more.',
    progress: 50,
    icon: BookOpen,
    to: '/challenges',
    tag: 'Module 03',
    color: 'purple' as const,
    accentClass: 'text-neon-purple',
  },
  {
    title: 'AI Mentor Notes',
    description: 'Review all your saved mentor explanations. Revisit the "why" behind every architectural decision you\'ve explored.',
    progress: 60,
    icon: Brain,
    to: '/my-notes',
    tag: 'Module 04',
    color: 'green' as const,
    accentClass: 'text-neon-green',
  },
];

const stats = [
  { label: 'Modules Active', value: '4', icon: Target, color: 'text-neon-green' },
  { label: 'Avg. Progress', value: '41%', icon: TrendingUp, color: 'text-neon-cyan' },
  { label: 'Challenges', value: '6+', icon: Award, color: 'text-neon-purple' },
  { label: 'Est. Hours', value: '12h', icon: Clock, color: 'text-yellow-400' },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Banner */}
      <section className="relative rounded-xl overflow-hidden border border-border">
        <img
          src="/assets/generated/hero-banner.dim_1400x400.png"
          alt="AI SkillBridge Hero"
          className="w-full h-48 sm:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent flex flex-col justify-center px-8">
          <div className="max-w-lg">
            <span className="text-xs font-mono text-neon-green uppercase tracking-widest mb-2 block">
              AI in Education & Skilling
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-3">
              Bridge the Gap Between{' '}
              <span className="text-neon-green">Academia</span> &{' '}
              <span className="text-neon-cyan">Industry</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Learn <em>why</em> architectural decisions matter — not just syntax. Interactive visualizers, real-world challenges, and an AI mentor that explains the reasoning behind every choice.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-surface-1 border border-border rounded-lg p-4 flex items-center gap-3">
            <Icon size={20} className={color} />
            <div>
              <div className={`text-xl font-bold font-mono ${color}`}>{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Problem Statement Banner */}
      <section className="bg-surface-1 border border-neon-green/20 rounded-lg p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={16} className="text-neon-green" />
            <span className="text-xs font-mono text-neon-green uppercase tracking-widest">Why This Platform?</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            There is a massive gap between academic CS curriculums and industry expectations. Students learn coding syntax but lack environments to practice{' '}
            <span className="text-foreground font-medium">architectural logic</span>,{' '}
            <span className="text-foreground font-medium">problem-solving</span>, and{' '}
            <span className="text-foreground font-medium">practical system design</span>. Current platforms act as simple auto-graders — failing to teach students{' '}
            <span className="text-neon-green font-medium">why</span> a specific approach is used in the real world.
          </p>
        </div>
      </section>

      {/* Module Cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-mono text-foreground">
            <span className="text-neon-green">//</span> Learning Modules
          </h2>
          <span className="text-xs text-muted-foreground font-mono">4 modules available</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modules.map((mod) => (
            <ModuleCard key={mod.to} {...mod} />
          ))}
        </div>
      </section>

      {/* Quick Start Tips */}
      <section className="bg-surface-1 border border-border rounded-lg p-5">
        <h3 className="text-sm font-mono font-semibold text-foreground mb-3">
          <span className="text-neon-cyan">//</span> Getting Started
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { step: '01', text: 'Open the AI Mentor panel (top right) and ask about any concept', color: 'text-neon-green' },
            { step: '02', text: 'Try the Data Structure Visualizer to see BST vs Array in action', color: 'text-neon-cyan' },
            { step: '03', text: 'Tackle an Industry Challenge to apply your knowledge', color: 'text-neon-purple' },
          ].map(({ step, text, color }) => (
            <div key={step} className="flex gap-3 items-start">
              <span className={`font-mono font-bold text-lg ${color} shrink-0`}>{step}</span>
              <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
