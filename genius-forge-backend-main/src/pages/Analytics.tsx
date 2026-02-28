import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Brain, TrendingDown, TrendingUp } from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line,
} from "recharts";

export default function Analytics() {
  const { user } = useAuth();
  const [tagWeights, setTagWeights] = useState<Record<string, number>>({});
  const [improvementHistory, setImprovementHistory] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    const [cogRes, subRes] = await Promise.all([
      supabase.from("cognitive_profiles").select("*").eq("user_id", user!.id).single(),
      supabase.from("submissions").select("*").eq("user_id", user!.id).order("created_at", { ascending: true }),
    ]);

    if (cogRes.data) {
      setTagWeights((cogRes.data.tag_weights || {}) as Record<string, number>);
      setImprovementHistory((cogRes.data.improvement_history || []) as any[]);
    }
    if (subRes.data) setSubmissions(subRes.data);
    setLoading(false);
  };

  // Prepare radar data
  const radarData = Object.entries(tagWeights).map(([tag, weight]) => ({
    tag,
    weight: Math.round(weight * 100),
  }));

  // Prepare bar chart data
  const barData = Object.entries(tagWeights)
    .sort(([, a], [, b]) => b - a)
    .map(([tag, weight]) => ({ tag, weight: Math.round(weight * 100) }));

  // Prepare timeline from submissions
  const timelineData = submissions.map((s, i) => {
    const tags = Array.isArray(s.mistake_tags) ? s.mistake_tags : [];
    return {
      submission: i + 1,
      date: new Date(s.created_at).toLocaleDateString(),
      mistakes: tags.length,
    };
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center gap-4 h-16">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="text-xl font-bold">⚡ Analytics</h1>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {radarData.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No data yet. Submit code to start building your analytics.</p>
              <Link to="/submit">
                <Button className="mt-4">Submit Code</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" /> Cognitive Weakness Radar
                  </CardTitle>
                  <CardDescription>Distribution of your mistake patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="tag" className="text-xs" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar
                        dataKey="weight"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" /> Tag Weights
                  </CardTitle>
                  <CardDescription>Ranked by recurrence weight</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="tag" width={120} className="text-xs font-mono" />
                      <Tooltip />
                      <Bar dataKey="weight" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Mistake Timeline */}
            {timelineData.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" /> Mistakes Over Time
                  </CardTitle>
                  <CardDescription>Number of mistakes per submission</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="submission" label={{ value: "Submission #", position: "bottom" }} />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="mistakes"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Improvement History */}
            {improvementHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Improvement Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {improvementHistory.slice(-10).reverse().map((entry: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-sm border-b border-border/50 pb-2">
                        <TrendingDown className="h-4 w-4 text-success" />
                        <span className="font-mono">{entry.tag}</span>
                        <span className="text-muted-foreground">
                          weight decreased from {(entry.from * 100).toFixed(0)}% to {(entry.to * 100).toFixed(0)}%
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {entry.date ? new Date(entry.date).toLocaleDateString() : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
