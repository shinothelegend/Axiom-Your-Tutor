import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Trash2, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  FileText, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useAxiomStore } from '../store/useAxiomStore';
import { VaultItem } from '../types';
import { MathRenderer } from '../components/MathRenderer';
import { 
  exportSolutionToMarkdown, 
  exportVaultToJSON, 
  downloadFile, 
  copyToClipboard 
} from '../services/export';

interface VaultProps {
  onOpenWorkspaceWithSolution: (solution: any) => void;
}

export const Vault: React.FC<VaultProps> = ({ onOpenWorkspaceWithSolution }) => {
  const { vault, removeFromVault, addToVault } = useAxiomStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredVault = vault.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.latexSnippet && item.latexSnippet.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = filterSubject === 'ALL' || item.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const handleCopyLatex = async (id: string, latex?: string) => {
    if (!latex) return;
    const success = await copyToClipboard(latex);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleExportMarkdown = (item: VaultItem) => {
    const md = exportSolutionToMarkdown(item.fullSolution);
    const filename = `axiom_vault_${item.topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
    downloadFile(filename, md, 'text/markdown');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const items: VaultItem[] = JSON.parse(evt.target?.result as string);
        if (Array.isArray(items)) {
          items.forEach((item) => addToVault(item));
          alert(`Successfully imported ${items.length} Vault items.`);
        }
      } catch (err) {
        console.error('Import error:', err);
        alert('Invalid Vault JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-axiom-muted-dark">
            <Bookmark className="w-4 h-4" />
            <span>VAULT REPOSITORY</span>
          </div>
          <h1 className="font-display text-3xl text-axiom-text-dark flex flex-col gap-1">
            <span className="font-semibold">Bookmarked Formulas</span>
            <span className="italic text-axiom-muted-dark font-light text-base">and saved derivations.</span>
          </h1>
          <p className="text-base text-axiom-muted-dark font-body pt-1">
            Saved mathematical proofs, equations, and practice problems persisted in your browser.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => exportVaultToJSON(vault)}
            disabled={vault.length === 0}
            className="px-3.5 py-2 bg-transparent border border-white/10 text-sm font-mono uppercase tracking-wider text-axiom-text-dark hover:border-white/30 transition-colors flex items-center gap-2 disabled:opacity-40"
            title="Export full Vault backup in JSON format"
          >
            <Download className="w-3.5 h-3.5 text-axiom-muted-dark" /> Export JSON
          </button>

          <label className="px-3.5 py-2 bg-transparent border border-white/10 text-sm font-mono uppercase tracking-wider text-axiom-text-dark hover:border-white/30 transition-colors flex items-center gap-2 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-axiom-muted-dark" /> Import JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-axiom-muted-dark absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts or math expressions..."
            className="w-full pl-9 pr-3 py-2 bg-black/60 border border-white/15 text-[10px] font-mono text-axiom-text-dark focus:border-axiom-amber focus:outline-none"
          />
        </div>

        {/* Subject Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 bg-black/60 border border-white/15 text-[10px] font-mono text-axiom-text-dark focus:border-axiom-amber focus:outline-none"
          >
            <option value="ALL">All Subjects ({vault.length})</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry (Organic)">Chemistry (Organic)</option>
            <option value="Chemistry (Inorganic)">Chemistry (Inorganic)</option>
            <option value="Biology">Biology</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Economics">Economics</option>
          </select>
        </div>
      </div>

      {/* Vault Grid / List */}
      {filteredVault.length === 0 ? (
        <div className="axiom-border bg-transparent p-12 text-center space-y-3 font-mono text-base text-axiom-muted-dark">
          <Bookmark className="w-8 h-8 text-white/20 mx-auto" />
          <div>{vault.length === 0 ? 'Your Vault is empty.' : 'No bookmarked items match your search.'}</div>
          <p className="text-sm text-axiom-muted-dark max-w-sm mx-auto">
            Solve doubts in the Workspace and click "Save to Vault" or "Save Formula" on individual steps to bookmark them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVault.map((item) => (
            <div key={item.id} className="axiom-border bg-transparent p-6 space-y-4 relative group">
              
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-mono text-axiom-muted-dark">
                    <span>{item.subject}</span>
                    <span>•</span>
                    <span>{item.board}</span>
                  </div>
                  <h3 className="font-display font-medium text-base text-axiom-text-dark leading-snug">
                    {item.title}
                  </h3>
                </div>

                <button
                  onClick={() => removeFromVault(item.id)}
                  className="p-1 text-axiom-muted-dark hover:text-red-400 transition-colors"
                  title="Remove from Vault"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* LaTeX Formula Snippet preview if exists */}
              {item.latexSnippet && (
                <div className="py-2 overflow-x-auto relative">
                  <MathRenderer content={`$$${item.latexSnippet}$$`} allowCopyLatex={false} />
                  <button
                    onClick={() => handleCopyLatex(item.id, item.latexSnippet)}
                    className="absolute top-1 right-1 p-1 text-sm font-mono uppercase tracking-wider text-axiom-muted-dark hover:text-axiom-amber"
                    title="Copy LaTeX"
                  >
                    {copiedId === item.id ? (
                      <span className="text-green-400 flex items-center gap-1"><Check className="w-3 h-3" /> Copied</span>
                    ) : (
                      <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy LaTeX</span>
                    )}
                  </button>
                </div>
              )}

              {/* Steps count & Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 font-mono text-base">
                <span className="text-axiom-muted-dark text-sm">
                  {item.fullSolution.steps?.length || 0} Step Derivation
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleExportMarkdown(item)}
                    className="text-axiom-muted-dark hover:text-axiom-amber flex items-center gap-1 text-sm"
                    title="Export Markdown"
                  >
                    <FileText className="w-3.5 h-3.5" /> .md
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenWorkspaceWithSolution(item.fullSolution)}
                    className="text-axiom-muted-dark hover:text-axiom-amber flex items-center gap-1 text-sm font-medium"
                  >
                    Open Solution <ArrowRight className="w-3.5 h-3.5 text-axiom-muted-dark group-hover:text-axiom-amber" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
