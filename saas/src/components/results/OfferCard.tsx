'use client';

import { motion } from 'framer-motion';
import { type Offer } from '@/types/offer';
import Link from 'next/link';

interface OfferCardProps {
  offer: Offer;
  argumentaire: string;
  isRecommended?: boolean;
}

export function OfferCard({ offer, argumentaire, isRecommended = false }: OfferCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative rounded-2xl border-2 p-6
        ${isRecommended
          ? 'border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800 shadow-xl shadow-blue-600/10'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
        }
      `}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
            Recommande pour vous
          </span>
        </div>
      )}

      <div className="mt-2">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
          {offer.name}
        </h4>
        <div className="mt-2">
          <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {offer.price}
          </span>
          {offer.isRecurrent && (
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              (sans engagement)
            </span>
          )}
        </div>

        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {argumentaire}
        </p>

        <ul className="mt-4 space-y-2">
          {offer.features.slice(0, 4).map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-3">
          <Link
            href="/rdv/decouverte"
            className={`
              block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all
              ${isRecommended
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
          >
            Reserver un appel gratuit (20 min)
          </Link>
          <Link
            href={offer.ctaLink}
            className="block w-full text-center py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            En savoir plus
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
