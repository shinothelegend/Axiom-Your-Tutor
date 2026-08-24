# PRODUCT.md — Axiom

## Vision
Axiom is a production-ready, client-side web application providing mathematically rigorous, step-by-step doubt resolution and Socratic breakdowns for students from Grade 6 through competitive exams (JEE, NEET, AP, SAT, College). It operates entirely client-side using the student's own Gemini API key.

## Target Audience & Taxonomy
- **Boards / Tiers:** CBSE, ICSE, State Board (India), US Middle School (Grades 6–8), US High School (Grades 9–10), AP / IB, Competitive & College (JEE, NEET, SAT, Calculus / Linear Algebra).
- **Subjects:** Mathematics, Physics, Chemistry (Organic & Inorganic), Biology, Computer Science, Economics.
- **Resolution Modes:**
  1. **Step-by-Step Proof:** Full analytical breakdown with LaTeX equations.
  2. **Socratic Hint Engine:** 3 progressive hints before revealing the complete solution.
  3. **Exam Marking Breakdown:** Step-wise marking allocation aligned with board & competitive exam criteria.

## Key Features & User Journey
1. **BYOK (Bring Your Own Key):**
   - Persistent top-nav status pill (`API Key: Connected` / `API Key: Missing`).
   - Security disclosure modal detailing `localStorage` retention (`axiom_gemini_key`) and zero server middleware.
   - Pre-validation ping before storing key.
2. **Multimodal Input Stream (`/app`):**
   - Typed text / markdown / LaTeX.
   - Drag-and-drop, clipboard paste, and camera capture for textbook photos, circuit diagrams, and handwritten work.
   - Fast vs. Rigorous tier toggle (`gemini-2.5-flash` vs `gemini-2.5-pro`).
3. **Structured Response Engine:**
   - Topic identification, prerequisites, structured steps, common mistakes, and interactive practice challenges.
   - Live LaTeX rendering via KaTeX (`react-markdown` + `rehype-katex`).
   - One-click copy LaTeX per step.
4. **Interactive Landing Page (`/`):**
   - Asymmetric layout (columns 2–8).
   - Live pre-loaded interactive demo featuring a JEE Advanced Physics projectile motion calculus derivation.
   - Board & subject selector preview.
5. **Vault (`/vault`):**
   - Bookmarked formulas & saved doubts.
   - Export to Markdown (`.md`) with LaTeX, full JSON backup/restore, and direct LaTeX copy.

## Strict Voice & Tone
- Terse, exam-room calm.
- Short declarative sentences.
- Zero exclamation points in UI copy.
- Zero corporate SaaS hype words ("supercharge", "transform", "24/7 personal tutor").
