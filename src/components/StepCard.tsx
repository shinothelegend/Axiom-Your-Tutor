import React from 'react';
import { DoubtStep } from '../types';
import { MathRenderer } from './MathRenderer';
import { CheckCircle2, BookmarkPlus, BookmarkCheck } from 'lucide-react';

interface StepCardProps {
  step: DoubtStep;
  totalSteps: number;
  onBookmarkFormula?: (latex: string, title: string) => void;
  isBookmarked?: boolean;
}

export const StepCard: React.FC<StepCardProps> = ({ 
  step, 
  totalSteps,
  onBookmarkFormula,
  isBookmarked = false 
}) => {
  return (
    <div className="axiom-border bg-transparent p-5 relative space-y-3">
      {/* Header Badge & Action */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-axiom-muted-dark font-medium tabular-nums">
            STEP {step.stepNumber} / {totalSteps}
          </span>
          <h3 className="font-display font-medium text-base text-axiom-text-dark">
            {step.title}
          </h3>
        </div>

        {step.mathLatex && onBookmarkFormula && (
          <button
            type="button"
            onClick={() => onBookmarkFormula(step.mathLatex!, step.title)}
            className="p-1 text-axiom-muted-dark hover:text-axiom-amber transition-colors flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider"
            title="Bookmark formula to Vault"
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-green-500" />
                <span className="text-green-500 font-medium">Saved</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" />
                <span>Save Formula</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Text Explanation */}
      <div className="text-sm text-axiom-text-dark leading-relaxed">
        <MathRenderer content={step.explanation} />
      </div>

      {/* LaTeX Equation Block (Separate with spacing, no inner border/bg boxes) */}
      {step.mathLatex && (
        <div className="py-2 overflow-x-auto my-2">
          <MathRenderer content={`$$${step.mathLatex}$$`} />
        </div>
      )}

      {/* Exam Marks Allocation (if ExamPrep mode) */}
      {step.examMarksAllocated && (
        <div className="pt-2 flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-axiom-muted-dark border-t border-white/5">
          <CheckCircle2 className="w-3.5 h-3.5 text-axiom-muted-dark shrink-0" />
          <span>Exam Allocation: {step.examMarksAllocated}</span>
        </div>
      )}
    </div>
  );
};
