import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  BoardTier, 
  Subject, 
  ResolutionMode, 
  ModelTier, 
  ApiKeyStatus, 
  DoubtSolutionResponse, 
  HistoryItem, 
  VaultItem 
} from '../types';
import { MODEL_CONFIG } from '../constants';

interface AxiomState {
  // API Key & BYOK
  apiKey: string;
  keyStatus: ApiKeyStatus;
  keyErrorMessage: string | null;
  isKeyModalOpen: boolean;
  
  // Taxonomies & Configuration
  selectedBoard: BoardTier;
  selectedSubject: Subject;
  selectedMode: ResolutionMode;
  selectedModelTier: ModelTier;
  customModelId: string;
  
  // Workspace & Active Solve
  currentQuery: string;
  currentImageDataUrl: string | null;
  currentSolution: DoubtSolutionResponse | null;
  isLoading: boolean;
  activeError: string | null;
  
  // History & Vault
  history: HistoryItem[];
  vault: VaultItem[];
  
  // Theme
  theme: 'dark' | 'light';

  // Actions
  setApiKey: (key: string) => void;
  setKeyStatus: (status: ApiKeyStatus, errorMsg?: string | null) => void;
  setIsKeyModalOpen: (isOpen: boolean) => void;
  
  setSelectedBoard: (board: BoardTier) => void;
  setSelectedSubject: (subject: Subject) => void;
  setSelectedMode: (mode: ResolutionMode) => void;
  setSelectedModelTier: (tier: ModelTier) => void;
  setCustomModelId: (modelId: string) => void;
  
  setCurrentQuery: (query: string) => void;
  setCurrentImageDataUrl: (dataUrl: string | null) => void;
  setCurrentSolution: (solution: DoubtSolutionResponse | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setActiveError: (error: string | null) => void;
  
  addToHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
  
  addToVault: (item: VaultItem) => void;
  removeFromVault: (id: string) => void;
  isInVault: (solutionTitle: string) => boolean;
  
  toggleTheme: () => void;
}

export const useAxiomStore = create<AxiomState>()(
  persist(
    (set, get) => ({
      apiKey: '',
      keyStatus: 'missing',
      keyErrorMessage: null,
      isKeyModalOpen: false,

      selectedBoard: 'JEE / NEET / College',
      selectedSubject: 'Physics',
      selectedMode: 'Proof',
      selectedModelTier: 'fast',
      customModelId: MODEL_CONFIG.FAST,

      currentQuery: '',
      currentImageDataUrl: null,
      currentSolution: null,
      isLoading: false,
      activeError: null,

      history: [],
      vault: [],
      theme: 'dark',

      setApiKey: (key: string) => {
        const trimmed = key.trim();
        set({ 
          apiKey: trimmed, 
          keyStatus: trimmed ? 'testing' : 'missing',
          keyErrorMessage: null 
        });
      },

      setKeyStatus: (status: ApiKeyStatus, errorMsg = null) => {
        set({ keyStatus: status, keyErrorMessage: errorMsg });
      },

      setIsKeyModalOpen: (isOpen: boolean) => {
        set({ isKeyModalOpen: isOpen });
      },

      setSelectedBoard: (board: BoardTier) => set({ selectedBoard: board }),
      setSelectedSubject: (subject: Subject) => set({ selectedSubject: subject }),
      setSelectedMode: (mode: ResolutionMode) => set({ selectedMode: mode }),
      setSelectedModelTier: (tier: ModelTier) => {
        const defaultModel = tier === 'rigorous' ? MODEL_CONFIG.RIGOROUS : MODEL_CONFIG.FAST;
        set({ selectedModelTier: tier, customModelId: defaultModel });
      },
      setCustomModelId: (modelId: string) => set({ customModelId: modelId }),

      setCurrentQuery: (query: string) => set({ currentQuery: query }),
      setCurrentImageDataUrl: (dataUrl: string | null) => set({ currentImageDataUrl: dataUrl }),
      setCurrentSolution: (solution: DoubtSolutionResponse | null) => set({ currentSolution: solution }),
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      setActiveError: (error: string | null) => set({ activeError: error }),

      addToHistory: (item: HistoryItem) => {
        set((state) => ({
          history: [item, ...state.history.filter((h) => h.id !== item.id)].slice(0, 50),
        }));
      },

      clearHistory: () => set({ history: [] }),

      addToVault: (item: VaultItem) => {
        set((state) => ({
          vault: [item, ...state.vault.filter((v) => v.id !== item.id)],
        }));
      },

      removeFromVault: (id: string) => {
        set((state) => ({
          vault: state.vault.filter((v) => v.id !== id),
        }));
      },

      isInVault: (solutionTitle: string) => {
        return get().vault.some((v) => v.title === solutionTitle);
      },

      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        if (typeof document !== 'undefined') {
          if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        set({ theme: nextTheme });
      },
    }),
    {
      name: 'axiom_store',
      partialize: (state) => ({
        apiKey: state.apiKey,
        keyStatus: state.apiKey ? state.keyStatus : 'missing',
        selectedBoard: state.selectedBoard,
        selectedSubject: state.selectedSubject,
        selectedMode: state.selectedMode,
        selectedModelTier: state.selectedModelTier,
        customModelId: state.customModelId,
        history: state.history,
        vault: state.vault,
        theme: state.theme,
      }),
    }
  )
);
