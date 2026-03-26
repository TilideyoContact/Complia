'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  current: number;
  total: number;
  remaining: number;
}

export function ProgressBar({ progress, current, total, remaining }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Question {current} / {total}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {remaining > 0
            ? `Plus que ${remaining} question${remaining > 1 ? 's' : ''}`
            : 'Derniere question'
          }
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
