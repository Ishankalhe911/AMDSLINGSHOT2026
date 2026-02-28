import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Target, Lightbulb, AlertTriangle } from "lucide-react";

interface Problem {
  title: string;
  description: string;
  difficulty: string;
  target_weakness: string;
  expected_pitfalls: string[];
  hints: string[];
}

export default function Practice() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const generateProblem = async () => {
    setLoading(true);
    setProblem(null);
    setShowHints(false);

    try {
      const { data, error } = await supabase.functions.invoke("generate-problem", {
        body: { userId: user!.id },
      });

      if (error) throw error;
      setProblem(data);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const difficultyColor = (d: string) => {
    switch (d) {
      case "hard": return "bg-destructive/10 text-destructive";
      case "medium": return "bg-warning/10 text-warning";
      default: return "bg-success/10 text-success";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center gap-4 h-16">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="text-xl font-bold">⚡ Practice Problem</h1>
        </div>
      </header>

      <main className="container py-8 max-w-3xl space-y-6">
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Generating a problem for your weakness...</span>
            </CardContent>
          </Card>
        ) : problem ? (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={difficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                  <Badge variant="outline" className="font-mono">{problem.target_weakness}</Badge>
                </div>
                <CardTitle className="text-2xl">{problem.title}</CardTitle>
                <CardDescription>Targets your weakness in: {problem.target_weakness}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{problem.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Pitfalls */}
            {problem.expected_pitfalls.length > 0 && (
              <Card className="border-warning/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" /> Expected Pitfalls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {problem.expected_pitfalls.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-warning mt-0.5">•</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Hints */}
            {problem.hints.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" /> Hints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showHints ? (
                    <ul className="space-y-2">
                      {problem.hints.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-accent mt-0.5">💡</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setShowHints(true)}>
                      Show Hints
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button onClick={generateProblem} className="gap-2">
                <Target className="h-4 w-4" /> Generate Another
              </Button>
              <Link to="/submit">
                <Button variant="outline">Submit Your Solution</Button>
              </Link>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Submit some code first so we can identify your weaknesses.</p>
              <Link to="/submit">
                <Button className="mt-4">Submit Code</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
