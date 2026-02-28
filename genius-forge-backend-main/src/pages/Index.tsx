import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Code, Target, TrendingUp, Zap, ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-xl font-bold">⚡ LogicForge</h1>
          <Link to="/auth">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main>
        <section className="container py-24 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <Zap className="h-3.5 w-3.5" /> AI-Powered Cognitive Tracking
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Stop making the
            <span className="text-primary"> same mistakes</span> twice
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            LogicForge uses AI to analyze your code, identify persistent cognitive mistake patterns,
            and generate targeted practice problems to strengthen your weakest areas.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                Start Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border/50 bg-card/50">
          <div className="container py-20 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Code,
                title: "Submit Code",
                desc: "Paste any code snippet for instant AI analysis of cognitive mistake patterns.",
              },
              {
                icon: Brain,
                title: "Cognitive Profiling",
                desc: "Build a weighted profile of your recurring mistake tags across sessions.",
              },
              {
                icon: Target,
                title: "Targeted Practice",
                desc: "Get problems designed to exercise your specific weak areas.",
              },
              {
                icon: TrendingUp,
                title: "Track Progress",
                desc: "Watch your mistake weights decay as you improve over time.",
              },
            ].map((f) => (
              <div key={f.title} className="space-y-3">
                <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="container py-20 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">How it Works</h2>
          <div className="space-y-8 text-left">
            {[
              { step: "1", title: "Submit your code", desc: "Paste a code snippet in any language. Our AI analyzes it for cognitive mistake patterns." },
              { step: "2", title: "Build your profile", desc: "Each mistake tag gets weighted. Recurring mistakes increase in weight, improvements cause decay." },
              { step: "3", title: "Practice smart", desc: "Get AI-generated problems that target your dominant weakness, helping you improve where it matters most." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="rounded-full bg-primary text-primary-foreground w-10 h-10 flex items-center justify-center font-bold shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{s.title}</h3>
                  <p className="text-muted-foreground mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/50 bg-primary/5">
          <div className="container py-16 text-center">
            <h2 className="text-3xl font-bold">Ready to forge better logic?</h2>
            <p className="mt-3 text-muted-foreground">Join engineering students who are breaking their mistake cycles.</p>
            <Link to="/auth">
              <Button size="lg" className="mt-6 gap-2">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 LogicForge. Built for engineering students.
        </div>
      </footer>
    </div>
  );
}
