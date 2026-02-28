import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Code, Target, TrendingUp, LogOut, BarChart3, Zap } from "lucide-react";

interface Profile {
  display_name: string | null;
  skill_level: string | null;
  streak_count: number;
  quiz_completed: boolean;
}

interface CognitiveProfile {
  tag_weights: Record<string, number>;
  dominant_weakness: string | null;
  total_submissions: number;
}

interface Submission {
  id: string;
  language: string;
  mistake_tags: any;
  created_at: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cogProfile, setCogProfile] = useState<CognitiveProfile | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    const [profileRes, cogRes, subRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user!.id).single(),
      supabase.from("cognitive_profiles").select("*").eq("user_id", user!.id).single(),
      supabase.from("submissions").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(5),
    ]);

    if (profileRes.data) {
      // Check if quiz is completed, redirect if not
      if (!profileRes.data.quiz_completed) {
        navigate("/onboarding");
        return;
      }
      setProfile(profileRes.data);
    }
    if (cogRes.data) setCogProfile(cogRes.data as any);
    if (subRes.data) setRecentSubmissions(subRes.data as any);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  const tagWeights = (cogProfile?.tag_weights || {}) as Record<string, number>;
  const sortedTags = Object.entries(tagWeights).sort(([, a], [, b]) => b - a);
  const dominantWeakness = cogProfile?.dominant_weakness || sortedTags[0]?.[0] || null;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-xl font-bold">⚡ LogicForge</h1>
          <nav className="flex items-center gap-4">
            <Link to="/submit">
              <Button variant="ghost" size="sm" className="gap-2">
                <Code className="h-4 w-4" /> Submit Code
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="ghost" size="sm" className="gap-2">
                <BarChart3 className="h-4 w-4" /> Analytics
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </nav>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-3xl font-bold">Welcome back, {profile?.display_name || "Student"}</h2>
          <p className="text-muted-foreground mt-1">
            Skill level: <Badge variant="secondary">{profile?.skill_level}</Badge>
            {" · "}
            {cogProfile?.total_submissions || 0} submissions
            {" · "}
            🔥 {profile?.streak_count || 0} day streak
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{cogProfile?.total_submissions || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Dominant Weakness</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold font-mono text-destructive">
                {dominantWeakness || "None yet"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tags Tracked</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sortedTags.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">🔥 {profile?.streak_count || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Cognitive Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" /> Cognitive Profile
              </CardTitle>
              <CardDescription>Your mistake pattern distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sortedTags.length === 0 ? (
                <p className="text-muted-foreground text-sm">Submit code to start building your profile.</p>
              ) : (
                sortedTags.slice(0, 8).map(([tag, weight]) => (
                  <div key={tag} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-mono">{tag}</span>
                      <span className="text-muted-foreground">{(weight * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${Math.min(weight * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Submissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Recent Submissions
              </CardTitle>
              <CardDescription>Your latest code analyses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentSubmissions.length === 0 ? (
                <p className="text-muted-foreground text-sm">No submissions yet.</p>
              ) : (
                recentSubmissions.map((sub) => {
                  const tags = Array.isArray(sub.mistake_tags) ? sub.mistake_tags : [];
                  return (
                    <div key={sub.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{sub.language}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(sub.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {tags.slice(0, 3).map((t: any, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs font-mono">
                            {typeof t === "string" ? t : t.tag || "unknown"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
              <Link to="/submit">
                <Button className="w-full mt-2" variant="outline">
                  Submit New Code
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Problem */}
        {dominantWeakness && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" /> Recommended Practice
              </CardTitle>
              <CardDescription>
                Based on your dominant weakness: <span className="font-mono text-destructive">{dominantWeakness}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/practice">
                <Button className="gap-2">
                  <Zap className="h-4 w-4" /> Generate Practice Problem
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
