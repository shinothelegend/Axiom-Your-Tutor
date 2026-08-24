import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Lightbulb, Eye } from 'lucide-react';
import { MathRenderer } from './MathRenderer';

interface SocraticEngineProps {
  hints?: string[];
  onRevealFullSolution: () => void;
  isFullSolutionRevealed: boolean;
}

export const SocraticEngine: React.FC<SocraticEngineProps> = ({
  hints = [],
  onRevealFullSolution,
  isFullSolutionRevealed,
}) => {
  const [revealedCount, setRevealedCount] = useState<number>(1);

  if (!hints || hints.length === 0) return null;

  return (
    <div className="axiom-border bg-transparent p-5 space-y-4 my-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-axiom-text-dark font-mono text-[11px] uppercase tracking-wider font-semibold">
          <Lightbulb className="w-4 h-4 text-axiom-muted-dark" />
          <span>SOCRATIC HINT ENGINE</span>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-axiom-muted-dark">
          Hint {revealedCount} of {hints.length}
        </span>
      </div>

      <p className="text-xs text-axiom-muted-dark leading-relaxed">
        Try answering using these hints before viewing the full step-by-step proof solution.
      </p>

      {/* Hints List */}
      <div className="space-y-4 pt-2">
        {hints.slice(0, revealedCount).map((hint, idx) => (
          <div 
            key={idx} 
            className="py-3 border-b border-white/10 last:border-b-0 text-xs text-axiom-text-dark space-y-1"
          >
            <span className="font-mono text-[11px] uppercase tracking-wider text-axiom-muted-dark font-semibold">HINT {idx + 1}:</span>
            <div className="pt-1">
              <MathRenderer content={hint} />
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        {revealedCount < hints.length ? (
          <button
            type="button"
            onClick={() => setRevealedCount((c) => c + 1)}
            className="px-4 py-2 bg-transparent border border-white/10 text-axiom-text-dark hover:border-white/30 text-[11px] font-mono uppercase tracking-wider font-medium transition-colors flex items-center gap-2"
          >
            <ChevronDown className="w-3.5 h-3.5 text-axiom-muted-dark" /> Next Hint ({revealedCount + 1}/{hints.length})
          </button>
        ) : (
          <span className="text-[11px] font-mono uppercase tracking-wider text-green-400 flex items-center gap-1">
            ✓ All hints revealed
          </span>
        )}

        {!isFullSolutionRevealed && (
          <button
            type="button"
            onClick={onRevealFullSolution}
            className="px-4 py-2 border border-white/10 bg-transparent text-axiom-text-dark hover:border-white/30 text-[11px] font-mono uppercase tracking-wider font-semibold transition-colors flex items-center gap-2"
          >
            <Eye className="w-3.5 h-3.5 text-axiom-muted-dark" /> Reveal Full Proof
          </button>
        )}
      </div>
    </div>
  );
};
