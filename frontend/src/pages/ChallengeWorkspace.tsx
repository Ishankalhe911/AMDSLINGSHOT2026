import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, CheckCircle, Clock, Loader2, Send, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnswerEditor from '../components/AnswerEditor';
import { useGetChallenge } from '@/hooks/useQueries';

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

const SESSION_ANSWERS_KEY = 'skillbridge_answers';

function saveAnswer(challengeId: string, answer: string) {
  try {
    const existing = JSON.parse(localStorage.getItem(SESSION_ANSWERS_KEY) || '{}');
    existing[challengeId] = { answer, savedAt: new Date().toISOString() };
    localStorage.setItem(SESSION_ANSWERS_KEY, JSON.stringify(existing));
  } catch {
    // ignore
  }
}

function loadAnswer(challengeId: string): string {
  try {
    const existing = JSON.parse(localStorage.getItem(SESSION_ANSWERS_KEY) || '{}');
    return existing[challengeId]?.answer || '';
  } catch {
    return '';
  }
}

export default function ChallengeWorkspace() {
  const { id } = useParams({ from: '/challenges/$id' });
  const navigate = useNavigate();
  const { data: challenge, isLoading, error } = useGetChallenge(id);
  const [answer, setAnswer] = useState(() => loadAnswer(id));
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim() || isSubmitting) return;
    setIsSubmitting(true);
    // Simulate submission delay
    await new Promise((r) => setTimeout(r, 800));
    saveAnswer(id, answer);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3">
        <Loader2 size={20} className="animate-spin text-neon-purple" />
        <span className="text-sm text-muted-foreground font-mono">Loading challenge...</span>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-muted-foreground font-mono text-sm">Challenge not found.</p>
        <Button variant="outline" onClick={() => navigate({ to: '/challenges' })} className="gap-2 font-mono text-sm">
          <ArrowLeft size={14} /> Back to Challenges
        </Button>
      </div>
    );
  }

  const diff = getDifficultyLabel(challenge.difficulty);
  const category = getCategoryFromId(challenge.id);
  const estimatedMins = Number(challenge.estimatedTime);
  const lines = challenge.description.split('\n');
  const title = lines[0].replace(/^#+\s*/, '');
  const body = lines.slice(1).join('\n').trim();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Back nav */}
      <button
        onClick={() => navigate({ to: '/challenges' })}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
      >
        <ArrowLeft size={14} /> Back to Challenges
      </button>

      {/* Challenge Header */}
      <div className="bg-surface-1 border border-border rounded-lg p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-surface-2 border border-border text-muted-foreground flex items-center gap-1">
            <Tag size={10} /> {category}
          </span>
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${diff.className}`}>
            {diff.label}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono ml-auto">
            <Clock size={12} /> ~{estimatedMins} min
          </span>
        </div>

        <h1 className="text-xl font-bold font-mono text-foreground">{title}</h1>

        {body && (
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{body}</p>
          </div>
        )}

        {/* Guidance */}
        <div className="bg-surface-2 border border-border rounded-md p-4 space-y-2">
          <p className="text-xs font-mono text-neon-green font-semibold uppercase tracking-wider">// What we're looking for</p>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {[
              'Explain your architectural approach and why you chose it',
              'Identify key trade-offs (performance, cost, complexity, scalability)',
              'Reference real-world analogies or industry examples',
              'Mention what you would do differently with more time or resources',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-neon-green mt-0.5 shrink-0">▸</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Answer Editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-semibold text-foreground">
            <span className="text-neon-purple">//</span> Your Answer
          </h2>
          {answer.trim() && !submitted && (
            <span className="text-xs text-muted-foreground font-mono">
              {answer.trim().split(/\s+/).length} words
            </span>
          )}
        </div>
        <AnswerEditor
          value={answer}
          onChange={(v) => {
            setAnswer(v);
            setSubmitted(false);
          }}
          placeholder={`Explain your approach to: ${title}\n\nConsider:\n- What architecture/data structure/algorithm would you choose?\n- Why is this better than alternatives?\n- What are the trade-offs?\n- How does this scale?`}
        />
      </div>

      {/* Submit */}
      {!submitted ? (
        <Button
          onClick={handleSubmit}
          disabled={!answer.trim() || isSubmitting}
          className="bg-neon-purple text-background hover:bg-neon-purple/90 font-mono text-sm gap-2"
        >
          {isSubmitting ? (
            <><Loader2 size={14} className="animate-spin" /> Submitting...</>
          ) : (
            <><Send size={14} /> Submit Answer</>
          )}
        </Button>
      ) : (
        <div className="bg-neon-green/10 border border-neon-green/30 rounded-lg p-5 animate-fade-in-up">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-neon-green shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-mono font-bold text-neon-green">Answer Submitted!</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Great work tackling this challenge. Your answer has been saved to your session. Open the{' '}
                <span className="text-neon-green font-medium">AI Mentor</span> panel to get feedback on your approach — ask about the specific concepts in this challenge for a structured explanation.
              </p>
              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate({ to: '/challenges' })}
                  className="font-mono text-xs gap-1.5 border-border"
                >
                  <ArrowLeft size={12} /> More Challenges
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                  className="font-mono text-xs gap-1.5 border-neon-green/30 text-neon-green"
                >
                  Edit Answer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
