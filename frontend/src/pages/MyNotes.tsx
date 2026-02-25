import { useState, useEffect } from 'react';
import { Brain, StickyNote, Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MentorResponseCard from '../components/MentorResponseCard';
import type { MentorResponse } from '../backend';

const SESSION_ID_KEY = 'skillbridge_session_id';
const NOTES_STORAGE_KEY = 'skillbridge_mentor_notes';

interface SavedNote {
  id: string;
  question: string;
  response: MentorResponse;
  savedAt: string;
}

function getSessionId(): string {
  return localStorage.getItem(SESSION_ID_KEY) || 'unknown';
}

function loadNotes(): SavedNote[] {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedNote[];
  } catch {
    return [];
  }
}

export default function MyNotes() {
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const sessionId = getSessionId();

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearAll = () => {
    setNotes([]);
    try {
      localStorage.removeItem(NOTES_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-mono text-neon-green uppercase tracking-widest">Module 04</span>
        <h1 className="text-2xl font-bold font-mono text-foreground mt-1">
          My <span className="text-neon-green">Notes</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          All your saved AI Mentor responses from this session. Revisit the reasoning behind every architectural decision you've explored.
        </p>
      </div>

      {/* Session info */}
      <div className="flex items-center justify-between bg-surface-1 border border-border rounded-lg px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Brain size={14} className="text-neon-green" />
          <span>Session: <span className="text-foreground">{sessionId.slice(0, 24)}…</span></span>
          <span className="text-border">|</span>
          <span>{notes.length} note{notes.length !== 1 ? 's' : ''} saved</span>
        </div>
        {notes.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
            className="text-xs font-mono gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <Trash2 size={12} />
            Clear All
          </Button>
        )}
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center">
            <StickyNote size={28} className="text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-mono font-semibold text-foreground">No notes yet</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Open the <span className="text-neon-green font-medium">AI Mentor</span> panel from any module page and ask a question. Your responses will appear here automatically.
            </p>
          </div>
          <div className="bg-surface-1 border border-border rounded-md px-4 py-3 text-xs font-mono text-muted-foreground max-w-sm text-left space-y-1">
            <p className="text-neon-green font-semibold mb-2">// Try asking:</p>
            {[
              'Why use a BST over a flat array?',
              'Explain Git merge vs rebase',
              'When should I use a HashMap?',
              'Monolith vs microservices trade-offs',
            ].map((q) => (
              <p key={q} className="flex items-start gap-1.5">
                <span className="text-neon-green shrink-0">▸</span> {q}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const isExpanded = expandedIds.has(note.id);
            const savedDate = new Date(note.savedAt);
            const timeAgo = formatTimeAgo(savedDate);

            return (
              <div
                key={note.id}
                className="bg-surface-1 border border-border rounded-lg overflow-hidden animate-fade-in-up"
              >
                {/* Note header */}
                <div
                  className="flex items-start justify-between gap-3 px-4 py-3 cursor-pointer hover:bg-surface-2 transition-colors"
                  onClick={() => toggleExpand(note.id)}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <Brain size={15} className="text-neon-green shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{note.question}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock size={11} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-mono">{timeAgo}</span>
                        <span className="text-xs text-muted-foreground font-mono">·</span>
                        <span className="text-xs text-neon-green/70 font-mono truncate">
                          {note.response.approach.slice(0, 40)}…
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      aria-label="Delete note"
                    >
                      <Trash2 size={13} />
                    </button>
                    {isExpanded ? (
                      <ChevronUp size={14} className="text-muted-foreground" />
                    ) : (
                      <ChevronDown size={14} className="text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 animate-fade-in-up">
                    <MentorResponseCard response={note.response} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
