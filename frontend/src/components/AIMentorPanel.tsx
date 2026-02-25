import { useState, useRef, useEffect } from 'react';
import { Send, Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import MentorResponseCard from './MentorResponseCard';
import { useStoreMentorResponse } from '@/hooks/useQueries';
import type { MentorResponse } from '../backend';

interface AIMentorPanelProps {
  sessionId: string;
}

// Pre-authored mentor responses keyed by topic keywords
const MENTOR_KNOWLEDGE_BASE: Array<{
  keywords: string[];
  response: MentorResponse;
}> = [
  {
    keywords: ['bst', 'binary search tree', 'tree', 'search'],
    response: {
      approach: 'Binary Search Tree (BST) for ordered data lookup',
      tradeOffs: 'BST offers O(log n) average search vs O(n) for flat arrays. However, worst-case BST degrades to O(n) if unbalanced. Self-balancing trees (AVL, Red-Black) guarantee O(log n) at the cost of rotation overhead.',
      realWorldAnalogy: 'Think of a BST like a library with a Dewey Decimal System — you never scan every book. You go left or right at each shelf based on the number, halving your search space each time.',
      betterAlternative: 'For most production use cases, consider a HashMap for O(1) lookups if ordering is not required, or a B-Tree (used in databases like PostgreSQL) for disk-based ordered storage.',
    },
  },
  {
    keywords: ['array', 'flat array', 'list', 'linear'],
    response: {
      approach: 'Flat Array / Linear Search',
      tradeOffs: 'Arrays provide O(1) random access by index and excellent cache locality. However, searching unsorted arrays is O(n). Insertion/deletion in the middle is O(n) due to shifting.',
      realWorldAnalogy: 'A flat array is like a row of numbered lockers — you can jump directly to locker #42, but finding "the locker with the red key" means checking each one.',
      betterAlternative: 'Sort the array first to enable binary search O(log n), or use a hash map for O(1) key-based lookups when random access by value is the primary operation.',
    },
  },
  {
    keywords: ['git', 'merge', 'conflict', 'branch', 'rebase'],
    response: {
      approach: 'Git Merge vs Rebase for integrating branches',
      tradeOffs: 'Merge preserves full history with a merge commit — great for auditing. Rebase creates a linear history but rewrites commits, making force-push necessary and potentially dangerous on shared branches.',
      realWorldAnalogy: 'Merge is like stapling two documents together with a cover page noting when they were combined. Rebase is like retyping one document to include the other\'s changes inline — cleaner, but you\'ve altered the original.',
      betterAlternative: 'Use "squash and merge" for feature branches to keep main history clean, while preserving full history in the feature branch PR for review purposes.',
    },
  },
  {
    keywords: ['hash', 'hashmap', 'dictionary', 'map', 'lookup'],
    response: {
      approach: 'HashMap / Hash Table for key-value lookups',
      tradeOffs: 'HashMaps provide O(1) average-case insert, delete, and lookup. Worst case is O(n) due to hash collisions. Memory overhead is higher than arrays, and iteration order is not guaranteed.',
      realWorldAnalogy: 'A HashMap is like a coat check — you hand in your coat and get a numbered ticket. Retrieving it is instant because the number maps directly to a rack position, not a sequential search.',
      betterAlternative: 'If you need ordered iteration, use a TreeMap (O(log n) operations). For concurrent access, use ConcurrentHashMap or lock-free structures like skip lists.',
    },
  },
  {
    keywords: ['queue', 'stack', 'fifo', 'lifo', 'deque'],
    response: {
      approach: 'Queue (FIFO) vs Stack (LIFO) data structures',
      tradeOffs: 'Queues ensure fairness — first in, first out. Stacks are ideal for undo/redo and recursive call management. Both offer O(1) push/pop. Choosing wrong leads to incorrect ordering semantics.',
      realWorldAnalogy: 'A Queue is a coffee shop line — first customer served first. A Stack is a pile of plates — you always take from the top, which was placed last.',
      betterAlternative: 'For priority-based processing, use a Priority Queue (min/max heap) with O(log n) insertion. For concurrent systems, consider lock-free queues like Michael-Scott queue.',
    },
  },
  {
    keywords: ['system design', 'architecture', 'scalable', 'microservice', 'monolith'],
    response: {
      approach: 'Monolith vs Microservices Architecture',
      tradeOffs: 'Monoliths are simpler to develop, test, and deploy initially. Microservices enable independent scaling and deployment but introduce network latency, distributed tracing complexity, and operational overhead.',
      realWorldAnalogy: 'A monolith is a Swiss Army knife — one tool, many functions, easy to carry. Microservices are a professional chef\'s knife set — each tool is optimized for its job, but you need a bigger kitchen to use them all.',
      betterAlternative: 'Start with a modular monolith (well-separated modules in one codebase). Extract services only when a specific module has distinct scaling or deployment needs — this is the "strangler fig" pattern.',
    },
  },
];

function findMentorResponse(question: string): MentorResponse {
  const lower = question.toLowerCase();
  for (const entry of MENTOR_KNOWLEDGE_BASE) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.response;
    }
  }
  // Default response
  return {
    approach: 'Analyzing your question from first principles',
    tradeOffs: 'Every engineering decision involves trade-offs between time complexity, space complexity, readability, and maintainability. Without more context, the best approach depends on your specific constraints (data size, access patterns, team familiarity).',
    realWorldAnalogy: 'Think of it like choosing a vehicle: a bicycle is perfect for a city commute but impractical for cross-country travel. The "best" choice is always relative to the problem constraints.',
    betterAlternative: 'Try asking about a specific data structure (BST, HashMap, Array), algorithm pattern (sorting, searching), or system design concept (caching, queuing, sharding) for a more targeted explanation.',
  };
}

