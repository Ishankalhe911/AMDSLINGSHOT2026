# Specification

## Summary
**Goal:** Build SkillBridge AI, an interactive CS learning platform with a dark-tech aesthetic, featuring a student dashboard, data structure visualizer, AI mentor panel, Git conflict simulator, and industry challenge feed — all backed by a Motoko actor with no external APIs.

**Planned changes:**
- Create a main dashboard with module cards (Architectural Logic, Data Structures, System Design, Git Mastery), animated progress indicators, and quick navigation, styled with a dark-tech theme (deep charcoal backgrounds, neon green/cyan accents, monospace + sans-serif fonts, glowing card borders)
- Build a Data Structure Visualizer module with side-by-side comparison (e.g., BST vs flat array), step-by-step animated traversal, Big-O complexity labels, and industry context tooltips; triggered by a "Run Comparison" button
- Build an AI Mentor panel accessible from every module, accepting questions or code snippets and returning structured pre-authored responses (Approach → Trade-offs → Analogy → Alternative); responses saved to backend and viewable in a "My Notes" history list
- Build a Git Conflict Resolution Simulator with 3+ pre-loaded scenarios, a three-panel diff view (base/ours/theirs), an editable merged output panel, backend-validated resolution checking, progressive hints (3 levels), and a success banner
- Build an Industry Challenge Feed with 6+ pre-seeded challenges (title, category, difficulty badge, estimated time), filterable by category/difficulty, with a full-screen challenge workspace and backend-saved submitted answers
- Apply cohesive dark-tech visual theme across all pages: circuit/grid background patterns, neon accents, glowing hover effects, smooth transitions, no light backgrounds
- Backend implemented as a single Motoko actor with stable variables for mentor responses, challenge data, conflict scenarios, submitted answers, and progress state

**User-visible outcome:** Students can navigate a visually rich dark-tech dashboard, animate and compare data structures, ask an AI mentor for structured explanations, practice resolving Git merge conflicts with guided hints, and browse/submit real-world system design challenges — all within a cohesive IDE-inspired learning environment.
