import React from 'react';
import { DoubtStep } from '../types';
import { Award, CheckCircle2 } from 'lucide-react';
import { MathRenderer } from './MathRenderer';

interface ExamBreakdownProps {
  steps: DoubtStep[];
  topic: string;
  board: string;
}

export const ExamBreakdown: React.FC<ExamBreakdownProps> = ({ steps, topic, board }) => {
  return (
    <div className="axiom-border bg-transparent p-5 space-y-4 my-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-axiom-text-dark font-mono text-[11px] uppercase tracking-wider font-semibold">
          <Award className="w-4 h-4 text-axiom-muted-dark" />
          <span>EXAM MARKING CRITERIA BREAKDOWN ({board})</span>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-axiom-muted-dark">{topic}</span>
      </div>

      <p className="text-xs text-axiom-muted-dark leading-relaxed">
        Below is the step-by-step marking key used by board examiners and grading rubrics:
      </p>

      <div className="space-y-4 pt-2">
        {steps.map((step) => (
          <div 
            key={step.stepNumber} 
            className="py-3 border-b border-white/10 last:border-b-0 text-xs flex items-start justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-axiom-muted-dark font-medium">
                  Step {step.stepNumber}:
                </span>
                <span className="font-medium text-axiom-text-dark">{step.title}</span>
              </div>
              <div className="text-axiom-muted-dark">
                <MathRenderer content={step.explanation} allowCopyLatex={false} />
              </div>
            </div>

            <div className="shrink-0 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 bg-transparent border border-white/10 text-axiom-text-dark flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-axiom-muted-dark" />
              <span>{step.examMarksAllocated || '+1 Mark'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