interface Message {
  id: string;
  question: string;
  response: MentorResponse;
  timestamp: Date;
}

export default function AIMentorPanel({ sessionId }: AIMentorPanelProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const storeMutation = useStoreMentorResponse();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSubmit = async () => {
    if (!question.trim() || isThinking) return;
    const q = question.trim();
    setQuestion('');
    setIsThinking(true);

    // Simulate thinking delay
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const response = findMentorResponse(q);
    const msg: Message = {
      id: `${Date.now()}`,
      question: q,
      response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, msg]);
    setIsThinking(false);

    // Persist to backend
    storeMutation.mutate({ sessionId, response });
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isThinking && (
          <div className="text-center py-8 space-y-3">
            <Brain size={32} className="mx-auto text-neon-green opacity-50" />
            <p className="text-sm text-muted-foreground font-mono">
              Ask me about data structures, algorithms, system design, or Git workflows.
            </p>
            <div className="space-y-1.5">
              {['Why use a BST over a flat array?', 'Explain Git merge vs rebase', 'When to use a HashMap?'].map((hint) => (
                <button
                  key={hint}
                  onClick={() => setQuestion(hint)}
                  className="block w-full text-left text-xs px-3 py-2 rounded-md bg-surface-2 text-muted-foreground hover:text-neon-green hover:bg-surface-3 transition-colors font-mono border border-border hover:border-neon-green/30"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2 animate-fade-in-up">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs">👤</span>
              </div>
              <div className="bg-surface-2 rounded-lg px-3 py-2 text-sm text-foreground flex-1">
                {msg.question}
              </div>
            </div>
            <MentorResponseCard response={msg.response} />
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-3 px-3 py-3 bg-surface-2 rounded-lg animate-fade-in-up">
            <Brain size={16} className="text-neon-green shrink-0" />
            <div className="flex gap-1.5 items-center">
              <span className="text-xs text-muted-foreground font-mono">Thinking</span>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="thinking-dot w-1.5 h-1.5 rounded-full bg-neon-green inline-block"
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border space-y-2">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about a concept, paste code, or describe a problem..."
          className="resize-none text-sm font-mono bg-surface-2 border-border focus:border-neon-green/50 min-h-[80px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
          }}
        />
        <Button
          onClick={handleSubmit}
          disabled={!question.trim() || isThinking}
          className="w-full bg-neon-green text-background hover:bg-neon-green/90 font-mono text-xs gap-2"
          size="sm"
        >
          {isThinking ? (
            <><Loader2 size={13} className="animate-spin" /> Thinking...</>
          ) : (
            <><Send size={13} /> Ask Mentor <span className="text-background/60">(Ctrl+Enter)</span></>
          )}
        </Button>
      </div>
    </div>
  );
}
