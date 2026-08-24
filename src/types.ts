export type BoardTier = 
  | 'CBSE'
  | 'ICSE'
  | 'State Board'
  | 'US Middle School (6-8)'
  | 'US High School (9-10)'
  | 'AP / IB'
  | 'JEE / NEET / College';

export type Subject = 
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry (Organic)'
  | 'Chemistry (Inorganic)'
  | 'Biology'
  | 'Computer Science'
  | 'Economics';

export type ResolutionMode = 'Proof' | 'Socratic' | 'ExamPrep';

export type ModelTier = 'fast' | 'rigorous';

export type ApiKeyStatus = 'missing' | 'connected' | 'testing' | 'invalid';

export interface DoubtStep {
  stepNumber: number;
  title: string;
  explanation: string;
  mathLatex?: string;
  examMarksAllocated?: string;
}

export interface PracticeChallenge {
  question: string;
  mathLatex?: string;
  hint: string;
  answer: string;
}

export interface DoubtSolutionResponse {
  identifiedTopic: string;
  coreConcept: string;
  prerequisites: string[];
  steps: DoubtStep[];
  socraticHints?: string[];
  commonMistakes: string[];
  practiceChallenge: PracticeChallenge;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  query: string;
  imageDataUrl?: string;
  board: BoardTier;
  subject: Subject;
  mode: ResolutionMode;
  modelTier: ModelTier;
  response: DoubtSolutionResponse;
}

export interface VaultItem {
  id: string;
  savedAt: number;
  title: string;
  topic: string;
  subject: Subject;
  board: BoardTier;
  latexSnippet?: string;
  fullSolution: DoubtSolutionResponse;
  userNotes?: string;
}
