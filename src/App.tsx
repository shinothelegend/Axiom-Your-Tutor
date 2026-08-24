import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { SolverWorkspace } from './pages/SolverWorkspace';
import { Vault } from './pages/Vault';
import { useAxiomStore } from './store/useAxiomStore';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'landing' | 'app' | 'vault'>('landing');
  const { theme, setCurrentSolution } = useAxiomStore();

  const shouldReduceMotion = useReducedMotion();

  // Sync theme with document element on initial load
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleOpenWorkspaceWithSolution = (solution: any) => {
    setCurrentSolution(solution);
    setActiveTab('app');
  };

  const transitionVariants = {
    initial: { 
      opacity: 0, 
      scale: shouldReduceMotion ? 1 : 0.98 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      scale: shouldReduceMotion ? 1 : 1.02,
      transition: { duration: 0.3, ease: 'easeIn' }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {activeTab === 'landing' ? (
        <motion.div
          key="landing"
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="min-h-screen w-full"
        >
          <Landing onStartSolver={() => setActiveTab('app')} />
        </motion.div>
      ) : (
        <motion.div
          key="app-shell"
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="min-h-screen w-full"
        >
          <Layout activeTab={activeTab as 'app' | 'vault'} setActiveTab={setActiveTab}>
            {activeTab === 'app' && (
              <SolverWorkspace />
            )}
            {activeTab === 'vault' && (
              <Vault onOpenWorkspaceWithSolution={handleOpenWorkspaceWithSolution} />
            )}
          </Layout>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
