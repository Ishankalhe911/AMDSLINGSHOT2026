import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Brain } from "lucide-react";

const quizQuestions = [
  {
    question: "What does `arr[arr.length]` return in JavaScript?",
    options: [
      { value: "a", label: "The last element" },
      { value: "b", label: "undefined" },
      { value: "c", label: "An error" },
      { value: "d", label: "null" },
    ],
    correct: "b",
    tag: "off-by-one",
  },
  {
    question: "What happens when you compare `null == undefined` in JavaScript?",
    options: [
      { value: "a", label: "true" },
      { value: "b", label: "false" },
      { value: "c", label: "TypeError" },
      { value: "d", label: "NaN" },
    ],
    correct: "a",
    tag: "null-handling",
  },
  {
    question: "What is the output of `typeof NaN`?",
    options: [
      { value: "a", label: "'NaN'" },
      { value: "b", label: "'undefined'" },
      { value: "c", label: "'number'" },
      { value: "d", label: "'object'" },
    ],
    correct: "c",
    tag: "type-coercion",
  },
  {
    question: "In a `for` loop with `var i`, what does `i` equal after the loop?",
    options: [
      { value: "a", label: "undefined" },
      { value: "b", label: "The last iterated value" },
      { value: "c", label: "The length of the array" },
      { value: "d", label: "It's not accessible" },
    ],
    correct: "c",
    tag: "scope-confusion",
  },
  {
    question: "What does `!!'false'` evaluate to?",
    options: [
      { value: "a", label: "false" },
      { value: "b", label: "true" },
      { value: "c", label: "'false'" },
      { value: "d", label: "TypeError" },
    ],
    correct: "b",
    tag: "logic-inversion",
  },
];

export default function Onboarding() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const progress = ((currentQ + 1) / quizQuestions.length) * 100;
  const q = quizQuestions[currentQ];

  const handleNext = async () => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected("");
    } else {
      // Calculate skill level
      setLoading(true);
      const correctCount = newAnswers.reduce(
        (count, ans, i) => (ans === quizQuestions[i].correct ? count + 1 : count),
        0
      );
      const skillLevel = correctCount <= 1 ? "beginner" : correctCount <= 3 ? "intermediate" : "advanced";

      try {
        await supabase
          .from("profiles")
          .update({
            quiz_completed: true,
            quiz_answers: newAnswers as any,
            skill_level: skillLevel,
          })
          .eq("user_id", user!.id);

        // Create initial cognitive profile
        await supabase.from("cognitive_profiles").insert({
          user_id: user!.id,
          tag_weights: {} as any,
        });

        toast({ title: "Quiz complete!", description: `Your skill level: ${skillLevel}` });
        navigate("/dashboard");
      } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg shadow-xl border-border/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Skill Assessment</CardTitle>
          <CardDescription>
            Question {currentQ + 1} of {quizQuestions.length} — This helps calibrate your experience
          </CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="font-medium text-lg font-mono">{q.question}</p>
          <RadioGroup value={selected} onValueChange={setSelected} className="space-y-3">
            {q.options.map((opt) => (
              <div
                key={opt.value}
                className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem value={opt.value} id={opt.value} />
                <Label htmlFor={opt.value} className="cursor-pointer flex-1">
                  {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <Button
            onClick={handleNext}
            disabled={!selected || loading}
            className="w-full"
          >
            {loading ? "Submitting..." : currentQ < quizQuestions.length - 1 ? "Next" : "Complete Quiz"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
