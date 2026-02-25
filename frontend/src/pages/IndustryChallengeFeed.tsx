import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Filter, Search, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChallengeCard from '../components/ChallengeCard';
import { useGetAllChallenges, useAddChallenge } from '@/hooks/useQueries';
import type { Challenge } from '../backend';

// Pre-seeded challenges to add if backend is empty
const SEED_CHALLENGES = [
  {
    id: 'url-shortener-design',
    description: `Design a URL Shortener Service\n\nDesign a scalable URL shortening service like bit.ly. Consider the data model, hashing strategy, redirect mechanism, and how you'd handle 100M+ URLs. What database would you choose and why?`,
    difficulty: BigInt(2),
    estimatedTime: BigInt(30),
  },
  {
    id: 'ride-sharing-db',
    description: `Choose the Right Database for Ride-Sharing\n\nA ride-sharing app needs to store driver locations (updated every 5s), trip history, and user profiles. Evaluate SQL vs NoSQL vs time-series databases. Justify your choice with trade-offs.`,
    difficulty: BigInt(3),
    estimatedTime: BigInt(45),
  },
  {
    id: 'cache-strategy',
    description: `Design a Caching Strategy for an E-Commerce Platform\n\nAn e-commerce site has slow product page loads. Design a multi-layer caching strategy using Redis. Address cache invalidation, TTL policies, and the thundering herd problem.`,
    difficulty: BigInt(2),
    estimatedTime: BigInt(25),
  },
  {
    id: 'api-rate-limiting',
    description: `Implement API Rate Limiting\n\nDesign a rate limiting system for a public REST API. Compare token bucket vs sliding window algorithms. How would you implement this in a distributed system with multiple API servers?`,
    difficulty: BigInt(2),
    estimatedTime: BigInt(20),
  },
  {
    id: 'algo-bst-vs-array',
    description: `BST vs Array: When Does It Matter?\n\nYou're building a leaderboard for a gaming platform with 10M players. Compare using a sorted array vs a BST vs a skip list for real-time rank queries and updates. Analyze time complexity for each operation.`,
    difficulty: BigInt(1),
    estimatedTime: BigInt(15),
  },
  {
    id: 'git-branching-strategy',
    description: `Design a Git Branching Strategy for a 50-Person Team\n\nA startup is scaling from 5 to 50 engineers. Compare GitFlow, trunk-based development, and GitHub Flow. Recommend a strategy and explain how it prevents merge conflicts and enables CI/CD.`,
    difficulty: BigInt(1),
    estimatedTime: BigInt(20),
  },
  {
    id: 'microservice-vs-monolith',
    description: `Monolith vs Microservices: Make the Call\n\nA fintech startup has a 2-year-old monolith with 200K LOC. The team wants to migrate to microservices. Analyze the trade-offs, identify which services to extract first, and describe the strangler fig pattern.`,
    difficulty: BigInt(3),
    estimatedTime: BigInt(40),
  },
];

function getDifficultyLabel(d: bigint): string {
  const n = Number(d);
  if (n <= 1) return 'Beginner';
  if (n <= 2) return 'Intermediate';
  return 'Advanced';
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

export default function IndustryChallengeFeed() {
  const navigate = useNavigate();
  const { data: challenges, isLoading, refetch } = useGetAllChallenges();
  const addChallenge = useAddChallenge();
  const [seeded, setSeeded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Seed challenges if backend is empty
  useEffect(() => {
    if (!seeded && challenges !== undefined && challenges.length === 0) {
      setSeeded(true);
      const seedAll = async () => {
        for (const c of SEED_CHALLENGES) {
          try {
            await addChallenge.mutateAsync(c);
          } catch {
            // ignore duplicate errors
          }
        }
        refetch();
      };
      seedAll();
    } else if (challenges && challenges.length > 0) {
      setSeeded(true);
    }
  }, [challenges, seeded]);

  const allChallenges: Challenge[] = challenges || [];

  const categories = ['all', ...Array.from(new Set(allChallenges.map((c) => getCategoryFromId(c.id))))];

  const filtered = allChallenges.filter((c) => {
    const matchSearch =
      !searchQuery ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDiff =
      difficultyFilter === 'all' || getDifficultyLabel(c.difficulty) === difficultyFilter;
    const matchCat =
      categoryFilter === 'all' || getCategoryFromId(c.id) === categoryFilter;
    return matchSearch && matchDiff && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-mono text-neon-purple uppercase tracking-widest">Module 03</span>
        <h1 className="text-2xl font-bold font-mono text-foreground mt-1">
          Industry <span className="text-neon-purple">Challenges</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Real-world system design and architectural tasks used in industry. Practice the reasoning behind engineering decisions.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-surface-1 border border-border rounded-lg p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Search</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search challenges..."
                className="pl-8 bg-surface-2 border-border font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Difficulty</label>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-40 bg-surface-2 border-border font-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface-2 border-border">
                <SelectItem value="all" className="font-mono text-sm">All Levels</SelectItem>
                <SelectItem value="Beginner" className="font-mono text-sm">Beginner</SelectItem>
                <SelectItem value="Intermediate" className="font-mono text-sm">Intermediate</SelectItem>
                <SelectItem value="Advanced" className="font-mono text-sm">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44 bg-surface-2 border-border font-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface-2 border-border">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="font-mono text-sm capitalize">
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-border font-mono text-xs gap-1.5"
          >
            <RefreshCw size={12} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Challenge Grid */}
      {isLoading || addChallenge.isPending ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <Loader2 size={20} className="animate-spin text-neon-purple" />
          <span className="text-sm text-muted-foreground font-mono">Loading challenges...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <p className="text-muted-foreground font-mono text-sm">No challenges match your filters.</p>
          <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setDifficultyFilter('all'); setCategoryFilter('all'); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">{filtered.length} challenge{filtered.length !== 1 ? 's' : ''} found</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClick={() => navigate({ to: '/challenges/$id', params: { id: challenge.id } })}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
