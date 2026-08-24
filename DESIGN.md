# DESIGN.md — Axiom Design System

## Core Aesthetic: Exam-Room Precision & Technical Rigor
Axiom is built for high-stakes academic clarity. Its visual identity reflects a sharp, technical reference tool — hard edges, precise typography, zero decorative noise.

## Typography System
- **Display / Headlines:** `Fraunces` (Google Fonts, variable font supporting optical size and weight axes). Used for main page headers, section titles, hero statement.
- **Body & Controls:** `Geist` (Google Fonts / Vercel Geist). 14px to 16px range. Never exceeds 16px outside the hero.
- **Math, Formulas & Inputs:** `JetBrains Mono`. Used for code blocks, LaTeX raw strings, API key inputs, and tabular numerical data.

## Color Tokens

### Dark Mode (Default)
- `--bg-base`: `#0B0D11`
- `--bg-surface`: `#14171F`
- `--text-main`: `#F3F4F6`
- `--text-muted`: `#9CA3AF`
- `--accent-amber`: `#F59E0B`
- `--border-subtle`: `rgba(255, 255, 255, 0.08)`
- `--border-hard`: `rgba(255, 255, 255, 0.16)`

### Light Mode
- `--bg-base`: `#F9FAFB`
- `--bg-surface`: `#FFFFFF`
- `--text-main`: `#111827`
- `--text-muted`: `#4B5563`
- `--accent-amber`: `#D97706`
- `--border-subtle`: `rgba(0, 0, 0, 0.08)`
- `--border-hard`: `rgba(0, 0, 0, 0.16)`

## Spatial & Grid Rules
- **Grid Layout:** 12-column grid with 80px gutters on desktop (≥1024px), collapsing to 4 columns / 16px gutters under 768px.
- **Asymmetric Content Placement:** Hero and main workspace content are placed in columns 2–8 on desktop (never horizontally centered).
- **Rhythm:** 8px base grid. All section margins and paddings are strict multiples of 24px or 32px (`py-6`, `py-8`, `gap-6`, `gap-8`).
- **Dividers:** `1px solid` border color only. Shadows are forbidden.
- **Micro-Interactions:** `active:scale-[0.96]`, `transition-transform` on controls. `tabular-nums` on step counters and execution timings.

## Anti-Pattern Blacklist (Strict Enforcement)
1. **Fonts:** No Inter, Roboto, Open Sans, Arial, or Poppins.
2. **Gradients:** No purple-to-indigo, violet-to-blue, or pastel mesh gradients.
3. **Shadows:** No soft/blurry drop shadows (`box-shadow: none` or `1px solid` borders).
4. **Grids:** No standard 3-up feature card rows.
5. **Badges:** No rounded-pill glowing "AI Magic ✨" chips.
6. **Hero:** No centered text over gradient blobs.
7. **Empty/Error States:** Must feature explicit, helpful copy in exam-room tone, never plain spinners.
