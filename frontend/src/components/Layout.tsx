import { useState, useEffect } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { Brain, LayoutDashboard, GitMerge, Zap, BookOpen, StickyNote, Menu, X, MessageSquare } from 'lucide-react';
import AIMentorPanel from './AIMentorPanel';
import { Button } from '@/components/ui/button';

const SESSION_ID_KEY = 'skillbridge_session_id';

function getOrCreateSessionId(): string {
  let id = localStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/data-structures', label: 'Data Structures', icon: Zap },
  { to: '/git-conflicts', label: 'Git Conflicts', icon: GitMerge },
  { to: '/challenges', label: 'Challenges', icon: BookOpen },
  { to: '/my-notes', label: 'My Notes', icon: StickyNote },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mentorOpen, setMentorOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const sessionId = getOrCreateSessionId();
  const router = useRouter();

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [router.state.location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface-1/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/assets/generated/logo-icon.dim_128x128.png"
              alt="AI SkillBridge"
              className="w-8 h-8 rounded-md"
            />
            <span className="font-mono font-bold text-lg text-neon-green tracking-tight hidden sm:block">
              AI<span className="text-foreground">SkillBridge</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                activeProps={{ className: 'text-neon-green bg-surface-2' }}
                activeOptions={{ exact: to === '/' }}
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMentorOpen(!mentorOpen)}
              className="gap-1.5 border-neon-green text-neon-green hover:bg-neon-green/10 font-mono text-xs"
            >
              <MessageSquare size={14} />
              <span className="hidden sm:inline">AI Mentor</span>
            </Button>
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileNavOpen && (
          <div className="md:hidden border-t border-border bg-surface-1 px-4 py-2 animate-fade-in-up">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                activeProps={{ className: 'text-neon-green bg-surface-2' }}
                activeOptions={{ exact: to === '/' }}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main content + Mentor panel */}
      <div className="flex flex-1 relative overflow-hidden">
        <main className="flex-1 min-w-0 overflow-auto">
          {children}
        </main>

        {/* AI Mentor Sidebar */}
        {mentorOpen && (
          <aside className="w-full sm:w-96 border-l border-border bg-surface-1 flex flex-col animate-slide-in-right shrink-0 absolute sm:relative right-0 top-0 bottom-0 z-40">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Brain size={16} className="text-neon-green" />
                <span className="font-mono font-semibold text-sm text-neon-green">AI Mentor</span>
              </div>
              <button
                onClick={() => setMentorOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <AIMentorPanel sessionId={sessionId} />
          </aside>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-1/80 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="font-mono">© {new Date().getFullYear()} AI SkillBridge — Bridging Academia & Industry</span>
          <span className="flex items-center gap-1">
            Built with <span className="text-red-400">♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'ai-skillbridge')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
