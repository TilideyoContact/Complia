'use client';

import { type Option } from '@/types/question';
import { motion } from 'framer-motion';

interface SingleChoiceProps {
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
}

export function SingleChoice({ options, value, onChange }: SingleChoiceProps) {
  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const isSelected = value === option.value;
        return (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onChange(option.value)}
            className={`
              w-full text-left p-4 rounded-xl border-2 transition-all duration-200
              ${isSelected
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 dark:border-blue-400'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${isSelected
                    ? 'border-blue-600 dark:border-blue-400'
                    : 'border-gray-300 dark:border-gray-600'
                  }
                `}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400"
                  />
                )}
              </div>
              <span className={`text-sm font-medium ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-700 dark:text-gray-300'}`}>
                {option.label}
              </span>
            </div>
            {option.tooltip && (
              <p className="mt-1 ml-8 text-xs text-gray-500 dark:text-gray-400">
                {option.tooltip}
              </p>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
