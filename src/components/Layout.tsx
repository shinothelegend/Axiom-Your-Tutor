import React from 'react';
import { 
  Key, 
  Sun, 
  Moon, 
  Bookmark, 
  Zap, 
  Compass, 
  CheckCircle2, 
  AlertCircle,
  Menu,
  X
} from 'lucide-react';
import { useAxiomStore } from '../store/useAxiomStore';
import { ApiKeyModal } from './ApiKeyModal';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'app' | 'vault';
  setActiveTab: (tab: 'app' | 'vault' | 'landing') => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab 
}) => {
  const { 
    keyStatus, 
    theme, 
    toggleTheme, 
    setIsKeyModalOpen,
    vault 
  } = useAxiomStore();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-axiom-base-dark dark:bg-axiom-base-dark text-axiom-text-dark dark:text-axiom-text-dark font-body">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-axiom-surface-dark/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Mark (Asymmetric left alignment) */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2 text-left group focus:outline-none"
            >
              <div className="w-7 h-7 border border-white/10 font-display font-black text-lg flex items-center justify-center rounded-none text-axiom-text-dark">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg tracking-tight text-axiom-text-dark">
                  AXIOM
                </span>
                <span className="font-mono text-[10px] text-axiom-muted-dark tracking-widest uppercase -mt-1">
                  Socratic Doubt Solver
                </span>
              </div>
            </button>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 border-l border-white/10 pl-6 h-8">
              <button
                type="button"
                onClick={() => setActiveTab('app')}
                className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 border-b-2 ${
                  activeTab === 'app'
                    ? 'text-axiom-text-dark font-semibold border-axiom-amber'
                    : 'text-axiom-muted-dark hover:text-white border-transparent'
                }`}
              >
                <Zap className="w-3.5 h-3.5" /> Workspace
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('vault')}
                className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 border-b-2 ${
                  activeTab === 'vault'
                    ? 'text-axiom-text-dark font-semibold border-axiom-amber'
                    : 'text-axiom-muted-dark hover:text-white border-transparent'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" /> Vault
                {vault.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 border border-white/10 text-[10px] text-axiom-text-dark font-mono">
                    {vault.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Right Controls (BYOK Pill & Theme Toggle) */}
          <div className="hidden md:flex items-center gap-4">
            {/* API Key Status Pill */}
            <button
              type="button"
              onClick={() => setIsKeyModalOpen(true)}
              className={`px-3 py-1.5 border text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 ${
                keyStatus === 'connected'
                  ? 'bg-transparent border-white/10 text-axiom-text-dark hover:border-white/30'
                  : 'bg-axiom-amber/10 border-axiom-amber/30 text-axiom-amber hover:bg-axiom-amber/20 hover:border-axiom-amber/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
              }`}
            >
              {keyStatus === 'connected' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span>Key: Connected</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-axiom-amber animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                  <span className="font-semibold drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">Key: Missing</span>
                </>
              )}
            </button>

            {/* Theme Toggle */}
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsKeyModalOpen(true)}
              className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider border border-white/10 text-axiom-text-dark"
            >
              Key
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-axiom-muted-dark hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-axiom-surface-dark px-4 py-3 space-y-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('app');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider ${
                activeTab === 'app' ? 'text-axiom-text-dark font-semibold' : 'text-axiom-muted-dark'
              }`}
            >
              Workspace
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('vault');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider ${
                activeTab === 'vault' ? 'text-axiom-text-dark font-semibold' : 'text-axiom-muted-dark'
              }`}
            >
              Vault ({vault.length})
            </button>
          </div>
        )}
      </header>

      {/* Main Content Stage */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 bg-transparent text-sm font-mono text-axiom-muted-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            AXIOM — Client-Side Socratic Doubt Resolution Engine.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>100% Zero-Server BYOK</span>
            <span>•</span>
            <span>Gemini API Unified SDK</span>
          </div>
        </div>
      </footer>

      {/* BYOK Modal */}
      <ApiKeyModal />
    </div>
  );
};
