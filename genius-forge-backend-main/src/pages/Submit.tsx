import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Code, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

interface MistakeTag {
  tag: string;
  explanation: string;
  severity: "low" | "medium" | "high";
  line_hint?: string;
}

interface AnalysisResult {
  tags: MistakeTag[];
  summary: string;
}

export default function Submit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast({ title: "Empty code", description: "Please paste some code to analyze.", variant: "destructive" });
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      // Call AI analysis edge function
      const { data, error } = await supabase.functions.invoke("analyze-code", {
        body: { code, language, userId: user!.id },
      });

      if (error) throw error;

      setResult(data);
      toast({ title: "Analysis complete!", description: `Found ${data.tags.length} cognitive pattern(s).` });
    } catch (error: any) {
      toast({ title: "Analysis failed", description: error.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const severityColor = (s: string) => {
    switch (s) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center gap-4 h-16">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="text-xl font-bold">⚡ Submit Code</h1>
        </div>
      </header>

      <main className="container py-8 max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" /> Code Submission
            </CardTitle>
            <CardDescription>Paste your code below for AI-powered cognitive mistake analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="c">C</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="min-h-[300px] font-mono text-sm"
            />

            <Button onClick={handleSubmit} disabled={analyzing} className="gap-2">
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Code className="h-4 w-4" /> Analyze Code
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" /> Analysis Results
              </CardTitle>
              <CardDescription>{result.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.tags.length === 0 ? (
                <p className="text-success font-medium">No cognitive mistakes detected! Great job.</p>
              ) : (
                result.tags.map((tag, i) => (
                  <div key={i} className="rounded-lg border p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <span className="font-mono font-bold">{tag.tag}</span>
                      <Badge className={severityColor(tag.severity)}>{tag.severity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tag.explanation}</p>
                    {tag.line_hint && (
                      <p className="text-xs font-mono text-muted-foreground">📍 {tag.line_hint}</p>
                    )}
                  </div>
                ))
              )}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => { setResult(null); setCode(""); }}>
                  Submit Another
                </Button>
                <Link to="/dashboard">
                  <Button variant="ghost">Back to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
