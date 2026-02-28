
-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  skill_level TEXT DEFAULT 'beginner',
  quiz_completed BOOLEAN NOT NULL DEFAULT false,
  quiz_answers JSONB DEFAULT '[]'::jsonb,
  streak_count INTEGER NOT NULL DEFAULT 0,
  last_submission_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  code TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'python',
  mistake_tags JSONB DEFAULT '[]'::jsonb,
  ai_analysis TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own submissions" ON public.submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own submissions" ON public.submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cognitive profiles table
CREATE TABLE public.cognitive_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  tag_weights JSONB NOT NULL DEFAULT '{}'::jsonb,
  dominant_weakness TEXT,
  improvement_history JSONB DEFAULT '[]'::jsonb,
  total_submissions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cognitive_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cognitive profile" ON public.cognitive_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own cognitive profile" ON public.cognitive_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cognitive profile" ON public.cognitive_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_cognitive_profiles_updated_at BEFORE UPDATE ON public.cognitive_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Generated problems table
CREATE TABLE public.generated_problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  target_weakness TEXT NOT NULL,
  expected_pitfalls JSONB DEFAULT '[]'::jsonb,
  hints JSONB DEFAULT '[]'::jsonb,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.generated_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own problems" ON public.generated_problems FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own problems" ON public.generated_problems FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own problems" ON public.generated_problems FOR UPDATE USING (auth.uid() = user_id);
