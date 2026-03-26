'use client';

import { type Option } from '@/types/question';
import { motion } from 'framer-motion';

interface MultiChoiceProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiChoice({ options, value, onChange }: MultiChoiceProps) {
  const handleToggle = (optionValue: string) => {
    // If "aucune" / "aucun" is selected, deselect everything else
    const isNoneOption = optionValue === 'aucune' || optionValue === 'aucun';

    if (isNoneOption) {
      if (value.includes(optionValue)) {
        onChange([]);
      } else {
        onChange([optionValue]);
      }
      return;
    }

    // If selecting a non-none option, remove none
    const withoutNone = value.filter(v => v !== 'aucune' && v !== 'aucun');

    if (withoutNone.includes(optionValue)) {
      onChange(withoutNone.filter(v => v !== optionValue));
    } else {
      onChange([...withoutNone, optionValue]);
    }
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const isSelected = value.includes(option.value);
        const isNoneOption = option.value === 'aucune' || option.value === 'aucun';

        return (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleToggle(option.value)}
            className={`
              w-full text-left p-4 rounded-xl border-2 transition-all duration-200
              ${isSelected
                ? isNoneOption
                  ? 'border-green-600 bg-green-50 dark:bg-green-950 dark:border-green-400'
                  : 'border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-400'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0
                  ${isSelected
                    ? isNoneOption
                      ? 'border-green-600 bg-green-600 dark:border-green-400 dark:bg-green-400'
                      : 'border-red-500 bg-red-500 dark:border-red-400 dark:bg-red-400'
                    : 'border-gray-300 dark:border-gray-600'
                  }
                `}
              >
                {isSelected && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 text-white"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 6l3 3 5-5" />
                  </motion.svg>
                )}
              </div>
              <span className={`text-sm font-medium ${
                isSelected
                  ? isNoneOption
                    ? 'text-green-900 dark:text-green-100'
                    : 'text-red-900 dark:text-red-100'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {option.label}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
