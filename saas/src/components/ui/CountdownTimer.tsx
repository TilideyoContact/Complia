'use client';

import { useState, useEffect } from 'react';

const TARGET_DATE = new Date('2026-08-02T00:00:00+02:00').getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const diff = TARGET_DATE - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-3 justify-center">
        {['--', '--', '--', '--'].map((v, i) => (
          <div key={i} className="text-center">
            <div className="bg-gray-900 dark:bg-gray-800 text-white text-2xl sm:text-3xl font-bold rounded-xl px-4 py-3 min-w-[70px] tabular-nums">
              {v}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {['Jours', 'Heures', 'Min', 'Sec'][i]}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const isUrgent = timeLeft.days < 180;
  const units = [
    { value: timeLeft.days, label: 'Jours' },
    { value: timeLeft.hours, label: 'Heures' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ];

  return (
    <div>
      <div className="flex gap-3 justify-center">
        {units.map((unit, i) => (
          <div key={i} className="text-center">
            <div
              className={`
                text-2xl sm:text-3xl font-bold rounded-xl px-4 py-3 min-w-[70px] tabular-nums
                ${isUrgent
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-gray-900 dark:bg-gray-800 text-white'
                }
              `}
            >
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
        avant l&apos;echeance systemes haut risque (2 aout 2026)
      </p>
    </div>
  );
}
