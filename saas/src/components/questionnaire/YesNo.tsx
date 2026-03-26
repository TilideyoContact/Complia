'use client';

import { motion } from 'framer-motion';

interface YesNoProps {
  value: string | null;
  onChange: (value: string) => void;
  yesLabel?: string;
  noLabel?: string;
}

export function YesNo({
  value,
  onChange,
  yesLabel = 'Oui',
  noLabel = 'Non',
}: YesNoProps) {
  return (
    <div className="flex gap-4">
      {[
        { val: 'oui', label: yesLabel },
        { val: 'non', label: noLabel },
      ].map(({ val, label }) => {
        const isSelected = value === val;
        return (
          <motion.button
            key={val}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(val)}
            className={`
              flex-1 p-6 rounded-xl border-2 text-center font-semibold text-lg transition-all duration-200
              ${isSelected
                ? val === 'oui'
                  ? 'border-green-600 bg-green-50 text-green-800 dark:bg-green-950 dark:border-green-400 dark:text-green-200'
                  : 'border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:border-red-400 dark:text-red-200'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800'
              }
            `}
          >
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}
