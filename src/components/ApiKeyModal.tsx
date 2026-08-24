import React, { useState, useEffect } from 'react';
import { X, Key, ExternalLink, ShieldAlert, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAxiomStore } from '../store/useAxiomStore';
import { validateApiKey } from '../services/gemini';

export const ApiKeyModal: React.FC = () => {
  const { 
    apiKey, 
    keyStatus, 
    keyErrorMessage, 
    isKeyModalOpen, 
    setApiKey, 
    setKeyStatus, 
    setIsKeyModalOpen 
  } = useAxiomStore();

  const [inputKey, setInputKey] = useState(apiKey);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(keyErrorMessage);

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey, isKeyModalOpen]);

  if (!isKeyModalOpen) return null;

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputKey.trim();
    if (!cleanKey) {
      setValidationError('Please enter a valid Gemini API key.');
      return;
    }

    setIsValidating(true);
    setValidationError(null);
    setKeyStatus('testing');

    const result = await validateApiKey(cleanKey);
    setIsValidating(false);

    if (result.valid) {
      setApiKey(cleanKey);
      setKeyStatus('connected');
      setIsKeyModalOpen(false);
    } else {
      setKeyStatus('invalid', result.error);
      setValidationError(result.error || 'Failed to validate API key.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-axiom-surface-dark border border-white/10 text-axiom-text-dark rounded-none shadow-none overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-axiom-muted-dark" />
            <h2 className="font-display text-lg tracking-wide flex flex-col gap-0.5">
              <span className="font-semibold text-axiom-text-dark">Gemini API Key</span>
              <span className="italic text-axiom-muted-dark font-light text-xs">configuration.</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsKeyModalOpen(false)}
            className="p-1 text-axiom-muted-dark hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSaveKey} className="p-6 space-y-5">
          
          {/* Key Status Pill Indicator */}
          <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 text-xs">
            <span className="text-axiom-muted-dark">Current Status:</span>
            <div className="flex items-center gap-2">
              {keyStatus === 'connected' && (
                <span className="flex items-center gap-1.5 font-mono text-green-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> API Key: Connected
                </span>
              )}
              {keyStatus === 'missing' && (
                <span className="flex items-center gap-1.5 font-mono text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5" /> API Key: Missing
                </span>
              )}
              {keyStatus === 'invalid' && (
                <span className="flex items-center gap-1.5 font-mono text-red-400">
                  <AlertCircle className="w-3.5 h-3.5" /> API Key: Invalid
                </span>
              )}
              {keyStatus === 'testing' && (
                <span className="flex items-center gap-1.5 font-mono text-blue-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying...
                </span>
              )}
            </div>
          </div>

          {/* Key Input */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-axiom-muted-dark">
              Enter Google Gemini API Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2.5 bg-black/60 border border-white/15 font-mono text-xs text-axiom-text-dark focus:border-axiom-amber focus:outline-none transition-colors"
            />
          </div>

          {/* Validation Error Alert */}
          {validationError && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 text-xs text-red-300 font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Free Key Guide Link */}
          <div className="text-xs text-axiom-muted-dark leading-relaxed">
            Need an API key? Get a free key instantly at{' '}
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-axiom-text-dark underline hover:text-axiom-amber inline-flex items-center gap-1 font-mono transition-colors"
            >
              aistudio.google.com <ExternalLink className="w-3 h-3 text-axiom-muted-dark" />
            </a>
          </div>

          {/* Security Disclosure */}
          <div className="p-3.5 bg-black/40 border border-white/10 text-xs text-axiom-text-dark space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-axiom-amber">
              <ShieldAlert className="w-3.5 h-3.5" /> Client-Side BYOK Security Disclosure
            </div>
            <p className="leading-normal text-axiom-muted-dark">
              Your key is stored only in <code className="font-mono text-[11px] text-white">localStorage</code> under <code className="font-mono text-[11px] text-white">axiom_gemini_key</code> and sent directly from your browser to Google — it never touches a server Axiom controls. Note that keys in localStorage are visible in browser devtools, so avoid using keys with sensitive paid quota on shared devices.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsKeyModalOpen(false)}
              className="px-4 py-2 text-xs font-mono text-axiom-muted-dark hover:text-white border border-transparent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isValidating}
              className="px-5 py-2 text-[11px] font-mono uppercase tracking-wider font-semibold bg-axiom-text-dark text-axiom-base-dark dark:bg-axiom-text-dark dark:text-axiom-base-dark hover:bg-axiom-text-dark/95 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isValidating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isValidating ? 'Validating Key...' : 'Validate & Save Key'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
