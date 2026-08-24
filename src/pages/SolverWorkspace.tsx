import React, { useState } from 'react';
import { 
  Zap, 
  BookOpen, 
  Sliders, 
  History, 
  Send, 
  Loader2, 
  AlertCircle, 
  BookmarkPlus, 
  BookmarkCheck, 
  Download, 
  Check, 
  Trash2,
  Cpu,
  Sparkles,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import { useAxiomStore } from '../store/useAxiomStore';
import { BOARDS, SUBJECTS, MODEL_CONFIG } from '../constants';
import { BoardTier, Subject, ResolutionMode, ModelTier, VaultItem } from '../types';
import { solveDoubt } from '../services/gemini';
import { ImageUploader } from '../components/ImageUploader';
import { StepCard } from '../components/StepCard';
import { SocraticEngine } from '../components/SocraticEngine';
import { ExamBreakdown } from '../components/ExamBreakdown';
import { MathRenderer } from '../components/MathRenderer';
import { exportSolutionToMarkdown, downloadFile } from '../services/export';

export const SolverWorkspace: React.FC = () => {
  const {
    apiKey,
    keyStatus,
    setIsKeyModalOpen,
    selectedBoard,
    setSelectedBoard,
    selectedSubject,
    setSelectedSubject,
    selectedMode,
    setSelectedMode,
    selectedModelTier,
    setSelectedModelTier,
    currentQuery,
    setCurrentQuery,
    currentImageDataUrl,
    setCurrentImageDataUrl,
    currentSolution,
    setCurrentSolution,
    isLoading,
    setIsLoading,
    activeError,
    setActiveError,
    history,
    addToHistory,
    clearHistory,
    addToVault,
    removeFromVault,
    isInVault,
  } = useAxiomStore();

  const [isFullSolutionRevealed, setIsFullSolutionRevealed] = useState(false);
  const [downloadedMd, setDownloadedMd] = useState(false);

  const handleSolve = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentQuery.trim() && !currentImageDataUrl) {
      setActiveError('Please enter a question or attach an image of the problem.');
      return;
    }

    if (keyStatus !== 'connected' || !apiKey) {
      setIsKeyModalOpen(true);
      setActiveError('Gemini API Key is missing or unverified. Please configure your key.');
      return;
    }

    setIsLoading(true);
    setActiveError(null);
    setIsFullSolutionRevealed(false);

    try {
      const modelId = selectedModelTier === 'rigorous' ? MODEL_CONFIG.RIGOROUS : MODEL_CONFIG.FAST;

      const solution = await solveDoubt({
        apiKey,
        query: currentQuery,
        imageDataUrl: currentImageDataUrl,
        board: selectedBoard,
        subject: selectedSubject,
        mode: selectedMode,
        modelId,
      });

      setCurrentSolution(solution);

      // Add to history
      addToHistory({
        id: `hist_${Date.now()}`,
        timestamp: Date.now(),
        query: currentQuery || 'Image Problem Solve',
        imageDataUrl: currentImageDataUrl || undefined,
        board: selectedBoard,
        subject: selectedSubject,
        mode: selectedMode,
        modelTier: selectedModelTier,
        response: solution,
      });
    } catch (err: any) {
      console.error('Solve Error:', err);
      setActiveError(err?.message || 'Failed to solve doubt. Please check your network or key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkVault = (solution = currentSolution) => {
    if (!solution) return;
    const title = solution.identifiedTopic || currentQuery || 'Doubt Solution';
    
    if (isInVault(title)) {
      // Find item and remove
      const existing = useAxiomStore.getState().vault.find(v => v.title === title);
      if (existing) removeFromVault(existing.id);
    } else {
      const firstMathStep = solution.steps.find(s => s.mathLatex)?.mathLatex;
      const vaultItem: VaultItem = {
        id: `vault_${Date.now()}`,
        savedAt: Date.now(),
        title,
        topic: solution.identifiedTopic,
        subject: selectedSubject,
        board: selectedBoard,
        latexSnippet: firstMathStep,
        fullSolution: solution,
      };
      addToVault(vaultItem);
    }
  };

  const handleExportMarkdown = () => {
    if (!currentSolution) return;
    const mdContent = exportSolutionToMarkdown(currentSolution, currentQuery);
    const filename = `axiom_solution_${currentSolution.identifiedTopic.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
    downloadFile(filename, mdContent, 'text/markdown');
    setDownloadedMd(true);
    setTimeout(() => setDownloadedMd(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner if API Key is Missing */}
      {keyStatus !== 'connected' && (
        <div className="p-4 bg-axiom-amber/5 border border-axiom-amber/20 text-[10px] text-axiom-amber flex items-center justify-between gap-4 font-mono uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-axiom-amber shrink-0" />
            <span className="drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]">Add your Gemini key to start. Nothing leaves your browser.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsKeyModalOpen(true)}
            className="px-3 py-1 bg-axiom-amber/10 border border-axiom-amber/30 text-axiom-amber font-semibold hover:bg-axiom-amber/20 hover:border-axiom-amber/50 shrink-0 font-mono text-[10px] uppercase tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.1)] transition-colors"
          >
            Configure Key
          </button>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* LEFT SIDEBAR: Taxonomy & History (Cols 1-4, sitting in open space with no boxed borders) */}
        <aside className="col-span-12 lg:col-span-4 space-y-8 pr-4">
          
          {/* Board Selector */}
          <div className="space-y-2">
            <label className="block text-base font-mono font-semibold text-axiom-text-dark tracking-wide uppercase">
              Board / Grade Tier
            </label>
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value as BoardTier)}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 text-[10px] text-axiom-text-dark font-mono focus:border-axiom-amber focus:outline-none"
            >
              {BOARDS.map((b) => (
                <option key={b} value={b} className="bg-axiom-surface-dark">
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Picker (Clean left border, no scrollbar, full display) */}
          <div className="space-y-3">
            <label className="block text-sm font-mono font-semibold text-axiom-text-dark tracking-wider uppercase">
              Subjects
            </label>
            <div className="flex flex-col gap-1">
              {SUBJECTS.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-2 text-left text-base font-mono transition-colors flex items-center justify-between border-l-2 ${
                    selectedSubject === sub
                      ? 'border-axiom-amber text-axiom-text-dark font-semibold'
                      : 'border-transparent text-axiom-muted-dark hover:text-white'
                  }`}
                >
                  <span>{sub}</span>
                  {selectedSubject === sub && <Check className="w-3.5 h-3.5 text-axiom-amber" />}
                </button>
              ))}
            </div>
          </div>

          {/* Past History List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-base font-mono font-semibold text-axiom-text-dark tracking-wide uppercase">
                Solve History
              </span>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-sm font-mono text-axiom-muted-dark hover:text-red-400"
                  title="Clear history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="text-base font-mono text-axiom-muted-dark py-2">
                No past doubts solved yet.
              </p>
            ) : (
              <div className="space-y-2">
                {history.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      setCurrentQuery(h.query);
                      setCurrentImageDataUrl(h.imageDataUrl || null);
                      setSelectedBoard(h.board);
                      setSelectedSubject(h.subject);
                      setSelectedMode(h.mode);
                      setSelectedModelTier(h.modelTier);
                      setCurrentSolution(h.response);
                    }}
                    className="w-full p-2.5 bg-transparent border-l-2 border-transparent hover:border-axiom-amber text-left text-base space-y-1 transition-colors group"
                  >
                    <div className="font-mono text-sm text-axiom-muted-dark flex items-center justify-between group-hover:text-axiom-amber">
                      <span>{h.subject} · {h.mode}</span>
                      <span>
                        {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-axiom-text-dark line-clamp-2 font-body text-base group-hover:text-white">
                      {h.query}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

        </aside>

        {/* MAIN STAGE: Input & Output Stream (Cols 5-12) */}
        <main className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* DOUBT INPUT PANEL (Sitting in open space, no boxed borders) */}
          <form onSubmit={handleSolve} className="py-2 space-y-5">
            
            {/* Header Controls (Resolution Mode & Model Tier) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              
              {/* Resolution Modes */}
              <div className="space-y-1">
                <span className="text-sm font-mono text-axiom-text-dark uppercase tracking-wider block">
                  Resolution Mode
                </span>
                <div className="flex items-center gap-4 bg-transparent p-1">
                  {(['Proof', 'Socratic', 'ExamPrep'] as ResolutionMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSelectedMode(mode)}
                      className={`pb-1 font-mono text-sm uppercase tracking-wider transition-colors border-b-2 ${
                        selectedMode === mode
                          ? 'border-axiom-amber text-axiom-text-dark font-semibold'
                          : 'border-transparent text-axiom-muted-dark hover:text-white'
                      }`}
                    >
                      {mode === 'Proof' ? 'Step-by-Step Proof' : mode === 'Socratic' ? 'Socratic Hints' : 'Exam Marking'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Tier Selection */}
              <div className="space-y-1 self-start sm:self-auto">
                <span className="text-sm font-mono text-axiom-text-dark uppercase tracking-wider block">
                  Gemini Tier
                </span>
                <div className="flex items-center gap-4 bg-transparent p-1">
                  <button
                    type="button"
                    onClick={() => setSelectedModelTier('fast')}
                    className={`pb-1 font-mono text-sm uppercase tracking-wider transition-colors border-b-2 ${
                      selectedModelTier === 'fast'
                        ? 'border-axiom-amber text-axiom-text-dark font-semibold'
                        : 'border-transparent text-axiom-muted-dark hover:text-white'
                    }`}
                  >
                    Fast (3.5-Flash)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedModelTier('rigorous')}
                    className={`pb-1 font-mono text-sm uppercase tracking-wider transition-colors border-b-2 ${
                      selectedModelTier === 'rigorous'
                        ? 'border-axiom-amber text-axiom-text-dark font-semibold'
                        : 'border-transparent text-axiom-muted-dark hover:text-white'
                    }`}
                  >
                    Rigorous (3.5-Pro)
                  </button>
                </div>
              </div>

            </div>

            {/* Text Input Area */}
            <div className="space-y-2">
              <label className="block text-base font-mono text-axiom-muted-dark">
                Type your question, math problem, or LaTeX derivation doubt:
              </label>
              <textarea
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                rows={4}
                placeholder="e.g. Find the general solution for dy/dx + y tan(x) = sec(x), or describe the organic reaction mechanism of electrophilic aromatic substitution..."
                className="w-full p-3 bg-black/60 border border-white/15 text-[10px] text-axiom-text-dark font-mono focus:border-axiom-amber focus:outline-none resize-y"
              />
            </div>

            {/* Multimodal Image Dropzone Component */}
            <ImageUploader
              imageDataUrl={currentImageDataUrl}
              onImageSelected={setCurrentImageDataUrl}
            />

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="text-base font-mono text-axiom-muted-dark">
                Target: {selectedBoard} · {selectedSubject}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-axiom-text-dark text-axiom-base-dark dark:bg-axiom-text-dark dark:text-axiom-base-dark font-mono text-sm uppercase tracking-wider font-bold hover:bg-axiom-text-dark/95 transition-transform active:scale-[0.96] disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Solving Doubt...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Derive Solution
                  </>
                )}
              </button>
            </div>

          </form>

          {/* ACTIVE ERROR BANNER */}
          {activeError && (
            <div className="p-4 bg-red-950/40 border border-red-500/40 text-base font-mono text-red-300 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-red-400">Execution Error:</span>
                <p className="leading-relaxed">{activeError}</p>
              </div>
            </div>
          )}          {/* OUTPUT STREAM DISPLAY */}
          {isLoading ? (
            <div className="axiom-border bg-transparent p-12 text-center space-y-4 font-mono text-base text-axiom-muted-dark">
              <Loader2 className="w-8 h-8 text-axiom-muted-dark animate-spin mx-auto" />
              <div>Generating step-by-step mathematical breakdown via Gemini ({selectedModelTier === 'rigorous' ? '3.5 Pro' : '3.5 Flash'})...</div>
            </div>
          ) : currentSolution ? (
            <div className="axiom-border bg-transparent p-6 sm:p-8 space-y-6">
              
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-base text-axiom-muted-dark">
                    <Zap className="w-4 h-4" />
                    <span>TOPIC: {currentSolution.identifiedTopic}</span>
                  </div>
                  {currentSolution.coreConcept && (
                    <h2 className="font-display text-base text-axiom-text-dark">
                      <MathRenderer content={currentSolution.coreConcept} allowCopyLatex={false} />
                    </h2>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={handleExportMarkdown}
                    className="px-3 py-1.5 bg-transparent border border-white/10 text-base font-mono text-axiom-text-dark hover:border-white/30 flex items-center gap-1.5"
                    title="Export solution as Markdown file"
                  >
                    <Download className="w-3.5 h-3.5 text-axiom-muted-dark" />
                    {downloadedMd ? 'Exported .md' : 'Export .md'}
                  </button>

                  <button
                    onClick={() => handleBookmarkVault()}
                    className="px-3 py-1.5 bg-transparent border border-white/10 text-base font-mono text-axiom-text-dark hover:border-white/30 flex items-center gap-1.5"
                    title="Save to Vault"
                  >
                    {isInVault(currentSolution.identifiedTopic || currentQuery) ? (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-green-500 font-medium">Saved in Vault</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="w-3.5 h-3.5 text-axiom-muted-dark" />
                        <span>Save to Vault</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Prerequisites */}
              {currentSolution.prerequisites && currentSolution.prerequisites.length > 0 && (
                <div className="py-2 text-sm font-mono uppercase tracking-wider space-y-2 border-b border-white/10 pb-3">
                  <span className="text-axiom-muted-dark font-medium">Required Prerequisites:</span>
                  <div className="flex flex-wrap gap-2">
                    {currentSolution.prerequisites.map((p, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500/70 shrink-0 mt-0.5" />
                        <div className="flex-1 overflow-hidden">
                          <MathRenderer content={p} allowCopyLatex={false} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Socratic Mode Engine */}
              {selectedMode === 'Socratic' && currentSolution.socraticHints && (
                <SocraticEngine
                  hints={currentSolution.socraticHints}
                  onRevealFullSolution={() => setIsFullSolutionRevealed(true)}
                  isFullSolutionRevealed={isFullSolutionRevealed}
                />
              )}

              {/* Exam Marking Breakdown Mode */}
              {selectedMode === 'ExamPrep' && (
                <ExamBreakdown
                  steps={currentSolution.steps}
                  topic={currentSolution.identifiedTopic}
                  board={selectedBoard}
                />
              )}

              {/* Proof / Steps Stream */}
              {(selectedMode === 'Proof' || selectedMode === 'ExamPrep' || isFullSolutionRevealed) && (
                <div className="space-y-4 pt-2">
                  <div className="font-mono text-sm uppercase tracking-wider text-axiom-muted-dark border-b border-white/10 pb-2">
                    ANALYTICAL DERIVATION STEPS ({currentSolution.steps.length})
                  </div>

                  <div className="space-y-4">
                    {currentSolution.steps.map((step) => (
                      <StepCard
                        key={step.stepNumber}
                        step={step}
                        totalSteps={currentSolution.steps.length}
                        onBookmarkFormula={(latex, title) => {
                          addToVault({
                            id: `v_formula_${Date.now()}`,
                            savedAt: Date.now(),
                            title: `${title} (${currentSolution.identifiedTopic})`,
                            topic: currentSolution.identifiedTopic,
                            subject: selectedSubject,
                            board: selectedBoard,
                            latexSnippet: latex,
                            fullSolution: currentSolution,
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Common Pitfalls & Exam Traps */}
              {currentSolution.commonMistakes && currentSolution.commonMistakes.length > 0 && (
                <div className="py-3 border-t border-white/10 space-y-2">
                  <span className="font-mono text-sm font-semibold text-axiom-text-dark uppercase tracking-wider block">
                    Common Mistakes & Exam Pitfalls
                  </span>
                  <ul className="list-disc list-inside text-base text-axiom-muted-dark space-y-1">
                    {currentSolution.commonMistakes.map((mistake, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <MathRenderer content={mistake} allowCopyLatex={false} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Practice Challenge */}
              {currentSolution.practiceChallenge && (
                <div className="pt-5 border-t border-white/10 space-y-3">
                  <div className="font-mono text-sm uppercase tracking-wider font-semibold text-axiom-text-dark flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-axiom-muted-dark" /> PRACTICE CHALLENGE
                  </div>
                  <div className="text-base text-axiom-text-dark">
                    <MathRenderer content={currentSolution.practiceChallenge.question} />
                  </div>
                  {currentSolution.practiceChallenge.mathLatex && (
                    <div className="p-3 bg-black/40 border border-white/5 my-3">
                      <MathRenderer content={currentSolution.practiceChallenge.mathLatex} />
                    </div>
                  )}
                  <div className="grid gap-3 pt-3">
                    <div><strong>Hint:</strong> <MathRenderer content={currentSolution.practiceChallenge.hint} allowCopyLatex={false} /></div>
                    <div><strong>Exact Answer:</strong> <MathRenderer content={currentSolution.practiceChallenge.answer} allowCopyLatex={false} /></div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* EMPTY STATE */
            <div className="axiom-border bg-transparent p-12 text-center space-y-3">
              <div className="font-mono text-sm text-axiom-text-dark">
                Type a question, or drop a photo of the problem.
              </div>
              <p className="text-base text-axiom-muted-dark max-w-md mx-auto">
                Select your academic board tier and subject on the left, choose between Proof, Socratic Hints, or Exam Marking breakdown above, then click Derive Solution.
              </p>
            </div>
          )}

        </main>

      </div>
    </div>
  );
};
