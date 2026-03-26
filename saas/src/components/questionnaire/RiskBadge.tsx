'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { type Score } from '@/types/score';

interface RiskBadgeProps {
  score: Score | null;
}

const LEVEL_STYLES = {
  FAIBLE: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
  MODERE: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700',
  ELEVE: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700',
  CRITIQUE: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700',
};

export function RiskBadge({ score }: RiskBadgeProps) {
  if (!score || score.final === 0) return null;

  const style = LEVEL_STYLES[score.riskLevel];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-xl border shadow-lg ${style}`}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: score.color }}
          />
          <div className="text-right">
            <div className="text-xs font-medium opacity-75">Risque</div>
            <div className="text-sm font-bold">
              {score.final}/10 - {score.riskLevel}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
