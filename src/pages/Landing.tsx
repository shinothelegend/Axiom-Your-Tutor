import React, { useEffect } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  BookOpen, 
  Sliders,
  Terminal,
  Sun,
  Moon
} from 'lucide-react';
import { BOARDS, SUBJECTS } from '../constants';
import { useAxiomStore } from '../store/useAxiomStore';
import { WaveDivider } from '../components/WaveDivider';
import { BlockyBackdrop } from '../components/BlockyBackdrop';

interface LandingProps {
  onStartSolver: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStartSolver }) => {
  const { setIsKeyModalOpen, keyStatus, theme, toggleTheme } = useAxiomStore();

  return (
    <div className="min-h-[100svh] flex flex-col bg-axiom-base-dark dark:bg-axiom-base-dark text-axiom-text-dark dark:text-axiom-text-dark font-body relative overflow-x-hidden">
      
      {/* LANDING MINIMAL NAV */}
      <header className="absolute top-0 left-0 right-0 z-40 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 border border-white/10 font-display font-black text-lg flex items-center justify-center rounded-none text-axiom-text-dark">
              A
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-axiom-text-dark">
              AXIOM
            </span>
          </div>
          
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 border border-white/10 text-axiom-muted-dark hover:text-white transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-axiom-text-dark" />
            ) : (
              <Moon className="w-4 h-4 text-axiom-muted-dark" />
            )}
          </button>
        </div>
      </header>

      {/* SECTION 1: Asymmetric Full-Screen Hero */}
      <section className="flex-1 flex flex-col justify-center min-h-[100svh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-16">
        <BlockyBackdrop />
        <div className="grid grid-cols-12 gap-8 items-start relative z-10">
          
          {/* Main Hero Column (Cols 2 to 9 asymmetrically offset) */}
          <div className="col-span-12 lg:col-start-2 lg:col-span-8 space-y-8">
            
            {/* Terse Voice Reference Badge (Neutral border, uppercase mono, no solid amber) */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-transparent border border-white/10 font-mono text-[13px] uppercase tracking-wider text-axiom-text-dark">
              <span className="w-1.5 h-1.5 bg-axiom-amber rounded-full" />
              <span>BYOK Client-Side Architecture</span>
              <span className="text-white/20">|</span>
              <span>Gemini 3.5 Pro & Flash</span>
            </div>

            {/* Dominant Headline (Fraunces serif / italic pairing description) */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-axiom-text-dark text-balance flex flex-col gap-2">
              <span className="font-semibold">Rigorous doubt resolution</span>
              <span className="italic text-axiom-muted-dark font-light">without the noise.</span>
            </h1>

            {/* Terse Subheading (Geist 16px max) */}
            <p className="text-lg text-axiom-muted-dark max-w-2xl leading-relaxed text-pretty font-body">
              Step-by-step mathematical proofs, Socratic hint engines, and exam marking criteria for Grade 6 through JEE/NEET/AP/SAT level. Powered by your own Gemini API key. Zero server middleware.
            </p>

            {/* CTAs (Only ONE solid accent-fill action button on screen: Launch Workspace, using text-color fill) */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartSolver}
                className="px-6 py-3.5 bg-axiom-text-dark text-axiom-base-dark dark:bg-axiom-text-dark dark:text-axiom-base-dark font-mono text-sm uppercase tracking-wider font-bold hover:bg-axiom-text-dark/95 transition-transform active:scale-[0.96] flex items-center gap-3"
              >
                Launch Workspace <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsKeyModalOpen(true)}
                className="px-5 py-3.5 bg-transparent border border-white/10 text-axiom-text-dark font-mono text-sm uppercase tracking-wider hover:border-white/30 transition-colors flex items-center gap-2"
              >
                <Terminal className="w-4 h-4 text-axiom-muted-dark" />
                {keyStatus === 'connected' ? 'API Key: Connected' : 'Configure Gemini Key'}
              </button>
            </div>

            {/* Key Value Micro-metrics (Uppercase Monospace Labels) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-[13px] font-mono uppercase tracking-wider text-axiom-muted-dark">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                <span>Client BYOK</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-axiom-muted-dark shrink-0" />
                <span>JSON Output</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                <span>KaTeX Math</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* WAVE SEAM DIVIDER (Exactly one-time use between hero and taxonomies sections) */}
      <WaveDivider />

      {/* SECTION 2: Taxonomies Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-12">
          
          {/* Boards */}
          <div className="space-y-4">
            <h3 className="font-display font-medium text-xl text-axiom-text-dark flex items-center gap-2">
              <Sliders className="w-5 h-5 text-axiom-muted-dark" /> Supported Academic Boards
            </h3>
            <p className="text-sm text-axiom-muted-dark">
              Axiom tunes explanation depth, notation style, and exam marking schemes specifically for your syllabus:
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {BOARDS.map((board) => (
                <span
                  key={board}
                  className="px-3 py-1.5 bg-axiom-surface-dark border border-white/10 text-[13px] font-mono text-axiom-text-dark"
                >
                  {board}
                </span>
              ))}
            </div>
          </div>

          {/* Subjects */}
          <div className="space-y-4">
            <h3 className="font-display font-medium text-xl text-axiom-text-dark flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-axiom-muted-dark" /> STEM & Economics Subjects
            </h3>
            <p className="text-sm text-axiom-muted-dark">
              Full support for analytical mathematical derivations, structural organic chemistry mechanisms, biological concepts, and computational theory:
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {SUBJECTS.map((subj) => (
                <span
                  key={subj}
                  className="px-3 py-1.5 bg-axiom-surface-dark border border-white/10 text-[13px] font-mono text-axiom-text-dark"
                >
                  {subj}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
