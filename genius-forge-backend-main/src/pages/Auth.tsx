import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Brain, Zap, Target } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        navigate("/dashboard");
      } else {
        await signUp(email, password, displayName);
        toast({
          title: "Check your email",
          description: "We sent you a confirmation link. Please verify your email to continue.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">⚡ LogicForge</h1>
          <p className="mt-2 text-primary-foreground/70">AI-Powered Cognitive Mistake Tracker</p>
        </div>
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <Brain className="h-8 w-8 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Cognitive Profiling</h3>
              <p className="text-primary-foreground/70">AI analyzes your code to identify recurring mistake patterns and build your cognitive profile.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Target className="h-8 w-8 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Targeted Practice</h3>
              <p className="text-primary-foreground/70">Get problems designed specifically to strengthen your weakest areas.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Zap className="h-8 w-8 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Track Improvement</h3>
              <p className="text-primary-foreground/70">Watch your cognitive weaknesses decay as you improve over time.</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-primary-foreground/50">© 2026 LogicForge. Built for engineering students.</p>
      </div>

      {/* Right panel — auth form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <Card className="w-full max-w-md border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <div className="lg:hidden mb-4">
              <h1 className="text-2xl font-bold">⚡ LogicForge</h1>
            </div>
            <CardTitle className="text-2xl">{isLogin ? "Welcome back" : "Create account"}</CardTitle>
            <CardDescription>
              {isLogin ? "Sign in to continue tracking your progress" : "Start identifying your cognitive patterns"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Input
                  placeholder="Display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              )}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-medium hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
